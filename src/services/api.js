import axios from 'axios';

const API_URL = 'https://carenexaiapi.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getHospitals = async () => {
  const response = await api.get('/hospitals');
  return response.data;
};

export const createHospital = async (hospitalData) => {
  const response = await api.post('/hospitals', hospitalData);
  return response.data;
};

export const updateHospital = async (id, hospitalData) => {
  const response = await api.put(`/hospitals/${id}`, hospitalData);
  return response.data;
};

export const deleteHospital = async (id) => {
  const response = await api.delete(`/hospitals/${id}`);
  return response.data;
};

export const getDoctors = async () => {
  const response = await api.get('/doctors');
  return response.data;
};

export const createDoctor = async (doctorData) => {
  const response = await api.post('/doctors', doctorData);
  return response.data;
};

export const updateDoctor = async (id, doctorData) => {
  const response = await api.put(`/doctors/${id}`, doctorData);
  return response.data;
};

export const deleteDoctor = async (id) => {
  const response = await api.delete(`/doctors/${id}`);
  return response.data;
};

export default api;
