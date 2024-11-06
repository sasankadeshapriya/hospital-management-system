// src/services/LabTestService.tsx
export interface LabTest {
    TestID: number;
    TestName: string;
    ProcessingTime: string;
    Cost: number;
    isActive: number;
  }
  
  class LabTestService {
    private baseUrl = `${import.meta.env.VITE_API_URL}/labtests`;
  
    async fetchLabTests(): Promise<LabTest[]> {
      const response = await fetch(this.baseUrl);
      if (!response.ok) throw new Error('Failed to fetch lab tests');
      return response.json();
    }
  
    async fetchLabTestById(testId: number): Promise<LabTest> {
      const response = await fetch(`${this.baseUrl}/${testId}`);
      if (!response.ok) throw new Error('Failed to fetch lab test details');
      const data = await response.json();
      if (Array.isArray(data) && data[0].length > 0) {
        return data[0][0];
      }
      throw new Error('Lab test not found');
    }
  
    async addLabTest(newTest: { TestName: string; ProcessingTime: string; Cost: number }) {
      const response = await fetch(`${this.baseUrl}/add-lab-test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTest),
      });
      if (!response.ok) throw new Error('Failed to add lab test');
    }
  
    async updateLabTest(testId: number, updatedTest: { TestName: string; ProcessingTime: string; Cost: number }) {
      const response = await fetch(`${this.baseUrl}/${testId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTest),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update lab test');
      }
    }
  
    async deleteLabTest(testId: number): Promise<void> {
      const response = await fetch(`${this.baseUrl}/${testId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete lab test');
    }
  }
  
  export default new LabTestService();
  