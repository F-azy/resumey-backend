import { env } from './env.js';

const escape = (s) => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&');

// "*" matches one hostname segment made of letters, digits and dashes
const matchers = env.clientUrls.map(
  (pattern) => new RegExp('^' + pattern.split('*').map(escape).join('[a-z0-9-]+') + '$', 'i')
);

export const isAllowedOrigin = (origin) => matchers.some((re) => re.test(origin));

export const corsOptions = {
  origin(origin, callback) {
    // No Origin header means a non-browser client (curl, health checks): allow
    if (!origin || isAllowedOrigin(origin)) return callback(null, true);
    callback(null, false);
  },
};