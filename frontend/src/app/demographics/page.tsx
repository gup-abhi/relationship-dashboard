"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import AgeDistributionBarChart from '@/components/AgeDistributionBarChart';
import GenderDistributionDonutChart from '@/components/GenderDistributionDonutChart';
import RelationshipLengthStackedBarChart from '@/components/RelationshipLengthStackedBarChart';
import RelationshipStagePieChart from '@/components/RelationshipStagePieChart';

interface AgeDistributionData {
  _id: string;
  count: number;
}

interface GenderDistributionData {
  _id: string;
  count: number;
}

interface RelationshipLengthData {
  _id: string;
  count: number;
}

interface RelationshipStageData {
  _id: string;
  count: number;
}

const fetchAgeDistribution = async (): Promise<AgeDistributionData[]> => {
  const response = await api.get<{ ageDistribution: AgeDistributionData[] }>('/demographics/age-ranges');
  return response.ageDistribution;
};

const fetchGenderDistribution = async (): Promise<GenderDistributionData[]> => {
  const response = await api.get<{ genderDistribution: GenderDistributionData[] }>('/demographics/gender');
  return response.genderDistribution;
};

const fetchRelationshipLengthDistribution = async (): Promise<RelationshipLengthData[]> => {
  const response = await api.get<{ relationshipLengthDistribution: RelationshipLengthData[] }>('/demographics/relationship-length');
  return response.relationshipLengthDistribution;
};

const fetchRelationshipStagesDistribution = async (): Promise<RelationshipStageData[]> => {
  const response = await api.get<{ relationshipStagesDistribution: RelationshipStageData[] }>('/demographics/relationship-stages');
  return response.relationshipStagesDistribution;
};

const DemographicsPage: React.FC = () => {
  const { data: ageDistribution, isLoading: ageLoading, isError: ageError, error: ageFetchError } = useQuery<AgeDistributionData[]>({ queryKey: ['ageDistribution'], queryFn: fetchAgeDistribution });
  const { data: genderDistribution, isLoading: genderLoading, isError: genderError, error: genderFetchError } = useQuery<GenderDistributionData[]>({ queryKey: ['genderDistribution'], queryFn: fetchGenderDistribution });
  const { data: relationshipLengthDistribution, isLoading: relationshipLengthLoading, isError: relationshipLengthError, error: relationshipLengthFetchError } = useQuery<RelationshipLengthData[]>({ queryKey: ['relationshipLengthDistribution'], queryFn: fetchRelationshipLengthDistribution });
  const { data: relationshipStagesDistribution, isLoading: relationshipStagesLoading, isError: relationshipStagesError, error: relationshipStagesFetchError } = useQuery<RelationshipStageData[]>({ queryKey: ['relationshipStagesDistribution'], queryFn: fetchRelationshipStagesDistribution });

  if (ageLoading || genderLoading || relationshipLengthLoading || relationshipStagesLoading) {
    return <p>Loading demographics data...</p>;
  }

  if (ageError || genderError || relationshipLengthError || relationshipStagesError) {
    return (
      <p className="text-red-500">
        Error: {ageFetchError?.message || genderFetchError?.message || relationshipLengthFetchError?.message || relationshipStagesFetchError?.message || 'Failed to fetch demographics data'}
      </p>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Demographics Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <div className="bg-white p-4 shadow rounded-lg mb-6 col-span-full">
          <h2 className="text-xl font-semibold mb-2">Relationship Length Distribution</h2>
          {relationshipLengthDistribution && relationshipLengthDistribution.length > 0 ? (
            <RelationshipLengthStackedBarChart data={relationshipLengthDistribution} />
          ) : (
            <p>No relationship length data available.</p>
          )}
        </div>

        <div className="bg-white p-4 shadow rounded-lg mb-6 col-span-full">
          <h2 className="text-xl font-semibold mb-2">Relationship Stage Distribution</h2>
          {relationshipStagesDistribution && relationshipStagesDistribution.length > 0 ? (
            <RelationshipStagePieChart data={relationshipStagesDistribution} />
          ) : (
            <p>No relationship stage data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemographicsPage;
