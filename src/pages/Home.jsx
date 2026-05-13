import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const features = [
    {
      icon: <Activity size={32} className="text-blue" />,
      title: 'Advanced Analytics',
      description: 'Leverage AI to analyze patient data and predict health outcomes with unprecedented accuracy.'
    },
    {
      icon: <ShieldCheck size={32} className="text-green" />,
      title: 'Secure & Compliant',
      description: 'Enterprise-grade security ensuring all healthcare data remains private and HIPAA compliant.'
    },
    {
      icon: <Zap size={32} className="text-yellow" />,
      title: 'Real-time Insights',
      description: 'Get instant access to critical health metrics and resource allocation data across facilities.'
    }
  ];

  return (
    <div className="home-container">
      <section className="hero-section">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="badge glass-panel">
            <span className="pulse-dot"></span> Next-Gen Healthcare Platform
          </div>
          <h1 className="hero-title">
            The Future of <br />
            <span className="text-gradient">Intelligent Care</span>
          </h1>
          <p className="hero-subtitle">
            CareNexAI revolutionizes hospital management and patient care through cutting-edge artificial intelligence, seamless data integration, and predictive analytics.
          </p>
          <div className="hero-actions">
            <Link to="/hospitals" className="btn btn-primary btn-lg">
              Explore Hospitals <ArrowRight size={20} />
            </Link>
            <Link to="/doctors" className="btn btn-secondary btn-lg glass-panel">
              View Doctors
            </Link>
          </div>
        </motion.div>
        
        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="abstract-shape shape-1"></div>
          <div className="abstract-shape shape-2"></div>
          <div className="glass-panel stats-card card-1">
            <Activity className="text-gradient" size={40} />
            <div className="stats-info">
              <h3>99.9%</h3>
              <p>System Uptime</p>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="features-section">
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="feature-card glass-panel"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <div className="feature-icon-wrapper">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
