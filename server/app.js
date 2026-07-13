import express from 'express';
import cors from 'cors';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import contributionRoutes from './routes/contributionRoutes.js';
import withdrawalRoutes from './routes/withdrawalRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import userRoutes from './routes/userRoutes.js';

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    })
  );
  app.use(express.json());

  app.get('/', (req, res) => {
    res.json({ message: 'Crowdfunding Platform API is running' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/campaigns', campaignRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/contributions', contributionRoutes);
  app.use('/api/withdrawals', withdrawalRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/reports', reportRoutes);
  app.use('/api/users', userRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
