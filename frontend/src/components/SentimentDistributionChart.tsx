import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, PieLabelRenderProps } from 'recharts';

interface SentimentData {
  _id: string;
  count: number;
}

interface SentimentDistributionChartProps {
  data: SentimentData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const SentimentDistributionChart: React.FC<SentimentDistributionChartProps> = ({ data }) => {
  // Map the data to the format expected by Recharts PieChart
  const chartData = data.map(item => ({
    name: item._id,
    value: item.count,
  }));

  return (
    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }: PieLabelRenderProps) => `${name}: ${(percent as number * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SentimentDistributionChart;