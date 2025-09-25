'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CustomTooltip from './ui/CustomTooltip';

interface UrgencyLevelDistributionData {
  _id: string;
  count: number;
}

interface UrgencyLevelDistributionChartProps {
  data: UrgencyLevelDistributionData[];
}

export default function UrgencyLevelDistributionChart({ data }: UrgencyLevelDistributionChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{
          top: 5,
          right: 30,
          left: 80,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis type="category" dataKey="_id" interval={0} tick={{ fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" />
        <Bar dataKey="count" fill="#8884d8" label={{ position: 'right' }} />
      </BarChart>
    </ResponsiveContainer>
  );
}
