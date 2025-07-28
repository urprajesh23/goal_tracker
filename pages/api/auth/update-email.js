import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import { parse } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  await dbConnect();
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const token = cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  // Check if email is already taken
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: 'Email already in use' });
  }
  const user = await User.findByIdAndUpdate(token, { email }, { new: true });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json({ message: 'Email updated' });
} 