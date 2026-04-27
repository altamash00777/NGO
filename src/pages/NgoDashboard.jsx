import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { TaskCard } from '../components/TaskCard';
import { Button } from '../components/Button';
import { PlusCircle, Activity, Bell, X } from 'lucide-react';
import './NgoDashboard.css';

export const NgoDashboard = () => {
  const { tasks, addTask, removeTask, notifications, removeNotification } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    urgency: 'Medium',
    location: '',
    requiredSkills: []
  });

  const availableSkills = ['Medical', 'Education', 'Logistics','Cooking','Management'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.description || !newTask.location) return;
    addTask(newTask);
    setIsModalOpen(false);
    setNewTask({ title: '', description: '', urgency: 'Medium', location: '', requiredSkills: [] });
  };

  const handleSkillToggle = (skill) => {
    setNewTask(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.includes(skill)
        ? prev.requiredSkills.filter(s => s !== skill)
        : [...prev.requiredSkills, skill]
    }));
  };

  const urgentTasksCount = tasks.filter(t => t.urgency === 'High' && t.status === 'Open').length;

  return (
    <div className="dashboard fade-in">
      <header className="dashboard-header">
        <div>
          <h1 className="heading-1">NGO Dashboard</h1>
          <p className="text-body">Manage community needs and track volunteer assignments.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} variant="primary">
          <PlusCircle size={18} /> Report New Need
        </Button>
      </header>

      {notifications && notifications.length > 0 && (
        <div className="notifications-container" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: 'var(--spacing-lg)' }}>
          {notifications.map(notification => (
            <div key={notification.id} className="notification-alert fade-in slide-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--priority-low)', border: '1px solid var(--secondary-color)', padding: 'var(--spacing-md)', borderRadius: 'var(--border-radius)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={18} color="var(--secondary-color)" />
                <span className="text-body" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{notification.message}</span>
              </div>
              <button onClick={() => removeNotification(notification.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="stats-container glass-panel">
        <div className="stat-card">
          <Activity className="stat-icon" size={24} style={{ color: 'var(--accent-color)' }} />
          <div>
            <h3 className="heading-3">{urgentTasksCount}</h3>
            <span className="text-small">Urgent Open Tasks</span>
          </div>
        </div>
        <div className="stat-card">
          <Activity className="stat-icon" size={24} style={{ color: 'var(--primary-color)' }} />
          <div>
            <h3 className="heading-3">{tasks.filter(t => t.status === 'Open').length}</h3>
            <span className="text-small">Total Open Tasks</span>
          </div>
        </div>
        <div className="stat-card">
          <Activity className="stat-icon" size={24} style={{ color: 'var(--secondary-color)' }} />
          <div>
            <h3 className="heading-3">{tasks.filter(t => t.status === 'Assigned' || t.status === 'Completed').length}</h3>
            <span className="text-small">Tasks Assigned or Done</span>
          </div>
        </div>
      </div>

      <div className="tasks-grid">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onRemove={removeTask} />
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal glass-panel slide-up">
            <h2 className="heading-2">Report Community Need</h2>
            <form onSubmit={handleSubmit} className="task-form">
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  value={newTask.title} 
                  onChange={e => setNewTask({...newTask, title: e.target.value})} 
                  placeholder="e.g. Medical Supplies Needed"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={newTask.description} 
                  onChange={e => setNewTask({...newTask, description: e.target.value})} 
                  placeholder="Describe the need..."
                  required 
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Urgency</label>
                  <select 
                    value={newTask.urgency} 
                    onChange={e => setNewTask({...newTask, urgency: e.target.value})}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input 
                    type="text" 
                    value={newTask.location} 
                    onChange={e => setNewTask({...newTask, location: e.target.value})} 
                    placeholder="e.g. Sector 4"
                    required 
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Required Skills</label>
                <div className="skills-select">
                  {availableSkills.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      className={`skill-btn ${newTask.requiredSkills.includes(skill) ? 'selected' : ''}`}
                      onClick={() => handleSkillToggle(skill)}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
              <div className="modal-actions">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Submit Task</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
