'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import CustomTooltip from './ui/CustomTooltip';

interface OverallSentimentPieChartProps {
  data: { name: string; value: number }[];
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00C49F", "#FFBB28", "#FF8042", "#0088FE", "#A020F0", "#F08080"];

export default function OverallSentimentPieChart({ data }: OverallSentimentPieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={(props) => {
            const { name, percent } = props as { name?: string; percent?: number };
            return name && percent !== undefined ? `${name} ${(percent * 100).toFixed(0)}%` : '';
          }}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
