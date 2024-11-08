import React from 'react';

interface TimeSlotGridProps {
  selectedTime: string;
  onSelectTime: (time: string) => void;
  availableSlots: string[];  // Available time slots based on selected day
}

export function TimeSlotGrid({
  selectedTime,
  onSelectTime,
  availableSlots,
}: TimeSlotGridProps) {
  return (
    <div className="grid gap-2">
      {availableSlots.length > 0 ? (
        <div className="grid grid-cols-4 gap-2">
          {availableSlots.map((time) => (
            <button
              key={time}
              type="button"
              onClick={() => onSelectTime(time)}
              disabled={!availableSlots.includes(time)}
              className={`p-2 text-sm rounded border
                ${
                  !availableSlots.includes(time)
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : selectedTime === time
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'hover:border-indigo-600'
                }
              `}
            >
              {time}
            </button>
          ))}
        </div>
      ) : (
        <div className="text-gray-500">No available time slots for the selected date.</div>
      )}
    </div>
  );
}
