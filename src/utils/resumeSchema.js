const o = (v) => (v && typeof v === 'object' ? v : {});
const str = (v) => (v == null ? '' : String(v).trim());
const arr = (v) => (Array.isArray(v) ? v : []);
const lines = (v) => arr(v).map(str).filter(Boolean);
const joined = (v) => (Array.isArray(v) ? v.map(str).filter(Boolean).join(', ') : str(v));

// Shape sent to the AI. Keep in sync with normalizeResume.
export const RESUME_SHAPE = `{
  "personal": {"fullName":"","headline":"","email":"","phone":"","location":"","linkedin":"","github":"","website":""},
  "education": [{"degree":"","institution":"","period":"","score":""}],
  "skills": [{"label":"","items":"comma separated"}],
  "projects": [{"name":"","tech":"","subtitle":"","link":"","bullets":[""]}],
  "experience": [{"title":"","organization":"","period":"","bullets":[""]}],
  "leadership": [{"title":"","period":"","description":""}],
  "achievements": [{"title":"","period":"","description":""}],
  "additional": {"languages":"","hobbies":""}
}`;

export function normalizeResume(raw) {
  const r = o(raw);
  const p = o(r.personal);
  const a = o(r.additional);
  const entry = (e) => ({ title: str(o(e).title), period: str(o(e).period), description: str(o(e).description) });
  return {
    personal: {
      fullName: str(p.fullName), headline: str(p.headline), email: str(p.email), phone: str(p.phone),
      location: str(p.location), linkedin: str(p.linkedin), github: str(p.github), website: str(p.website),
      photoUrl: str(p.photoUrl),
    },
    education: arr(r.education).map((e) => ({
      degree: str(o(e).degree), institution: str(o(e).institution), period: str(o(e).period), score: str(o(e).score),
    })),
    skills: arr(r.skills).map((s) => ({ label: str(o(s).label), items: joined(o(s).items) })),
    projects: arr(r.projects).map((x) => ({
      name: str(o(x).name), tech: joined(o(x).tech), subtitle: str(o(x).subtitle), link: str(o(x).link),
      bullets: lines(o(x).bullets),
    })),
    experience: arr(r.experience).map((x) => ({
      title: str(o(x).title), organization: str(o(x).organization), period: str(o(x).period), bullets: lines(o(x).bullets),
    })),
    leadership: arr(r.leadership).map(entry),
    achievements: arr(r.achievements).map(entry),
    additional: { languages: joined(a.languages), hobbies: joined(a.hobbies) },
  };
}