import mongoose from 'mongoose';
import Preference from '../models/Preference.js';
import { findOrCreateUser } from '../services/userService.js';
import { extractVehicleProfileInsights } from '../services/geminiService.js';
import {
  mapMcqResponsesToProfile,
  normalizeProfileOutput,
  loadShowcaseInventory,
  rankVehicles
} from '../services/vehicleProfileService.js';

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

const REQUIRED_MCQS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'];

const sanitizeMcqResponses = (raw = {}) => {
  return REQUIRED_MCQS.reduce((acc, key) => {
    const value = raw[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      acc[key] = value.trim().toUpperCase();
    }
    return acc;
  }, {});
};

const sanitizeFrqResponses = (raw = {}) => ({
  lifeChapter:
    typeof raw.lifeChapter === 'string' ? raw.lifeChapter.trim() : '',
  stressNonNegotiables:
    typeof raw.stressNonNegotiables === 'string'
      ? raw.stressNonNegotiables.trim()
      : ''
});

const ensureGeminiFields = (profile, geminiProfile) => {
  if (!geminiProfile) {
    return profile;
  }

  const merged = { ...profile };

  if (geminiProfile.life_stage) {
    merged.lifeStage = geminiProfile.life_stage;
  }

  if (Array.isArray(geminiProfile.vehicle_needs)) {
    merged.vehicleNeedsTags = geminiProfile.vehicle_needs;
  }

  if (geminiProfile.financial_sentiment) {
    merged.financialSentiment = geminiProfile.financial_sentiment;
  }

  if (Array.isArray(geminiProfile.key_concerns)) {
    merged.keyConcerns = geminiProfile.key_concerns;
  }

  return merged;
};

const formatGeminiProfile = (geminiProfile) => {
  if (!geminiProfile) return null;
  return {
    lifeStage: geminiProfile.life_stage || null,
    topGoals: geminiProfile.top_goals || [],
    vehicleNeeds: geminiProfile.vehicle_needs || [],
    financialSentiment: geminiProfile.financial_sentiment || null,
    keyConcerns: geminiProfile.key_concerns || []
  };
};

const formatRecommendationsForStorage = (recommendations) =>
  recommendations.map((item) => ({
    vehicleId:
      item.vehicle._id && mongoose.isValidObjectId(item.vehicle._id)
        ? item.vehicle._id
        : null,
    model: item.vehicle.model,
    trim: item.vehicle.trim || null,
    score: item.score,
    summary: item.summary,
    rank: item.rank
  }));

const buildQuizResponse = ({
  profile,
  geminiProfile,
  frqResponses,
  recommendations
}) => ({
  profile,
  geminiProfile,
  frqResponses,
  recommendations
});

export const submitVehicleProfile = async (req, res, next) => {
  try {
    const user = await findOrCreateUser(req.user);
    const mcqPayload = sanitizeMcqResponses(req.body?.mcqResponses || {});
    const missing = REQUIRED_MCQS.filter((key) => !mcqPayload[key]);

    if (missing.length) {
      return res.status(400).json({
        message: `Missing answers for: ${missing.join(', ')}`
      });
    }

    const frqPayload = sanitizeFrqResponses(req.body?.frqResponses || {});

    let profile = mapMcqResponsesToProfile(mcqPayload);
    let geminiProfile = null;

    if (
      (frqPayload.lifeChapter || frqPayload.stressNonNegotiables) &&
      process.env.GEMINI_API_KEY
    ) {
      try {
        geminiProfile = await extractVehicleProfileInsights(frqPayload);
      } catch (error) {
        console.warn('Gemini extraction failed', error);
      }
    }

    profile = normalizeProfileOutput(ensureGeminiFields(profile, geminiProfile));

    const inventory = await loadShowcaseInventory();
    const recommendations = rankVehicles(profile, inventory);

    const updatedPreference = await Preference.findOneAndUpdate(
      { user: user._id },
      {
        budgetMin: null,
        budgetMax: null,
        fuelTypes: [],
        bodyStyles: [],
        seatCountMin: null,
        primaryUseCases: [],
        user: user._id,
        vehicleProfile: profile,
        frqResponses: frqPayload,
        geminiProfile: geminiProfile,
        lastRecommendations: formatRecommendationsForStorage(recommendations)
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    if (!Array.isArray(user.preferences)) {
      user.preferences = [];
    }

    if (
      !user.preferences.some((prefId) =>
        prefId?.toString() === updatedPreference._id.toString()
      )
    ) {
      user.preferences = [updatedPreference._id];
      await user.save();
    }

    res.status(200).json(
      buildQuizResponse({
        profile,
        geminiProfile: formatGeminiProfile(geminiProfile),
        frqResponses: frqPayload,
        recommendations
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getVehicleProfile = async (req, res, next) => {
  try {
    const user = await findOrCreateUser(req.user);
    const preference = await Preference.findOne({ user: user._id }).lean();

    if (!preference?.vehicleProfile) {
      return res.status(200).json({
        profile: null,
        geminiProfile: null,
        frqResponses: null,
        recommendations: []
      });
    }

    const inventory = await loadShowcaseInventory();
    const recommendations = rankVehicles(
      normalizeProfileOutput(preference.vehicleProfile),
      inventory
    );

    res.status(200).json(
      buildQuizResponse({
        profile: normalizeProfileOutput(preference.vehicleProfile),
        geminiProfile: formatGeminiProfile(preference.geminiProfile),
        frqResponses: preference.frqResponses,
        recommendations
      })
    );
  } catch (error) {
    next(error);
  }
};

