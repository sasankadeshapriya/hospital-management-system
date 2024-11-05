// src/services/DepartmentService.ts
export interface Department {
    DepartmentID: number;
    DepartmentName: string;
    Specialization: string;
    HOD_Name: string;
}

class DepartmentService {
    private baseUrl = 'http://localhost:5000/api/v1/departments';

    async fetchDepartments(): Promise<Department[]> {
        try {
            const response = await fetch(this.baseUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch departments');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching departments:', error);
            throw error;
        }
    }

    async deleteDepartment(departmentId: number): Promise<void> {
        const response = await fetch(`${this.baseUrl}/${departmentId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete department');
      }
}

export default new DepartmentService();
