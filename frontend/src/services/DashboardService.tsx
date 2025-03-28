export interface GenderDistributionItem {
    name: string; // Month name
    male: number; // Male count for the month
    female: number; // Female count for the month
  }
  
  export interface DepartmentDistributionItem {
    name: string; // Department name
    percentage: number; // Patient percentage for the department
  }
  
  export interface DashboardData {
    doctors: number;
    patients: number;
    appointments: number;
    revenue: number;
    genderDistribution: GenderDistributionItem[];
    departmentDistribution: DepartmentDistributionItem[];
  }
  
  class DashboardService {
    private baseUrl = 'http://localhost:5000/api/v1/admin/dashboard-stats';
  
    async fetchDashboardData(): Promise<DashboardData> {
      try {
        const response = await fetch(this.baseUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await response.json();
        return this.transformData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw error;
      }
    }
  
    private transformData(data: any): DashboardData {
      // Map genderDistribution to the expected format
      const genderDistribution = this.ensureFullMonthData(
        data.genderDistribution.map((item: any) => ({
          name: item.month,
          male: item.maleCount,
          female: item.femaleCount,
        }))
      );
  
      // Map departmentDistribution to the expected format
      const departmentDistribution = data.departmentDistribution.map((item: any) => ({
        name: item.DepartmentName,
        percentage: item.patientPercentage,
      }));
  
      return {
        doctors: data.doctors,
        patients: data.patients,
        appointments: data.appointments,
        revenue: data.revenue,
        genderDistribution,
        departmentDistribution,
      };
    }
  
    private ensureFullMonthData(data: GenderDistributionItem[]): GenderDistributionItem[] {
      const currentDate = new Date();
      const allMonths: string[] = [];
    
      // Generate past 12 months dynamically
      for (let i = 11; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        allMonths.push(date.toLocaleString('en-US', { month: 'short' }));
      }
    
      const monthDataMap = new Map(data.map(item => [item.name, item]));
    
      return allMonths.map(month =>
        monthDataMap.get(month) || { name: month, male: 0, female: 0 }
      );
    }
    
  }
  
  export default new DashboardService();
  