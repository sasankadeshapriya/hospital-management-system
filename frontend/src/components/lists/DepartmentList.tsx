// src/components/lists/DepartmentList.tsx
import React, { useEffect, useState, useContext } from 'react';
import { Table } from '../Table';
import DepartmentService, { Department } from '../../services/DepartmentService';
import ConfirmationModal from '../modal/ConfirmationModal';
import { ToastContext } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';

interface DepartmentListProps {
  searchQuery: string;
}

const DepartmentList: React.FC<DepartmentListProps> = ({ searchQuery }) => {
  const navigate = useNavigate();
  const { success, error: showError } = useContext(ToastContext);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<number | null>(null);
  const [recordsPerPage, setRecordsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const data = await DepartmentService.fetchDepartments();
        setDepartments(data);
      } catch (error) {
        console.error('Error loading departments:', error);
        showError('Failed to load departments');
      }
    };
    loadDepartments();
  }, [showError]);

  const filteredDepartments = departments.filter(({ DepartmentName, Specialization, HOD_Name }) =>
    [DepartmentName, Specialization, HOD_Name].some((field) =>
      field.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalDepartments = filteredDepartments.length;
  const totalPages = Math.ceil(totalDepartments / recordsPerPage);
  const displayedDepartments = filteredDepartments
    .slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage)
    .map((department) => ({
      ...department,
      id: department.DepartmentID, // Mapping DepartmentID to id for Table compatibility
    }));

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleUpdateDepartment = (departmentId: number) => {
    navigate(`/departments/edit/${departmentId}`);
  };

  const handleDeleteClick = (departmentId: number) => {
    setDepartmentToDelete(departmentId);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (departmentToDelete !== null) {
      try {
        await DepartmentService.deleteDepartment(departmentToDelete);
        setDepartments((prev) => prev.filter((dept) => dept.DepartmentID !== departmentToDelete));
        success('Department deleted successfully');
      } catch (err) {
        console.error('Error deleting department:', err);
        showError('Failed to delete department');
      } finally {
        setShowModal(false);
        setDepartmentToDelete(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setDepartmentToDelete(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm h-[70vh] flex flex-col">
      <Table
        data={displayedDepartments}
        columns={[
          { header: 'Department Name', accessor: 'DepartmentName' },
          { header: 'Specialization', accessor: 'Specialization' },
          { header: 'Head of Department', accessor: 'HOD_Name' },
          {
            header: 'Actions',
            accessor: (department) => (
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdateDepartment(department.DepartmentID)}
                  className="px-4 py-2 text-sm text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteClick(department.DepartmentID)}
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
          message="Are you sure you want to delete this department?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default DepartmentList;
