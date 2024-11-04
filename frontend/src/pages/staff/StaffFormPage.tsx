import React, { ChangeEvent, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TextInput, SelectInput, TextArea, FileInput } from '../../components/FormComponents';

interface Staff {
  id?: number;
  name: string;
  email: string;
  contactNumber: string;
  address: string;
  accountType: string;
  dob: string;
  photo: string;
}

interface StaffFormProps {
  initialData?: Staff;
}

export function StaffFormPage({ initialData }: StaffFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: initialData?.name.split(' ')[0] || '',
    lastName: initialData?.name.split(' ')[1] || '',
    email: initialData?.email || '',
    contactNumber: initialData?.contactNumber || '',
    address: initialData?.address || '',
    accountType: initialData?.accountType || '',
    dob: initialData?.dob || '',
    password: '',
    confirmPassword: '',
    photo: initialData?.photo || '',
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/staff');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate('/staff')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Staff List
      </button>

      <div className="bg-white rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6">
          {initialData ? 'Update Staff Member' : 'Add New Staff Member'}
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
              label="Email"
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter email"
            />
            <TextInput
              label="Contact Number"
              id="contactNumber"
              type="tel"
              required
              value={formData.contactNumber}
              onChange={(e) => handleInputChange('contactNumber', e.target.value)}
              placeholder="Enter contact number"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <SelectInput
              label="Role"
              id="accountType"
              required
              value={formData.accountType}
              options={[
                "Receptionist",
                "Lab Assistant",
                "Pharmacist",
                "Nurse",
                "Admin Staff"
              ]}
              onChange={(e) => handleInputChange('accountType', e.target.value)}
            />
            <TextInput
              label="Date of Birth"
              id="dob"
              type="date"
              required
              value={formData.dob}
              onChange={(e) => handleInputChange('dob', e.target.value)}
            />
          </div>

          <TextArea
            label="Address"
            id="address"
            required
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Enter address"
          />

          {!initialData && (
            <div className="grid grid-cols-2 gap-6">
              <TextInput
                label="Password"
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter password"
              />
              <TextInput
                label="Confirm Password"
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirm password"
              />
            </div>
          )}

          <FileInput
            label="Upload Profile Picture"
            id="photo"
            onChange={handleFileChange}
            photo={formData.photo}
          />

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/staff')}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              {initialData ? 'Update Staff' : 'Add Staff'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StaffFormPage;
