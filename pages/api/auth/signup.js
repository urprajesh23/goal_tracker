import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  await dbConnect();
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  // Check if user exists
  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    return res.status(409).json({ message: 'Email or username already exists' });
  }
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, username, password: hashedPassword });
  await user.save();
  res.status(201).json({ message: 'User created' });
} 