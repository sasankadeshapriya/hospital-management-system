// src/components/lists/LabTestList.tsx
import React, { useEffect, useState, useContext } from 'react';
import { Table } from '../Table';
import LabTestService, { LabTest } from '../../services/LabTestService';
import ConfirmationModal from '../modal/ConfirmationModal';
import { ToastContext } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';

interface LabTestListProps {
  searchQuery: string;
}

const LabTestList: React.FC<LabTestListProps> = ({ searchQuery }) => {
  const navigate = useNavigate();
  const { success, error: showError } = useContext(ToastContext);
  const [labTests, setLabTests] = useState<(LabTest & { id: number })[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [testToDelete, setTestToDelete] = useState<number | null>(null);
  const [recordsPerPage, setRecordsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadLabTests = async () => {
      try {
        const data = await LabTestService.fetchLabTests();
        setLabTests(data.map((test) => ({ ...test, id: test.TestID }))); // Map to add 'id' based on 'TestID'
      } catch (error) {
        showError('Failed to load lab tests');
        console.error('Error loading lab tests:', error);
      }
    };
    loadLabTests();
  }, [showError]);

  const filteredTests = labTests.filter(({ TestName }) =>
    TestName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalTests = filteredTests.length;
  const totalPages = Math.ceil(totalTests / recordsPerPage);
  const displayedTests = filteredTests.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleUpdateTest = (testId: number) => navigate(`/labtests/edit/${testId}`);

  const handleDeleteClick = (testId: number) => {
    setTestToDelete(testId);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (testToDelete !== null) {
      try {
        await LabTestService.deleteLabTest(testToDelete);
        setLabTests((prev) => prev.filter((test) => test.TestID !== testToDelete));
        success('Lab Test deleted successfully');
      } catch (err) {
        showError('Failed to delete lab test');
        console.error('Error deleting lab test:', err);
      } finally {
        setShowModal(false);
        setTestToDelete(null);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm h-[70vh] flex flex-col">
      <Table
        data={displayedTests}
        columns={[
          { header: 'Test Name', accessor: 'TestName' },
          { header: 'Processing Time', accessor: 'ProcessingTime' },
          { header: 'Cost', accessor: 'Cost' },
          {
            header: 'Actions',
            accessor: (test) => (
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => handleUpdateTest(test.TestID)}
                  className="px-4 py-2 text-sm text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteClick(test.TestID)}
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
          message="Are you sure you want to delete this lab test?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default LabTestList;
