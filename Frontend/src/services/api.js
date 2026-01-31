import axios from 'axios';

const API_BASE_URL = 'http://localhost/Interview%20Prep/Calenderly/Backend/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getSlots = async (date) => {
    const response = await api.get(`/get_slots.php${date ? `?date=${date}` : ''}`);
    return response.data;
};

export const bookSlot = async (slotId, name, email) => {
    const response = await api.post('/book_slot.php', {
        slot_id: slotId,
        name,
        email,
    });
    return response.data;
};

export default api;
