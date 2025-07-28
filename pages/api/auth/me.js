import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import { parse } from 'cookie';

export default async function handler(req, res) {
  await dbConnect();
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const token = cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  // For demo, token is user id
  const user = await User.findById(token).select('-password');
  if (!user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  res.status(200).json(user);
} 