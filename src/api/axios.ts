import axios from 'axios';

const api = axios.create({
    baseURL: 'https://gym-challenge-backend-production.up.railway.app', // Adjust if API port differs
    withCredentials: true, // Important for cookies
});

export default api;
