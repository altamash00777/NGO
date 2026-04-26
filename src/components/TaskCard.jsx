import React from 'react';
import { MapPin, Clock, Stethoscope, BookOpen, Truck, Utensils, AlertCircle } from 'lucide-react';
import './TaskCard.css';
import { Button } from './Button';

export const iconMap = {
  Medical: <Stethoscope size={16} />,
  Education: <BookOpen size={16} />,
  Logistics: <Truck size={16} />,
  Cooking: <Utensils size={16} />
};

export const TaskCard = ({ task, onAccept, onComplete, onRemove, showAcceptButton = false, matchScore }) => {
  const getUrgencyClass = (urgency) => {
    switch(urgency) {
      case 'High': return 'urgency-high';
      case 'Medium': return 'urgency-medium';
      case 'Low': return 'urgency-low';
      default: return '';
    }
  };

  return (
    <div className="task-card glass-panel fade-in hover-lift">
      {matchScore !== undefined && (
        <div className="match-badge">
          Match Score: {matchScore}%
        </div>
      )}
      
      <div className="task-header">
        <h3 className="heading-3">{task.title}</h3>
        <span className={`urgency-badge ${getUrgencyClass(task.urgency)}`}>
          <AlertCircle size={14} />
          {task.urgency}
        </span>
      </div>
      
      <p className="text-body">{task.description}</p>
      
      <div className="task-meta">
        <span className="meta-item">
          <MapPin size={16} />
          {task.location}
        </span>
        <span className="meta-item">
          <Clock size={16} />
          {task.status}
        </span>
      </div>

      <div className="skills-container">
        {task.requiredSkills.map(skill => (
          <span key={skill} className="skill-tag">
            {iconMap[skill]} {skill}
          </span>
        ))}
      </div>

      {showAcceptButton && task.status === 'Open' && (
        <div className="task-actions">
          <Button variant="primary" onClick={() => onAccept(task.id)}>
            Accept Task
          </Button>
        </div>
      )}

      {onComplete && task.status === 'Assigned' && (
        <div className="task-actions">
          <Button variant="secondary" onClick={() => onComplete(task.id)}>
            Mark as Done
          </Button>
        </div>
      )}

      {onRemove && task.status === 'Completed' && (
        <div className="task-actions">
          <Button variant="secondary" onClick={() => onRemove(task.id)}>
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};
