import React from 'react';
import { format } from 'date-fns';

const SlotPicker = ({ slots, selectedSlot, onSlotSelect, loading }) => {
    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading slots...</div>;
    }

    if (slots.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500 demo">
                No times available for this date.
            </div>
        );
    }

    return (
        <div className="flex-1 p-4 max-h-[400px] overflow-y-auto">
            <h3 className="text-lg font-semibold text-secondary mb-4 sticky top-0 bg-white pb-2">
                Select a Time
            </h3>
            <div className="grid grid-cols-1 gap-2">
                {slots.map((slot) => {
                    const start = new Date(slot.start_time);
                    const timeString = format(start, 'h:mm aa');

                    const isSelected = selectedSlot && selectedSlot.id === slot.id;

                    return (
                        <button
                            key={slot.id}
                            onClick={() => onSlotSelect(slot)}
                            className={`
                w-full py-3 px-4 rounded border text-center font-bold transition-all
                ${isSelected
                                    ? 'bg-gray-600 text-white border-gray-600 ring-2 ring-gray-300'
                                    : 'bg-white text-primary border-primary hover:border-blue-700 hover:text-blue-700 hover:shadow-sm'
                                }
              `}
                        >
                            {timeString}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default SlotPicker;
