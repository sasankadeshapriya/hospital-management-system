import React, { useState } from 'react';
import { Table } from '../Table';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  phone: string;
  room: string;
  image: string;
}

interface PatientListProps {
  onPatientSelect: (patientId: number) => void;
  selectedPatients: number[];
  searchQuery: string;
}

const patients: Patient[] = [
  {
    id: 1,
    name: 'Rebecca Young',
    age: 36,
    gender: 'Female',
    bloodType: 'O-',
    phone: '+96659756070',
    room: 'Room 271',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 2,
    name: 'Barry Taylor',
    age: 42,
    gender: 'Male',
    bloodType: 'A+',
    phone: '+96659186876',
    room: 'Room 225',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 3,
    name: 'Mike Jackson',
    age: 69,
    gender: 'Male',
    bloodType: 'A-',
    phone: '+96653498044',
    room: 'Room 212',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 4,
    name: 'Ralph Adams',
    age: 60,
    gender: 'Male',
    bloodType: 'AB',
    phone: '+96650624822',
    room: 'Room 280',
    image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 5,
    name: 'Samantha Thomas',
    age: 37,
    gender: 'Female',
    bloodType: 'O+',
    phone: '+96655841498',
    room: 'Room 272',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

const PatientList: React.FC<PatientListProps> = ({ onPatientSelect, selectedPatients, searchQuery }) => {
  const navigate = useNavigate();
  const [recordsPerPage, setRecordsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter patients based on search query
  const filteredPatients = patients.filter(({ name, gender, bloodType, room, phone, age }) =>
    [name, gender, bloodType, room, phone, age.toString()].some((field) =>
      field.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Pagination logic
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
                checked={selectedPatients.includes(patient.id)}
                onChange={() => onPatientSelect(patient.id)}
                className="rounded border-gray-300"
                title="Select"
              />
            ),
          },
          {
            header: 'Patient',
            accessor: (patient: Patient) => (
              <div className="flex items-center gap-4">
                <img
                  src={patient.image}
                  alt={patient.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>{patient.name}</div>
              </div>
            ),
          },
          { header: 'Age', accessor: 'age' },
          { header: 'Gender', accessor: 'gender' },
          { header: 'Blood Type', accessor: 'bloodType' },
          { header: 'Phone Number', accessor: 'phone' },
          { header: 'Room', accessor: 'room' },
          {
            header: 'Details',
            accessor: (patient) => (
              <button
                onClick={() => navigateToDetails(patient.id)}
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
