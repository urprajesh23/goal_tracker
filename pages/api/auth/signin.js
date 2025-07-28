import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  await dbConnect();
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  // Find user by email or username
  const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  // Set cookie for session (for demo, use user id as token)
  res.setHeader('Set-Cookie', `token=${user._id}; Path=/; HttpOnly; Max-Age=86400`);
  // Return user info (excluding password)
  res.status(200).json({ email: user.email, username: user.username, id: user._id });
} 