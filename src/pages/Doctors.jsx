import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Search, Star, CheckCircle, XCircle } from 'lucide-react';
import { getDoctors, createDoctor } from '../services/api';
import './Directory.css';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    Doctor_ID: '',
    Doctor_Name: '',
    Specialty: '',
    Rating: 0,
    Availability: true
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const data = await getDoctors();
      if(data.success) {
        setDoctors(data.data);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createDoctor(formData);
      setShowForm(false);
      setFormData({ Doctor_ID: '', Doctor_Name: '', Specialty: '', Rating: 0, Availability: true });
      fetchDoctors();
    } catch (error) {
      console.error("Error creating doctor:", error);
      alert("Error creating doctor. Check console or duplicate ID.");
    }
  };

  const filteredDoctors = doctors.filter(d => 
    d.Doctor_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.Specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="directory-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Doctors Directory</h1>
          <p className="text-muted">Find and manage healthcare professionals.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={20} /> Add Doctor
        </button>
      </div>

      <div className="search-bar glass-panel">
        <Search className="search-icon text-muted" size={20} />
        <input 
          type="text" 
          placeholder="Search doctors by name or specialty..." 
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {showForm && (
        <motion.div 
          className="form-container glass-panel"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3>Add New Doctor</h3>
          <form onSubmit={handleSubmit} className="entity-form">
            <div className="form-group">
              <label>Doctor ID</label>
              <input type="text" name="Doctor_ID" value={formData.Doctor_ID} onChange={handleInputChange} className="form-control" required />
            </div>
            <div className="form-group">
              <label>Doctor Name</label>
              <input type="text" name="Doctor_Name" value={formData.Doctor_Name} onChange={handleInputChange} className="form-control" required />
            </div>
            <div className="form-group">
              <label>Specialty</label>
              <input type="text" name="Specialty" value={formData.Specialty} onChange={handleInputChange} className="form-control" required />
            </div>
            <div className="form-group">
              <label>Rating (0-5)</label>
              <input type="number" name="Rating" min="0" max="5" step="0.1" value={formData.Rating} onChange={handleInputChange} className="form-control" />
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input type="checkbox" name="Availability" checked={formData.Availability} onChange={handleInputChange} />
                Available for appointments
              </label>
            </div>
            <button type="submit" className="btn btn-primary">Save Doctor</button>
          </form>
        </motion.div>
      )}

      <div className="grid-list">
        {filteredDoctors.map((doctor, index) => (
          <motion.div 
            key={doctor._id}
            className="entity-card glass-panel"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="card-header">
              <div className="icon-wrapper bg-green">
                <Users size={24} className="text-green" />
              </div>
              <span className={`badge-status ${doctor.Availability ? 'status-active' : 'status-inactive'}`}>
                {doctor.Availability ? <CheckCircle size={14} /> : <XCircle size={14} />}
                {doctor.Availability ? 'Available' : 'Unavailable'}
              </span>
            </div>
            <h3 className="card-title">{doctor.Doctor_Name}</h3>
            <div className="card-details">
              <p className="specialty-tag">{doctor.Specialty}</p>
              <div className="rating">
                <Star size={16} className="text-yellow fill-yellow" />
                <span>{doctor.Rating}</span>
              </div>
            </div>
          </motion.div>
        ))}
        
        {filteredDoctors.length === 0 && (
          <div className="no-results">No doctors found.</div>
        )}
      </div>
    </div>
  );
};

export default Doctors;
