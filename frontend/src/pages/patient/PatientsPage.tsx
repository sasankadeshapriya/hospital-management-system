import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientList from '../../components/lists/PatientList';
import SelectionControls from '../../components/SelectionControls';
import PatientService from '../../services/PatientService';
import { ToastContext } from '../../context/ToastContext';

const PatientsPage: React.FC = () => {
  const navigate = useNavigate();
  const { success, error } = useContext(ToastContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatients, setSelectedPatients] = useState<number[]>([]);

  const handlePatientSelect = (patientId: number) => {
    setSelectedPatients((prevSelected) =>
      prevSelected.includes(patientId)
        ? prevSelected.filter((id) => id !== patientId)
        : [...prevSelected, patientId]
    );
  };

  const handleAddNew = () => {
    navigate('/patients/new');
  };

  const handleUpdatePatient = () => {
    if (selectedPatients.length === 1) {
      const patientId = selectedPatients[0];
      navigate(`/patients/edit/${patientId}`);
    }
  };

  const handleDeletePatients = async () => {
    if (selectedPatients.length === 1) {
      try {
        const patientId = selectedPatients[0];
        await PatientService.deletePatient(patientId);
        success('Patient deleted successfully');
        setSelectedPatients([]);
        // Optionally, refresh the patient list after deletion
      } catch (err: unknown) {
        if (err instanceof Error) {
          error(err.message);
        } else {
          error('Failed to delete patient. Please try again.');
        }
      }
    } else {
      error('Please select a single patient to delete.');
    }
  };

  return (
    <main className="flex-1 p-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Title and Controls Section */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <p className="text-indigo-600 font-medium">Patients</p>
            <h1 className="text-2xl font-bold text-gray-900">Patients List</h1>
          </div>
          <SelectionControls
            selectedCount={selectedPatients.length}
            onUpdate={handleUpdatePatient}
            onDelete={handleDeletePatients}
            onSearchChange={setSearchQuery}
            searchQuery={searchQuery}
            onAddNew={handleAddNew}
          />
        </header>

        {/* Patient List */}
        <PatientList
          onPatientSelect={handlePatientSelect}
          selectedPatients={selectedPatients}
          searchQuery={searchQuery}
        />
      </div>
    </main>
  );
};

export default PatientsPage;
