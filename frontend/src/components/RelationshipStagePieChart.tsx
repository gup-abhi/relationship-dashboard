import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import CustomTooltip from './ui/CustomTooltip';

interface RelationshipStageData {
  _id: string;
  count: number;
}

interface RelationshipStagePieChartProps {
  data: RelationshipStageData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6F61'];

const RelationshipStagePieChart: React.FC<RelationshipStagePieChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    name: item._id,
    value: item.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label={(props: any) => `${props.name}: ${(props.percent * 100).toFixed(0)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default RelationshipStagePieChart;
