import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import navigate
import InventoryList from '../../components/lists/InventoryList';
import SelectionControls from '../../components/SelectionControls';
import '../../style/Toggle.css';

const InventoryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showExpired, setShowExpired] = useState(false);
  const navigate = useNavigate(); // Declare navigate function

  const handleToggleExpired = () => setShowExpired((prev) => !prev);

  // Handler for the "Add New" action from SelectionControls
  const handleAddNew = () => {
    navigate('/inventory/new'); // Navigate to the "Add New Medicine" page
  };

  return (
    <main className="flex-1 p-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Title and Controls Section */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <p className="text-indigo-600 font-medium">Inventory</p>
            <h1 className="text-2xl font-bold text-gray-900">Inventory List</h1>
          </div>

          {/* Pass handleAddNew to SelectionControls */}
          <SelectionControls
            selectedCount={0}
            onSearchChange={setSearchQuery}
            searchQuery={searchQuery}
            onAddNew={handleAddNew} // Pass the onAddNew handler here
          />
        </header>

        {/* Toggle Switch for Expired Items */}
        <div className="flex items-center gap-4 mb-6">
          <input
            type="checkbox"
            id="showExpiredToggle"
            checked={showExpired}
            onChange={handleToggleExpired}
            className="toggle-checkbox"
          />
          <label htmlFor="showExpiredToggle" className="text-gray-700 font-medium">
            {showExpired ? 'Show All Items' : 'Show Expired Items'}
          </label>
          <span className="toggle-switch" />
        </div>

        {/* Inventory List */}
        <InventoryList searchQuery={searchQuery} showExpired={showExpired} />
      </div>
    </main>
  );
};

export default InventoryPage;
