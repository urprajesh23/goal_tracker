"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import styles from "../../styles/Home.module.scss";

export default function DeleteGoalsPage() {
  const [goals, setGoals] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchGoals = async () => {
      const res = await fetch("/api/goals");
      const data = await res.json();
      setGoals(data);
      setLoading(false);
    };
    fetchGoals();
  }, []);

  const handleSelect = (goalId) => {
    setSelected(selected =>
      selected.includes(goalId)
        ? selected.filter(id => id !== goalId)
        : [...selected, goalId]
    );
  };

  const handleDelete = async () => {
    if (selected.length === 0) return;
    if (!confirm(`Delete ${selected.length} selected goal(s)?`)) return;
    setDeleting(true);
    await Promise.all(selected.map(id =>
      fetch(`/api/goals/${id}`, { method: "DELETE" })
    ));
    // Refresh list
    const res = await fetch("/api/goals");
    const data = await res.json();
    setGoals(data);
    setSelected([]);
    setDeleting(false);
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Delete Goals</h2>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : goals.length === 0 ? (
          <p>No goals to delete.</p>
        ) : (
          <form onSubmit={e => { e.preventDefault(); handleDelete(); }}>
            <div style={{ marginBottom: 16 }}>
              <button
                type="submit"
                disabled={selected.length === 0 || deleting}
                style={{ background: '#f7b2b2', color: '#fff', fontWeight: 600, border: 'none', borderRadius: 6, padding: '8px 20px', cursor: selected.length === 0 ? 'not-allowed' : 'pointer' }}
              >
                {deleting ? 'Deleting...' : `Delete Selected (${selected.length})`}
              </button>
            </div>
            <div className={styles.goalsGrid}>
              {goals.map(goal => (
                <label key={goal._id} className={styles.goalCard} style={{ cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <input
                    type="checkbox"
                    checked={selected.includes(goal._id)}
                    onChange={() => handleSelect(goal._id)}
                    style={{ marginTop: 4 }}
                  />
                  <div style={{ flex: 1 }}>
                    <div className={styles.goalTitle}>{goal.title}</div>
                    <div className={styles.goalMeta}>
                      <span>Deadline: {goal.deadline || '-'}</span><br />
                      <span>Reward: {goal.reward || '-'}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </form>
        )}
      </div>
    </>
  );
} 