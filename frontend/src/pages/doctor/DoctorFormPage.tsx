import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TextInput, SelectInput, FileInput } from '../../components/FormComponents';

interface Doctor {
  firstName: string;
  lastName: string;
  departmentId: number;
  specialization: string;
  status: string;
  dateOfJoining: string;
  image?: File | null;
}

interface DoctorFormProps {
  initialData?: Doctor;
}

const departments = [
  { id: 1, name: 'Cardiology' },
  { id: 2, name: 'Neurology' },
  { id: 3, name: 'Pediatrics' },
  { id: 4, name: 'Orthopedics' },
  { id: 5, name: 'Dermatology' },
];

// Convert departments to string array
const departmentNames = departments.map((department) => department.name);

const specializations = [
  'General Physician',
  'Cardiologist',
  'Neurologist',
  'Pediatrician',
  'Orthopedic Surgeon',
  'Dermatologist',
];

export function DoctorFormPage({ initialData }: DoctorFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    departmentId: initialData?.departmentId || 0,
    specialization: initialData?.specialization || '',
    status: initialData?.status || '',
    dateOfJoining: initialData?.dateOfJoining || '',
    image: initialData?.image || null,
  });

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData); // Log data for now
    navigate('/doctors'); // Navigate to doctors page after submission
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate('/doctors')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Doctors
      </button>

      <div className="bg-white rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6">
          {initialData ? 'Update Doctor' : 'Add New Doctor'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <TextInput
              label="First Name"
              id="firstName"
              required
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="Enter first name"
            />
            <TextInput
              label="Last Name"
              id="lastName"
              required
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="Enter last name"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <SelectInput
              label="Department"
              id="departmentId"
              required
              value={departments.find(d => d.id === formData.departmentId)?.name || ''}
              options={departmentNames}
              onChange={(e) => {
                const selectedDept = departments.find(d => d.name === e.target.value);
                handleInputChange('departmentId', selectedDept ? selectedDept.id : 0);
              }}
            />
            <SelectInput
              label="Specialization"
              id="specialization"
              required
              value={formData.specialization}
              options={specializations}
              onChange={(e) => handleInputChange('specialization', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <SelectInput
              label="Status"
              id="status"
              required
              value={formData.status}
              options={['Available', 'On Leave', 'In Surgery']}
              onChange={(e) => handleInputChange('status', e.target.value)}
            />
            <TextInput
              label="Date of Joining"
              id="dateOfJoining"
              type="date"
              required
              value={formData.dateOfJoining}
              onChange={(e) => handleInputChange('dateOfJoining', e.target.value)}
            />
          </div>

          <FileInput
            label="Upload Profile Picture"
            id="image"
            onChange={handleImageChange}
            photo={formData.image ? URL.createObjectURL(formData.image) : ''}
          />

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/doctors')}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              {initialData ? 'Update Doctor' : 'Add Doctor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
