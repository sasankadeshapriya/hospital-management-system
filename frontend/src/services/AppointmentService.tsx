// src/services/AppointmentService.ts
export interface Appointment {
  D_AppointmentID: number;
  AppointmentDate: string;
  AppointmentTime: string;
  Status: 'Pending' | 'Confirmed' | 'Completed';
  'Patient Name': string;
  'Doctor Name': string;
  AppointmentType: 'Consultation' | 'Lab';
  RoomNO: string;
  QueueID: number;
  QueueNumber: number;
}

class AppointmentService {
  private baseUrl = `${import.meta.env.VITE_API_URL}/doc-appointments`;

  // Fetch all appointments
  async fetchAppointments(): Promise<Appointment[]> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  }

  // Fetch appointments by patient ID
  async fetchAppointmentsByPatientId(patientId: number): Promise<Appointment> {
    try {
      const response = await fetch(`${this.baseUrl}/patient/${patientId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch appointments by patient ID');
      }
      const data = await response.json();
      if (Array.isArray(data) && data[0].length > 0) {
        return data[0][0]; // Access the nested appointment data
      }
      throw new Error('No appointments found for this patient');
    } catch (error) {
      console.error('Error fetching appointments by patient ID:', error);
      throw error;
    }
  }

  // Count patients for each doctor
  async countPatientsByDoctor(doctorId: number): Promise<number> {
    try {
      const appointments = await this.fetchAppointments();
      return appointments.filter(app => app['Doctor Name'].includes(`Dr. ${doctorId}`)).length;
    } catch (error) {
      console.error(`Error counting patients for doctor ${doctorId}:`, error);
      throw error;
    }
  }

    // Fetch appointments by doctor ID
    async fetchAppointmentsByDoctorId(doctorId: number): Promise<Appointment[]> {
      try {
        const response = await fetch(`${this.baseUrl}/doctor/${doctorId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }
        const data = await response.json();
        return data[0]; // Assuming appointments are in the first element of the response array
      } catch (error) {
        console.error('Error fetching appointments:', error);
        throw error;
      }
    }

     // Create a new appointment
  async createAppointment(appointmentData: {
    AppointmentDate: string;
    AppointmentTime: string;
    Status: string;
    PatientID: number;
    DoctorID: number;
    AppointmentType: string;
    AvailabilityID: number; // This is added based on your requirement
  }): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/book-appointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        throw new Error('Failed to book appointment');
      }

      const responseData = await response.json();
      return responseData; // This will contain the response data from the API
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error; // You may want to propagate the error to the caller
    }
  }

    // Update appointment status
    async updateAppointmentStatus(appointmentId: number, status: 'Pending' | 'Confirmed'): Promise<any> {
      try {
        const response = await fetch(`${this.baseUrl}/update-status/${appointmentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ Status: status }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to update appointment status');
        }
  
        const responseData = await response.json();
        return responseData; // This will contain the updated appointment details
      } catch (error) {
        console.error('Error updating appointment status:', error);
        throw error;
      }
    }

      // Delete appointment
  async deleteAppointment(appointmentId: number): Promise<any> {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await fetch(`${this.baseUrl}/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete appointment');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
    
}



export default new AppointmentService();
