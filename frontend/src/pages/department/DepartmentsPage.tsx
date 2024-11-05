// src/pages/department/DepartmentsPage.tsx
import React, { useState } from 'react';
import DepartmentList from '../../components/lists/DepartmentList';
import SelectionControls from '../../components/SelectionControls';

const DepartmentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <main className="flex-1 p-8 relative">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <p className="text-indigo-600 font-medium">Departments</p>
            <h1 className="text-2xl font-bold text-gray-900">Departments List</h1>
          </div>
          <SelectionControls
            selectedCount={0}
            onSearchChange={setSearchQuery}
            searchQuery={searchQuery}
          />
        </header>

        <DepartmentList searchQuery={searchQuery} />
      </div>
    </main>
  );
};

export default DepartmentsPage;
