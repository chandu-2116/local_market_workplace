/**
 * Mongoose Booking Model for UrbanFix
 */
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceCategory',
    },
    assignedProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: [
        'Pending',
        'Accepted',
        'Rejected',
        'Work Started',
        'Completed',
        'Cancelled',
      ],
      default: 'Pending',
    },
    problemDescription: {
      type: String,
      required: [true, 'Please provide service request details'],
    },
    serviceAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, default: 'NY' },
      zipCode: { type: String, required: true },
      contactPhone: { type: String, required: true },
      notes: { type: String, default: '' },
    },
    scheduledDate: {
      type: String,
      required: true,
    },
    scheduledTimeSlot: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Refunded'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      enum: ['Razorpay', 'Card', 'UPI', 'Cash', 'None'],
      default: 'None',
    },
    paymentId: {
      type: String,
      default: '',
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        note: { type: String, default: '' },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ customer: 1 });
bookingSchema.index({ assignedProvider: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ createdAt: -1 });

const Booking =
  mongoose.models?.Booking || mongoose.model('Booking', bookingSchema);
export default Booking;
