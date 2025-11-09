import mongoose from 'mongoose';

const { Schema } = mongoose;

const vehicleSchema = new Schema(
  {
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    trim: { type: String },
    price: { type: Number },
    fuelType: { type: String },
    bodyStyle: { type: String },
    transmission: { type: String },
    drivetrain: { type: String },
    mpgCity: { type: Number },
    mpgHighway: { type: Number },
    seats: { type: Number },
    imageUrl: { type: String },
    features: [{ type: String }]
  },
  {
    timestamps: true
  }
);

vehicleSchema.index({ make: 1, model: 1, year: 1, trim: 1 }, { unique: true });

const Vehicle =
  mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;

