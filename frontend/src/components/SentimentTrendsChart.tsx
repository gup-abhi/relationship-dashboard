'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CustomTooltip from './ui/CustomTooltip';

interface SentimentTrendData {
  date: string;
  [sentiment: string]: number | string;
}

interface SentimentTrendsChartProps {
  data: SentimentTrendData[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];

export default function SentimentTrendsChart({ data }: SentimentTrendsChartProps) {
  if (!data || data.length === 0) {
    return <p>No sentiment trends data available.</p>;
  }

  const sentimentKeys = Object.keys(data[0]).filter(key => key !== 'date');

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {sentimentKeys.map((sentiment, index) => (
          <Line
            key={sentiment}
            type="monotone"
            dataKey={sentiment}
            stroke={COLORS[index % COLORS.length]}
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
