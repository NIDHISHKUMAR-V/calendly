import React, { useState } from 'react';

const BookingForm = ({ slot, onConfirm, onCancel, submitting }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name && email) {
            onConfirm({ name, email });
        }
    };

    return (
        <div className="flex-1 p-6 border-l border-gray-200 animate-fade-in-up">
            <h2 className="text-xl font-bold text-secondary mb-2">Enter Details</h2>
            <p className="text-gray-500 mb-6 text-sm">
                Booking for <span className="font-semibold text-secondary">{new Date(slot.start_time).toLocaleString()}</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                    <input
                        type="text"
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={submitting}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-bold rounded hover:bg-gray-50"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 px-4 py-2 bg-primary text-white font-bold rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {submitting ? 'Scheduling...' : 'Schedule Event'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BookingForm;
