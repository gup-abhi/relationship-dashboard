'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import CustomTooltip from './ui/CustomTooltip';

interface KeyThemeData {
  _id: string;
  count: number;
}

interface KeyThemesChartProps {
  data: KeyThemeData[];
}

const KeyThemesChart: React.FC<KeyThemesChartProps> = ({ data }) => {
  return (
    <div>
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            layout="vertical"
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="_id" type="category" width={150} interval={0} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" name="Key Themes" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p>No key themes data found for the selected filters.</p>
      )}
    </div>
  );
};

export default KeyThemesChart;