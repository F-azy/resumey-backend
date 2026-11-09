import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import mammoth from 'mammoth';
import { httpError } from '../utils/httpError.js';

export async function extractText(file) {
  const name = file.originalname.toLowerCase();
  try {
    if (name.endsWith('.pdf')) return (await pdfParse(file.buffer)).text;
    if (name.endsWith('.docx')) return (await mammoth.extractRawText({ buffer: file.buffer })).value;
    return file.buffer.toString('utf8');
  } catch {
    throw httpError(422, 'This file could not be read. Try another PDF or DOCX.');
  }
}
