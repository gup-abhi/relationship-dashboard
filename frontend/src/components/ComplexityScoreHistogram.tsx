import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface ComplexityData {
  _id: number;
  count: number;
}

interface ComplexityScoreHistogramProps {
  relationshipStage?: string;
  ageRangeOp?: string;
  timePeriod?: string;
}

const ComplexityScoreHistogram: React.FC<ComplexityScoreHistogramProps> = ({ relationshipStage, ageRangeOp, timePeriod }) => {
  const { data, error, isLoading } = useQuery<ComplexityData[]>({
    queryKey: ['complexityDistribution', relationshipStage, ageRangeOp, timePeriod],
    queryFn: async () => {
      const params = {
        ...(relationshipStage && { relationship_stage: relationshipStage }),
        ...(ageRangeOp && { age_range_op: ageRangeOp }),
        ...(timePeriod && { time_period: timePeriod }),
      };
      const response = await axios.get('/api/issues/complexity', { params });
      return response.data;
    },
  });

  if (isLoading) return <div>Loading complexity data...</div>;
  if (error) return <div>Error loading complexity data: {error.message}</div>;

  if (!data || data.length === 0) {
    return <p>No complexity score data available for the selected filters.</p>;
  }

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="_id" type="category" interval={0} label={{ value: "Complexity Score", position: "insideBottom", offset: 0 }} />
          <YAxis label={{ value: "Number of Posts", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" name="Number of Posts" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComplexityScoreHistogram;
