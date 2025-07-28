import mongoose from 'mongoose';

const StepSchema = new mongoose.Schema({
  text: String,
  completed: { type: Boolean, default: false }
});

const GoalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  deadline: String,
  reward: String,
  steps: [StepSchema],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Add user reference
});

export default mongoose.models.Goal || mongoose.model('Goal', GoalSchema);