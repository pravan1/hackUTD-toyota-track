import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    auth0Id: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: { type: String },
    preferences: [{ type: Schema.Types.ObjectId, ref: 'Preference' }],
    savedVehicles: [{ type: Schema.Types.ObjectId, ref: 'Vehicle' }]
  },
  {
    timestamps: true
  }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;

