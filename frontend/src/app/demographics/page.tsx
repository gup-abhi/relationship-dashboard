"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import AgeDistributionBarChart from '@/components/AgeDistributionBarChart';
import GenderDistributionDonutChart from '@/components/GenderDistributionDonutChart';

interface AgeDistributionData {
  _id: string;
  count: number;
}

interface GenderDistributionData {
  _id: string;
  count: number;
}

const fetchAgeDistribution = async (): Promise<AgeDistributionData[]> => {
  const response = await api.get<{ ageDistribution: AgeDistributionData[] }>('/demographics/age-ranges');
  return response.ageDistribution;
};

const fetchGenderDistribution = async (): Promise<GenderDistributionData[]> => {
  const response = await api.get<{ genderDistribution: GenderDistributionData[] }>('/demographics/gender');
  console.log('Backend response for gender distribution:', response.genderDistribution);
  return response.genderDistribution;
};

const DemographicsPage: React.FC = () => {
  const { data: ageDistribution, isLoading: ageLoading, isError: ageError, error: ageFetchError } = useQuery<AgeDistributionData[]>({ queryKey: ['ageDistribution'], queryFn: fetchAgeDistribution });
  const { data: genderDistribution, isLoading: genderLoading, isError: genderError, error: genderFetchError } = useQuery<GenderDistributionData[]>({ queryKey: ['genderDistribution'], queryFn: fetchGenderDistribution });

  if (ageLoading || genderLoading) {
    return <p>Loading demographics data...</p>;
  }

  if (ageError || genderError) {
    return (
      <p className="text-red-500">
        Error: {ageFetchError?.message || genderFetchError?.message || 'Failed to fetch demographics data'}
      </p>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Demographics Overview</h1>
      <div className="grid grid-cols-1 md::grid-cols-2 gap-6">
        <div className="bg-white p-4 shadow rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">Age Distribution</h2>
          {ageDistribution && ageDistribution.length > 0 ? (
            <AgeDistributionBarChart data={ageDistribution} />
          ) : (
            <p>No age distribution data available.</p>
          )}
        </div>

        <div className="bg-white p-4 shadow rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">Gender Distribution</h2>
          {genderDistribution && genderDistribution.length > 0 ? (
            <GenderDistributionDonutChart data={genderDistribution} />
          ) : (
            <p>No gender distribution data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemographicsPage;
