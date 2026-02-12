import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000', // Adjust if API port differs
    withCredentials: true, // Important for cookies
});

export default api;
