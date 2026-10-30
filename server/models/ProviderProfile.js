/**
 * Mongoose ProviderProfile Model for UrbanFix
 */
import mongoose from 'mongoose';

const providerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      default: '',
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceCategory',
      },
    ],
    experienceYears: {
      type: Number,
      default: 3,
    },
    hourlyRate: {
      type: Number,
      default: 45,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    documents: [
      {
        name: String,
        url: String,
        status: { type: String, default: 'submitted' },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    rating: {
      type: Number,
      default: 5.0,
      min: 1,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    totalJobsCompleted: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    serviceRadiusKm: {
      type: Number,
      default: 25,
    },
  },
  {
    timestamps: true,
  }
);

providerProfileSchema.index({ user: 1 });
providerProfileSchema.index({ verificationStatus: 1 });
providerProfileSchema.index({ isAvailable: 1 });

const ProviderProfile =
  mongoose.models?.ProviderProfile ||
  mongoose.model('ProviderProfile', providerProfileSchema);
export default ProviderProfile;
