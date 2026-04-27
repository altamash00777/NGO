import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

const defaultVolunteer = {
  id: 1,
  name: 'Guest Volunteer',
  skills: [],
  location: ''
};

export const AppProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('sra_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [volunteer, setVolunteer] = useState(() => {
    const saved = localStorage.getItem('sra_volunteer');
    return saved ? JSON.parse(saved) : defaultVolunteer;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('sra_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('sra_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('sra_volunteer', JSON.stringify(volunteer));
  }, [volunteer]);

  useEffect(() => {
    localStorage.setItem('sra_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addTask = (newTask) => {
    const task = {
      ...newTask,
      id: Date.now(),
      status: 'Open'
    };
    setTasks([task, ...tasks]);
  };

  const acceptTask = (taskId) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'Assigned', volunteerId: volunteer.id } : t));
  };

  const completeTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setNotifications([
        { id: Date.now(), message: `${volunteer.name} completed task: "${task.title}"` },
        ...notifications
      ]);
    }
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'Completed' } : t));
  };

  const removeTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  // Matching Logic
  const getMatchedTasks = () => {
    if (!volunteer) return [];

    return tasks
      .filter(t => t.status === 'Open')
      .map(task => {
        let score = 0;
        // Skill match (Primary)
        const hasSkill = task.requiredSkills.some(skill => volunteer.skills.includes(skill));
        if (hasSkill) score += 50;

        // Urgency weight
        if (task.urgency === 'High') score += 30;
        if (task.urgency === 'Medium') score += 15;

        // Location match
        if (task.location === volunteer.location) score += 20;

        return { ...task, matchScore: score };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  };

  return (
    <AppContext.Provider value={{
      tasks,
      volunteer,
      addTask,
      acceptTask,
      completeTask,
      removeTask,
      getMatchedTasks,
      setVolunteer,
      notifications,
      removeNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};
