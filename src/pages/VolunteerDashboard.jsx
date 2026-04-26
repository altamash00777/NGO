import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { TaskCard, iconMap } from '../components/TaskCard';
import { Button } from '../components/Button';
import { User, MapPin, Award, Edit2 } from 'lucide-react';
import './VolunteerDashboard.css';

export const VolunteerDashboard = () => {
  const { volunteer, setVolunteer, getMatchedTasks, acceptTask, completeTask, tasks } = useContext(AppContext);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: volunteer.name,
    location: volunteer.location,
    skills: volunteer.skills
  });

  const availableSkills = ['Medical', 'Education', 'Logistics'];

  const matchedTasks = getMatchedTasks();
  const acceptedTasks = tasks.filter(t => (t.status === 'Assigned' || t.status === 'Completed') && t.volunteerId === volunteer.id);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!profileForm.name || !profileForm.location) return;
    setVolunteer({ ...volunteer, ...profileForm });
    setIsEditingProfile(false);
  };

  const handleSkillToggle = (skill) => {
    setProfileForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  return (
    <div className="dashboard fade-in">
      <header className="dashboard-header volunteer-header">
        <div>
          <h1 className="heading-1">Welcome, {volunteer.name}</h1>
          <p className="text-body">Here are the community needs that best match your skills.</p>
        </div>
      </header>

      <div className="volunteer-profile glass-panel">
        <div className="profile-info">
          <div className="profile-avatar">
            <User size={32} color="var(--primary-color)" />
          </div>
          <div>
            <h2 className="heading-2" style={{marginBottom: 0}}>{volunteer.name}</h2>
            <div className="profile-meta">
              <span className="meta-item"><MapPin size={14}/> {volunteer.location}</span>
              <span className="meta-item"><Award size={14}/> Volunteer</span>
            </div>
          </div>
        </div>
        
        <div className="profile-skills" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--spacing-sm)' }}>
          <Button variant="secondary" onClick={() => setIsEditingProfile(true)}>
            <Edit2 size={16} style={{marginRight: '8px'}} /> Edit Profile
          </Button>
          <div>
            <h3 className="heading-3" style={{fontSize: '1rem', marginBottom: '8px'}}>Your Skills</h3>
            <div className="skills-container">
              {volunteer.skills.map(skill => (
                <span key={skill} className="skill-tag">
                  {iconMap[skill]} {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="matches-section" style={{marginBottom: 'var(--spacing-xl)'}}>
        <h2 className="heading-2">My Accepted Tasks</h2>
        {acceptedTasks.length === 0 ? (
          <div className="glass-panel" style={{padding: 'var(--spacing-xl)', textAlign: 'center'}}>
            <p className="text-body">You haven't accepted any tasks yet.</p>
          </div>
        ) : (
          <div className="tasks-grid">
            {acceptedTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                showAcceptButton={false} 
                onComplete={completeTask}
              />
            ))}
          </div>
        )}
      </div>

      <div className="matches-section">
        <h2 className="heading-2">Recommended Matches</h2>
        {matchedTasks.length === 0 ? (
          <div className="glass-panel" style={{padding: 'var(--spacing-xl)', textAlign: 'center'}}>
            <p className="text-body">No open tasks available right now. Check back later!</p>
          </div>
        ) : (
          <div className="tasks-grid">
            {matchedTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                showAcceptButton={true} 
                onAccept={acceptTask}
                matchScore={task.matchScore}
              />
            ))}
          </div>
        )}
      </div>

      {isEditingProfile && (
        <div className="modal-overlay">
          <div className="modal glass-panel slide-up">
            <h2 className="heading-2">Edit Profile</h2>
            <form onSubmit={handleProfileSubmit} className="task-form">
              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  value={profileForm.name} 
                  onChange={e => setProfileForm({...profileForm, name: e.target.value})} 
                  placeholder="Your Name"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input 
                  type="text" 
                  value={profileForm.location} 
                  onChange={e => setProfileForm({...profileForm, location: e.target.value})} 
                  placeholder="e.g. Sector 4"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Your Skills</label>
                <div className="skills-select">
                  {availableSkills.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      className={`skill-btn ${profileForm.skills.includes(skill) ? 'selected' : ''}`}
                      onClick={() => handleSkillToggle(skill)}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
              <div className="modal-actions">
                <Button type="button" variant="secondary" onClick={() => setIsEditingProfile(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
