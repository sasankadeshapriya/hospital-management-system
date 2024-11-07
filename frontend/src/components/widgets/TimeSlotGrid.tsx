// src/components/widgets/TimeSlotGrid.tsx
import React from 'react';

interface TimeSlotGridProps {
  selectedTime: string;
  onSelectTime: (time: string) => void;
  availableSlots: string[];
}

export function TimeSlotGrid({
  selectedTime,
  onSelectTime,
  availableSlots,
}: TimeSlotGridProps) {
  // You can remove the static allTimeSlots array and render based on availableSlots
  const timeSlotRows = [
    ['09:00', '09:30', '10:00', '10:30'],
    ['11:00', '11:30', '12:00', '12:30'],
    ['13:00', '13:30', '14:00', '14:30'],
    ['15:00', '15:30', '16:00', '16:30'],
  ];

  return (
    <div className="grid gap-2">
      {timeSlotRows.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-4 gap-2">
          {row.map((time) => (
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
      ))}
    </div>
  );
}

