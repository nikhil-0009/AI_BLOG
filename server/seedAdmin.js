import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';


dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/ai_blog`)
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_MAIL })

    if (existingAdmin) {
      console.log('✅ Admin already exists')
      return process.exit(0)
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)

    const admin = new User({
      name: 'Admin',
      email: process.env.ADMIN_MAIL,
      password: hashedPassword,
      role: 'admin',
    })

    await admin.save()
    console.log('✅ Admin seeded successfully')
    process.exit(0)
  } catch (err) {
    console.error('❌ Failed to seed admin:', err)
    process.exit(1)
  }
}

seedAdmin();