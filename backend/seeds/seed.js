require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');
const Challenge = require('../models/Challenge');
const Reward = require('../models/Reward');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/greensphere';

async function seed() {
  await mongoose.connect(MONGODB_URI);
  await User.deleteMany({});
  await Post.deleteMany({});
  await Challenge.deleteMany({});
  await Reward.deleteMany({});

  const admin = await User.create({
    name: 'Admin Green',
    email: 'admin@greensphere.com',
    password: 'admin123',
    role: 'admin',
    bio: 'GreenSphere platform admin.',
    points: 0,
  });

  const users = await User.insertMany([
    { name: 'Eco Emma', email: 'emma@example.com', password: 'password123', bio: 'Tree planter & nature lover', points: 320, badges: ['Eco Warrior'] },
    { name: 'Solar Sam', email: 'sam@example.com', password: 'password123', bio: 'Cycling enthusiast', points: 280, badges: [] },
    { name: 'Recycle Rita', email: 'rita@example.com', password: 'password123', bio: 'Zero waste advocate', points: 450, badges: ['Recycler', 'Cleanup Champion'] },
  ]);

  const [u1, u2, u3] = users;
  await User.findByIdAndUpdate(u1._id, { following: [u2._id, u3._id], followers: [u2._id] });
  await User.findByIdAndUpdate(u2._id, { following: [u1._id], followers: [u1._id, u3._id] });
  await User.findByIdAndUpdate(u3._id, { following: [u1._id, u2._id], followers: [u2._id] });

  await Post.insertMany([
    { userId: u1._id, caption: 'Planted 10 saplings today! 🌱', location: 'Central Park', ecoCategory: 'tree_plantation', pointsAwarded: 50, likes: [u2._id, u3._id], comments: [{ userId: u2._id, text: 'Amazing work!' }] },
    { userId: u2._id, caption: 'Cycled 20 km to work. No car today!', location: 'Downtown', ecoCategory: 'cycling', pointsAwarded: 20, likes: [u1._id], comments: [] },
    { userId: u3._id, caption: 'Beach cleanup with the team. 50 kg waste collected.', location: 'Sunset Beach', ecoCategory: 'cleanup', pointsAwarded: 40, likes: [u1._id, u2._id], comments: [{ userId: u1._id, text: 'So proud of you all!' }] },
    { userId: u1._id, caption: 'Sorted and recycled all plastic this week.', location: 'Home', ecoCategory: 'recycling', pointsAwarded: 30, likes: [], comments: [] },
  ]);

  await Challenge.insertMany([
    { title: 'Plant a Tree Week', description: 'Plant at least one tree and share a photo.', pointsReward: 50, deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), requiresProof: true, createdBy: admin._id },
    { title: 'No Car Day', description: 'Use only public transport or cycle for one day.', pointsReward: 25, deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), requiresProof: false, createdBy: admin._id },
  ]);

  await Reward.insertMany([
    { title: 'Eco Warrior Badge', description: 'Earned for 100+ eco-points', pointsCost: 100, stock: 1000, type: 'badge' },
    { title: 'Green Certificate', description: 'Official GreenSphere certificate', pointsCost: 200, stock: 500, type: 'certificate' },
    { title: '10% Off Eco Store', description: 'Coupon for partner store', pointsCost: 150, stock: 200, type: 'coupon' },
  ]);

  console.log('Seed completed. Admin: admin@greensphere.com / admin123. Users: emma@example.com, sam@example.com, rita@example.com / password123');
  await mongoose.disconnect();
}

seed().catch((e) => { console.error(e); process.exit(1); });
