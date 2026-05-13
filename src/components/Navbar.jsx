import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Building2, Users, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/', icon: <Activity size={20} /> },
    { name: 'Hospitals', path: '/hospitals', icon: <Building2 size={20} /> },
    { name: 'Doctors', path: '/doctors', icon: <Users size={20} /> },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <motion.div
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Activity className="logo-icon" size={28} />
          </motion.div>
          <span className="logo-text text-gradient">CareNexAI</span>
        </Link>
        
        {/* Desktop Menu */}
        <ul className="nav-menu desktop-menu">
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

        {/* Mobile Menu Toggle Button */}
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="mobile-menu"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="mobile-nav-list">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <li key={link.name} className="mobile-nav-item">
                    <Link 
                      to={link.path} 
                      className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                      onClick={closeMobileMenu}
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
