import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Search, Users, Trash2, Edit, Plus } from 'lucide-react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import './Directory.css';

const AdminPatients = () => {
  const { isAdmin } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    Patient_ID: '',
    FullName: '',
    MobileNumber: '',
    DateOfBirth: '',
    City: '',
    PreferredLanguage: ''
  });

  useEffect(() => {
    if (isAdmin) {
      fetchPatients();
    }
  }, [isAdmin]);

  const fetchPatients = async () => {
    try {
      const res = await axios.get('/patients');
      if (res.data.success) {
        setPatients(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching patients", error);
    }
  };
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/patients/${editingId}`, formData);
      } else {
        await axios.post('/patients', formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ Patient_ID: '', FullName: '', MobileNumber: '', DateOfBirth: '', City: '', PreferredLanguage: '' });
      fetchPatients();
    } catch (error) {
      console.error("Error saving patient:", error);
      alert("Error saving patient.");
    }
  };

  const handleEdit = (patient) => {
    setFormData({
      Patient_ID: patient.Patient_ID,
      FullName: patient.FullName,
      MobileNumber: patient.MobileNumber,
      DateOfBirth: patient.DateOfBirth ? patient.DateOfBirth.split('T')[0] : '',
      City: patient.City,
      PreferredLanguage: patient.PreferredLanguage
    });
    setEditingId(patient._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await axios.delete(`/patients/${id}`);
        fetchPatients();
      } catch (error) {
        console.error("Error deleting patient", error);
        alert("Failed to delete");
      }
    }
  };

  if (!isAdmin) {
    return <Navigate to="/login" />;
  }

  const filteredPatients = patients.filter(p => 
    p.FullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.Patient_ID.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="directory-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <ShieldCheck className="text-primary" size={32} style={{ verticalAlign: 'bottom', marginRight: '10px' }}/> 
            Admin: Patients
          </h1>
          <p className="text-muted">Manage patient profiles and data.</p>
        </div>
        <button className="btn btn-primary" onClick={() => {
          setShowForm(!showForm);
          if (!showForm) {
            setEditingId(null);
            setFormData({ Patient_ID: '', FullName: '', MobileNumber: '', DateOfBirth: '', City: '', PreferredLanguage: '' });
          }
        }}>
          <Plus size={20} /> Add Patient
        </button>
      </div>

      <div className="search-bar glass-panel">
        <Search className="search-icon text-muted" size={20} />
        <input 
          type="text" 
          placeholder="Search patients by name or ID..." 
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
          <h3>{editingId ? 'Edit Patient' : 'Add New Patient'}</h3>
          <form onSubmit={handleSubmit} className="entity-form">
            <div className="form-group">
              <label>Patient ID</label>
              <input type="text" name="Patient_ID" value={formData.Patient_ID} onChange={handleInputChange} className="form-control" required />
            </div>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="FullName" value={formData.FullName} onChange={handleInputChange} className="form-control" required />
            </div>
            <div className="form-group">
              <label>Mobile Number</label>
              <input type="text" name="MobileNumber" value={formData.MobileNumber} onChange={handleInputChange} className="form-control" required />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input type="date" name="DateOfBirth" value={formData.DateOfBirth} onChange={handleInputChange} className="form-control" required />
            </div>
            <div className="form-group">
              <label>City</label>
              <input type="text" name="City" value={formData.City} onChange={handleInputChange} className="form-control" required />
            </div>
            <div className="form-group">
              <label>Preferred Language</label>
              <input type="text" name="PreferredLanguage" value={formData.PreferredLanguage} onChange={handleInputChange} className="form-control" />
            </div>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Update Patient' : 'Save Patient'}
            </button>
          </form>
        </motion.div>
      )}

      <div className="grid-list">
        {filteredPatients.map((patient, index) => (
          <motion.div 
            key={patient._id}
            className="entity-card glass-panel"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="card-header">
              <div className="icon-wrapper" style={{background: 'rgba(255,255,255,0.1)'}}>
                <Users size={24} className="text-main" />
              </div>
              <div style={{ display: 'flex', gap: '5px' }}>
                <button 
                  className="btn btn-icon" 
                  style={{padding: '0.5rem', color: '#fff', borderColor: 'transparent'}}
                  onClick={() => handleEdit(patient)}
                >
                  <Edit size={18} />
                </button>
                <button 
                  className="btn btn-icon" 
                  style={{padding: '0.5rem', color: '#ef4444', borderColor: 'transparent'}}
                  onClick={() => handleDelete(patient._id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <h3 className="card-title">{patient.FullName}</h3>
            <div className="card-details">
              <p>ID: {patient.Patient_ID}</p>
              <p>Mobile: {patient.MobileNumber}</p>
            </div>
          </motion.div>
        ))}
        
        {filteredPatients.length === 0 && (
          <div className="no-results">No patients found.</div>
        )}
      </div>
    </div>
  );
};

export default AdminPatients;
