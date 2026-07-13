import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    toEmail: { type: String, required: true, lowercase: true, index: true },
    actionRoute: { type: String, default: '/dashboard' },
    read: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: 'time', updatedAt: false } }
);

export const Notification = mongoose.model('Notification', notificationSchema);
