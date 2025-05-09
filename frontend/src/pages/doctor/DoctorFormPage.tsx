import React, { useState, useEffect, useContext, useRef } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TextInput, SelectInput, TextArea } from '../../components/FormComponents';
import DoctorService from '../../services/DoctorService';
import DepartmentService from '../../services/DepartmentService';
import { ToastContext } from '../../context/ToastContext';

interface DoctorFormProps {
  initialData?: Doctor;
}

export function DoctorFormPage({ initialData }: DoctorFormProps) {
  const navigate = useNavigate();
  const { success, error } = useContext(ToastContext);
  const [departments, setDepartments] = useState<{ DepartmentID: number; DepartmentName: string }[]>([]);
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.Email || '', 
    address: initialData?.Address || '', 
    dob: initialData?.DOB || '', 
    contactNumber: initialData?.ContactNumber || '', 
    departmentId: initialData?.DepartmentID || 0, 
    specialization: initialData?.Specialization || '', 
    status: initialData?.['Employeement Status'] || 'Active', 
    dateOfJoining: initialData?.['Date of join'] || '', 
    image: initialData?.Photo || null,
    password: '', // Temporary password
    accountType: 'Doctor',
    isActive: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Ref for file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Hardcoded specialization options
  const specializationOptions = [
    'Cardiology',
    'Neurology',
    'Oncology',
    'Pediatrics',
    'Orthopedics',
    'Dermatology',
    'Psychiatry',
    'Gastroenterology',
    'General Surgery',
    'Endocrinology',
    'Radiology',
    'Urology',
    'Pulmonology',
    'Nephrology',
    'Rheumatology',
    'Hematology',
    'Infectious Diseases',
    'Plastic Surgery',
    'Ophthalmology',
  ];

  useEffect(() => {
    DepartmentService.fetchDepartments().then(setDepartments);
  }, []);

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));

    // Display preview if an image is selected
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleClearImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the file input
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = new FormData();
    form.append('Name', formData.firstName + ' ' + formData.lastName);
    form.append('Email', formData.email);
    form.append('Password', formData.password);
    form.append('Address', formData.address);
    form.append('DOB', formData.dob);
    form.append('ContactNumber', formData.contactNumber);
    form.append('AccountType', formData.accountType);
    form.append('isActive', formData.isActive.toString());
    form.append('Specialization', formData.specialization);
    form.append('Status', formData.status);
    form.append('DOJ', formData.dateOfJoining);
    form.append('DepartmentID', formData.departmentId.toString());

    if (formData.image) {
      form.append('Photo', formData.image);
    }

    try {
      await DoctorService.createDoctor(form);
      success('Doctor added successfully!');

      // Reset form fields for new entry
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        dob: '',
        contactNumber: '',
        departmentId: 0,
        specialization: '',
        status: 'Active',
        dateOfJoining: '',
        image: null,
        password: '',
        accountType: 'Doctor',
        isActive: true
      });
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Clear the file input field after submission
      }
    } catch (err) {
      setIsSubmitting(false);
      if (err.response) {
        const serverMessage = err.response.data?.message || 'An error occurred. Please try again.';
        error(serverMessage);
      } else if (err instanceof Error) {
        error(err.message);
      } else {
        error('Failed to submit doctor data. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
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
          Add New Doctor
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <TextInput label="First Name" id="firstName" required value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} placeholder="Enter first name" />
            <TextInput label="Last Name" id="lastName" required value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} placeholder="Enter last name" />
            <TextInput label="Email" id="email" required value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="Enter email" />
            <TextInput label="Temporary Password" id="password" type="password" required value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} placeholder="Enter temporary password" />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <TextArea label="Address" id="address" required value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} placeholder="Enter address" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <TextInput label="Date of Birth" id="dob" type="date" required value={formData.dob} onChange={(e) => handleInputChange('dob', e.target.value)} />
            <TextInput label="Contact Number" id="contactNumber" required value={formData.contactNumber} onChange={(e) => handleInputChange('contactNumber', e.target.value)} placeholder="Enter contact number" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <SelectInput label="Department" id="departmentId" required value={departments.find(d => d.DepartmentID === formData.departmentId)?.DepartmentName || ''}
              options={departments.map(d => d.DepartmentName)}
              onChange={(e) => {
                const selectedDept = departments.find(d => d.DepartmentName === e.target.value);
                handleInputChange('departmentId', selectedDept ? selectedDept.DepartmentID : 0);
              }}
            />
            <TextInput label="Account Type" id="accountType" value={formData.accountType} disabled={true} />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <TextInput label="Date of Joining" id="dateOfJoining" type="date" required value={formData.dateOfJoining} onChange={(e) => handleInputChange('dateOfJoining', e.target.value)} />
          </div>

          {/* Specialization Dropdown */}
          <SelectInput
            label="Specialization"
            id="specialization"
            required
            value={formData.specialization}
            options={specializationOptions}
            onChange={(e) => handleInputChange('specialization', e.target.value)}
          />

          {/* Custom file input for image upload */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Upload Profile Picture</label>
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*"  title='Upload Profile Picture'/>
          </div>

          {/* Display image preview if an image is selected */}
          {imagePreview && (
            <div className="relative mt-4">
              <img src={imagePreview} alt="Selected Profile" className="w-24 h-24 rounded-lg object-cover" />
              <button
                type="button"
                onClick={handleClearImage}
                className="absolute top-0 right-0 bg-white text-red-500 rounded-full p-1 shadow-lg"
                aria-label="Clear selected image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

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
              disabled={isSubmitting}
              className={`px-4 py-2 ${isSubmitting ? 'bg-gray-500' : 'bg-indigo-600'} text-white rounded-lg hover:${isSubmitting ? '' : 'bg-indigo-700'}`}
            >
              {isSubmitting ? 'Submitting...' : 'Add Doctor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
