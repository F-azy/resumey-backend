// Preview photos shown on the Templates screen (Cloudinary). Replace the URLs to change them.
const MEN = [
  'https://res.cloudinary.com/n202mmx4/image/upload/v1794218558/gallery-3.jpg',
  'https://res.cloudinary.com/n202mmx4/image/upload/v1794218558/fotoria-ai-professional-headshots-hero3.webp',
];
const WOMEN = [
  'https://res.cloudinary.com/n202mmx4/image/upload/v1794218633/image.webp',
  'https://res.cloudinary.com/n202mmx4/image/upload/v1794218634/professional-headshot-cv-linkedin-photographer-Copenhagen.jpg',
];

export const templateSeeds = [
  {
    slug: 'btech',
    name: 'B.Tech and Engineering Student',
    description: 'Technical skills, projects and internships. Built for engineering and IT students.',
    category: 'student',
    previewImageUrl: MEN[0],
    sortOrder: 1,
    config: {
      sections: ['education', 'skills', 'projects', 'experience', 'leadership', 'achievements', 'additional'],
      titles: { skills: 'Technical Skills', experience: 'Internship & Courses' },
      hints: { headline: 'Full Stack Developer | Mobile App Developer', skillGroup: 'Languages', skillItems: 'Python, JavaScript, Java', techLabel: 'Technologies' },
    },
  },
  {
    slug: 'bcom',
    name: 'B.Com and Commerce Student',
    description: 'Career objective, core skills, internships and academic projects. No technical section.',
    category: 'student',
    previewImageUrl: WOMEN[0],
    sortOrder: 2,
    config: {
      sections: ['summary', 'education', 'skills', 'experience', 'projects', 'certifications', 'leadership', 'achievements', 'additional'],
      titles: { summary: 'Career Objective', skills: 'Core Skills', experience: 'Internships & Training', projects: 'Academic Projects', leadership: 'Extracurricular Activities' },
      hints: { headline: 'B.Com Graduate | Accounting and Finance', skillGroup: 'Accounting', skillItems: 'Tally Prime, GST, MS Excel', techLabel: 'Tools used' },
    },
  },
  {
    slug: 'aviation',
    name: 'Aviation Student',
    description: 'Training, licenses and certifications up front. For aviation, cabin crew and ground operations.',
    category: 'student',
    previewImageUrl: MEN[1],
    sortOrder: 3,
    config: {
      sections: ['summary', 'education', 'skills', 'experience', 'certifications', 'projects', 'leadership', 'achievements', 'additional'],
      titles: { summary: 'Career Objective', skills: 'Aviation & Core Skills', experience: 'Training & Internships', certifications: 'Licenses & Certifications', projects: 'Academic Projects', leadership: 'Extracurricular Activities' },
      hints: { headline: 'Aviation Student | Ground Operations', skillGroup: 'Operations', skillItems: 'Passenger handling, Ticketing, Safety procedures', techLabel: 'Focus area' },
    },
  },
  {
    slug: 'agriculture',
    name: 'Agriculture Student',
    description: 'Field and laboratory skills, research projects and farm training.',
    category: 'student',
    previewImageUrl: WOMEN[1],
    sortOrder: 4,
    config: {
      sections: ['summary', 'education', 'skills', 'projects', 'experience', 'certifications', 'leadership', 'achievements', 'additional'],
      titles: { summary: 'Career Objective', skills: 'Field & Laboratory Skills', projects: 'Research & Field Projects', experience: 'Internships & Farm Training', leadership: 'Extracurricular Activities' },
      hints: { headline: 'B.Sc Agriculture Student | Crop Science', skillGroup: 'Laboratory', skillItems: 'Soil testing, Plant pathology, GIS basics', techLabel: 'Crop or method' },
    },
  },
  {
    slug: 'arts-science',
    name: 'Arts and Science Fresher',
    description: 'For BA, BSc, BBA and other non-technical graduates. Profile, internships and key skills.',
    category: 'student',
    previewImageUrl: WOMEN[0],
    sortOrder: 5,
    config: {
      sections: ['summary', 'education', 'experience', 'skills', 'projects', 'certifications', 'leadership', 'achievements', 'additional'],
      titles: { summary: 'Profile', experience: 'Internships & Experience', skills: 'Key Skills', projects: 'Academic Projects', leadership: 'Volunteering & Activities' },
      hints: { headline: 'BA English Graduate | Content Writing', skillGroup: 'Communication', skillItems: 'Public speaking, Content writing, MS Office', techLabel: 'Tools used' },
    },
  },
  {
    slug: 'professional',
    name: 'General Professional',
    description: 'Summary and work experience first. For any experienced role, technical or not.',
    category: 'professional',
    previewImageUrl: MEN[1],
    sortOrder: 6,
    config: {
      sections: ['summary', 'experience', 'skills', 'projects', 'education', 'certifications', 'achievements', 'additional'],
      titles: { summary: 'Professional Summary', experience: 'Work Experience', skills: 'Key Skills', projects: 'Key Projects' },
      hints: { headline: 'Operations Manager', skillGroup: 'Management', skillItems: 'Team leadership, Budgeting, Reporting', techLabel: 'Tools used' },
    },
  },
  {
    slug: 'tech-professional',
    name: 'Technical Professional',
    description: 'Technical skills and work experience first. For experienced developers and engineers.',
    category: 'professional',
    previewImageUrl: MEN[0],
    sortOrder: 7,
    config: {
      sections: ['summary', 'skills', 'experience', 'projects', 'education', 'certifications', 'achievements', 'additional'],
      titles: { summary: 'Professional Summary', skills: 'Technical Skills', experience: 'Work Experience', projects: 'Key Projects' },
      hints: { headline: 'Senior Software Engineer', skillGroup: 'Backend', skillItems: 'Node.js, PostgreSQL, AWS', techLabel: 'Technologies' },
    },
  },
];