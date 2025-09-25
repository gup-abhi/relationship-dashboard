'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import CustomTooltip from './ui/CustomTooltip';

interface TrendingTopicsData {
  _id: string; // Topic
  count: number;
}

interface TrendingTopicsChartProps {
  data: TrendingTopicsData[];
}

export default function TrendingTopicsChart({ data }: TrendingTopicsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="_id" type="category" interval={0} width={300} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="count" fill="#8884d8">
          <LabelList dataKey="count" position="right" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
