import React, { useState } from 'react';
import { Table } from '../Table';

interface Staff {
  id: number;
  name: string;
  email: string;
  photo: string;
  dob: string;
  contactNumber: string;
  accountType: string;
  address: string;
}

interface StaffListProps {
  onStaffSelect: (staffId: number) => void;
  selectedStaff: number[];
  searchQuery: string;
}

const staffMembers: Staff[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    dob: '1990-05-01',
    contactNumber: '+1234567890',
    accountType: 'Lab Assistant',
    address: '123 Main St, Anytown, USA',
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob.s@example.com',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    dob: '1985-11-21',
    contactNumber: '+0987654321',
    accountType: 'Receptionist',
    address: '456 Elm St, Anytown, USA',
  },
  // Additional staff members
];

const StaffList: React.FC<StaffListProps> = ({ onStaffSelect, selectedStaff, searchQuery }) => {
  const [recordsPerPage, setRecordsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter staff based on the search query
  const filteredStaff = staffMembers.filter(({ name, email, accountType, contactNumber }) =>
    [name, email, accountType, contactNumber].some(field =>
      field.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Pagination logic
  const totalStaff = filteredStaff.length;
  const totalPages = Math.ceil(totalStaff / recordsPerPage);
  const displayedStaff = filteredStaff.slice(
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
        data={displayedStaff}
        columns={[
          {
            header: '',
            accessor: (staff) => (
              <input
                type="checkbox"
                checked={selectedStaff.includes(staff.id)}
                onChange={() => onStaffSelect(staff.id)}
                className="rounded border-gray-300"
                title="Select staff member"
              />
            ),
          },
          {
            header: 'Staff Member',
            accessor: (staff: Staff) => (
              <div className="flex items-center gap-4">
                <img
                  src={staff.photo}
                  alt={staff.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{staff.name}</p>
                  <p className="text-sm text-gray-500">{staff.email}</p>
                </div>
              </div>
            ),
          },
          { header: 'Account Type', accessor: 'accountType' },
          { header: 'DOB', accessor: 'dob' },
          { header: 'Contact', accessor: 'contactNumber' },
          { header: 'Address', accessor: 'address' },
        ]}
        pageSize={recordsPerPage}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default StaffList;
