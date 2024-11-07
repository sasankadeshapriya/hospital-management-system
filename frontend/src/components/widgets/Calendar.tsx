// src/components/widgets/Calendar.tsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  highlightedDates?: string[];
  disableUnavailableDates?: boolean;
}

export function Calendar({
  selectedDate,
  onSelectDate,
  highlightedDates = [],
  disableUnavailableDates = false,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weekDays = [
    { key: 'sun', label: 'S' },
    { key: 'mon', label: 'M' },
    { key: 'tue', label: 'T' },
    { key: 'wed', label: 'W' },
    { key: 'thu', label: 'T' },
    { key: 'fri', label: 'F' },
    { key: 'sat', label: 'S' },
  ];

  const isHighlighted = (day: number) => {
    const dateStr = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    )
      .toISOString()
      .split('T')[0];
    return highlightedDates.includes(dateStr);
  };

  const isSelected = (day: number) =>
    selectedDate?.getDate() === day &&
    selectedDate?.getMonth() === currentMonth.getMonth() &&
    selectedDate?.getFullYear() === currentMonth.getFullYear();

  const isDisabled = (day: number) => {
    if (!disableUnavailableDates) return false;
    return !isHighlighted(day);
  };

  return (
    <div className="w-full max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
            )
          }
          className="p-1 hover:bg-gray-100 rounded"
          title="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="font-medium">
          {currentMonth.toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </h3>
        <button
          type="button"
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
            )
          }
          className="p-1 hover:bg-gray-100 rounded"
          title="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div
            key={day.key}
            className="h-8 flex items-center justify-center text-sm font-medium text-gray-500"
          >
            {day.label}
          </div>
        ))}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}
        {days.map((day) => (
          <button
            key={`day-${day}`}
            type="button"
            onClick={() =>
              !isDisabled(day) &&
              onSelectDate(
                new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
              )
            }
            disabled={isDisabled(day)}
            className={`h-8 flex items-center justify-center text-sm rounded-full
              ${
                isDisabled(day)
                  ? 'text-gray-300 cursor-not-allowed'
                  : isSelected(day)
                  ? 'bg-indigo-600 text-white'
                  : isHighlighted(day)
                  ? 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                  : 'hover:bg-gray-100'
              }`}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
}
