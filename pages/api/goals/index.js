import dbConnect from '../../../lib/mongodb';
import Goal from '../../../models/Goal';
import { parse } from 'cookie';

export default async function handler(req, res) {
  await dbConnect();
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const token = cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  if (req.method === 'GET') {
    const goals = await Goal.find({ user: token });
    res.status(200).json(goals);
  } else if (req.method === 'POST') {
    const { title, deadline, reward, steps } = req.body;
    const goal = new Goal({ title, deadline, reward, steps, user: token });
    await goal.save();
    res.status(201).json(goal);
  } else {
    res.status(405).end();
  }
}