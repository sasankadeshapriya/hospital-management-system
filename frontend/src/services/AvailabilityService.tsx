class AvailabilityService {

    private baseUrl = `${import.meta.env.VITE_API_URL}/doc-availability`;
  
    // Add a new availability slot for a doctor
    async addAvailability(availability: {
      DoctorID: number;
      RoomNO: number;
      AvailableDay: string;
      StartTime: string;
      EndTime: string;
    }): Promise<void> {
      try {
        const response = await fetch(`${this.baseUrl}/insert-slot`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(availability),
        });
  
        if (!response.ok) {
          throw new Error('Failed to add availability');
        }
      } catch (error) {
        console.error('Error adding availability:', error);
        throw error;
      }
    }
  }
  
  export default new AvailabilityService();
  