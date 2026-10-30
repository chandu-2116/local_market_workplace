/**
 * Database Seed Execution Script for MongoDB
 * Usage: node server/seed/seed.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import ProviderProfile from '../models/ProviderProfile.js';
import ServiceCategory from '../models/ServiceCategory.js';
import Service from '../models/Service.js';
import Booking from '../models/Booking.js';
import { Review } from '../models/Review.js';
import {
  INITIAL_CATEGORIES,
  INITIAL_USERS,
  INITIAL_PROVIDER_PROFILES,
  INITIAL_SERVICES,
  INITIAL_BOOKINGS,
  INITIAL_REVIEWS,
} from './initialData.js';

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing collections...');
    await User.deleteMany();
    await ProviderProfile.deleteMany();
    await ServiceCategory.deleteMany();
    await Service.deleteMany();
    await Booking.deleteMany();
    await Review.deleteMany();

    console.log('Seeding 15 Service Categories...');
    await ServiceCategory.insertMany(INITIAL_CATEGORIES);

    console.log('Seeding Users and Providers...');
    await User.insertMany(INITIAL_USERS);

    console.log('Seeding Services...');
    await Service.insertMany(INITIAL_SERVICES);

    console.log('Seeding Sample Bookings & Status History...');
    await Booking.insertMany(INITIAL_BOOKINGS);

    console.log('Seeding Customer Reviews...');
    await Review.insertMany(INITIAL_REVIEWS);

    console.log('✅ UrbanFix Database Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Seed error: ${error}`);
    process.exit(1);
  }
};

importData();
