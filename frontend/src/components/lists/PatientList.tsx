import React, { useState, useEffect } from 'react';
import { Table } from '../Table';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PatientService, { Patient } from '../../services/PatientService';

interface PatientListProps {
  onPatientSelect: (patientId: number) => void;
  selectedPatients: number[];
  searchQuery: string;
}

const PatientList: React.FC<PatientListProps> = ({ onPatientSelect, selectedPatients, searchQuery }) => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<(Patient & { id: number })[]>([]);
  const [recordsPerPage, setRecordsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  // Utility function to calculate age from DOB
  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  // Utility function to display full gender
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

  const filteredPatients = patients.filter(({ FirstName, LastName, Gender, CNIC, Address, ContactNumber }) =>
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

  return (
    <div className="bg-white rounded-xl shadow-sm h-[70vh] flex flex-col">
      <Table
        data={displayedPatients}
        columns={[
          {
            header: '',
            accessor: (patient) => (
              <input
                type="checkbox"
                checked={selectedPatients.includes(patient.PatientID)}
                onChange={() => onPatientSelect(patient.PatientID)}
                className="rounded border-gray-300"
                title="Select"
              />
            ),
          },
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
        onPageSizeChange={setRecordsPerPage}
      />
    </div>
  );
};

export default PatientList;
