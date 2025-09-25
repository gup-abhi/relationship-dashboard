'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import PostVolumeTrendsChart from '@/components/PostVolumeTrendsChart';
import TrendingTopicsChart from '@/components/TrendingTopicsChart'; // Import the new component
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface PostVolumeData {
  _id: string; // Date in YYYY-MM-DD format
  count: number;
}

interface TrendingTopicsData {
  _id: string; // Topic
  count: number;
}

const fetchPostVolume = async (filters?: Record<string, string>): Promise<PostVolumeData[]> => {
  const params = { ...filters, timeUnit: 'month' };
  return api.get('/trends/volume', { params });
};

const fetchTrendingTopics = async (filters?: Record<string, string>): Promise<TrendingTopicsData[]> => {
  return api.get('/trends/topics', { params: filters });
};

const fetchUniqueValues = async (field: string): Promise<string[]> => {
  const response = await api.get<{ [key: string]: { _id: string }[] }>(`/demographics/${field}`);
  const key = Object.keys(response)[0];
  return ['all', ...response[key].map(item => item._id)];
};

const TrendsPage: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedAgeRange, setSelectedAgeRange] = useState<string>('all');

  const filters = {
    ...(selectedStage !== 'all' && { relationship_stage: selectedStage }),
    ...(selectedAgeRange !== 'all' && { age_range_op: selectedAgeRange }),
  };

  const { data: postVolume, isLoading: isLoadingPostVolume, isError: isErrorPostVolume } = useQuery<PostVolumeData[]>({ queryKey: ['postVolume', filters], queryFn: () => fetchPostVolume(filters) });
  const { data: trendingTopics, isLoading: isLoadingTrendingTopics, isError: isErrorTrendingTopics } = useQuery<TrendingTopicsData[]>({ queryKey: ['trendingTopics', filters], queryFn: () => fetchTrendingTopics(filters) });


  const { data: uniqueStages } = useQuery<string[]>({ queryKey: ['uniqueStages'], queryFn: () => fetchUniqueValues('relationship-stages') });
  const { data: uniqueAgeRanges } = useQuery<string[]>({ queryKey: ['uniqueAgeRanges'], queryFn: () => fetchUniqueValues('age-ranges') });

  const handleClearFilters = () => {
    setSelectedStage('all');
    setSelectedAgeRange('all');
  };

  if (isLoadingPostVolume || isLoadingTrendingTopics) {
    return <p>Loading trends data...</p>;
  }

  if (isErrorPostVolume || isErrorTrendingTopics) {
    return <p className="text-red-500">Failed to fetch trends data</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Trends</h1>

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

      <div className="bg-card p-4 shadow rounded-lg mb-4">
        <h2 className="text-xl font-semibold mb-2">Post Volume Over Time</h2>
        {postVolume && postVolume.length > 0 ? (
          <PostVolumeTrendsChart data={postVolume} />
        ) : (
          <p>No post volume data found for the selected filters.</p>
        )}
      </div>

      <div className="bg-card p-4 shadow rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Trending Topics</h2>
        {trendingTopics && trendingTopics.length > 0 ? (
          <TrendingTopicsChart data={trendingTopics} />
        ) : (
          <p>No trending topics data found for the selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default TrendsPage;