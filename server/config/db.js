import dns from 'dns';
import mongoose from 'mongoose';

// mongodb+srv:// URIs need SRV DNS lookups, which time out under some sandboxed/
// serverless resolvers (a known issue on Vercel/Lambda-style environments).
// Pointing Node at public resolvers avoids that without affecting the app otherwise.
dns.setServers(['1.1.1.1', '8.8.8.8']);

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set in the environment');
  }

  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
  });
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
  });

  await mongoose.connect(uri);
};
