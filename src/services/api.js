import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://iplbackend-bwr3.onrender.com/api',
});

export default api;

