import React, { useState, useEffect, useContext } from 'react';
import { Table } from '../Table';
import { ChevronRight } from 'lucide-react';
import AppointmentService, { Appointment } from '../../services/AppointmentService';
import AppointmentDetailsModal from '../modal/AppointmentDetailsModal';
import ConfirmationModal from '../modal/ConfirmationModal';
import { ToastContext } from '../../context/ToastContext';

interface DoctorAppointmentListProps {
  searchQuery: string;
}

const DoctorAppointmentList: React.FC<DoctorAppointmentListProps> = ({ searchQuery }) => {
  const { success, error: showError } = useContext(ToastContext);
  const [appointments, setAppointments] = useState<(Appointment & { id: number })[]>([]);
  const [recordsPerPage, setRecordsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<number | null>(null);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const data = await AppointmentService.fetchAppointments();
        setAppointments(data.map((appointment) => ({ ...appointment, id: appointment.D_AppointmentID })));
      } catch (error) {
        console.error('Error loading appointments:', error);
        showError('Failed to load appointments');
      }
    };
    loadAppointments();
  }, [showError]);

  // Filter appointments based on the search query
  const filteredAppointments = appointments.filter(
    ({ 'Patient Name': patientName, 'Doctor Name': doctorName, Status: status }) =>
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

  const handleDeleteClick = (appointmentId: number) => {
    setAppointmentToDelete(appointmentId);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (appointmentToDelete !== null) {
      try {
        await AppointmentService.deleteAppointment(appointmentToDelete);
        setAppointments((prev) => prev.filter((app) => app.D_AppointmentID !== appointmentToDelete));
        success('Appointment deleted successfully');
      } catch (err) {
        console.error('Error deleting appointment:', err);
        showError('Failed to delete appointment');
      } finally {
        setShowModal(false);
        setAppointmentToDelete(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setAppointmentToDelete(null);
  };

  // Handle checkbox change (status update)
  const handleStatusChange = async (appointmentId: number, isChecked: boolean) => {
    const newStatus = isChecked ? 'Confirmed' : 'Pending';
    try {
      await AppointmentService.updateAppointmentStatus(appointmentId, newStatus);
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.D_AppointmentID === appointmentId ? { ...appointment, Status: newStatus } : appointment
        )
      );
      success(`Appointment status updated to ${newStatus}`);
    } catch (error) {
      showError('Failed to update status');
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm h-[70vh] flex flex-col">
      <Table
        data={displayedAppointments}
        columns={[
          { header: 'Patient Name', accessor: (appointment) => appointment['Patient Name'] },
          { header: 'Doctor Name', accessor: (appointment) => appointment['Doctor Name'] },
          { header: 'Appointment Date', accessor: (appointment) => new Date(appointment.AppointmentDate).toLocaleDateString() },
          { header: 'Appointment Time', accessor: (appointment) => appointment.AppointmentTime },
          {
            header: 'Status',
            accessor: (appointment) => (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={appointment.Status === 'Confirmed'}
                  onChange={(e) => handleStatusChange(appointment.D_AppointmentID, e.target.checked)}
                  className="form-checkbox h-5 w-5 text-green-600"
                />
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    appointment.Status === 'Confirmed'
                      ? 'bg-green-100 text-green-800'
                      : appointment.Status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {appointment.Status}
                </span>
              </div>
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
          {
            header: 'Actions',
            accessor: (appointment) => (
              <div className="flex gap-2 jsutify-center">
                <button
                  onClick={() => handleDeleteClick(appointment.D_AppointmentID)}
                  className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            ),
          },
        ]}
        pageSize={recordsPerPage}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onPageSizeChange={setRecordsPerPage}
      />

      {/* Details Modal */}
      {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={{
            id: selectedAppointment.D_AppointmentID,
            patientName: selectedAppointment['Patient Name'],
            doctorName: selectedAppointment['Doctor Name'],
            date: selectedAppointment.AppointmentDate,
            time: selectedAppointment.AppointmentTime,
            status: selectedAppointment.Status,
            roomNumber: selectedAppointment.RoomNO,
            queueNumber: selectedAppointment.QueueNumber,
            type: selectedAppointment.AppointmentType,
          }}
          onClose={() => setSelectedAppointment(null)}
        />
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this appointment?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default DoctorAppointmentList;
