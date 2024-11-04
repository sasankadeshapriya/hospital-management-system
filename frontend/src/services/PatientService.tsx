// src/services/PatientService.tsx
export interface Patient {
    PatientID: number;
    FirstName: string;
    LastName: string;
    DOB: string;
    Gender: string;
    ContactNumber: string;
    Address: string;
    CNIC: string;
    isActive: number | boolean;
}

class PatientService {
    private baseUrl = `${import.meta.env.VITE_API_URL}/patients`;

    async fetchPatients(): Promise<Patient[]> {
        try {
            const response = await fetch(this.baseUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch patients');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching patients:', error);
            throw error;
        }
    }

    async addPatient(patientData: Omit<Patient, 'PatientID'>): Promise<void> {
        const response = await fetch(`${this.baseUrl}/add-patient`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(patientData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add patient');
        }
    }
}

export default new PatientService();
