"use client";

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import AgeDistributionBarChart from '@/components/AgeDistributionBarChart';
import GenderDistributionDonutChart from '@/components/GenderDistributionDonutChart';
import RelationshipLengthStackedBarChart from '@/components/RelationshipLengthStackedBarChart';
import RelationshipStageBarChart from '@/components/RelationshipStageBarChart';
import CrossTabulationHeatmap from '@/components/CrossTabulationHeatmap';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useLoader } from '@/components/LoaderProvider';

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

interface CrossTabulationData {
  field1: string;
  field2: string;
  count: number;
}

const fetchAgeDistribution = async (filters?: Record<string, string>): Promise<AgeDistributionData[]> => {
  const response = await api.get<{ ageDistribution: AgeDistributionData[] }>('/demographics/age-ranges', { params: filters });
  return response.ageDistribution;
};

const fetchGenderDistribution = async (filters?: Record<string, string>): Promise<GenderDistributionData[]> => {
  const response = await api.get<{ genderDistribution: GenderDistributionData[] }>('/demographics/gender', { params: filters });
  return response.genderDistribution;
};

const fetchRelationshipLengthDistribution = async (filters?: Record<string, string>): Promise<RelationshipLengthData[]> => {
  const response = await api.get<{ relationshipLengthDistribution: RelationshipLengthData[] }>('/demographics/relationship-length', { params: filters });
  return response.relationshipLengthDistribution;
};

const fetchRelationshipStagesDistribution = async (filters?: Record<string, string>): Promise<RelationshipStageData[]> => {
  const response = await api.get<{ relationshipStagesDistribution: RelationshipStageData[] }>('/demographics/relationship-stages', { params: filters });
  return response.relationshipStagesDistribution;
};

const fetchAgeGenderCrossTabulation = async (filters?: Record<string, string>): Promise<CrossTabulationData[]> => {
  const response = await api.get<{ crossTabulation: CrossTabulationData[] }>('/demographics/cross-tabulation', {
    params: {
      field1: 'age_range_op',
      field2: 'gender_op',
      ...filters,
    },
  });
  return response.crossTabulation;
};

