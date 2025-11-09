import Vehicle from '../models/Vehicle.js';
import { findOrCreateUser } from '../services/userService.js';

export const getMe = async (req, res, next) => {
  try {
    const user = await findOrCreateUser(req.user);
    await user.populate(['savedVehicles', 'preferences']);

    res.json({
      id: user._id,
      auth0Id: user.auth0Id,
      email: user.email,
      name: user.name,
      savedVehicles: user.savedVehicles,
      preferences: user.preferences
    });
  } catch (error) {
    next(error);
  }
};

export const saveVehicle = async (req, res, next) => {
  try {
    const { vehicleId } = req.body;

    if (!vehicleId) {
      return res.status(400).json({ message: 'vehicleId is required' });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const user = await findOrCreateUser(req.user);

    if (!user.savedVehicles.some((id) => id.equals(vehicle._id))) {
      user.savedVehicles.push(vehicle._id);
      await user.save();
    }

    await user.populate('savedVehicles');

    res.status(200).json(user.savedVehicles);
  } catch (error) {
    next(error);
  }
};

export const removeSavedVehicle = async (req, res, next) => {
  try {
    const { vehicleId } = req.params;
    const user = await findOrCreateUser(req.user);
    user.savedVehicles = user.savedVehicles.filter(
      (id) => id.toString() !== vehicleId
    );
    await user.save();
    await user.populate('savedVehicles');

    res.status(200).json(user.savedVehicles);
  } catch (error) {
    next(error);
  }
};

