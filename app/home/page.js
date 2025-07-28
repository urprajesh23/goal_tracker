"use client";
import { useEffect, useState } from 'react';
import Navbar from "./components/Navbar";
import styles from '../styles/Home.module.scss';

function getDaysBetween(start, end) {
  if (!start || !end) return '-';
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diff = Math.abs(endDate - startDate);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function Home() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      const res = await fetch('/api/goals');
      const data = await res.json();
      setGoals(data);
      setLoading(false);
    };
    fetchGoals();
  }, []);

  // A goal is completed if all steps are completed and there is at least one step
  const completedGoals = goals.filter(goal => goal.steps.length > 0 && goal.steps.every(s => s.completed));

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Dashboard</h1>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : completedGoals.length === 0 ? (
          <p>No completed goals yet.</p>
        ) : (
          <div className={styles.goalsGrid}>
            {completedGoals.map(goal => {
              // For demo: use the date the goal was created as start, and the date last updated as end
              // If you want to track real start/end, you should add those fields to the schema
              const percent = 100;
              const startDate = goal.createdAt ? new Date(goal.createdAt).toLocaleDateString() : '-';
              const endDate = goal.updatedAt ? new Date(goal.updatedAt).toLocaleDateString() : '-';
              const daysTaken = goal.createdAt && goal.updatedAt ? getDaysBetween(goal.createdAt, goal.updatedAt) : '-';
              return (
                <div key={goal._id} className={styles.goalCard}>
                  <div className={styles.goalTitle}>{goal.title}</div>
                  <div className={styles.goalMeta}>
                    <span>Deadline: {goal.deadline || '-'}</span><br />
                    <span>Reward: {goal.reward || '-'}</span>
                  </div>
                  <div style={{ margin: '12px 0' }}>
                    <b>Percent Completed:</b> {percent}%
                  </div>
                  <div>
                    <b>Start Date:</b> {startDate}<br />
                    <b>End Date:</b> {endDate}<br />
                    <b>Time Taken:</b> {daysTaken === '-' ? '-' : daysTaken + ' days'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
} 