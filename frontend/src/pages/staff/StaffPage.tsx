import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StaffList from '../../components/lists/StaffList';
import SelectionControls from '../../components/SelectionControls';

const StaffPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<number[]>([]);

  const handleStaffSelect = (staffId: number) => {
    setSelectedStaff((prevSelected) => 
      prevSelected.includes(staffId)
        ? prevSelected.filter((id) => id !== staffId)
        : [...prevSelected, staffId]
    );
  };

  const handleAddNew = () => {
    navigate('/staff/new');
  };

  const handleUpdateStaff = () => {
    if (selectedStaff.length === 1) {
      const staffId = selectedStaff[0];
      navigate(`/staff/edit/${staffId}`);
    }
  };

  const handleDeleteStaff = () => {
    console.log('Delete staff members:', selectedStaff);
    setSelectedStaff([]);
  };

  return (
    <main className="flex-1 p-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Title and Controls Section */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <p className="text-indigo-600 font-medium">Staff</p>
            <h1 className="text-2xl font-bold text-gray-900">Staff List</h1>
          </div>
          <SelectionControls
            selectedCount={selectedStaff.length}
            onUpdate={handleUpdateStaff}
            onDelete={handleDeleteStaff}
            onSearchChange={setSearchQuery}
            searchQuery={searchQuery}
            onAddNew={handleAddNew}
          />
        </header>

        {/* Staff List */}
        <StaffList
          onStaffSelect={handleStaffSelect}
          selectedStaff={selectedStaff}
          searchQuery={searchQuery}
        />
      </div>
    </main>
  );
};

export default StaffPage;
