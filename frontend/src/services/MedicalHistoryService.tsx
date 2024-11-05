// src/services/MedicalHistoryService.tsx
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
          return data[0][0]; // Access the medical history data
        }
        throw new Error('Medical history not found');
      } catch (error) {
        console.error('Error fetching medical history by patient ID:', error);
        throw error;
      }
    }
  }
  
  export default new MedicalHistoryService();
  