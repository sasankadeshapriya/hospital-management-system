import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DepartmentList from '../../components/lists/DepartmentList';
import SelectionControls from '../../components/SelectionControls';
import DepartmentService from '../../services/DepartmentService';

const DepartmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState<number[]>([]);

  // Handle selection of departments
  const handleDepartmentSelect = (departmentId: number) => {
    setSelectedDepartments((prevSelected) =>
      prevSelected.includes(departmentId)
        ? prevSelected.filter((id) => id !== departmentId)
        : [...prevSelected, departmentId]
    );
  };

  // Navigate to "Add New" Department Form
  const handleAddNew = () => {
    navigate('/departments/add');
  };

  // Handle "Update" action for selected department
  const handleUpdateDepartment = () => {
    if (selectedDepartments.length === 1) {
      const departmentId = selectedDepartments[0];
      navigate(`/departments/edit/${departmentId}`);
    }
  };

  // Handle "Delete" action for selected department(s)
  const handleDeleteDepartments = async () => {
    if (selectedDepartments.length === 1) {
      try {
        const departmentId = selectedDepartments[0];
        await DepartmentService.deleteDepartment(departmentId);
        alert('Department deleted successfully');
        setSelectedDepartments([]);
        // Optionally, refresh the department list after deletion
      } catch (err) {
        alert('Failed to delete department. Please try again.');
        console.error('Error deleting department:', err);
      }
    } else {
      alert('Please select a single department to delete.');
    }
  };

  return (
    <main className="flex-1 p-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <p className="text-indigo-600 font-medium">Departments</p>
            <h1 className="text-2xl font-bold text-gray-900">Departments List</h1>
          </div>
          <SelectionControls
            selectedCount={selectedDepartments.length}
            onUpdate={handleUpdateDepartment}
            onDelete={handleDeleteDepartments}
            onSearchChange={setSearchQuery}
            searchQuery={searchQuery}
            onAddNew={handleAddNew}
          />
        </header>

        {/* Department List */}
        <DepartmentList
          onDepartmentSelect={handleDepartmentSelect}
          searchQuery={searchQuery}
        />
      </div>
    </main>
  );
};

export default DepartmentsPage;