const DemographicsPage: React.FC = () => {
  const [selectedAgeRange, setSelectedAgeRange] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedRelationshipLength, setSelectedRelationshipLength] = useState<string>('all');
  const [selectedRelationshipStage, setSelectedRelationshipStage] = useState<string>('all');
  const { showLoader, hideLoader } = useLoader();

  const filters = {
    ...(selectedAgeRange !== 'all' && { age_range_op: selectedAgeRange }),
    ...(selectedGender !== 'all' && { gender_op: selectedGender }),
    ...(selectedRelationshipLength !== 'all' && { relationship_length: selectedRelationshipLength }),
    ...(selectedRelationshipStage !== 'all' && { relationship_stage: selectedRelationshipStage }),
  };

  const { data: ageDistribution, isLoading: ageLoading, isError: ageError, error: ageFetchError } = useQuery<AgeDistributionData[]>({ queryKey: ['ageDistribution', filters], queryFn: () => fetchAgeDistribution(filters) });
  const { data: genderDistribution, isLoading: genderLoading, isError: genderError, error: genderFetchError } = useQuery<GenderDistributionData[]>({ queryKey: ['genderDistribution', filters], queryFn: () => fetchGenderDistribution(filters) });
  const { data: relationshipLengthDistribution, isLoading: relationshipLengthLoading, isError: relationshipLengthError, error: relationshipLengthFetchError } = useQuery<RelationshipLengthData[]>({ queryKey: ['relationshipLengthDistribution', filters], queryFn: () => fetchRelationshipLengthDistribution(filters) });
  const { data: relationshipStagesDistribution, isLoading: relationshipStagesLoading, isError: relationshipStagesError, error: relationshipStagesFetchError } = useQuery<RelationshipStageData[]>({ queryKey: ['relationshipStagesDistribution', filters], queryFn: () => fetchRelationshipStagesDistribution(filters) });
  const { data: ageGenderCrossTabulation, isLoading: crossTabulationLoading, isError: crossTabulationError, error: crossTabulationFetchError } = useQuery<CrossTabulationData[]>({ queryKey: ['ageGenderCrossTabulation', filters], queryFn: () => fetchAgeGenderCrossTabulation(filters) });

  // Fetch unique values for filters
  const { data: uniqueAgeRanges } = useQuery<string[]>({ queryKey: ['uniqueAgeRanges'], queryFn: () => api.get<{ ageDistribution: { _id: string }[] }>('/demographics/age-ranges').then(res => ['all', ...res.ageDistribution.map(item => item._id)]) });
  const { data: uniqueGenders } = useQuery<string[]>({ queryKey: ['uniqueGenders'], queryFn: () => api.get<{ genderDistribution: { _id: string }[] }>('/demographics/gender').then(res => ['all', ...res.genderDistribution.map(item => item._id)]) });
  const { data: uniqueRelationshipLengths } = useQuery<string[]>({ queryKey: ['uniqueRelationshipLengths'], queryFn: () => api.get<{ relationshipLengthDistribution: { _id: string }[] }>('/demographics/relationship-length').then(res => ['all', ...res.relationshipLengthDistribution.map(item => item._id)]) });
  const { data: uniqueRelationshipStages } = useQuery<string[]>({ queryKey: ['uniqueRelationshipStages'], queryFn: () => api.get<{ relationshipStagesDistribution: { _id: string }[] }>('/demographics/relationship-stages').then(res => ['all', ...res.relationshipStagesDistribution.map(item => item._id)]) });

  useEffect(() => {
    if (ageLoading || genderLoading || relationshipLengthLoading || relationshipStagesLoading || crossTabulationLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [ageLoading, genderLoading, relationshipLengthLoading, relationshipStagesLoading, crossTabulationLoading, showLoader, hideLoader]);

  const handleClearFilters = () => {
    setSelectedAgeRange('all');
    setSelectedGender('all');
    setSelectedRelationshipLength('all');
    setSelectedRelationshipStage('all');
  };

  if (ageError || genderError || relationshipLengthError || relationshipStagesError || crossTabulationError) {
    return (
      <p className="text-red-500">
        Error: {ageFetchError?.message || genderFetchError?.message || relationshipLengthFetchError?.message || relationshipStagesFetchError?.message || crossTabulationFetchError?.message || 'Failed to fetch demographics data'}
      </p>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Demographics Overview</h1>

      <div className="mb-4 flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:items-end">
        <div>
          <label htmlFor="age-range-select" className="block text-sm font-medium text-foreground">Filter by Age Range:</label>
          <Select onValueChange={setSelectedAgeRange} value={selectedAgeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select an age range" />
            </SelectTrigger>
            <SelectContent>
              {uniqueAgeRanges?.map((range) => (
                <SelectItem key={range} value={range}>
                  {range === 'all' ? 'All Age Ranges' : range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="gender-select" className="block text-sm font-medium text-foreground">Filter by Gender:</label>
          <Select onValueChange={setSelectedGender} value={selectedGender}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              {uniqueGenders?.map((gender) => (
                <SelectItem key={gender} value={gender}>
                  {gender === 'all' ? 'All Genders' : gender}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="relationship-length-select" className="block text-sm font-medium text-foreground">Filter by Relationship Length:</label>
          <Select onValueChange={setSelectedRelationshipLength} value={selectedRelationshipLength}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select length" />
            </SelectTrigger>
            <SelectContent>
              {uniqueRelationshipLengths?.map((length) => (
                <SelectItem key={length} value={length}>
                  {length === 'all' ? 'All Lengths' : length}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="relationship-stage-select" className="block text-sm font-medium text-foreground">Filter by Relationship Stage:</label>
          <Select onValueChange={setSelectedRelationshipStage} value={selectedRelationshipStage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a stage" />
            </SelectTrigger>
            <SelectContent>
              {uniqueRelationshipStages?.map((stage) => (
                <SelectItem key={stage} value={stage}>
                  {stage === 'all' ? 'All Stages' : stage}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleClearFilters} className="self-end">Clear All Filters</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card p-4 shadow rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">Age Distribution</h2>
          {ageDistribution && ageDistribution.length > 0 ? (
            <AgeDistributionBarChart data={ageDistribution} />
          ) : (
            <p>No age distribution data available.</p>
          )}
        </div>

        <div className="bg-card p-4 shadow rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">Gender Distribution</h2>
          {genderDistribution && genderDistribution.length > 0 ? (
            <GenderDistributionDonutChart data={genderDistribution} />
          ) : (
            <p>No gender distribution data available.</p>
          )}
        </div>

        <div className="bg-card p-4 shadow rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">Relationship Length Distribution</h2>
          {relationshipLengthDistribution && relationshipLengthDistribution.length > 0 ? (
            <RelationshipLengthStackedBarChart data={relationshipLengthDistribution} />
          ) : (
            <p>No relationship length data available.</p>
          )}
        </div>

        <div className="bg-card p-4 shadow rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">Age vs Gender Cross-Tabulation</h2>
          {ageGenderCrossTabulation && ageGenderCrossTabulation.length > 0 ? (
            <CrossTabulationHeatmap data={ageGenderCrossTabulation} field1Name="Age Range" field2Name="Gender" />
          ) : (
            <p>No cross-tabulation data available.</p>
          )}
        </div>

        <div className="bg-card p-4 shadow rounded-lg mb-6 col-span-full">
          <h2 className="text-xl font-semibold mb-2">Relationship Stage Distribution</h2>
          {relationshipStagesDistribution && relationshipStagesDistribution.length > 0 ? (
            <RelationshipStageBarChart data={relationshipStagesDistribution} />
          ) : (
            <p>No relationship stage data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemographicsPage;
