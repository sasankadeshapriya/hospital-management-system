import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#6366f1', '#ec4899', '#1e40af', '#8b5cf6', '#34d399', '#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#f472b6'];

interface DepartmentDistributionProps {
  departmentData: { name: string; percentage: number }[];
}

function DepartmentDistribution({ departmentData }: DepartmentDistributionProps) {
  const totalPatientsDepartment = departmentData.reduce((total, dept) => total + dept.percentage, 0);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Patients By Department</h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Tooltip formatter={(value: number) => `${((value / totalPatientsDepartment) * 100).toFixed(2)}%`} />
          <Pie
            data={departmentData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="percentage"
            nameKey="name"
          >
            {departmentData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 flex flex-col">
        {departmentData.map((entry, index) => (
          <div key={entry.name} className="flex items-center mb-2">
            <div
              className="rounded-full mr-2"
              style={{
                width: '10px',
                height: '10px',
                backgroundColor: COLORS[index % COLORS.length],
              }}
            ></div>
            <span className="text-sm text-gray-600">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DepartmentDistribution;
