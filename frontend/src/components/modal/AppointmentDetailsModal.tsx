import { X, User, Calendar, Clock, MapPin } from 'lucide-react';

interface Appointment {
  id: number;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
  roomNumber: string;
  queueNumber: number;
  type: 'Consultation' | 'Lab';
}

interface AppointmentDetailsModalProps {
  appointment: Appointment | null;
  onClose: () => void;
}

// Reusable DetailItem component for each appointment detail
const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) => (
  <div className="flex items-center gap-3">
    <Icon className="h-5 w-5 text-indigo-600" />
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  </div>
);

const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({ appointment, onClose }) => {
  if (!appointment) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Appointment Details</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg" aria-label="Close">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <DetailItem icon={User} label="Patient" value={appointment.patientName} />
          <DetailItem icon={User} label="Doctor" value={appointment.doctorName} />
          <DetailItem icon={Calendar} label="Date" value={new Date(appointment.date).toLocaleDateString()} />
          <DetailItem icon={Clock} label="Time" value={appointment.time} />
          <DetailItem icon={MapPin} label="Room" value={appointment.roomNumber} />

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Queue Number</p>
                <p className="text-xl font-semibold text-indigo-600">#{appointment.queueNumber}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  appointment.status === 'Confirmed'
                    ? 'bg-green-100 text-green-800'
                    : appointment.status === 'Pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {appointment.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailsModal;
