import mongoose from 'mongoose';

const { Schema } = mongoose;

const preferenceSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    budgetMin: { type: Number },
    budgetMax: { type: Number },
    fuelTypes: [{ type: String }],
    bodyStyles: [{ type: String }],
    seatCountMin: { type: Number },
    primaryUseCases: [{ type: String }]
  },
  {
    timestamps: true
  }
);

const Preference =
  mongoose.models.Preference || mongoose.model('Preference', preferenceSchema);

export default Preference;

