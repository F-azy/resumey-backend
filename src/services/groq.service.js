import { env } from '../config/env.js';
import { httpError } from '../utils/httpError.js';

const SYSTEM_PROMPT = `You are a resume writer that outputs LaTeX only.
You are given a LaTeX resume TEMPLATE. Produce a complete .tex document that keeps the template's
preamble, layout, section order and commands exactly, but replaces the content with the candidate's details.
Rules:
- Output ONLY raw LaTeX, from \\documentclass to \\end{document}. No markdown fences, no commentary.
- Use only facts given by the user. Never invent employers, dates, numbers or links.
- Escape LaTeX special characters (& % $ # _ { }) inside text.
- Keep it to ONE page. Use concise, action-oriented bullets.
- If a job description is provided, emphasise matching skills and projects, but do not fabricate.`;

const stripFences = (s) =>
  s.replace(/^```(?:latex|tex)?\s*/i, '').replace(/```\s*$/i, '').trim();

export async function generateLatex({ template, details, jobDescription }) {
  if (!env.groqApiKey) throw httpError(500, 'GROQ_API_KEY is missing in backend/.env');

  const userPrompt = `TEMPLATE:\n${template}\n\nCANDIDATE DETAILS:\n${details}\n\nJOB DESCRIPTION (optional):\n${jobDescription || 'None'}`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.groqApiKey}` },
    body: JSON.stringify({
      model: env.groqModel,
      temperature: 0.2,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  const data = await res.json();
  if (!res.ok) throw httpError(res.status, data?.error?.message || 'Groq request failed');
  return stripFences(data.choices[0].message.content);
}
