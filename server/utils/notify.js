import { Notification } from '../models/Notification.js';

export const notify = ({ message, toEmail, actionRoute }) =>
  Notification.create({ message, toEmail: toEmail.toLowerCase(), actionRoute });
