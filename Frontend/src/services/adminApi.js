import axios from 'axios';

const API_BASE_URL = 'http://localhost/Interview%20Prep/Calenderly/Backend/api';

export const createSlot = async (startTime, endTime) => {
    const response = await axios.post(`${API_BASE_URL}/admin/create_slot.php`, {
        start_time: startTime,
        end_time: endTime,
    });
    return response.data;
};

export const deleteSlot = async (slotId) => {
    const response = await axios.post(`${API_BASE_URL}/admin/delete_slot.php`, {
        slot_id: slotId,
    });
    return response.data;
};
