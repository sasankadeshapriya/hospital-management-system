// src/pages/doctor/DoctorAppointmentsPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorAppointmentList from '../../components/lists/DoctorAppointmentList';
import SelectionControls from '../../components/SelectionControls';

const DoctorAppointmentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppointments] = useState<number[]>([]);
  const navigate = useNavigate();

  const handleAddNewAppointment = () => {
    navigate('/appointments/new'); // Navigate to the appointment form page
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
            onSearchChange={setSearchQuery}
            searchQuery={searchQuery}
            onAddNew={handleAddNewAppointment}
          />
        </header>

        <DoctorAppointmentList searchQuery={searchQuery} />
      </div>
    </main>
  );
};

export default DoctorAppointmentsPage;
