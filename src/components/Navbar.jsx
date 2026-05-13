import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Building2, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: <Activity size={20} /> },
    { name: 'Hospitals', path: '/hospitals', icon: <Building2 size={20} /> },
    { name: 'Doctors', path: '/doctors', icon: <Users size={20} /> },
  ];

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <motion.div
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Activity className="logo-icon" size={28} />
          </motion.div>
          <span className="logo-text text-gradient">CareNexAI</span>
        </Link>
        <ul className="nav-menu">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <li key={link.name} className="nav-item">
                <Link to={link.path} className={`nav-link ${isActive ? 'active' : ''}`}>
                  {link.icon}
                  <span>{link.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="nav-indicator"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
