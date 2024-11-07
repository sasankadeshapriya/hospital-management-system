// src/services/DepartmentService.ts
export interface Department {
    DepartmentID: number;
    DepartmentName: string;
    Specialization: string;
    HOD_Name: string;
}

class DepartmentService {
    private baseUrl = `${import.meta.env.VITE_API_URL}/departments`;

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

    async addDepartment(departmentData: { departmentName: string; hod: number }): Promise<void> {
        const response = await fetch(`${this.baseUrl}/add-department`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(departmentData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add department');
        }
    }

    // Update department
    async updateDepartment(departmentData: { departmentID: number; newDepartmentName: string; newHOD: number }): Promise<void> {
        const response = await fetch(`${this.baseUrl}/${departmentData.departmentID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                departmentID: departmentData.departmentID,
                newDepartmentName: departmentData.newDepartmentName,
                newHOD: departmentData.newHOD,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update department');
        }
    }

    async deleteDepartment(departmentId: number): Promise<void> {
        const response = await fetch(`${this.baseUrl}/${departmentId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete department');
    }
}

export default new DepartmentService();
