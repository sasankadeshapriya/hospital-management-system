import React, { useState } from 'react';
import DoctorAppointmentList from '../../components/lists/DoctorAppointmentList';
import SelectionControls from '../../components/SelectionControls';
import BookAppointmentModal from '../../components/modal/BookAppointmentModal';

const DoctorAppointmentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppointments, setSelectedAppointments] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentData, setAppointmentData] = useState(null);

  const handleAppointmentSelect = (appointmentId: number) => {
    setSelectedAppointments((prevSelected) =>
      prevSelected.includes(appointmentId)
        ? prevSelected.filter((id) => id !== appointmentId)
        : [...prevSelected, appointmentId]
    );
  };

  const handleAddNewAppointment = () => {
    setAppointmentData(null); // Clear data for new appointment
    setIsModalOpen(true);
  };

  const handleUpdateAppointment = () => {
    if (selectedAppointments.length === 1) {
      const appointmentId = selectedAppointments[0];
      // Placeholder for fetching data based on appointmentId
      const fetchedAppointmentData = {
        patientName: 'John Doe',
        doctorId: '1',
        date: '2024-11-10',
        time: '10:00',
        type: 'consultation',
      };
      setAppointmentData(fetchedAppointmentData);
      setIsModalOpen(true);
    }
  };

  const handleDeleteAppointments = () => {
    console.log('Delete appointment(s)', selectedAppointments);
    setSelectedAppointments([]);
  };

  return (
    <main className="flex-1 p-8 relative">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <p className="text-indigo-600 font-medium">Appointments</p>
            <h1 className="text-2xl font-bold text-gray-900">Appointment List</h1>
          </div>
          <SelectionControls
            selectedCount={selectedAppointments.length}
            onUpdate={handleUpdateAppointment}
            onDelete={handleDeleteAppointments}
            onSearchChange={setSearchQuery}
            searchQuery={searchQuery}
            onAddNew={handleAddNewAppointment}
          />
        </header>

        <DoctorAppointmentList
          onAppointmentSelect={handleAppointmentSelect}
          selectedAppointments={selectedAppointments}
          searchQuery={searchQuery}
        />
      </div>

      {isModalOpen && (
        <BookAppointmentModal
          onClose={() => setIsModalOpen(false)}
          appointmentData={appointmentData}
        />
      )}
    </main>
  );
};

export default DoctorAppointmentsPage;
