// src/pages/lab/LabTestFormPage.tsx
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { TextInput } from '../../components/FormComponents';
import LabTestService from '../../services/LabTestService';
import { ToastContext } from '../../context/ToastContext';

const LabTestFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id: labTestId } = useParams<{ id: string }>(); // Get labTestId from the route if available
  const { success, error } = useContext(ToastContext);

  const [formData, setFormData] = useState({
    testName: '',
    processingTime: '',
    cost: '',
  });
  const [initialFormData, setInitialFormData] = useState(formData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    if (field === 'processingTime') {
      const sanitizedValue = value.replace(/[^0-9]/g, '');
      const formattedValue = sanitizedValue
        .slice(0, 6)
        .replace(/(\d{2})(\d{2})?(\d{2})?/, (_match, p1, p2, p3) =>
          `${p1}${p2 ? ':' + p2 : ''}${p3 ? ':' + p3 : ''}`
        );
      setFormData((prev) => ({ ...prev, [field]: formattedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Fetch lab test data if labTestId is present (i.e., we are editing an existing lab test)
  useEffect(() => {
    const loadLabTestData = async () => {
      if (labTestId) {
        try {
          const labTest = await LabTestService.fetchLabTestById(Number(labTestId));
          const newFormData = {
            testName: labTest.TestName,
            processingTime: labTest.ProcessingTime,
            cost: labTest.Cost.toString(),
          };
          setFormData(newFormData);
          setInitialFormData(newFormData); // Set initial data for change detection
        } catch (err) {
          error('Failed to load lab test details.');
          console.error(err);
        }
      }
    };
    loadLabTestData();
  }, [labTestId, error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent submission if data hasn't changed
    if (JSON.stringify(formData) === JSON.stringify(initialFormData)) {
      error('No changes detected');
      return;
    }

    setIsSubmitting(true);
    try {
      if (labTestId) {
        // Update existing lab test
        await LabTestService.updateLabTest(Number(labTestId), {
          TestName: formData.testName,
          ProcessingTime: formData.processingTime,
          Cost: parseFloat(formData.cost),
        });
        success('Lab Test updated successfully!');
      } else {
        // Add new lab test
        await LabTestService.addLabTest({
          TestName: formData.testName,
          ProcessingTime: formData.processingTime,
          Cost: parseFloat(formData.cost),
        });
        success('Lab Test added successfully!');
        // Clear form for adding new entries
        setFormData({ testName: '', processingTime: '', cost: '' });
        setInitialFormData({ testName: '', processingTime: '', cost: '' });
      }
      navigate('/labtests');
    } catch (err) {
      error(`Failed to ${labTestId ? 'update' : 'add'} lab test. Please try again.`);
      console.error(`Error ${labTestId ? 'updating' : 'adding'} lab test:`, err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate('/labtests')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Lab Tests
      </button>

      <div className="bg-white rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6">{labTestId ? 'Update Lab Test' : 'Add New Lab Test'}</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <TextInput
            label="Test Name"
            id="testName"
            required
            value={formData.testName}
            onChange={(e) => handleInputChange('testName', e.target.value)}
            placeholder="Enter test name"
          />

          <TextInput
            label="Processing Time"
            id="processingTime"
            required
            value={formData.processingTime}
            onChange={(e) => handleInputChange('processingTime', e.target.value)}
            placeholder="Enter processing time (hh:mm:ss)"
          />

          <TextInput
            label="Cost"
            id="cost"
            type="number"
            required
            value={formData.cost}
            onChange={(e) => handleInputChange('cost', e.target.value)}
            placeholder="Enter cost"
          />

          <div className="flex justify-end gap-4">
            <button type="button" onClick={() => navigate('/labtests')} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 ${isSubmitting ? 'bg-gray-500' : 'bg-indigo-600'} text-white rounded-lg ${
                isSubmitting ? '' : 'hover:bg-indigo-700'
              }`}
            >
              {isSubmitting ? (labTestId ? 'Updating...' : 'Submitting...') : labTestId ? 'Update Lab Test' : 'Add Lab Test'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LabTestFormPage;
