'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import OverallSentimentPieChart from '@/components/OverallSentimentPieChart';
import SentimentDistributionChart from '@/components/SentimentDistributionChart';
import SentimentTrendsChart from '@/components/SentimentTrendsChart';
import SentimentByDemographicsChart from '@/components/SentimentByDemographicsChart';
import UrgencyLevelDistributionChart from '@/components/UrgencyLevelDistributionChart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface SentimentData {
  _id: string;
  count: number;
}

interface SentimentTrendData {
  _id: string; // Date
  count: number;
}

interface SentimentByDemographicsData {
  field1: string;
  field2: string;
  count: number;
}

interface UrgencyLevelDistributionData {
  _id: string;
  count: number;
}

const fetchSentimentData = async (filters?: Record<string, string>): Promise<SentimentData[]> => {
  return api.get('/sentiment/distribution', { params: filters });
};

const fetchSentimentTrends = async (filters?: Record<string, string>): Promise<SentimentTrendData[]> => {
  const params = { ...filters, timeUnit: 'month' };
  return api.get('/sentiment/trends', { params });
};

const fetchSentimentByDemographics = async (demographicField: string, filters?: Record<string, string>): Promise<SentimentByDemographicsData[]> => {
  const params = { ...filters, demographicField };
  return api.get('/sentiment/by-demographics', { params });
};

const fetchUrgencyLevelDistribution = async (filters?: Record<string, string>): Promise<UrgencyLevelDistributionData[]> => {
  return api.get('/sentiment/urgency', { params: filters });
};

const fetchUniqueValues = async (field: string): Promise<string[]> => {
  const response = await api.get<{ [key: string]: { _id: string }[] }>(`/demographics/${field}`);
  const key = Object.keys(response)[0];
  return ['all', ...response[key].map(item => item._id)];
};

const SentimentPage: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedAgeRange, setSelectedAgeRange] = useState<string>('all');

  const filters = {
    ...(selectedStage !== 'all' && { relationship_stage: selectedStage }),
    ...(selectedAgeRange !== 'all' && { age_range_op: selectedAgeRange }),
  };

  const { data: sentimentData, isLoading, isError } = useQuery<SentimentData[]>({ queryKey: ['sentimentData', filters], queryFn: () => fetchSentimentData(filters) });
  const { data: sentimentTrends, isLoading: trendsLoading, isError: trendsError } = useQuery<SentimentTrendData[]>({ queryKey: ['sentimentTrends', filters], queryFn: () => fetchSentimentTrends(filters) });
  const { data: sentimentByAge, isLoading: ageLoading, isError: ageError } = useQuery<SentimentByDemographicsData[]>({ queryKey: ['sentimentByAge', filters], queryFn: () => fetchSentimentByDemographics('age_range_op', filters) });
  const { data: sentimentByStage, isLoading: stageLoading, isError: stageError } = useQuery<SentimentByDemographicsData[]>({ queryKey: ['sentimentByStage', filters], queryFn: () => fetchSentimentByDemographics('relationship_stage', filters) });
  const { data: urgencyLevelDistribution, isLoading: urgencyLoading, isError: urgencyError } = useQuery<UrgencyLevelDistributionData[]>({ queryKey: ['urgencyLevelDistribution', filters], queryFn: () => fetchUrgencyLevelDistribution(filters) });

  const { data: uniqueStages } = useQuery<string[]>({ queryKey: ['uniqueStages'], queryFn: () => fetchUniqueValues('relationship-stages') });
  const { data: uniqueAgeRanges } = useQuery<string[]>({ queryKey: ['uniqueAgeRanges'], queryFn: () => fetchUniqueValues('age-ranges') });

  const handleClearFilters = () => {
    setSelectedStage('all');
    setSelectedAgeRange('all');
  };

  if (isLoading || trendsLoading || ageLoading || stageLoading || urgencyLoading) {
    return <p>Loading sentiment data...</p>;
  }

  if (isError || trendsError || ageError || stageError || urgencyError) {
    return <p className="text-red-500">Failed to fetch sentiment data</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Sentiment Analysis</h1>

      <div className="mb-4 flex space-x-4 items-end">
        <div>
          <label htmlFor="relationship-stage-select" className="block text-sm font-medium text-foreground">Filter by Relationship Stage:</label>
          <Select onValueChange={setSelectedStage} value={selectedStage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a stage" />
            </SelectTrigger>
            <SelectContent>
              {uniqueStages?.map((stage) => (
                <SelectItem key={stage} value={stage}>
                  {stage === 'all' ? 'All Stages' : stage}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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

        <Button onClick={handleClearFilters} className="self-end">Clear All Filters</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Sentiment Overview</h2>
          {sentimentData && sentimentData.length > 0 ? (
            <OverallSentimentPieChart data={sentimentData.slice(0, 5).map(item => ({ name: item._id, value: item.count }))} />
          ) : (
            <p>No sentiment data available.</p>
          )}
        </div>

        <div className="bg-card p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Sentiment Distribution</h2>
          {sentimentData && sentimentData.length > 0 ? (
            <SentimentDistributionChart data={sentimentData.map(item => ({ name: item._id, value: item.count }))} />
          ) : (
            <p>No sentiment distribution data available for the selected filters.</p>
          )}
        </div>

        <div className="bg-card p-4 shadow rounded-lg col-span-full">
          <h2 className="text-xl font-semibold mb-2">Sentiment Over Time</h2>
          {sentimentTrends && sentimentTrends.length > 0 ? (
            <SentimentTrendsChart data={sentimentTrends} />
          ) : (
            <p>No sentiment trends data available.</p>
          )}
        </div>

        <div className="bg-card p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Sentiment by Age Range</h2>
          {sentimentByAge && sentimentByAge.length > 0 ? (
            <SentimentByDemographicsChart data={sentimentByAge} field1Name="Age Range" />
          ) : (
            <p>No sentiment data available for this demographic.</p>
          )}
        </div>

        <div className="bg-card p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Sentiment by Relationship Stage</h2>
          {sentimentByStage && sentimentByStage.length > 0 ? (
            <SentimentByDemographicsChart data={sentimentByStage} field1Name="Relationship Stage" />
          ) : (
            <p>No sentiment data available for this demographic.</p>
          )}
        </div>

        <div className="bg-card p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Urgency Level Distribution</h2>
          {urgencyLevelDistribution && urgencyLevelDistribution.length > 0 ? (
            <UrgencyLevelDistributionChart data={urgencyLevelDistribution} />
          ) : (
            <p>No urgency level data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SentimentPage;