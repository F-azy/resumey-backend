import * as Resume from '../models/resume.model.js';
import * as Template from '../models/template.model.js';
import { extractResume, refineResume } from '../services/groq.service.js';
import { extractText } from '../services/fileText.service.js';
import { compileResume } from '../services/latex.service.js';
import { normalizeResume } from '../utils/resumeSchema.js';
import { httpError } from '../utils/httpError.js';
import { normalizeConfig } from '../utils/templateConfig.js';

export async function parse(req, res, next) {
  try {
    if (!req.file) throw httpError(400, 'file is required');
    const text = await extractText(req.file);
    if (text.trim().length < 30) throw httpError(422, 'No text found in this file. Scanned PDFs are not supported.');
    res.json({ data: await extractResume(text) });
  } catch (err) {
    next(err);
  }
}

export async function generate(req, res, next) {
  try {
    const { data, jobDescription, templateId, title, useAi = true } = req.body;
    if (!data) throw httpError(400, 'data is required');

    let resumeData = normalizeResume(data);
    if (!resumeData.personal.fullName) throw httpError(400, 'Full name is required');

    const template = (templateId && (await Template.findById(templateId))) || (await Template.findFirst());
    if (useAi) resumeData = await refineResume(resumeData, jobDescription, normalizeConfig(template?.config).sections);

    const resume = await Resume.create({
      userId: req.user.id,
      templateId: template?.id,
      title: title?.trim() || `${resumeData.personal.fullName} - Resume`,
      data: resumeData,
      jobDescription,
    });
    res.status(201).json({ resume });
  } catch (err) {
    next(err);
  }
}

export async function list(req, res, next) {
  try {
    res.json({ resumes: await Resume.findAllByUser(req.user.id) });
  } catch (err) {
    next(err);
  }
}

export async function getOne(req, res, next) {
  try {
    const resume = await Resume.findById(req.params.id, req.user.id);
    if (!resume) throw httpError(404, 'Resume not found');
    if (resume.data) resume.data = normalizeResume(resume.data); // older resumes may miss newer fields
    res.json({ resume });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const { title, data } = req.body;
    const resume = await Resume.update({
      id: req.params.id,
      userId: req.user.id,
      title,
      data: data ? normalizeResume(data) : null,
    });
    if (!resume) throw httpError(404, 'Resume not found');
    res.json({ resume });
  } catch (err) {
    next(err);
  }
}

// Saves any edits that are sent, then returns the PDF
export async function pdf(req, res, next) {
  try {
    const { title, data } = req.body;
    const id = req.params.id;
    if (data && !(await Resume.update({ id, userId: req.user.id, title, data: normalizeResume(data) }))) {
      throw httpError(404, 'Resume not found');
    }
    const resume = await Resume.findById(id, req.user.id);
    if (!resume) throw httpError(404, 'Resume not found');
    if (!resume.data) throw httpError(400, 'This resume has no editable content');
    res.type('application/pdf').send(await compileResume(normalizeResume(resume.data), resume.template_config));
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    if (!(await Resume.remove(req.params.id, req.user.id))) throw httpError(404, 'Resume not found');
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}