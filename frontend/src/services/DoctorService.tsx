// src/services/DoctorService.ts

export interface Doctor {
  DoctorID: number;
  firstName: string;
  lastName: string;
  Specialization: string;
  'Employeement Status': string;
  'Date of join': string;
  Email: string;
  Address: string;
  Photo: string;
  DOB: string;
  ContactNumber: string;
  DepartmentID: number;
  DepartmentName: string;
  Availability: Array<{
    RoomNO: number;
    EndTime: string;
    StartTime: string;
    AvailableDay: string;
  }>;
}

  class DoctorService {
    private baseUrl = `${import.meta.env.VITE_API_URL}/doctors`;
    private baseUrl2 = `${import.meta.env.VITE_API_URL}/user`;

  // Fetch all doctors
  async fetchDoctors(): Promise<Doctor[]> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }
      const data = await response.json();
      return data; // Assuming data is an array of Doctor objects
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    }
  }
  
    // Fetch a specific doctor's availability by doctorId
    async fetchDoctorAvailability(doctorId: number): Promise<any[]> {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/doc-availability/doctor/${doctorId}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch doctor availability');
        }
        const data = await response.json();
        return data[0]; // Assuming availability is in the first element of the response array
      } catch (error) {
        console.error('Error fetching doctor availability:', error);
        throw error;
      }
    }
  
  // Fetch details of a doctor by their ID
  async fetchDoctorById(doctorId: number): Promise<Doctor> {
    try {
      const url = `${this.baseUrl}/${doctorId}`; // Use baseUrl and doctorId
      console.log('Fetching doctor data from URL:', url);
  
      const response = await fetch(url);
      console.log('API Response Status:', response.status);
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error('Failed to fetch doctor details');
      }
  
      const doctor: Doctor = await response.json();
      console.log('Doctor data fetched from API:', doctor);
  
      return doctor;
    } catch (error) {
      console.error('Error fetching doctor by ID:', error);
      throw error;
    }
  }
  

  // Create Doctor (Insert)
  async createDoctor(newDoctorData: FormData): Promise<any> {
    try {
      const response = await fetch('http://localhost:5000/api/v1/user' ,{
        method: 'POST',
        body: newDoctorData,
        headers: {
          'Accept': 'application/json',
        },
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create doctor');
      }
  
      return data;
    } catch (error) {
      console.error('Error creating doctor:', error);
      throw error;
    }
  }
  
  async updateDoctor(userId: number, updatedData: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl2}/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update doctor');
      }
  
      return data;
    } catch (error) {
      console.error('Error updating doctor:', error);
      throw error;
    }
  }
  
      
    // Update doctor profile image
    async updateDoctorImage(doctorId: number, imageData: FormData): Promise<any> {
      try {
        // Log the FormData to ensure image is correctly appended
        console.log('Uploading image for doctor:', doctorId);
        console.log('ImageData FormData:', imageData);

        const response = await fetch(`${this.baseUrl2}/photo/${doctorId}`, {
          method: 'PUT',
          body: imageData,
        });

        // Debug: Check the response status and text before parsing it
        console.log('Response Status:', response.status);
        const responseText = await response.text();
        console.log('Response Text:', responseText);  // Print raw response text
        
        // If response is not okay, handle error
        if (!response.ok) {
          throw new Error(responseText || 'Failed to update doctor image');
        }

        // Parse JSON response and return
        const data = JSON.parse(responseText);
        console.log('Response Data:', data);  // Log the parsed response data
        return data;
      } catch (error) {
        console.error('Error updating doctor image:', error);
        throw error;
      }
    }

  // Delete doctor using UserID
  async deleteDoctor(userId: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl2}/${userId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete doctor');
      }
  
      console.log('Doctor deleted successfully');
    } catch (error) {
      console.error('Error deleting doctor:', error);
      throw error;
    }
  }
}
  
  
  export default new DoctorService();
