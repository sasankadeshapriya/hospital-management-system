import React, { useState, useEffect, useContext } from 'react';
import { Table } from '../Table';
import StaffService, { Staff } from '../../services/StaffService';
import { ToastContext } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../modal/ConfirmationModal';

interface StaffListProps {
  searchQuery: string;
}

const StaffList: React.FC<StaffListProps> = ({ searchQuery }) => {
  const navigate = useNavigate();
  const { success, error: showError } = useContext(ToastContext);
  const [staffMembers, setStaffMembers] = useState<Staff[]>([]);
  const [recordsPerPage, setRecordsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<number | null>(null);

  // Fetch staff data from API
  useEffect(() => {
    const loadStaff = async () => {
      try {
        const data = await StaffService.fetchStaff();
        setStaffMembers(data);
      } catch (err) {
        console.error('Error loading staff:', err);
        showError('Failed to load staff');
      }
    };

    loadStaff();
  }, [showError]);

  // Map staff data to include `id` property
  const mappedStaffMembers = staffMembers.map((staff) => ({
    ...staff,
    id: staff.UserID,  // Add `id` field from `UserID`
  }));

  // Calculate age based on DOB
  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Filter staff based on the search query
  const filteredStaff = mappedStaffMembers.filter(({ Name, Email, Address, ContactNumber }) =>
    [Name, Email, Address, ContactNumber].some(field =>
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

  const handleUpdateStaff = (staffId: number) => {
    navigate(`/staff/edit/${staffId}`);
  };
  

  const handleDeleteClick = (staffId: number) => {
    setStaffToDelete(staffId);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (staffToDelete !== null) {
      try {
        await StaffService.deleteStaff(staffToDelete);
        setStaffMembers((prevStaff) => prevStaff.filter(staff => staff.UserID !== staffToDelete));
        success('Staff deleted successfully');
      } catch (err) {
        console.error('Error deleting staff:', err);
        showError('Failed to delete staff');
      } finally {
        setShowModal(false);
        setStaffToDelete(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setStaffToDelete(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm h-[70vh] flex flex-col">
      <Table
        data={displayedStaff}
        columns={[
          {
            header: 'Staff Member',
            accessor: (staff: Staff) => (
              <div className="flex items-center gap-4 justify-center">
                <img
                  src={staff.Photo}
                  alt={staff.Name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{staff.Name}</p>
                  <p className="text-sm text-gray-500">{staff.Email}</p>
                </div>
              </div>
            ),
          },
          {
            header: 'Age',
            accessor: (staff: Staff) => calculateAge(staff.DOB),
          },
          { header: 'Contact', accessor: 'ContactNumber' },
          { header: 'Address', accessor: 'Address' },
          {
            header: 'Actions',
            accessor: (staff: Staff) => (
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdateStaff(staff.UserID)}
                  className="px-4 py-2 text-sm text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteClick(staff.UserID)}
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
        onPageSizeChange={handlePageSizeChange}
      />

      {showModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this staff member?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default StaffList;
