import 'dotenv/config';
import mongoose from 'mongoose';
import { createApp } from '../app.js';
import { connectDB } from '../config/db.js';

const app = createApp();

export default async function handler(req, res) {
  if (mongoose.connection.readyState === 0) {
    await connectDB();
  }
  return app(req, res);
}
