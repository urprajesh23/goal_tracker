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
  const { id } = req.query;

  const goal = await Goal.findOne({ _id: id, user: token });
  if (!goal) {
    return res.status(404).json({ message: 'Goal not found' });
  }

  if (req.method === 'PUT') {
    const { title, deadline, reward, steps } = req.body;
    goal.title = title;
    goal.deadline = deadline;
    goal.reward = reward;
    goal.steps = steps;
    await goal.save();
    res.status(200).json(goal);
  } else if (req.method === 'DELETE') {
    await goal.deleteOne();
    res.status(204).end();
  } else {
    res.status(405).end();
  }
}