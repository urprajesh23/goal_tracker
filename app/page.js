"use client";
import { useEffect, useState } from 'react';
import Navbar from "./components/Navbar";
import styles from '../styles/Home.module.scss';
import { useRouter } from 'next/navigation';

function ProgressBar({ percent }) {
  return (
    <div className={styles.progressBarContainer}>
      <div className={styles.progressBar} style={{ width: `${percent}%` }} />
    </div>
  );
}

function GoalCard({ goal, onEdit, onDelete, onToggleStep }) {
  const completedSteps = goal.steps.filter(s => s.completed).length;
  const percent = goal.steps.length ? Math.round((completedSteps / goal.steps.length) * 100) : 0;

  return (
    <div className={styles.goalCard}>
      <div className={styles.goalHeader}>
        <h3 className={styles.goalTitle}>{goal.title}</h3>
        <div className={styles.goalProgress}>
          {percent}%
        </div>
      </div>
      
      <div className={styles.goalMeta}>
        <div className={styles.metaItem}>
          <span className={styles.metaIcon}>📅</span>
          <span>Deadline: {goal.deadline || 'No deadline'}</span>
        </div>
        {goal.reward && (
          <div className={styles.metaItem}>
            <span className={styles.metaIcon}>🎁</span>
            <span>Reward: {goal.reward}</span>
          </div>
        )}
      </div>

      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>Progress</span>
          <span className={styles.progressPercentage}>{percent}%</span>
        </div>
        <ProgressBar percent={percent} />
      </div>

      <div className={styles.stepsSection}>
        <div className={styles.stepsHeader}>
          <span className={styles.metaIcon}>📋</span>
          <span>Steps ({completedSteps}/{goal.steps.length})</span>
        </div>
        <ul className={styles.stepsList}>
          {goal.steps.map((step, idx) => (
            <li 
              key={idx} 
              className={`${styles.stepItem} ${step.completed ? styles.completed : ''}`}
            >
              <input
                type="checkbox"
                className={styles.stepCheckbox}
                checked={step.completed}
                onChange={() => onToggleStep(goal._id, idx)}
              />
              <span className={styles.stepText}>{step.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.goalActions}>
        <button 
          className={`${styles.actionBtn} ${styles.primary}`}
          onClick={() => onEdit(goal)}
        >
          ✏️ Edit
        </button>
        <button 
          className={`${styles.actionBtn} ${styles.error}`}
          onClick={() => onDelete(goal._id)}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

function GoalModal({ open, onClose, onSave, initial }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [deadline, setDeadline] = useState(initial?.deadline || '');
  const [reward, setReward] = useState(initial?.reward || '');
  const [steps, setSteps] = useState(initial?.steps?.length ? initial.steps : Array(10).fill({ text: '', completed: false }));

  useEffect(() => {
    if (open) {
      setTitle(initial?.title || '');
      setDeadline(initial?.deadline || '');
      setReward(initial?.reward || '');
      setSteps(initial?.steps?.length ? initial.steps.concat(Array(10 - initial.steps.length).fill({ text: '', completed: false })) : Array(10).fill({ text: '', completed: false }));
    }
  }, [open, initial]);

  const handleStepChange = (idx, value) => {
    setSteps(steps.map((s, i) => i === idx ? { ...s, text: value } : s));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredSteps = steps.filter(s => s.text.trim() !== '');
    onSave({
      title,
      deadline,
      reward,
      steps: filteredSteps
    });
  };

  if (!open) return null;
  
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {initial ? 'Edit Goal' : 'Add New Goal'}
          </h2>
          <button className={styles.modalClose} onClick={onClose}>
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Goal Title *</label>
            <input 
              className={styles.formInput} 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Enter your goal title"
              required 
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Deadline</label>
            <input 
              type="date" 
              className={styles.formInput} 
              value={deadline} 
              onChange={e => setDeadline(e.target.value)} 
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Reward</label>
            <input 
              className={styles.formInput} 
              value={reward} 
              onChange={e => setReward(e.target.value)} 
              placeholder="What will you reward yourself with?"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Steps (up to 10) *</label>
            {steps.map((step, idx) => (
              <input
                key={idx}
                className={styles.formInput}
                value={step.text}
                onChange={e => handleStepChange(idx, e.target.value)}
                placeholder={`Step ${idx + 1}`}
                style={{ marginBottom: '8px' }}
              />
            ))}
          </div>
          
          <div className={styles.modalActions}>
            <button 
              className={`${styles.actionBtn} ${styles.secondary}`} 
              type="button" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className={`${styles.actionBtn} ${styles.primary}`} 
              type="submit"
            >
              {initial ? 'Update Goal' : 'Add Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StatsCard({ icon, number, label, type = 'primary' }) {
  return (
    <div className={styles.statCard}>
      <div className={`${styles.statIcon} ${styles[type]}`}>
        {icon}
      </div>
      <div className={styles.statNumber}>{number}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

export default function Home() {
  const [goals, setGoals] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const router = useRouter();

  const fetchGoals = async () => {
    try {
      const res = await fetch('/api/goals');
      let data = await res.json();
      if (!Array.isArray(data)) data = [];
      setGoals(data);
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.status !== 200) {
          router.replace('/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.replace('/login');
      }
    }
    checkAuth();
  }, [router]);

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      try {
        await fetch(`/api/goals/${id}`, { method: 'DELETE' });
        fetchGoals();
      } catch (error) {
        console.error('Failed to delete goal:', error);
      }
    }
  };

  const handleSave = async (goal) => {
    try {
      if (editingGoal) {
        await fetch(`/api/goals/${editingGoal._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(goal)
        });
      } else {
        await fetch('/api/goals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(goal)
        });
      }
      setModalOpen(false);
      setEditingGoal(null);
      fetchGoals();
    } catch (error) {
      console.error('Failed to save goal:', error);
    }
  };

  const handleToggleStep = async (goalId, stepIdx) => {
    try {
      const goal = goals.find(g => g._id === goalId);
      const updatedSteps = goal.steps.map((s, i) => i === stepIdx ? { ...s, completed: !s.completed } : s);
      await fetch(`/api/goals/${goalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...goal, steps: updatedSteps })
      });
      fetchGoals();
    } catch (error) {
      console.error('Failed to toggle step:', error);
    }
  };

  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => {
    const completedSteps = g.steps.filter(s => s.completed).length;
    return g.steps.length > 0 && completedSteps === g.steps.length;
  }).length;
  const activeGoals = totalGoals - completedGoals;
  const averageProgress = totalGoals > 0 
    ? Math.round(goals.reduce((acc, goal) => {
        const completedSteps = goal.steps.filter(s => s.completed).length;
        const percent = goal.steps.length ? (completedSteps / goal.steps.length) * 100 : 0;
        return acc + percent;
      }, 0) / totalGoals)
    : 0;

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>Goal Dashboard</h1>
          <p className={styles.headerSubtitle}>
            Track your progress, celebrate achievements, and stay motivated on your journey to success.
          </p>
        </div>

        <div className={styles.statsGrid}>
          <StatsCard 
            icon="🎯" 
            number={totalGoals} 
            label="Total Goals" 
            type="primary"
          />
          <StatsCard 
            icon="✅" 
            number={completedGoals} 
            label="Completed" 
            type="success"
          />
          <StatsCard 
            icon="🚀" 
            number={activeGoals} 
            label="Active Goals" 
            type="warning"
          />
          <StatsCard 
            icon="📊" 
            number={`${averageProgress}%`} 
            label="Avg Progress" 
            type="primary"
          />
        </div>

        <div className={styles.goalsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <div className={styles.sectionIcon}>📋</div>
              Your Goals
            </h2>
            <button 
              className={styles.addGoalBtn}
              onClick={() => setModalOpen(true)}
            >
              ➕ Add Goal
            </button>
          </div>

          {goals.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🎯</div>
              <h3 className={styles.emptyTitle}>No goals yet</h3>
              <p className={styles.emptyDescription}>
                Start your journey by adding your first goal. Break it down into steps and track your progress!
              </p>
              <button 
                className={`${styles.addGoalBtn} ${styles.btn}`}
                onClick={() => setModalOpen(true)}
              >
                ➕ Create Your First Goal
              </button>
            </div>
          ) : (
            <div className={styles.goalsGrid}>
              {goals.map(goal => (
                <GoalCard
                  key={goal._id}
                  goal={goal}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleStep={handleToggleStep}
                />
              ))}
            </div>
          )}
        </div>

        <GoalModal
          open={modalOpen}
          onClose={() => { setModalOpen(false); setEditingGoal(null); }}
          onSave={handleSave}
          initial={editingGoal}
        />
      </div>
    </>
  );
} 