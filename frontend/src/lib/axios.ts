import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true, // Important for sending cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient; 