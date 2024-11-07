import React, { useState, useEffect, useContext, useRef } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextInput, SelectInput, TextArea } from '../../components/FormComponents';
import DoctorService from '../../services/DoctorService';
import DepartmentService from '../../services/DepartmentService';
import { ToastContext } from '../../context/ToastContext';

export function UpdateDoctorFormPage() {
  const { doctorId, userId } = useParams<{ doctorId: string; userId: string }>();
  console.log('Doctor ID from URL:', doctorId);
  console.log('User ID from URL:', userId);

  const navigate = useNavigate();
  const { success, error } = useContext(ToastContext);

  const [departments, setDepartments] = useState<{ DepartmentID: number; DepartmentName: string }[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    dob: '',
    contactNumber: '',
    specialization: '',
    status: 'Active',
    departmentId: 0,
    isActive: true,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Fetch departments from the service
    DepartmentService.fetchDepartments().then(setDepartments);

    if (doctorId) {
      const doctorIdNumber = Number(doctorId);
      if (isNaN(doctorIdNumber)) {
        error('Invalid doctor ID.');
        return;
      }

      console.log('Doctor ID before fetching doctor data:', doctorIdNumber);

      DoctorService.fetchDoctorById(doctorIdNumber)
        .then((doctor) => {
          console.log('Fetched doctor data:', doctor);

          if (!doctor || Object.keys(doctor).length === 0) {
            error('No doctor data found for the given ID.');
            return;
          }

          // Split the full name into firstName and lastName
          const nameParts = doctor.Name ? doctor.Name.split(' ') : [''];
          const firstName = nameParts[0];
          const lastName = nameParts.slice(1).join(' ');

          setFormData({
            firstName: firstName || '',
            lastName: lastName || '',
            address: doctor.Address || '',
            dob: doctor.DOB ? doctor.DOB.split('T')[0] : '',
            contactNumber: doctor.ContactNumber || '',
            specialization: doctor.Specialization || '',
            status: doctor['Employeement Status'] || 'Active',
            departmentId: doctor.DepartmentID || 0,
            isActive: doctor.isActive !== undefined ? Boolean(doctor.isActive) : true,
          });
          setImagePreview(doctor.Photo || null);
        })
        .catch((err) => {
          error('Failed to load doctor details.');
          console.error('Error fetching doctor data:', err);
        });
    } else {
      error('No doctor ID provided in URL.');
    }
  }, [doctorId, error]);

  // Handle department change
  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDeptName = e.target.value;
    const selectedDept = departments.find((d) => d.DepartmentName === selectedDeptName);
    if (selectedDept) {
      setFormData((prevData) => ({
        ...prevData,
        departmentId: selectedDept.DepartmentID,
      }));
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setImagePreview(null);
  };

  const handleUpdateImage = async () => {
    if (fileInputRef.current?.files?.[0] && userId) {
      const imageData = new FormData();
      imageData.append('Photo', fileInputRef.current.files[0]);

      setIsSubmitting(true);

      try {
        await DoctorService.updateDoctorImage(Number(userId), imageData); // Use UserID for image update
        success('Profile picture updated successfully!');
      } catch (err) {
        error('Failed to update profile picture. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      error('No image selected or User ID not found');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!userId) {
      error('User ID not found.');
      setIsSubmitting(false);
      return;
    }

    const userIdNumber = Number(userId);
    if (isNaN(userIdNumber)) {
      error('Invalid user ID.');
      setIsSubmitting(false);
      return;
    }

    const updatedData = {
      Name: `${formData.firstName} ${formData.lastName}`.trim(),
      Address: formData.address,
      DOB: formData.dob,
      ContactNumber: formData.contactNumber,
      AccountType: 'Doctor',
      isActive: formData.isActive.toString(),
      Specialization: formData.specialization,
      Status: formData.status,
      DepartmentID: formData.departmentId,
    };

    console.log('Submitting updated data:', updatedData);

    try {
      await DoctorService.updateDoctor(userIdNumber, updatedData); // Use userId for update
      success('Doctor updated successfully!');
    } catch (err) {
      error('Failed to update doctor data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <h2 className="text-xl font-bold mb-6">Update Doctor</h2>

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
            <TextInput
              label="Date of Birth"
              id="dob"
              type="date"
              required
              value={formData.dob}
              onChange={(e) => handleInputChange('dob', e.target.value)}
            />
            <TextInput
              label="Contact Number"
              id="contactNumber"
              required
              value={formData.contactNumber}
              onChange={(e) => handleInputChange('contactNumber', e.target.value)}
              placeholder="Enter contact number"
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

          <div className="grid grid-cols-2 gap-6">
            <SelectInput
              label="Department"
              id="departmentId"
              required
              value={
                departments.find((d) => d.DepartmentID === formData.departmentId)?.DepartmentName ||
                ''
              }
              options={departments.map((d) => d.DepartmentName)}
              onChange={handleDepartmentChange}
            />

            <SelectInput
              label="Status"
              id="status"
              required
              value={formData.status}
              options={['Active', 'On Leave']}
              onChange={(e) => handleInputChange('status', e.target.value)}
            />
          </div>

          <SelectInput
            label="Specialization"
            id="specialization"
            required
            value={formData.specialization}
            options={specializationOptions}
            onChange={(e) => handleInputChange('specialization', e.target.value)}
          />

          <div className="flex justify-end gap-4 mt-6">
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
              className={`px-4 py-2 ${
                isSubmitting ? 'bg-gray-500' : 'bg-indigo-600'
              } text-white rounded-lg hover:${isSubmitting ? '' : 'bg-indigo-700'}`}
            >
              {isSubmitting ? 'Submitting...' : 'Update Doctor'}
            </button>
          </div>
        </form>
      </div>

      {/* Image Upload Section */}
      <div className="bg-white rounded-xl p-6 mt-6">
        <h2 className="text-xl font-bold mb-6">Update Profile Picture</h2>

        <div className="space-y-4 mt-12">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            title="Select image"
          />
        </div>

        {imagePreview && (
          <div className="relative mt-4">
            <img
              src={imagePreview}
              alt="Selected Profile"
              className="w-24 h-24 rounded-lg object-cover"
            />
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

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={handleUpdateImage}
            disabled={isSubmitting}
            className={`px-4 py-2 ${
              isSubmitting ? 'bg-gray-500' : 'bg-indigo-600'
            } text-white rounded-md hover:${isSubmitting ? '' : 'bg-indigo-700'}`}
          >
            {isSubmitting ? 'Updating...' : 'Update Profile Picture'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateDoctorFormPage;
