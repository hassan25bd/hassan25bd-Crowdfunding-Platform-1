import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, default: null },
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
    profilePictureUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop&crop=faces',
    },
    role: { type: String, enum: ['supporter', 'creator', 'admin'], default: 'supporter' },
    credits: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
