"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

export default function AddGoalPage() {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [reward, setReward] = useState("");
  const [steps, setSteps] = useState(Array(10).fill({ text: "", completed: false }));
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStepChange = (idx, value) => {
    setSteps(steps.map((s, i) => i === idx ? { ...s, text: value } : s));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const filteredSteps = steps.filter(s => s.text.trim() !== "");
    const goal = {
      title,
      deadline,
      reward,
      steps: filteredSteps
    };
    const res = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(goal)
    });
    setLoading(false);
    if (res.ok) {
      router.push("/");
    } else {
      alert("Failed to add goal");
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 900, margin: '40px auto', padding: 32 }}>
        <h2>Add a New Goal</h2>
        <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontWeight: 500 }}>Goal Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontWeight: 500 }}>Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontWeight: 500 }}>Reward</label>
            <input
              type="text"
              value={reward}
              onChange={e => setReward(e.target.value)}
              style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontWeight: 500 }}>Steps (up to 10)</label>
            {steps.map((step, idx) => (
              <input
                key={idx}
                type="text"
                value={step.text}
                onChange={e => handleStepChange(idx, e.target.value)}
                placeholder={`Step ${idx + 1}`}
                style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginBottom: 6 }}
              />
            ))}
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ background: '#f7b2b2', color: '#fff', fontWeight: 600, border: 'none', borderRadius: 6, padding: '8px 20px', cursor: 'pointer' }}
          >
            {loading ? 'Adding...' : 'Add Goal'}
          </button>
        </form>
      </main>
    </>
  );
} 