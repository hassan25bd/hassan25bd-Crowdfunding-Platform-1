import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { SIGNUP_BONUS_CREDITS } from '../utils/constants.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

const toPublicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  profilePictureUrl: user.profilePictureUrl,
  role: user.role,
  credits: user.credits,
  authProvider: user.authProvider,
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, profilePictureUrl } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error('Name, email, password, and role are required');
  }
  if (!EMAIL_REGEX.test(email)) {
    res.status(400);
    throw new Error('Please provide a valid email address');
  }
  if (!PASSWORD_REGEX.test(password)) {
    res.status(400);
    throw new Error('Password must be at least 6 characters and include a letter and a number');
  }
  if (!['supporter', 'creator'].includes(role)) {
    res.status(400);
    throw new Error('Role must be either supporter or creator');
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(409);
    throw new Error('An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    role,
    authProvider: 'local',
    profilePictureUrl: profilePictureUrl || undefined,
    credits: SIGNUP_BONUS_CREDITS[role],
  });

  const token = generateToken(user);
  res.status(201).json({ token, user: toPublicUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !user.passwordHash) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user);
  res.json({ token, user: toPublicUser(user) });
});

export const googleLogin = asyncHandler(async (req, res) => {
  const { idToken, role } = req.body;

  if (!idToken) {
    res.status(400);
    throw new Error('idToken is required');
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch (err) {
    res.status(401);
    throw new Error('Invalid Google token');
  }

  const email = payload.email.toLowerCase();
  let user = await User.findOne({ email });

  if (!user) {
    const chosenRole = ['supporter', 'creator'].includes(role) ? role : 'supporter';
    user = await User.create({
      name: payload.name,
      email,
      authProvider: 'google',
      profilePictureUrl: payload.picture || undefined,
      role: chosenRole,
      credits: SIGNUP_BONUS_CREDITS[chosenRole],
    });
  }

  const token = generateToken(user);
  res.json({ token, user: toPublicUser(user) });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: toPublicUser(req.user) });
});

export { toPublicUser };
