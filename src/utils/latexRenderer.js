import { normalizeConfig, titleOf } from './templateConfig.js';

const PREAMBLE = String.raw`\documentclass[a4paper,11pt]{article}
\usepackage[margin=0.5in]{geometry}
\usepackage{titlesec}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{setspace}
\usepackage{graphicx}

\renewcommand{\familydefault}{\sfdefault}
\setstretch{0.96}
\pagestyle{empty}

\titleformat{\section}{\bfseries\uppercase}{}{0em}{}[\titlerule]
\titlespacing{\section}{0pt}{6pt}{4pt}

\setlist[itemize]{noitemsep, topsep=3pt, left=1.2em}
`;

const SPECIAL = {
  '\\': '\\textbackslash{}', '&': '\\&', '%': '\\%', $: '\\$', '#': '\\#', _: '\\_',
  '{': '\\{', '}': '\\}', '~': '\\textasciitilde{}', '^': '\\textasciicircum{}',
};

export function esc(s) {
  return String(s ?? '')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2013/g, '--')
    .replace(/\u2014/g, '---')
    .replace(/\u2026/g, '...')
    .replace(/[\u2022\u25AA\u25CF\u00B7]/g, '-')
    .replace(/\u2192/g, '->')
    .replace(/[\u00A0\u200B-\u200D\uFEFF]/g, ' ')
    .replace(/[^\u0000-\u024F]/g, '')
    .replace(/\s*\n\s*/g, ' ')
    .replace(/[\\&%$#_{}~^]/g, (c) => SPECIAL[c]);
}

const url = (u) =>
  (/^(https?:|mailto:)/i.test(u) ? u : `https://${u}`)
    .replace(/[%#&]/g, (c) => `\\${c}`)
    .replace(/[{}\\^\s]/g, '');

const link = (u, text) => `\\href{${url(u)}}{${text}}`;
const join = (parts, glue) => parts.filter(Boolean).join(glue);
const SEP = ' \\;$|$\\; ';

const bullets = (items) =>
  items.length ? `\\begin{itemize}\n${items.map((b) => `    \\item ${esc(b)}`).join('\n')}\n\\end{itemize}\n` : '';

const section = (title, body) => (body ? `\n\\section*{${title}}\n${body}\n` : '');
const blocks = (list) => list.join('\n\\vspace{3pt}\n\n');
const lineRow = (left, right) => `\\noindent${left} \\hfill ${right}`;
const lines2 = (first, second) => join([first, second], '\\\\\n') + '\n';

function scoreText(score) {
  if (!score) return '';
  const i = score.indexOf(':');
  return i > 0 ? `${esc(score.slice(0, i + 1))} \\textbf{${esc(score.slice(i + 1).trim())}}` : `\\textbf{${esc(score)}}`;
}

function header(p, photo) {
  const widths = photo ? [0.5, 0.36] : [0.55, 0.45];
  const links = join(
    [p.linkedin && link(p.linkedin, 'LinkedIn'), p.github && link(p.github, 'GitHub'), p.website && link(p.website, 'Website')],
    SEP
  );
  const contact = join(
    [p.email && link(`mailto:${p.email}`, esc(p.email)), esc(p.phone), esc(p.location), links],
    '\\\\\n    '
  );
  const left = `{\\Huge \\textbf{${esc(p.fullName)}}}${p.headline ? `\\\\[6pt]\n    {\\large \\emph{${esc(p.headline)}}}` : ''}`;
  return `\\noindent
\\begin{minipage}[t]{${widths[0]}\\textwidth}
    \\vspace{0pt}
    ${left}
\\end{minipage}%
\\begin{minipage}[t]{${widths[1]}\\textwidth}
    \\vspace{0pt}\\raggedleft
    ${contact}
\\end{minipage}%${
    photo
      ? `
\\begin{minipage}[t]{0.14\\textwidth}
    \\vspace{0pt}\\raggedleft
    \\includegraphics[width=0.95\\linewidth]{photo.jpg}
\\end{minipage}`
      : ''
  }
`;
}

export function renderResume(d, templateConfig, { photo = false } = {}) {
  const config = normalizeConfig(templateConfig);

  const titled = (list) =>
    blocks(list.filter((x) => x.title).map((x) => lines2(lineRow(`\\textbf{${esc(x.title)}}`, esc(x.period)), esc(x.description))));

  const renderers = {
    summary: () => (d.summary ? `\\noindent ${esc(d.summary)}` : ''),

    education: () =>
      blocks(
        d.education
          .filter((e) => e.degree || e.institution)
          .map((e) =>
            lines2(
              lineRow(`\\textbf{${esc(e.degree)}}`, esc(e.period)),
              e.institution || e.score ? `${esc(e.institution)} \\hfill ${scoreText(e.score)}` : ''
            )
          )
      ),

    skills: () =>
      d.skills
        .filter((s) => s.items)
        .map((s) => `\\noindent${s.label ? `\\textbf{${esc(s.label)}:} ` : ''}${esc(s.items)}`)
        .join(' \\\\\n'),

    projects: () =>
      blocks(
        d.projects
          .filter((x) => x.name)
          .map((x) => {
            const sub = join([esc(x.subtitle), x.link && link(x.link, '\\textbf{View}')], SEP);
            return lines2(lineRow(`\\textbf{${esc(x.name)}}`, x.tech ? `\\textbf{${esc(x.tech)}}` : ''), sub) + bullets(x.bullets);
          })
      ),

    experience: () =>
      blocks(
        d.experience
          .filter((x) => x.title)
          .map((x) => lines2(lineRow(`\\textbf{${esc(x.title)}}`, esc(x.period)), esc(x.organization)) + bullets(x.bullets))
      ),

    certifications: () => titled(d.certifications),
    leadership: () => titled(d.leadership),
    achievements: () => titled(d.achievements),

    additional: () => {
      const { languages, hobbies } = d.additional;
      if (languages && hobbies) {
        return `\\noindent\n\\textbf{Languages:} ${esc(languages)}\n\\hfill\n\\textbf{Hobbies:} ${esc(hobbies)}`;
      }
      if (languages) return `\\noindent\\textbf{Languages:} ${esc(languages)}`;
      if (hobbies) return `\\noindent\\textbf{Hobbies:} ${esc(hobbies)}`;
      return '';
    },
  };

  return [
    PREAMBLE,
    '\\begin{document}',
    header(d.personal, photo),
    ...config.sections.map((key) => section(esc(titleOf(config, key)), renderers[key]())),
    '\\end{document}',
    '',
  ].join('\n');
}