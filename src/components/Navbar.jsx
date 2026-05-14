import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, Building2, Users, Menu, X, LogOut, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAdmin, logout } = useContext(AuthContext);

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

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    navigate('/');
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
          {isAdmin && (
            <li className="nav-item">
              <Link to="/admin/patients" className={`nav-link ${location.pathname === '/admin/patients' ? 'active' : ''}`}>
                <ShieldCheck size={20} />
                <span>Admin</span>
              </Link>
            </li>
          )}
        </ul>

        <div className="nav-actions desktop-menu">
          {isAdmin ? (
            <button onClick={handleLogout} className="btn btn-secondary">
              <LogOut size={18} /> Logout
            </button>
          ) : (
            <Link to="/login" className="btn btn-secondary">Admin Login</Link>
          )}
        </div>

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
