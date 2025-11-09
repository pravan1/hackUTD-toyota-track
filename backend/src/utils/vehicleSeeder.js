import Vehicle from '../models/Vehicle.js';
import vehiclesData from '../../data/toyotaVehicles.json' assert { type: 'json' };

export const ensureVehicleDataset = async () => {
  const count = await Vehicle.countDocuments();

  if (count === 0) {
    await Vehicle.insertMany(vehiclesData);
    console.log('[Seed] Inserted default Toyota vehicles dataset');
  }
};

export const resetVehicles = async () => {
  await Vehicle.deleteMany({});
  await Vehicle.insertMany(vehiclesData);
};

