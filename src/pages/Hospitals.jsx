import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Plus, MapPin, Search } from 'lucide-react';
import { getHospitals, createHospital } from '../services/api';
import './Directory.css';

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    Hospital_ID: '',
    Hospital_Name: '',
    City: '',
    State: ''
  });

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const data = await getHospitals();
      if(data.success) {
        setHospitals(data.data);
      }
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createHospital(formData);
      setShowForm(false);
      setFormData({ Hospital_ID: '', Hospital_Name: '', City: '', State: '' });
      fetchHospitals();
    } catch (error) {
      console.error("Error creating hospital:", error);
      alert("Error creating hospital. Check console or duplicate ID.");
    }
  };

  const filteredHospitals = hospitals.filter(h => 
    h.Hospital_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.City.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="directory-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Hospitals Directory</h1>
          <p className="text-muted">Manage and view all registered healthcare facilities.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={20} /> Add Hospital
        </button>
      </div>

      <div className="search-bar glass-panel">
        <Search className="search-icon text-muted" size={20} />
        <input 
          type="text" 
          placeholder="Search hospitals by name or city..." 
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
          <h3>Add New Hospital</h3>
          <form onSubmit={handleSubmit} className="entity-form">
            <div className="form-group">
              <label>Hospital ID</label>
              <input type="text" name="Hospital_ID" value={formData.Hospital_ID} onChange={handleInputChange} className="form-control" required />
            </div>
            <div className="form-group">
              <label>Hospital Name</label>
              <input type="text" name="Hospital_Name" value={formData.Hospital_Name} onChange={handleInputChange} className="form-control" required />
            </div>
            <div className="form-group">
              <label>City</label>
              <input type="text" name="City" value={formData.City} onChange={handleInputChange} className="form-control" required />
            </div>
            <div className="form-group">
              <label>State</label>
              <input type="text" name="State" value={formData.State} onChange={handleInputChange} className="form-control" required />
            </div>
            <button type="submit" className="btn btn-primary">Save Hospital</button>
          </form>
        </motion.div>
      )}

      <div className="grid-list">
        {filteredHospitals.map((hospital, index) => (
          <motion.div 
            key={hospital._id}
            className="entity-card glass-panel"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="card-header">
              <div className="icon-wrapper bg-blue">
                <Building2 size={24} className="text-blue" />
              </div>
              <span className="badge-id">ID: {hospital.Hospital_ID}</span>
            </div>
            <h3 className="card-title">{hospital.Hospital_Name}</h3>
            <div className="card-details">
              <p><MapPin size={16} /> {hospital.City}, {hospital.State}</p>
            </div>
          </motion.div>
        ))}
        
        {filteredHospitals.length === 0 && (
          <div className="no-results">No hospitals found.</div>
        )}
      </div>
    </div>
  );
};

export default Hospitals;
