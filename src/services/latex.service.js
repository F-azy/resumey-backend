import { httpError } from '../utils/httpError.js';

// Demo compiler: public latex.ytotech.com service.
// Swap for a local `pdflatex` call later without touching controllers or routes.
export async function compileToPdf(latex) {
  const res = await fetch('https://latex.ytotech.com/builds/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ compiler: 'pdflatex', resources: [{ main: true, content: latex }] }),
  });
  if (!res.ok) throw httpError(400, (await res.text()).slice(-1500));
  return Buffer.from(await res.arrayBuffer());
}
