import React, { useState, useEffect } from 'react';
import { format, addHours, startOfHour } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faWrench } from '@fortawesome/free-solid-svg-icons';
import { getSlots } from '../services/api';
import { createSlot, deleteSlot } from '../services/adminApi';
import Calendar from './Calendar';

const AdminDashboard = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSlots(selectedDate);
    }, [selectedDate]);

    const fetchSlots = async (date) => {
        setLoading(true);
        try {
            const dateStr = format(date, 'yyyy-MM-dd');
            const fetchedSlots = await getSlots(dateStr);
            setSlots(fetchedSlots);
        } catch (error) {
            console.error("Failed to fetch slots", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSlot = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const timeStr = formData.get('time');

        if (!timeStr) return;

        const [hours, minutes] = timeStr.split(':').map(Number);
        const start = new Date(selectedDate);
        start.setHours(hours, minutes, 0, 0);

        // Default 1 hour duration
        const end = addHours(start, 1);

        // Format for MySQL DATETIME: YYYY-MM-DD HH:MM:SS
        const formatForDB = (d) => format(d, 'yyyy-MM-dd HH:mm:ss');

        try {
            await createSlot(formatForDB(start), formatForDB(end));
            fetchSlots(selectedDate);
            e.target.reset();
        } catch (error) {
            alert('Failed to create slot: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleDeleteSlot = async (id) => {
        if (!window.confirm('Are you sure you want to delete this slot?')) return;
        try {
            await deleteSlot(id);
            fetchSlots(selectedDate);
        } catch (error) {
            alert('Failed to delete slot');
        }
    };

    return (
        <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row min-h-[500px] border border-gray-200">

                {/* Left Panel: Calendar (Identical to User View) */}
                <div className="md:w-auto border-r border-gray-200 block">
                    <div className="p-6 border-b border-gray-200 md:border-b-0">
                        <div className="text-gray-500 font-bold uppercase text-xs mb-1">Calendly</div>
                        <h1 className="text-2xl font-bold text-secondary mb-4">Admin Dashboard</h1>
                        <div className="flex items-center text-gray-500 mb-2">
                            <span className="mr-2"><FontAwesomeIcon icon={faWrench} style={{ color: "#d6d6d6", }} /></span> Manage Availability
                        </div>
                    </div>

                    <div className="hidden md:block">
                        <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
                    </div>
                    <div className="md:hidden w-full flex justify-center">
                        <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
                    </div>
                </div>

                {/* Right Panel: Content */}
                <div className="flex-1 flex flex-col p-6 overflow-y-auto">
                    <div className="mb-6 p-4 bg-blue-50 rounded border border-blue-100">
                        <h3 className="font-bold mb-2 text-secondary">Add New Slot</h3>
                        <form onSubmit={handleAddSlot} className="flex gap-2">
                            <input type="time" name="time" required className="border p-2 rounded flex-1 focus:ring-2 focus:ring-primary outline-none" />
                            <button type="submit" className="bg-primary text-white px-4 py-2 rounded font-bold hover:bg-blue-600">Add</button>
                        </form>
                        <p className="text-xs text-gray-500 mt-2">Creates a 1-hour slot for {format(selectedDate, 'MMM d, yyyy')}</p>
                    </div>

                    <h3 className="font-bold mb-4 text-secondary sticky top-0 bg-white pb-2">Slots for {format(selectedDate, 'EEEE, MMMM d')}</h3>

                    {loading ? <p className="text-gray-500 text-center py-4">Loading slots...</p> : (
                        <div className="space-y-2 flex-1">
                            {slots.length === 0 && <p className="text-gray-500 text-center py-8">No slots available.</p>}
                            {slots.map(slot => (
                                <div key={slot.id} className="flex justify-between items-center p-3 border border-gray-200 rounded hover:shadow-sm transition-shadow">
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                                        <span className="font-bold text-gray-700">{format(new Date(slot.start_time), 'h:mm aa')}</span>
                                        <span className="text-gray-400 mx-2">-</span>
                                        <span className="text-gray-500">{format(new Date(slot.end_time), 'h:mm aa')}</span>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteSlot(slot.id)}
                                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors"
                                        title="Delete Slot"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 text-xs text-gray-400">
                Admin Dashboard • Mini Calendly Clone
            </div>
        </div>
    );
};

export default AdminDashboard;
