import mongoose from 'mongoose';

const DEFAULT_DB_LOG = '[MongoDB]';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error(`${DEFAULT_DB_LOG} MONGODB_URI is not set. Please provide it in backend/.env`);
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log(`${DEFAULT_DB_LOG} Connected successfully`);
  } catch (error) {
    console.error(`${DEFAULT_DB_LOG} Connection error`, error);
    process.exit(1);
  }
};

