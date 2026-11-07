import express from 'express';
import cors from 'cors';
import { corsOptions } from './config/cors.js';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';

const app = express();

app.use(cors(corsOptions));
app.use(express.json({ limit: '2mb' }));

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;