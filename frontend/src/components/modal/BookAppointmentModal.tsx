import React from 'react';
import { X } from 'lucide-react';

interface AppointmentData {
  patientName: string;
  doctorId: string;
  date: string;
  time: string;
  type: string;
}

interface BookAppointmentModalProps {
  onClose: () => void;
  appointmentData: AppointmentData | null;
}

const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({ onClose, appointmentData }) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const data: AppointmentData = {
      patientName: formData.get('patient') as string,
      doctorId: formData.get('doctor') as string,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      type: formData.get('type') as string,
    };

    console.log('Booking appointment', data); // Log or send the updated data
    onClose(); // Close the modal after submitting
  };

  const inputClass = "w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {appointmentData ? 'Update Appointment' : 'Book Appointment'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg" aria-label="Close">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="patient" className="block text-sm font-medium text-gray-700 mb-1">
              Patient Name
            </label>
            <input
              type="text"
              id="patient"
              name="patient"
              className={inputClass}
              defaultValue={appointmentData?.patientName || ''}
              required
            />
          </div>

          <div>
            <label htmlFor="doctor" className="block text-sm font-medium text-gray-700 mb-1">
              Doctor
            </label>
            <select
              id="doctor"
              name="doctor"
              className={inputClass}
              defaultValue={appointmentData?.doctorId || ''}
              required
            >
              <option value="">Select a doctor</option>
              <option value="1">Dr. Sarah Wilson</option>
              <option value="2">Dr. James Mitchell</option>
              <option value="3">Dr. Emily Parker</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                className={inputClass}
                defaultValue={appointmentData?.date || ''}
                required
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="time"
                id="time"
                name="time"
                className={inputClass}
                defaultValue={appointmentData?.time || ''}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Appointment Type
            </label>
            <select
              id="type"
              name="type"
              className={inputClass}
              defaultValue={appointmentData?.type || ''}
              required
            >
              <option value="consultation">Consultation</option>
              <option value="lab">Lab Test</option>
            </select>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {appointmentData ? 'Update Appointment' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookAppointmentModal;
