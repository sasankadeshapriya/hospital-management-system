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
  private baseUrl = 'http://localhost:5000/api/v1/doc-appointments';

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
}



export default new AppointmentService();
