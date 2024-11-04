import React, { useState, useEffect } from 'react';
import { Table } from '../Table';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PatientService, { Patient } from '../../services/PatientService';
import ConfirmationModal from '../modal/ConfirmationModal';

interface PatientListProps {
  onPatientSelect: (patientId: number) => void;
  selectedPatients: number[];
  searchQuery: string;
}

const PatientList: React.FC<PatientListProps> = ({searchQuery }) => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<(Patient & { id: number })[]>([]);
  const [hiddenPatients, setHiddenPatients] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<number | null>(null);
  const [recordsPerPage, setRecordsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    return monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())
      ? age - 1
      : age;
  };

  const getGender = (genderCode: string): string => {
    return genderCode.toLowerCase() === 'f' ? 'Female' : 'Male';
  };

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const data = await PatientService.fetchPatients();
        setPatients(data.map((patient) => ({ ...patient, id: patient.PatientID })));
      } catch (error) {
        console.error('Error loading patients:', error);
      }
    };
    loadPatients();
  }, []);

  const visiblePatients = patients.filter(({ PatientID }) => !hiddenPatients.includes(PatientID));

  const filteredPatients = visiblePatients.filter(({ FirstName, LastName, Gender, CNIC, Address, ContactNumber }) =>
    [FirstName, LastName, Gender, CNIC, Address, ContactNumber].some((field) =>
      field.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalPatients = filteredPatients.length;
  const totalPages = Math.ceil(totalPatients / recordsPerPage);
  const displayedPatients = filteredPatients.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const navigateToDetails = (patientId: number) => {
    navigate(`/patient-details/${patientId}`);
  };

  const handleUpdatePatient = (patientId: number) => {
    navigate(`/patients/edit/${patientId}`);
  };

  const handleDeleteClick = (patientId: number) => {
    setPatientToDelete(patientId);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (patientToDelete !== null) {
      try {
        await PatientService.deletePatient(patientToDelete);
        setHiddenPatients((prevHidden) => [...prevHidden, patientToDelete]);
        console.log('Patient deleted successfully');
      } catch (error) {
        console.error('Error deleting patient:', error);
      } finally {
        setShowModal(false);
        setPatientToDelete(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setPatientToDelete(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm h-[70vh] flex flex-col">
      <Table
        data={displayedPatients}
        columns={[
          {
            header: 'Patient',
            accessor: (patient) => (
              <div className="flex items-center gap-4">
                <div>{`${patient.FirstName} ${patient.LastName}`}</div>
              </div>
            ),
          },
          {
            header: 'Age',
            accessor: (patient) => calculateAge(patient.DOB),
          },
          {
            header: 'Gender',
            accessor: (patient) => getGender(patient.Gender),
          },
          { header: 'CNIC', accessor: 'CNIC' },
          { header: 'Contact Number', accessor: 'ContactNumber' },
          { header: 'Address', accessor: 'Address' },
          {
            header: 'Details',
            accessor: (patient) => (
              <button
                onClick={() => navigateToDetails(patient.PatientID)}
                className="px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg flex items-center gap-2 transition-colors"
              >
                Details
                <ChevronRight className="h-4 w-4" />
              </button>
            ),
          },
          {
            header: 'Actions',
            accessor: (patient) => (
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdatePatient(patient.PatientID)}
                  className="px-4 py-2 text-sm text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteClick(patient.PatientID)}
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

      {showModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this patient?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default PatientList;
