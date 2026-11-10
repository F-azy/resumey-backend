// A template changes WHICH sections appear, their order and their headings. The look stays the same.
export const DEFAULT_TITLES = {
  summary: 'Professional Summary',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  experience: 'Experience',
  certifications: 'Certifications',
  leadership: 'Leadership & Community Involvement',
  achievements: 'Achievements & Recognitions',
  additional: 'Additional Information',
};

export const SECTION_KEYS = Object.keys(DEFAULT_TITLES);

export const DEFAULT_CONFIG = {
  sections: ['education', 'skills', 'projects', 'experience', 'leadership', 'achievements', 'additional'],
  titles: { skills: 'Technical Skills', experience: 'Internship & Courses' },
  hints: { headline: 'Full Stack Developer', skillGroup: 'Languages', skillItems: 'Python, JavaScript, Java', techLabel: 'Technologies' },
};

export function normalizeConfig(config) {
  const sections = Array.isArray(config?.sections) ? config.sections.filter((k) => SECTION_KEYS.includes(k)) : [];
  return {
    sections: sections.length ? sections : DEFAULT_CONFIG.sections,
    titles: config?.titles || {},
    hints: config?.hints || {},
  };
}

export const titleOf = (config, key) => config?.titles?.[key] || DEFAULT_TITLES[key];