import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RelationshipLengthData {
  _id: string;
  count: number;
}

interface RelationshipLengthStackedBarChartProps {
  data: RelationshipLengthData[];
}

const RelationshipLengthStackedBarChart: React.FC<RelationshipLengthStackedBarChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="_id" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" stackId="a" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RelationshipLengthStackedBarChart;
