import * as Resume from '../models/resume.model.js';
import * as Template from '../models/template.model.js';
import { generateLatex } from '../services/groq.service.js';
import { compileToPdf } from '../services/latex.service.js';
import { httpError } from '../utils/httpError.js';

export async function generate(req, res, next) {
  try {
    const { details, jobDescription, templateId, title } = req.body;
    if (!details?.trim()) throw httpError(400, 'details is required');

    const template = templateId ? await Template.findById(templateId) : await Template.findFirst();
    if (!template) throw httpError(404, 'Template not found');

    const latex = await generateLatex({ template: template.latex_source, details, jobDescription });
    const resume = await Resume.create({
      userId: req.user.id,
      templateId: template.id,
      title: title?.trim() || `Resume ${new Date().toISOString().slice(0, 10)}`,
      details,
      jobDescription,
      latex,
    });
    res.status(201).json({ latex, resume });
  } catch (err) {
    next(err);
  }
}

export async function compile(req, res, next) {
  try {
    const { latex, resumeId } = req.body;
    if (!latex?.trim()) throw httpError(400, 'latex is required');

    if (resumeId && !(await Resume.updateLatex(resumeId, req.user.id, latex))) {
      throw httpError(404, 'Resume not found');
    }
    res.type('application/pdf').send(await compileToPdf(latex));
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
    res.json({ resume });
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
