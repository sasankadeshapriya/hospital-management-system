// src/pages/medical-history/MedicalHistoryFormPage.tsx
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextInput, TextArea } from '../../components/FormComponents';
import MedicalHistoryService from '../../services/MedicalHistoryService';
import { ToastContext } from '../../context/ToastContext';
import { ArrowLeft } from 'lucide-react';

const MedicalHistoryFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { success, error } = useContext(ToastContext);
  const { id: patientId } = useParams<{ id: string }>();

  const [formData, setFormData] = useState({
    diagnosis: '',
    treatmentHistory: '',
    allergies: '',
    previousSurgeries: '',
    familyHistory: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadMedicalHistory = async () => {
      if (!patientId) return;

      try {
        const medicalHistory = await MedicalHistoryService.fetchMedicalHistoryByPatientId(Number(patientId));
        setFormData({
          diagnosis: medicalHistory.Diagnosis,
          treatmentHistory: medicalHistory.TreatmentHistory,
          allergies: medicalHistory.Allergies,
          previousSurgeries: medicalHistory.PreviousSurgeries,
          familyHistory: medicalHistory.FamilyHistory,
        });
        setIsUpdating(true);
      } catch (err) {
        console.error('No existing medical history for this patient. Ready to add new record.');
        console.error('Error loading medical history:', err);
      }
    };
    loadMedicalHistory();
  }, [patientId]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) return;

    setIsSubmitting(true);
    const action = isUpdating ? 'updateMedicalHistory' : 'addMedicalHistory';
    const successMessage = isUpdating ? 'updated' : 'added';

    try {
      await MedicalHistoryService[action](Number(patientId), {
        Diagnosis: formData.diagnosis,
        TreatmentHistory: formData.treatmentHistory,
        Allergies: formData.allergies,
        PreviousSurgeries: formData.previousSurgeries,
        FamilyHistory: formData.familyHistory,
      });
      success(`Medical history ${successMessage} successfully!`);
      navigate(`/patient-details/${patientId}`);
    } catch (err) {
      error(`Failed to ${successMessage} medical history. Please try again.`);
      console.error(`Error ${successMessage} medical history:`, err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Patient Details
      </button>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">{isUpdating ? 'Update Medical History' : 'Add Medical History'}</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <TextInput
            label="Diagnosis"
            id="diagnosis"
            required
            value={formData.diagnosis}
            onChange={(e) => handleInputChange('diagnosis', e.target.value)}
            placeholder="Enter diagnosis"
          />

          <TextArea
            label="Treatment History"
            id="treatmentHistory"
            required
            value={formData.treatmentHistory}
            onChange={(e) => handleInputChange('treatmentHistory', e.target.value)}
            placeholder="Enter treatment history"
          />

          <TextInput
            label="Allergies"
            id="allergies"
            required
            value={formData.allergies}
            onChange={(e) => handleInputChange('allergies', e.target.value)}
            placeholder="Enter allergies"
          />

          <TextArea
            label="Previous Surgeries"
            id="previousSurgeries"
            required
            value={formData.previousSurgeries}
            onChange={(e) => handleInputChange('previousSurgeries', e.target.value)}
            placeholder="Enter previous surgeries"
          />

          <TextArea
            label="Family History"
            id="familyHistory"
            required
            value={formData.familyHistory}
            onChange={(e) => handleInputChange('familyHistory', e.target.value)}
            placeholder="Enter family history"
          />

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 ${isSubmitting ? 'bg-gray-500' : 'bg-indigo-600'} text-white rounded-lg hover:${isSubmitting ? '' : 'bg-indigo-700'}`}
            >
              {isSubmitting ? (isUpdating ? 'Updating...' : 'Submitting...') : (isUpdating ? 'Update Medical History' : 'Add Medical History')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicalHistoryFormPage;
