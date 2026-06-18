import axios from 'axios';

// Vite env variable for backend URL, default to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const syncUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/users`, userData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la synchronisation', error);
        throw error;
    }
};

export const loginAdmin = async (pseudo, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { pseudo, password });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la connexion', error);
        throw error;
    }
};

export const getUsers = async () => {
    try {
        const response = await axios.get(`${API_URL}/users`);
        return response.data.utilisateurs || [];
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs', error);
        throw error;
    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await axios.delete(`${API_URL}/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la suppression', error);
        throw error;
    }
};
