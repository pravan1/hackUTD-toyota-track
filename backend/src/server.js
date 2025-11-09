import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { connectDB } from './config/db.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import userRoutes from './routes/userRoutes.js';
import preferenceRoutes from './routes/preferenceRoutes.js';
import geminiRoutes from './routes/geminiRoutes.js';
import { ensureVehicleDataset } from './utils/vehicleSeeder.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 4000;
const allowedOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

await connectDB();

try {
  await ensureVehicleDataset();
} catch (error) {
  console.error('[Seed] Failed to ensure vehicle dataset', error);
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/vehicles', vehicleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/preferences', preferenceRoutes);
app.use('/api/gemini', geminiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});

