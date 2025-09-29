'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CustomTooltip from './ui/CustomTooltip';

interface TrendData {
  date: string;
  [topic: string]: number | string;
}

interface TrendingTopicsChartProps {
  data: TrendData[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57', '#ffc0cb', '#00e0e0', '#e000e0', '#e0e000'];

export default function TrendingTopicsChart({ data }: TrendingTopicsChartProps) {
  if (!data || data.length === 0) {
    return <p>No data available.</p>;
  }

  const topicKeys = Object.keys(data[0]).filter(key => key !== 'date');

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {topicKeys.map((topic, index) => (
          <Line
            key={topic}
            type="monotone"
            dataKey={topic}
            stroke={COLORS[index % COLORS.length]}
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
