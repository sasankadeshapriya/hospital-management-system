// SelectionControls.tsx
import React from 'react';
import { Search, Plus, Edit, Trash } from 'lucide-react';

interface SelectionControlsProps {
  selectedCount: number;
  onUpdate: () => void;
  onDelete: () => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
  onAddNew: () => void;
}

const SelectionControls: React.FC<SelectionControlsProps> = ({
  selectedCount,
  onUpdate,
  onDelete,
  onSearchChange,
  searchQuery,
  onAddNew,
}) => {
  const renderActionButton = () => {
    const buttonStyles = "flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-transform duration-200 transform hover:scale-105";
    
    if (selectedCount === 0) {
      return (
        <button
          onClick={onAddNew}
          className={`bg-indigo-600 hover:bg-indigo-700 ${buttonStyles}`}
        >
          <Plus className="h-5 w-5" />
          Add New
        </button>
      );
    }

    return (
      <>
        {selectedCount === 1 && (
          <button
            onClick={onUpdate}
            className={`bg-green-600 hover:bg-green-700 ${buttonStyles}`}
          >
            <Edit className="h-5 w-5" />
            Update
          </button>
        )}
        <button
          onClick={onDelete}
          className={`bg-red-600 hover:bg-red-700 ${buttonStyles}`}
        >
          <Trash className="h-5 w-5" />
          {selectedCount > 1 ? 'Delete Selected' : 'Delete'}
        </button>
      </>
    );
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Action Buttons */}
        {renderActionButton()}
      </div>
    </div>
  );
};

export default SelectionControls;
