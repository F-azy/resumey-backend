import { httpError } from '../utils/httpError.js';
import { renderResume } from '../utils/latexRenderer.js';

async function build(latex, extraResources = []) {
  const res = await fetch('https://latex.ytotech.com/builds/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ compiler: 'pdflatex', resources: [{ main: true, content: latex }, ...extraResources] }),
  });
  if (!res.ok) throw httpError(400, (await res.text()).slice(-1200));
  return Buffer.from(await res.arrayBuffer());
}

// Cloudinary delivers the image as a JPG, which pdflatex can embed.
const asJpg = (u) => u.replace('/upload/', '/upload/f_jpg/');

export async function compileResume(data, templateConfig) {
  const photoUrl = data.personal.photoUrl;
  if (photoUrl) {
    try {
      return await build(renderResume(data, templateConfig, { photo: true }), [{ path: 'photo.jpg', url: asJpg(photoUrl) }]);
    } catch {
      // The photo could not be embedded; fall back to the resume without it.
    }
  }
  return build(renderResume(data, templateConfig, { photo: false }));
}