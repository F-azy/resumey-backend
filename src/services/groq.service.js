import { env } from '../config/env.js';
import { httpError } from '../utils/httpError.js';
import { RESUME_SHAPE, normalizeResume } from '../utils/resumeSchema.js';

async function chat(system, user) {
  if (!env.groqApiKey) throw httpError(500, 'GROQ_API_KEY is missing on the server');

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.groqApiKey}` },
    body: JSON.stringify({
      model: env.groqModel,
      temperature: 0.1,
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw httpError(res.status, data?.error?.message || 'Groq request failed');
  return data.choices[0].message.content || '';
}

function parseJson(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  try {
    if (start < 0 || end <= start) throw new Error('no json');
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    throw httpError(502, 'The AI response could not be read. Please try again.');
  }
}

export async function extractResume(text) {
  const system = `You extract resume data into JSON. Return ONLY one JSON object with exactly this shape:
${RESUME_SHAPE}
Rules: use only information present in the resume; never invent anything; use "" or [] when something is missing;
keep dates and links exactly as written; "score" is a grade such as "CGPA: 8.07"; "bullets" are short strings.`;
  const raw = await chat(system, text.slice(0, 15000));
  return normalizeResume(parseJson(raw));
}

const LIST_KEYS = ['education', 'skills', 'projects', 'experience', 'certifications', 'leadership', 'achievements'];

export async function refineResume(data, jobDescription, sections = []) {
  const system = `You improve resume content. You receive resume JSON and return the SAME JSON shape:
${RESUME_SHAPE}
Rules:
- Never invent facts, employers, dates, numbers, links or skills that are not in the input.
- Keep every entry, name, date, email, phone and link unchanged.
- Rewrite bullets to be concise and action-oriented, and fix grammar. Max 4 bullets per project and 3 per experience.
- If a job description is given, put the most relevant skills first and make the headline fit the role, staying truthful.
- This resume template uses these sections: ${sections.join(', ') || 'all'}. Only the content of those sections matters.
- If "summary" is one of the sections and it is empty, write 2 or 3 sentences using only facts present in the resume.
- Return ONLY the JSON object.`;
  const input = JSON.stringify({ ...data, personal: { ...data.personal, photoUrl: undefined } });
  const user = `RESUME JSON:\n${input}\n\nJOB DESCRIPTION:\n${jobDescription?.trim() || 'None'}`;

  const refined = normalizeResume(parseJson(await chat(system, user)));

  // Safety net: never lose content or contact details because of the AI step.
  refined.personal = { ...data.personal, headline: refined.personal.headline || data.personal.headline };
  refined.additional = data.additional;
  refined.summary = refined.summary || data.summary;
  for (const key of LIST_KEYS) {
    if (!refined[key].length && data[key].length) refined[key] = data[key];
  }
  return refined;
}