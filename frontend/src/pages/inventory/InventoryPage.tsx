import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InventoryList from '../../components/lists/InventoryList';
import SelectionControls from '../../components/SelectionControls';

const InventoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const handleItemSelect = (itemId: number) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(itemId) ? prevSelected.filter((id) => id !== itemId) : [...prevSelected, itemId]
    );
  };

  const handleAddNew = () => navigate('/inventory/new');
  const handleUpdateItem = () => selectedItems.length === 1 && navigate(`/inventory/edit/${selectedItems[0]}`);
  const handleDeleteItems = () => {
    console.log('Delete item(s)', selectedItems);
    setSelectedItems([]);
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
          <SelectionControls
            selectedCount={selectedItems.length}
            onUpdate={handleUpdateItem}
            onDelete={handleDeleteItems}
            onSearchChange={setSearchQuery}
            searchQuery={searchQuery}
            onAddNew={handleAddNew}
          />
        </header>

        {/* Inventory List */}
        <InventoryList
          onItemSelect={handleItemSelect}
          selectedItems={selectedItems}
          searchQuery={searchQuery}
        />
      </div>
    </main>
  );
};

export default InventoryPage;
