// src/pages/lab/LabTestsPage.tsx
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LabTestList from '../../components/lists/LabTestList';
import SelectionControls from '../../components/SelectionControls';
import LabTestService from '../../services/LabTestService';
import { ToastContext } from '../../context/ToastContext';

const LabTestsPage: React.FC = () => {
  const navigate = useNavigate();
  const { success, error } = useContext(ToastContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTests, setSelectedTests] = useState<number[]>([]);

  const handleAddNew = () => navigate('/labtests/new');

  const handleUpdateTest = () => {
    if (selectedTests.length === 1) {
      const testId = selectedTests[0];
      navigate(`/labtests/edit/${testId}`);
    }
  };

  const handleDeleteTests = async () => {
    if (selectedTests.length === 1) {
      try {
        const testId = selectedTests[0];
        await LabTestService.deleteLabTest(testId);
        success('Lab Test deleted successfully');
        setSelectedTests([]);
      } catch (err) {
        error('Failed to delete lab test. Please try again.');
        console.error('Error deleting lab test:', err);
      }
    } else {
      error('Please select a single lab test to delete.');
    }
  };

  return (
    <main className="flex-1 p-8 relative">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <p className="text-indigo-600 font-medium">Lab Tests</p>
            <h1 className="text-2xl font-bold text-gray-900">Lab Tests List</h1>
          </div>
          <SelectionControls
            selectedCount={selectedTests.length}
            onUpdate={handleUpdateTest}
            onDelete={handleDeleteTests}
            onSearchChange={setSearchQuery}
            searchQuery={searchQuery}
            onAddNew={handleAddNew}
          />
        </header>
        <LabTestList  searchQuery={searchQuery} />
      </div>
    </main>
  );
};

export default LabTestsPage;
