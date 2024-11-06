// src/services/MedicalHistoryService.ts
export interface MedicalHistory {
    MedicalHistoryID: number;
    PatientID: number;
    Diagnosis: string;
    TreatmentHistory: string;
    Allergies: string;
    PreviousSurgeries: string;
    FamilyHistory: string;
  }
  
  class MedicalHistoryService {
    private baseUrl = `${import.meta.env.VITE_API_URL}/medical-history`;
  
    // Fetch medical history by Patient ID
    async fetchMedicalHistoryByPatientId(patientId: number): Promise<MedicalHistory> {
      try {
        const response = await fetch(`${this.baseUrl}/${patientId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch medical history');
        }
        const data = await response.json();
        if (Array.isArray(data) && data[0].length > 0) {
          return data[0][0];
        }
        throw new Error('Medical history not found');
      } catch (error) {
        console.error('Error fetching medical history by patient ID:', error);
        throw error;
      }
    }
  
    // Add new medical history for a patient
    async addMedicalHistory(patientId: number, medicalHistory: Omit<MedicalHistory, 'MedicalHistoryID' | 'PatientID'>): Promise<void> {
      try {
        const response = await fetch(`${this.baseUrl}/add-mh/patient/${patientId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(medicalHistory),
        });
        if (!response.ok) {
          throw new Error('Failed to add medical history');
        }
      } catch (error) {
        console.error('Error adding medical history:', error);
        throw error;
      }
    }
  
    // Update medical history for a patient
    async updateMedicalHistory(patientId: number, medicalHistory: Omit<MedicalHistory, 'MedicalHistoryID' | 'PatientID'>): Promise<void> {
      try {
        const response = await fetch(`${this.baseUrl}/update-mh/patient/${patientId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(medicalHistory),
        });
        if (!response.ok) {
          throw new Error('Failed to update medical history');
        }
      } catch (error) {
        console.error('Error updating medical history:', error);
        throw error;
      }
    }
  }
  
  export default new MedicalHistoryService();
  