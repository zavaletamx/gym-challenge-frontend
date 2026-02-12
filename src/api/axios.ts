import axios from 'axios';

const api = axios.create({
	baseURL: 'https://api.kbfunnys.com', // Adjust if API port differs
	withCredentials: true, // Important for cookies
});

export default api;
