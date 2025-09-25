"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import AgeDistributionBarChart from '@/components/AgeDistributionBarChart';

interface AgeDistributionData {
  _id: string;
  count: number;
}

const fetchAgeDistribution = async (): Promise<AgeDistributionData[]> => {
  const response = await api.get<{ ageDistribution: AgeDistributionData[] }>('/demographics/age-ranges');
  return response.ageDistribution;
};

const DemographicsPage: React.FC = () => {
  const { data: ageDistribution, isLoading, isError, error } = useQuery<AgeDistributionData[]>({ queryKey: ['ageDistribution'], queryFn: fetchAgeDistribution });

  if (isLoading) {
    return <p>Loading age distribution data...</p>;
  }

  if (isError) {
    return <p className="text-red-500">Error: {error?.message || 'Failed to fetch age distribution'}</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Demographics Overview</h1>
      <div className="bg-white p-4 shadow rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Age Distribution</h2>
        {ageDistribution && ageDistribution.length > 0 ? (
          <AgeDistributionBarChart data={ageDistribution} />
        ) : (
          <p>No age distribution data available.</p>
        )}
      </div>
    </div>
  );
};

export default DemographicsPage;
