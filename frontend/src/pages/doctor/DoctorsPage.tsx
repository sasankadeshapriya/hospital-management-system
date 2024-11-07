// DoctorsPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorList from '../../components/lists/DoctorList';
import SelectionControls from '../../components/SelectionControls';

function DoctorsPage() {
  const navigate = useNavigate();
  const [specialtyFilter, setSpecialtyFilter] = useState('All Doctors');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctors, setSelectedDoctors] = useState<number[]>([]);

  const handleDoctorSelect = (selectedIds: number[]) => {
    setSelectedDoctors(selectedIds);
  };

  const handleAddNewDoctor = () => {
    navigate('/doctors/add');
  };

  const handleUpdateDoctor = () => {
    if (selectedDoctors.length === 1) {
      navigate(`/doctors/update/${selectedDoctors[0]}`);
    }
  };

  const handleDeleteDoctors = () => {
    console.log('Delete doctor(s)', selectedDoctors);
    setSelectedDoctors([]); // Clear selected doctors after deletion
  };

  return (
    <main className="flex-1 p-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Title Section */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <p className="text-indigo-600 font-medium">Doctors</p>
            <h1 className="text-2xl font-bold text-gray-900">Medical Staff</h1>
          </div>
          <SelectionControls
            selectedCount={selectedDoctors.length}
            onUpdate={handleUpdateDoctor}
            onDelete={handleDeleteDoctors}
            onSearchChange={setSearchQuery}
            searchQuery={searchQuery}
            onAddNew={handleAddNewDoctor}
          />
        </header>

        {/* Specialty Filter Section */}
        <div className="mb-6 flex gap-2">
          {['All Doctors', 'Cardiology', 'Neurology', 'Oncology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'Psychiatry'].map((specialty) => (
            <button
              key={specialty}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                specialty === specialtyFilter
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setSpecialtyFilter(specialty)}
            >
              {specialty}
            </button>
          ))}
        </div>

        {/* Doctor List Section */}
        <DoctorList
          specialtyFilter={specialtyFilter}
          searchQuery={searchQuery}
          onSelect={handleDoctorSelect}
        />
      </div>
    </main>
  );
}

export default DoctorsPage;
