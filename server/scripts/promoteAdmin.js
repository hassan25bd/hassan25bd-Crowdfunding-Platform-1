import mongoose from 'mongoose';

const [, , uri, email] = process.argv;
await mongoose.connect(uri);
const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
const result = await User.updateOne({ email }, { $set: { role: 'admin' } });
console.log(JSON.stringify(result));
await mongoose.disconnect();
