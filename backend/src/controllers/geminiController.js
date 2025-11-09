import Vehicle from '../models/Vehicle.js';
import Preference from '../models/Preference.js';
import { findOrCreateUser } from '../services/userService.js';
import {
  generateVehicleRecommendations,
  generateVehicleSummary
} from '../services/geminiService.js';

const ensureGeminiConfigured = () => {
  if (!process.env.GEMINI_API_KEY) {
    const error = new Error(
      'Gemini API key missing. Set GEMINI_API_KEY in backend/.env'
    );
    error.status = 503;
    throw error;
  }
};

const buildVehicleFilterFromPreferences = (preferences = {}) => {
  const query = {};

  if (preferences.budgetMin || preferences.budgetMax) {
    query.price = {};
    if (preferences.budgetMin) query.price.$gte = preferences.budgetMin;
    if (preferences.budgetMax) query.price.$lte = preferences.budgetMax;
  }

  if (preferences.fuelTypes?.length) {
    query.fuelType = { $in: preferences.fuelTypes };
  }

  if (preferences.bodyStyles?.length) {
    query.bodyStyle = { $in: preferences.bodyStyles };
  }

  if (preferences.seatCountMin) {
    query.seats = { $gte: preferences.seatCountMin };
  }

  return query;
};

export const getVehicleSummary = async (req, res, next) => {
  try {
    ensureGeminiConfigured();

    const { vehicleId } = req.body;

    if (!vehicleId) {
      return res.status(400).json({ message: 'vehicleId is required' });
    }

    const vehicle = await Vehicle.findById(vehicleId).lean();

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const summary = await generateVehicleSummary(vehicle);

    res.json({ summary, vehicle });
  } catch (error) {
    next(error);
  }
};

export const getRecommendations = async (req, res, next) => {
  try {
    ensureGeminiConfigured();

    const user = await findOrCreateUser(req.user);
    const storedPreference = await Preference.findOne({
      user: user._id
    }).lean();

    const overrides = req.body.preferenceOverrides || {};
    const effectivePreferences = {
      ...(storedPreference || {}),
      ...overrides
    };

    const filter = buildVehicleFilterFromPreferences(effectivePreferences);
    const candidates = await Vehicle.find(filter).limit(12).lean();

    const vehicles = candidates.length
      ? candidates
      : await Vehicle.find().limit(12).lean();

    const recommendationText = await generateVehicleRecommendations({
      preferences: effectivePreferences,
      vehicles
    });

    res.json({
      recommendations: recommendationText,
      vehicles
    });
  } catch (error) {
    next(error);
  }
};

