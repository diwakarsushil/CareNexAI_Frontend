import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Building2, Plus, Search, MapPin, Edit, Trash2 } from 'lucide-react';
import { getHospitals, createHospital, updateHospital, deleteHospital } from '../services/api';
import AuthContext from '../context/AuthContext';
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
  const [editingId, setEditingId] = useState(null);
  
  const { isAdmin } = useContext(AuthContext);

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
      if (editingId) {
        await updateHospital(editingId, formData);
      } else {
        await createHospital(formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ Hospital_ID: '', Hospital_Name: '', City: '', State: '' });
      fetchHospitals();
    } catch (error) {
      console.error("Error saving hospital:", error);
      alert("Error saving hospital. Check console or duplicate ID.");
    }
  };

  const handleEdit = (hospital) => {
    setFormData({
      Hospital_ID: hospital.Hospital_ID,
      Hospital_Name: hospital.Hospital_Name,
      City: hospital.City,
      State: hospital.State
    });
    setEditingId(hospital.Hospital_ID);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this hospital?")) {
      try {
        await deleteHospital(id);
        fetchHospitals();
      } catch (error) {
        console.error("Error deleting hospital:", error);
        alert("Failed to delete hospital");
      }
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
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => {
            setShowForm(!showForm);
            if (!showForm) {
              setEditingId(null);
              setFormData({ Hospital_ID: '', Hospital_Name: '', City: '', State: '' });
            }
          }}>
            <Plus size={20} /> Add Hospital
          </button>
        )}
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
          <h3>{editingId ? 'Edit Hospital' : 'Add New Hospital'}</h3>
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
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Update Hospital' : 'Save Hospital'}
            </button>
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
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span className="badge-id">ID: {hospital.Hospital_ID}</span>
                {isAdmin && (
                  <>
                    <button className="btn btn-icon" onClick={() => handleEdit(hospital)}>
                      <Edit size={16} />
                    </button>
                    <button className="btn btn-icon text-danger" onClick={() => handleDelete(hospital.Hospital_ID)}>
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>
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
