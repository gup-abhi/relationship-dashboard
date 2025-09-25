'use client';

import React, { useEffect, useState } from 'react';
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

interface KeyTheme {
  _id: string;
  count: number;
}

interface KeyThemesChartProps {
  selectedStage: string;
  selectedAgeRange: string;
}

const KeyThemesChart: React.FC<KeyThemesChartProps> = ({ selectedStage, selectedAgeRange }) => {
  const [themes, setThemes] = useState<KeyTheme[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThemes = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        if (selectedStage !== 'all') {
          queryParams.append('relationship_stage', selectedStage);
        }
        if (selectedAgeRange !== 'all') {
          queryParams.append('age_range_op', selectedAgeRange);
        }

        const queryString = queryParams.toString();
        const url = `/api/issues/themes${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: KeyTheme[] = await response.json();
        setThemes(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchThemes();
  }, [selectedStage, selectedAgeRange]);

  if (loading) {
    return <div>Loading key themes...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {themes.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={themes}
            layout="vertical"
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="_id" type="category" width={150} interval={0} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" name="Key Themes" barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p>No key themes data found for the selected filters.</p>
      )}
    </div>
  );
};

export default KeyThemesChart;