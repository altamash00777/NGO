import React from 'react';
import { NavLink } from 'react-router-dom';
import { HeartHandshake } from 'lucide-react';
import './Navbar.css';

export const Navbar = () => {
  return (
    <nav className="navbar glass-panel">
      <div className="nav-brand">
        <HeartHandshake className="nav-logo" size={28} />
        <h2>ResourceSync</h2>
      </div>
      <div className="nav-links">
        <NavLink 
          to="/" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          NGO Dashboard
        </NavLink>
        <NavLink 
          to="/volunteer" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          Volunteer Portal
        </NavLink>
      </div>
    </nav>
  );
};
