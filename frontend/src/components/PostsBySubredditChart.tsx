'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CustomTooltip from './ui/CustomTooltip';

interface TrendData {
  date: string;
  [subreddit: string]: number | string;
}

interface PostsBySubredditChartProps {
  data: TrendData[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];

export default function PostsBySubredditChart({ data }: PostsBySubredditChartProps) {
  if (!data || data.length === 0) {
    return <p>No data available.</p>;
  }

  const subredditKeys = Object.keys(data[0]).filter(key => key !== 'date');

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {subredditKeys.map((subreddit, index) => (
          <Line
            key={subreddit}
            type="monotone"
            dataKey={subreddit}
            stroke={COLORS[index % COLORS.length]}
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
