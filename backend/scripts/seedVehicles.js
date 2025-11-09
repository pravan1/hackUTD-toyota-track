import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../src/config/db.js';
import { resetVehicles } from '../src/utils/vehicleSeeder.js';

dotenv.config();

const seed = async () => {
  try {
    await connectDB();
    await resetVehicles();
    console.log('Vehicle collection successfully seeded.');
  } catch (error) {
    console.error('Failed to seed vehicles', error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seed();

