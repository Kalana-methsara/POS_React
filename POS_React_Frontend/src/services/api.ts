import axios from 'axios';

const api = axios.create({
  // Match this with your Spring Boot server port (usually 8080)
  baseURL: 'http://localhost:8080/api/v1/auth', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;