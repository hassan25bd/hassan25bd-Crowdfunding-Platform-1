import 'dotenv/config';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;
const app = createApp();

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
