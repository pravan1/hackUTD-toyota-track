import Preference from '../models/Preference.js';
import { findOrCreateUser } from '../services/userService.js';

export const getMyPreferences = async (req, res, next) => {
  try {
    const user = await findOrCreateUser(req.user);
    const preference = await Preference.findOne({ user: user._id }).lean();

    res.json(preference || null);
  } catch (error) {
    next(error);
  }
};

export const savePreferences = async (req, res, next) => {
  try {
    const user = await findOrCreateUser(req.user);
    const payload = {
      budgetMin: req.body.budgetMin ?? null,
      budgetMax: req.body.budgetMax ?? null,
      fuelTypes: req.body.fuelTypes ?? [],
      bodyStyles: req.body.bodyStyles ?? [],
      seatCountMin: req.body.seatCountMin ?? null,
      primaryUseCases: req.body.primaryUseCases ?? [],
      user: user._id
    };

    const preference = await Preference.findOneAndUpdate(
      { user: user._id },
      payload,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    if (!user.preferences.includes(preference._id)) {
      user.preferences = [preference._id];
      await user.save();
    }

    res.status(200).json(preference);
  } catch (error) {
    next(error);
  }
};

export const deletePreferences = async (req, res, next) => {
  try {
    const user = await findOrCreateUser(req.user);

    await Preference.deleteMany({ user: user._id });
    user.preferences = [];
    await user.save();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

