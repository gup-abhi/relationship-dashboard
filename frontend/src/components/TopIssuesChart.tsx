"use client";

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

interface TopIssuesChartProps {
  data: Array<{ _id: string; count: number }>;
  title: string;
}

const TopIssuesChart: React.FC<TopIssuesChartProps> = ({ data, title }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{
          top: 20,
          right: 30,
          left: 80,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="_id" type="category" width={200} interval={0} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" name={title} barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TopIssuesChart;