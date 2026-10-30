/**
 * Mongoose ServiceCategory Model for UrbanFix
 */
import mongoose from 'mongoose';

const serviceCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    iconName: {
      type: String,
      default: 'Wrench',
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    servicesCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

serviceCategorySchema.index({ slug: 1 });

const ServiceCategory =
  mongoose.models?.ServiceCategory ||
  mongoose.model('ServiceCategory', serviceCategorySchema);
export default ServiceCategory;
