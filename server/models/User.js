/**
 * Mongoose User Model for UrbanFix
 */
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
      required: [true, 'Please provide a contact phone number'],
    },
    role: {
      type: String,
      enum: ['customer', 'provider', 'admin'],
      default: 'customer',
    },
    avatar: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: 'Metropolis' },
      state: { type: String, default: 'NY' },
      zipCode: { type: String, default: '10001' },
      coordinates: {
        lat: { type: Number, default: 40.7128 },
        lng: { type: Number, default: -74.006 },
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

const User = mongoose.models?.User || mongoose.model('User', userSchema);
export default User;
