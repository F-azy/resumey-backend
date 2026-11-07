import * as Template from '../models/template.model.js';

export async function list(_req, res, next) {
  try {
    res.json({ templates: await Template.findAll() });
  } catch (err) {
    next(err);
  }
}
