"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import styles from "../../styles/Home.module.scss";

function ProgressBar({ percent }) {
  return (
    <div className={styles.progressBarContainer}>
      <div className={styles.progressBar} style={{ width: `${percent}%` }} />
    </div>
  );
}

export default function UncompletedGoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      const res = await fetch("/api/goals");
      const data = await res.json();
      setGoals(data);
      setLoading(false);
    };
    fetchGoals();
  }, []);

  // A goal is uncompleted if not all steps are completed or has no steps
  const uncompletedGoals = goals.filter(
    goal => goal.steps.length === 0 || goal.steps.some(s => !s.completed)
  );

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Uncompleted Goals</h2>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : uncompletedGoals.length === 0 ? (
          <p>All goals are completed!</p>
        ) : (
          <div className={styles.goalsGrid}>
            {uncompletedGoals.map(goal => {
              const completedSteps = goal.steps.filter(s => s.completed).length;
              const percent = goal.steps.length
                ? Math.round((completedSteps / goal.steps.length) * 100)
                : 0;
              return (
                <div key={goal._id} className={styles.goalCard}>
                  <div className={styles.goalTitle}>{goal.title}</div>
                  <div className={styles.goalMeta}>
                    <span>Deadline: {goal.deadline || '-'}</span><br />
                    <span>Reward: {goal.reward || '-'}</span>
                  </div>
                  <ProgressBar percent={percent} />
                  <div style={{ margin: '12px 0' }}>
                    <b>Percent Completed:</b> {percent}%
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