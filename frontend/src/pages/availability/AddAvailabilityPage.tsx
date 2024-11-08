import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AvailabilityService from '../../services/AvailabilityService';
import { ToastContext } from '../../context/ToastContext';
import { ArrowLeft } from 'lucide-react';

const AddAvailabilityPage: React.FC = () => {
  const { success, error } = React.useContext(ToastContext);
  const navigate = useNavigate();
  const { doctorId } = useParams();  // Get DoctorID from the URL

  const [formData, setFormData] = useState({
    DoctorID: doctorId ? Number(doctorId) : 0,
    RoomNO: 0,
    AvailableDay: '',
    StartTime: '',
    EndTime: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (doctorId) {
      setFormData((prev) => ({
        ...prev,
        DoctorID: Number(doctorId),  // Automatically set DoctorID from the URL
      }));
    }
  }, [doctorId]);

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    // Log the form data being submitted
    console.log('Form Data Submitted:', formData);
  
    try {
      await AvailabilityService.addAvailability(formData);
  
      success('Availability added successfully!');
      navigate('/dashboard');
    } catch (err) {
      // Handle error, check the response
      if (err.response && err.response.status === 409) {
        console.error('Conflict error:', err.response.data);  // Log detailed error message from the backend
        error(`Conflict Error: ${err.response.data.message || 'This availability slot already exists.'}`);
      } else {
        console.error('Error adding availability:', err);
        error('Failed to add availability. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Add Availability Slot</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Doctor ID is now hidden */}
          <div className="space-y-2">
            <label htmlFor="RoomNO" className="block text-sm font-medium text-gray-700">
              Room Number
            </label>
            <input
              type="number"
              id="RoomNO"
              value={formData.RoomNO}
              onChange={(e) => handleInputChange('RoomNO', parseInt(e.target.value))}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter Room Number"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="AvailableDay" className="block text-sm font-medium text-gray-700">
              Available Day
            </label>
            <input
              type="text"
              id="AvailableDay"
              value={formData.AvailableDay}
              onChange={(e) => handleInputChange('AvailableDay', e.target.value)}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter Available Day"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="StartTime" className="block text-sm font-medium text-gray-700">
              Start Time
            </label>
            <input
              type="time"
              id="StartTime"
              value={formData.StartTime}
              onChange={(e) => handleInputChange('StartTime', e.target.value)}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="EndTime" className="block text-sm font-medium text-gray-700">
              End Time
            </label>
            <input
              type="time"
              id="EndTime"
              value={formData.EndTime}
              onChange={(e) => handleInputChange('EndTime', e.target.value)}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 ${isSubmitting ? 'bg-gray-500' : 'bg-indigo-600'} text-white rounded-lg hover:bg-indigo-700`}
            >
              {isSubmitting ? 'Submitting...' : 'Add Availability'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAvailabilityPage;
