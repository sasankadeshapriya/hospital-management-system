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
}

export default new AppointmentService();
