import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { TextInput } from '../../components/FormComponents';
import DepartmentService from '../../services/DepartmentService';
import { ToastContext } from '../../context/ToastContext';
import { SearchableSelect } from '../../components/SearchableSelect';
import DoctorService from '../../services/DoctorService';

interface DoctorOption {
  id: string;
  label: string;
}

export function DepartmentFormPage() {
  const navigate = useNavigate();
  const { departmentId } = useParams(); // Get departmentId from URL
  const { success, error } = useContext(ToastContext);

  const [formData, setFormData] = useState({
    departmentName: '',
    hod: '',
    departmentID: 0, // For existing department, we'll populate this ID
  });

  const [doctors, setDoctors] = useState<DoctorOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorList = await DoctorService.fetchDoctors();
        setDoctors(doctorList.map((doctor) => ({
          id: doctor.DoctorID.toString(), // Convert DoctorID to string
          label: `${doctor.Name} - ${doctor.Specialization}`, // Concatenate Name and Specialization
        })));
      } catch (err) {
        error('Failed to load doctors');
        console.error(err);
      }
    };
    fetchDoctors();
  
    // If departmentId exists, fetch department details
    if (departmentId) {
      const fetchDepartments = async () => {
        try {
          const departments = await DepartmentService.fetchDepartments();
          const department = departments.find(d => d.DepartmentID.toString() === departmentId);
  
          if (department) {
            setFormData({
              departmentID: department.DepartmentID,
              departmentName: department.DepartmentName,
              hod: department.HOD_Name, // Assuming this is the HOD Name or ID
            });
          } else {
            error('Department not found');
          }
        } catch (err) {
          error('Failed to fetch departments');
          console.error(err);
        }
      };
      fetchDepartments();
    }
  }, [departmentId, error]);
  
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (formData.departmentID) {
        // Update the department
        await DepartmentService.updateDepartment({
          departmentID: formData.departmentID,
          newDepartmentName: formData.departmentName,
          newHOD: Number(formData.hod),
        });
        success('Department updated successfully!');
      } else {
        // Add new department
        await DepartmentService.addDepartment({
          departmentName: formData.departmentName,
          hod: Number(formData.hod),
        });
        success('Department added successfully!');
      }

      navigate('/departments');
    } catch (err) {
      if (err instanceof Error) {
        error(err.message);
      } else {
        error('Failed to submit department data. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/departments')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Departments
      </button>

      <h2 className="text-xl font-bold mb-6">{departmentId ? 'Update Department' : 'Add New Department'}</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <TextInput
          label="Department Name"
          id="departmentName"
          required
          value={formData.departmentName}
          onChange={(e) => handleInputChange('departmentName', e.target.value)}
          placeholder="Enter department name"
        />

        <SearchableSelect
          label="Head of Department"
          options={doctors}
          value={formData.hod}
          onChange={(value) => handleInputChange('hod', value)}
          placeholder="Select a doctor"
        />

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/departments')}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 ${isSubmitting ? 'bg-gray-500' : 'bg-indigo-600'} text-white rounded-lg hover:${isSubmitting ? '' : 'bg-indigo-700'}`}
          >
            {isSubmitting ? 'Submitting...' : departmentId ? 'Update Department' : 'Add Department'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DepartmentFormPage;
