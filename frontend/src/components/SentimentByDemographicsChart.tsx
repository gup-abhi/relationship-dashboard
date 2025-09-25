'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CustomTooltip from './ui/CustomTooltip';

interface SentimentByDemographicsData {
  field1: string;
  field2: string;
  count: number;
}

interface ChartData {
  name: string;
  [key: string]: string | number;
}

interface SentimentByDemographicsChartProps {
  data: SentimentByDemographicsData[];
  field1Name: string;
}

const transformDataForGroupedBarChart = (data: SentimentByDemographicsData[]): ChartData[] => {
  const groupedData = data.reduce((acc, { field1, field2, count }) => {
    if (!acc[field1]) {
      acc[field1] = { name: field1 };
    }
    acc[field1][field2] = count;
    return acc;
  }, {} as Record<string, ChartData>);

  return Object.values(groupedData);
};

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00C49F", "#FFBB28", "#FF8042", "#0088FE", "#A020F0", "#F08080"];

export default function SentimentByDemographicsChart({ data, field1Name }: SentimentByDemographicsChartProps) {
  const chartData = transformDataForGroupedBarChart(data);
  const sentimentTypes = Array.from(new Set(data.map(item => item.field2)));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 50 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" />
        {sentimentTypes.map((sentiment, index) => (
          <Bar key={sentiment} dataKey={sentiment} stackId="a" fill={COLORS[index % COLORS.length]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
