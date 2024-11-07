export interface Staff {
    UserID: number;
    Name: string;
    Email: string;
    Photo: string;
    DOB: string;
    ContactNumber: string;
    isActive: number;
    Address: string;
    AccountType: string;
  }
  
  class StaffService {
    private baseUrl = `${import.meta.env.VITE_API_URL}/user`;
  
    // Fetch all staff data
    async fetchStaff(): Promise<Staff[]> {
      try {
        const response = await fetch(`${this.baseUrl}/non-doctors`);
        if (!response.ok) {
          throw new Error('Failed to fetch staff data');
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching staff:', error);
        throw error;
      }
    }
  
    // Fetch a specific staff member by their ID
    async fetchStaffById(userId: number): Promise<Staff | null> {
      try {
        const response = await fetch(`${this.baseUrl}/non-doctor/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch staff details');
        }
        const data = await response.json();
        return data || null;
      } catch (error) {
        console.error('Error fetching staff by ID:', error);
        throw error;
      }
    }
  
    // Create new staff (POST request to insert a new staff member)
    async createStaff(newStaffData: FormData): Promise<any> {
      try {
        const response = await fetch(`${this.baseUrl}`, {
          method: 'POST',
          body: newStaffData,
          headers: {
            'Accept': 'application/json',
          },
        });
  
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to create staff');
        }
  
        return data;
      } catch (error) {
        console.error('Error creating staff:', error);
        throw error;
      }
    }
  
    // Update an existing staff member (PUT request)
    async updateStaff(userId: number, updatedData: any): Promise<any> {
      try {
        const response = await fetch(`${this.baseUrl}/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        });
  
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to update staff');
        }
  
        return data;
      } catch (error) {
        console.error('Error updating staff:', error);
        throw error;
      }
    }
  
    // Update the profile photo of an existing staff member (PUT request)
    async updateStaffImage(userId: number, imageData: FormData): Promise<any> {
      try {
        const response = await fetch(`${this.baseUrl}/photo/${userId}`, {
          method: 'PUT',
          body: imageData,
        });
  
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to update staff photo');
        }
  
        return data;
      } catch (error) {
        console.error('Error updating staff photo:', error);
        throw error;
      }
    }
  
    // Delete a staff member (DELETE request)
    async deleteStaff(userId: number): Promise<any> {
      try {
        const response = await fetch(`${this.baseUrl}/${userId}`, {
          method: 'DELETE',
        });
  
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to delete staff');
        }
  
        return data;
      } catch (error) {
        console.error('Error deleting staff:', error);
        throw error;
      }
    }
  }
  
  export default new StaffService();
  