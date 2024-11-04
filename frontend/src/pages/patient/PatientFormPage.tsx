import React, { useContext, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TextInput, SelectInput, TextArea } from '../../components/FormComponents';
import PatientService from '../../services/PatientService';
import { ToastContext } from '../../context/ToastContext';

interface PatientFormProps {
  initialData?: {
    name: string;
    dob: string;
    gender: string;
    phone: string;
    address: string;
    cnic: string;
  };
}

export function PatientFormPage({ initialData }: PatientFormProps) {
  const navigate = useNavigate();
  const { success, error } = useContext(ToastContext);
  const [formData, setFormData] = useState({
    firstName: initialData?.name.split(' ')[0] || '',
    lastName: initialData?.name.split(' ')[1] || '',
    dob: initialData?.dob || '',
    gender: initialData?.gender || '',
    contactNumber: initialData?.phone || '',
    address: initialData?.address || '',
    cnic: initialData?.cnic || '',
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await PatientService.addPatient({
        FirstName: formData.firstName,
        LastName: formData.lastName,
        DOB: formData.dob,
        Gender: formData.gender === 'Male' ? 'M' : 'F',
        ContactNumber: formData.contactNumber,
        Address: formData.address,
        CNIC: formData.cnic,
        isActive: true,
      });
      success('Patient added successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        dob: '',
        gender: '',
        contactNumber: '',
        address: '',
        cnic: '',
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        error(err.message);
      } else {
        error('Failed to add patient. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate('/patients')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Patients
      </button>

      <div className="bg-white rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6">
          {initialData ? 'Update Patient' : 'Register New Patient'}
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
            <TextInput
              label="Date of Birth"
              id="dob"
              type="date"
              required
              value={formData.dob}
              onChange={(e) => handleInputChange('dob', e.target.value)}
            />
            <SelectInput
              label="Gender"
              id="gender"
              required
              value={formData.gender}
              options={['Male', 'Female']}
              onChange={(e) => handleInputChange('gender', e.target.value)}
            />
          </div>

          <TextInput
            label="Contact Number"
            id="contactNumber"
            type="tel"
            required
            value={formData.contactNumber}
            onChange={(e) => handleInputChange('contactNumber', e.target.value)}
            placeholder="Enter contact number"
          />

          <TextArea
            label="Address"
            id="address"
            required
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Enter address"
          />

          <TextInput
            label="CNIC"
            id="cnic"
            required
            value={formData.cnic}
            onChange={(e) => handleInputChange('cnic', e.target.value)}
            placeholder="Enter CNIC"
          />

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/patients')}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              {initialData ? 'Update Patient' : 'Register Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PatientFormPage;
