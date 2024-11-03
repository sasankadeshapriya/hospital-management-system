import { useState } from 'react';
import { Table } from '../Table';
import { ChevronRight } from 'lucide-react';
import AppointmentDetailsModal from '../modal/AppointmentDetailsModal';

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

interface DoctorAppointmentListProps {
  onAppointmentSelect: (appointmentId: number) => void;
  selectedAppointments: number[];
  searchQuery: string;
}

const appointments: Appointment[] = [
  {
    id: 1,
    patientName: 'Rebecca Young',
    doctorName: 'Dr. Barry Taylor',
    date: '2024-11-02',
    time: '09:00',
    status: 'Pending',
    roomNumber: '101',
    queueNumber: 1,
    type: 'Consultation',
  },
  {
    id: 2,
    patientName: 'Mike Jackson',
    doctorName: 'Dr. Ralph Adams',
    date: '2024-11-03',
    time: '11:00',
    status: 'Confirmed',
    roomNumber: '102',
    queueNumber: 2,
    type: 'Lab',
  },
];

const DoctorAppointmentList: React.FC<DoctorAppointmentListProps> = ({
  onAppointmentSelect,
  selectedAppointments,
  searchQuery,
}) => {
  const [recordsPerPage, setRecordsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Filter appointments based on the search query
  const filteredAppointments = appointments.filter(
    ({ patientName, doctorName, status }) =>
      patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalAppointments = filteredAppointments.length;
  const totalPages = Math.ceil(totalAppointments / recordsPerPage);
  const displayedAppointments = filteredAppointments.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setRecordsPerPage(size);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm h-[70vh] flex flex-col">
      <Table
        data={displayedAppointments}
        columns={[
          {
            header: '',
            accessor: (appointment) => (
              <input
                type="checkbox"
                checked={selectedAppointments.includes(appointment.id)}
                onChange={() => onAppointmentSelect(appointment.id)}
                className="rounded border-gray-300"
                title="Select appointment"
              />
            ),
          },
          { header: 'Patient Name', accessor: 'patientName' },
          { header: 'Doctor Name', accessor: 'doctorName' },
          { header: 'Appointment Date', accessor: 'date' },
          { header: 'Appointment Time', accessor: 'time' },
          {
            header: 'Status',
            accessor: (appointment) => (
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  appointment.status === 'Confirmed'
                    ? 'bg-green-100 text-green-800'
                    : appointment.status === 'Pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {appointment.status}
              </span>
            ),
          },
          {
            header: 'Details',
            accessor: (appointment) => (
              <button
                onClick={() => setSelectedAppointment(appointment)}
                className="px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg flex items-center gap-2 transition-colors"
              >
                More details
                <ChevronRight className="h-4 w-4" />
              </button>
            ),
          },
        ]}
        pageSize={recordsPerPage}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* Modal */}
      {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </div>
  );
};

export default DoctorAppointmentList;
