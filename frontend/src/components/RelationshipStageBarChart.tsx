'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CustomTooltip from './ui/CustomTooltip';

interface RelationshipStageData {
  _id: string;
  count: number;
}

interface RelationshipStageBarChartProps {
  data: RelationshipStageData[];
}

export default function RelationshipStageBarChart({ data }: RelationshipStageBarChartProps) {
  const chartData = data.map(item => ({
    name: item._id,
    value: item.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={chartData}
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
        <YAxis type="category" dataKey="name" interval={0} tick={{ fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" />
        <Bar dataKey="value" fill="#8884d8" label={{ position: 'right' }} />
      </BarChart>
    </ResponsiveContainer>
  );
}