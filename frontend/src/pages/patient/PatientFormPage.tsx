import React, { useContext, useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
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
  const { id: patientId } = useParams<{ id: string }>(); // Get patientId from the route if available
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
  const [initialFormData, setInitialFormData] = useState(formData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function to format date to YYYY-MM-DD for input
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Populate formData if editing an existing patient
  useEffect(() => {
    const loadPatientData = async () => {
      if (patientId) {
        try {
          const patient = await PatientService.fetchPatientById(Number(patientId));
          const newFormData = {
            firstName: patient.FirstName,
            lastName: patient.LastName,
            dob: formatDate(patient.DOB),
            gender: patient.Gender === 'M' ? 'Male' : 'Female',
            contactNumber: patient.ContactNumber,
            address: patient.Address,
            cnic: patient.CNIC,
          };
          setFormData(newFormData);
          setInitialFormData(newFormData); // Set initial form data for change detection
        } catch (err) {
          error('Failed to load patient details.');
          console.error(err);
        }
      }
    };
    loadPatientData();
  }, [patientId, error]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent submission if data hasn't changed
    if (JSON.stringify(formData) === JSON.stringify(initialFormData)) {
      error('No changes detected');
      return;
    }

    setIsSubmitting(true);

    try {
      if (patientId) {
        // Update existing patient
        await PatientService.updatePatient(Number(patientId), {
          FirstName: formData.firstName,
          LastName: formData.lastName,
          DOB: formData.dob,
          Gender: formData.gender === 'Male' ? 'M' : 'F',
          ContactNumber: formData.contactNumber,
          Address: formData.address,
          CNIC: formData.cnic,
          isActive: true,
        });
        success('Patient updated successfully!');
      } else {
        // Add new patient
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
        // Clear form for adding new entries
        setFormData({
          firstName: '',
          lastName: '',
          dob: '',
          gender: '',
          contactNumber: '',
          address: '',
          cnic: '',
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        error(err.message);
      } else {
        error('Failed to submit patient data. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for the max attribute
  const today = new Date().toISOString().split('T')[0];

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
          {patientId ? 'Update Patient' : 'Register New Patient'}
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
              max={today}
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
              disabled={isSubmitting}
              className={`px-4 py-2 ${isSubmitting ? 'bg-gray-500' : 'bg-indigo-600'} text-white rounded-lg hover:${isSubmitting ? '' : 'bg-indigo-700'}`}
            >
              {isSubmitting ? (patientId ? 'Updating...' : 'Submitting...') : (patientId ? 'Update Patient' : 'Register Patient')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PatientFormPage;
