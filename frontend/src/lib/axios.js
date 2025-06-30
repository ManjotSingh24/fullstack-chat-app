import axios from 'axios';


export const axiosInstance = axios.create({

    baseURL:import.meta.env.MODE==="development" ? 'http://localhost:5001/api':"/api" ,
    withCredentials: true
});

// This creates an Axios instance pre-configured with:
// baseURL: all requests using this instance will prepend http://localhost:5001/api.
// withCredentials: true: allows sending cookies/auth headers with requests (needed if your backend requires auth).