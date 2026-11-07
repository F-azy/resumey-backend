export function notFound(_req, res) {
  res.status(404).json({ error: 'Route not found' });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  if (err.code === '23505') return res.status(409).json({ error: 'Already exists' });
  console.error(err.message);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
}
