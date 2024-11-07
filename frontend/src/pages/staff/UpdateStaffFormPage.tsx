import React, { useState, useEffect, useContext, useRef } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextInput, SelectInput, TextArea } from '../../components/FormComponents';
import StaffService from '../../services/StaffService';
import { ToastContext } from '../../context/ToastContext';

const accountTypeOptions = [
  'Receptionist',
  'Lab Assistant',
  'Pharmacist',
  'Nurse',
  'Admin Staff',
];

const useStaffForm = (userId: string | undefined, error: (msg: string) => void) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    dob: '',
    contactNumber: '',
    accountType: '',
    isActive: true,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      const userIdNumber = Number(userId);
      if (isNaN(userIdNumber)) {
        error('Invalid user ID.');
        return;
      }

      StaffService.fetchStaffById(userIdNumber)
        .then((staff) => {
          if (staff) {
            const [firstName, ...lastName] = staff.Name.split(' ');
            setFormData({
              firstName,
              lastName: lastName.join(' '),
              address: staff.Address || '',
              dob: staff.DOB.split('T')[0],
              contactNumber: staff.ContactNumber || '',
              accountType: staff.AccountType || '',
              isActive: staff.isActive === 1,
            });
            setImagePreview(staff.Photo || null);
          } else {
            error('Staff not found.');
          }
        })
        .catch(() => error('Failed to load staff details.'));
    }
  }, [userId, error]);

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
    setImagePreview(null);
  };

  return {
    formData,
    setFormData,
    imagePreview,
    handleInputChange,
    handleImageChange,
    handleClearImage,
  };
};

const UpdateStaffFormPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { success, error } = useContext(ToastContext);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    formData,
    imagePreview,
    handleInputChange,
    handleImageChange,
    handleClearImage,
  } = useStaffForm(userId, error);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    if (!userId || isNaN(Number(userId))) {
      error('Invalid user ID.');
      setIsSubmitting(false);
      return;
    }
  
    const updatedData = {
      Name: `${formData.firstName} ${formData.lastName}`.trim(),
      Address: formData.address,
      DOB: formData.dob,
      ContactNumber: formData.contactNumber,
      AccountType: formData.accountType,
      isActive: formData.isActive ? 'true' : 'false',
    };
  
    try {
      await StaffService.updateStaff(Number(userId), updatedData);
      success('Staff updated successfully!');
      // Removed navigate call so we don't redirect
    } catch (err) {
      error('Failed to update staff data. Please try again.');
      console.error('Error updating staff:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const handleUpdateImage = async () => {
    if (fileInputRef.current?.files?.[0] && userId) {
      const imageData = new FormData();
      imageData.append('Photo', fileInputRef.current.files[0]);

      setIsSubmitting(true);

      try {
        await StaffService.updateStaffImage(Number(userId), imageData);
        success('Profile picture updated successfully!');
      } catch (err) {
        error('Failed to update profile picture. Please try again.');
        console.error('Error updating profile picture:', err);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      error('No image selected or User ID not found');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate('/staff')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Staff
      </button>

      <div className="bg-white rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6">Update Staff</h2>
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
              label="Account Type"
              id="accountType"
              required
              value={formData.accountType}
              options={accountTypeOptions}
              onChange={(e) => handleInputChange('accountType', e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate('/staff')}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 ${isSubmitting ? 'bg-gray-500' : 'bg-indigo-600'} text-white rounded-lg hover:bg-indigo-700`}
            >
              {isSubmitting ? 'Submitting...' : 'Update Staff'}
            </button>
          </div>
        </form>
      </div>

      {/* Image Upload Section */}
      <div className="bg-white rounded-xl p-6 mt-6">
        <h2 className="text-xl font-bold mb-6">Update Profile Picture</h2>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          title="Select image"
        />

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
            className={`px-4 py-2 ${isSubmitting ? 'bg-gray-500' : 'bg-indigo-600'} text-white rounded-md hover:bg-indigo-700`}
          >
            {isSubmitting ? 'Updating...' : 'Update Profile Picture'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateStaffFormPage;
