import React, { useState } from 'react';
import { LineChart, Line, XAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface GenderDistributionChartProps {
  patientData: { name: string; male: number; female: number }[];
}

function GenderDistributionChart({ patientData }: GenderDistributionChartProps) {
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);

  const handleMouseEnter = (lineKey: string) => {
    setHoveredLine(lineKey);
  };

  const handleMouseLeave = () => {
    setHoveredLine(null);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Gender Distribution</h3>
      
      {/* Line Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={patientData}>
          <XAxis dataKey="name" />
          
          <Tooltip formatter={(value) => `${value}`} />
          
          <Line
            type="monotone"
            dataKey="male"
            stroke="#6366f1"
            strokeWidth={hoveredLine === 'male' ? 3 : 2} 
            onMouseEnter={() => handleMouseEnter('male')}
            onMouseLeave={handleMouseLeave}
          />
          <Line
            type="monotone"
            dataKey="female"
            stroke="#ec4899"
            strokeWidth={hoveredLine === 'female' ? 3 : 2}
            onMouseEnter={() => handleMouseEnter('female')}
            onMouseLeave={handleMouseLeave}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Line Chart Legend */}
      <div className="flex items-center mt-3">
        <div className="flex items-center mr-4">
          <div className="h-3 w-3 rounded-full bg-indigo-600 mr-2"></div>
          <span>Male</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-pink-500 mr-2"></div>
          <span>Female</span>
        </div>
      </div>
    </div>
  );
}

export default GenderDistributionChart;
