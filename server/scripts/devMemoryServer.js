import 'dotenv/config';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { createApp } from '../app.js';

const mongod = await MongoMemoryServer.create();
process.env.MONGODB_URI = mongod.getUri('crowdfunding');
await mongoose.connect(process.env.MONGODB_URI);
console.log('In-memory MongoDB running at', process.env.MONGODB_URI);

const app = createApp();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT} (in-memory DB mode)`));
