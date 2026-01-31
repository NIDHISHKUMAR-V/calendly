import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Calendar from './Calendar';
import SlotPicker from './SlotPicker';
import BookingForm from './BookingForm';
import { getSlots, bookSlot } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

function UserBooking() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [availableSlots, setAvailableSlots] = useState([]);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const [bookingMode, setBookingMode] = useState(false);
    const [bookingStatus, setBookingStatus] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [bookingDetails, setBookingDetails] = useState(null);

    useEffect(() => {
        fetchSlots(selectedDate);
        setSelectedSlot(null);
        setBookingMode(false);
        setBookingStatus(null);
    }, [selectedDate]);

    const fetchSlots = async (date) => {
        setSlotsLoading(true);
        try {
            const dateStr = format(date, 'yyyy-MM-dd');
            const slots = await getSlots(dateStr);
            setAvailableSlots(slots);
        } catch (error) {
            console.error("Failed to fetch slots", error);
            setAvailableSlots([]);
        } finally {
            setSlotsLoading(false);
        }
    };

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
        setBookingMode(true);
    };

    const handleBookingConfirm = async ({ name, email }) => {
        if (!selectedSlot) return;


        try {
            setBookingStatus('submitting');
            await bookSlot(selectedSlot.id, name, email);
            setBookingDetails({ name, email });
            setBookingStatus('success');
        } catch (error) {
            console.error("Booking error", error);
            setBookingStatus('error');
            setErrorMessage(error.response?.data?.error || 'Booking failed. Please try again.');
        }
    };

    const resetFlow = () => {
        setBookingStatus(null);
        setBookingMode(false);
        setSelectedSlot(null);
        fetchSlots(selectedDate);
    };

    if (bookingStatus === 'success') {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                    <div className="text-green-500 mb-4 text-5xl">✔️</div>
                    <h2 className="text-2xl font-bold text-secondary mb-2">Confirmed</h2>
                    <p className="text-gray-600 mb-6">You are scheduled with us.</p>
                    <div className="text-left bg-gray-50 p-4 rounded mb-6 border border-gray-100">
                        <p className="font-bold text-secondary">{bookingDetails?.name}</p>
                        <p className="text-gray-600">{format(new Date(selectedSlot.start_time), "EEEE, MMMM d, yyyy")}</p>
                        <p className="text-gray-600">{format(new Date(selectedSlot.start_time), "h:mm aa")} - {format(new Date(selectedSlot.end_time), "h:mm aa")}</p>
                    </div>
                    <button onClick={resetFlow} className="text-primary font-bold hover:underline">Book Another</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row min-h-[500px] border border-gray-200">

                {/* Left Panel: Calendar */}
                <div className={`md:w-auto border-r border-gray-200 ${bookingMode ? 'hidden md:block' : 'block'}`}>
                    <div className="p-6 border-b border-gray-200 md:border-b-0">
                        <div className="text-gray-500 font-bold uppercase text-xs mb-1">Calendly</div>
                        <h1 className="text-2xl font-bold text-secondary mb-4">One Hour Meeting</h1>
                        <div className="flex items-center text-gray-500 mb-2">
                            <span className="mr-2"><FontAwesomeIcon icon={faClock} style={{ color: "#d6d6d6" }} /></span> 1 hour
                        </div>
                    </div>

                    <div className="hidden md:block">
                        <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
                    </div>
                </div>

                {/* Mobile-only Calendar Wrapper (shown when not booking) */}
                {!bookingMode && (
                    <div className="md:hidden w-full flex justify-center">
                        <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
                    </div>
                )}

                {/* Right Panel: Logic Switcher */}
                <div className="flex-1 flex flex-col relative transition-all duration-300">
                    {bookingMode ? (
                        <BookingForm
                            slot={selectedSlot}
                            onConfirm={handleBookingConfirm}
                            onCancel={() => setBookingMode(false)}
                            submitting={bookingStatus === 'submitting'}
                        />
                    ) : (
                        <SlotPicker
                            slots={availableSlots}
                            selectedSlot={selectedSlot}
                            onSlotSelect={handleSlotSelect}
                            loading={slotsLoading}
                        />
                    )}

                    {bookingStatus === 'error' && (
                        <div className="absolute top-0 left-0 w-full bg-red-100 text-red-700 p-2 text-center text-sm">
                            {errorMessage} <button onClick={() => setBookingStatus(null)} className="ml-2 underline">Dismiss</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 text-xs text-gray-400">
                Mini Calendly Clone
            </div>
        </div>
    );
}

export default UserBooking;
