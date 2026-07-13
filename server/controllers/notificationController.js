import asyncHandler from 'express-async-handler';
import { Notification } from '../models/Notification.js';

export const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ toEmail: req.user.email }).sort({ time: -1 });
  res.json(notifications);
});
