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

   // Fetch all patients
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

// Fetch patient by ID
async fetchPatientById(patientId: number): Promise<Patient> {
    try {
        const response = await fetch(`${this.baseUrl}/${patientId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch patient details');
        }
        const data = await response.json();
        if (Array.isArray(data) && data[0].length > 0) {
            return data[0][0]; // Access the nested patient data array
        }
        throw new Error('Patient not found');
    } catch (error) {
        console.error('Error fetching patient by ID:', error);
        throw error;
    }
}

// Add a new patient
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

// Update patient details
async updatePatient(patientId: number, patientData: Omit<Patient, 'PatientID'>): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${patientId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update patient');
    }
}

// Delete patient by ID
async deletePatient(patientId: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${patientId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete patient');
    }
}
}

export default new PatientService();
