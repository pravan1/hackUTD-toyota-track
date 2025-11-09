import mongoose from 'mongoose';

const { Schema } = mongoose;

const vehicleProfileSchema = new Schema(
  {
    primaryUse: {
      type: String,
      enum: ['commuter', 'family', 'outdoor', 'eco_urban']
    },
    prefFuel: [{ type: String }],
    ecoPriority: { type: Number, min: 1, max: 5 },
    parkingTight: { type: Boolean, default: false },
    needsCompact: { type: Boolean, default: false },
    needs4WD: { type: Boolean, default: false },
    needsHighwayComfort: { type: Boolean, default: false },
    offRoadPriority: { type: Number, min: 1, max: 5, default: 1 },
    longRange: { type: Boolean, default: false },
    seatNeed: { type: Number, min: 1, max: 8 },
    cargoNeed: { type: Number, min: 1, max: 5 },
    style: {
      type: String,
      enum: ['sedan_lux', 'crossover_suv', 'truck_offroad', 'ev_tech']
    },
    budgetSensitivity: { type: Number, min: 1, max: 5 },
    lifeStage: { type: String },
    vehicleNeedsTags: [{ type: String }],
    financialSentiment: { type: String },
    keyConcerns: [{ type: String }]
  },
  { _id: false }
);

const frqResponsesSchema = new Schema(
  {
    lifeChapter: { type: String },
    stressNonNegotiables: { type: String }
  },
  { _id: false }
);

const geminiProfileSchema = new Schema(
  {
    life_stage: { type: String },
    top_goals: [{ type: String }],
    vehicle_needs: [{ type: String }],
    financial_sentiment: { type: String },
    key_concerns: [{ type: String }]
  },
  { _id: false }
);

const recommendationSchema = new Schema(
  {
    vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
    model: { type: String },
    trim: { type: String },
    score: { type: Number },
    summary: { type: String },
    rank: { type: Number }
  },
  { _id: false, timestamps: false }
);

const preferenceSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    budgetMin: { type: Number },
    budgetMax: { type: Number },
    fuelTypes: [{ type: String }],
    bodyStyles: [{ type: String }],
    seatCountMin: { type: Number },
    primaryUseCases: [{ type: String }],
    vehicleProfile: { type: vehicleProfileSchema, default: null },
    frqResponses: { type: frqResponsesSchema, default: null },
    geminiProfile: { type: geminiProfileSchema, default: null },
    lastRecommendations: {
      type: [recommendationSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Preference =
  mongoose.models.Preference || mongoose.model('Preference', preferenceSchema);

export default Preference;

