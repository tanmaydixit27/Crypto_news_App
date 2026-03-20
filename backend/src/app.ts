import express from 'express';
import cors from 'cors';
import newsRoutes from './routes/newsRoutes.js';
import { env } from './config/env.js';

const app = express();

app.use(cors({ origin: env.FRONTEND_ORIGINS, credentials: true }));
app.use(express.json());

app.use('/api/news', newsRoutes);

export default app;
