'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, fetchTrendingTopics, fetchPostVolume } from '@/lib/api';
import PostVolumeTrendsChart from '@/components/PostVolumeTrendsChart';
import TrendingTopicsChart from '@/components/TrendingTopicsChart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useLoader } from '@/components/LoaderProvider';

interface PostVolumeData {
  _id: string; // Date in YYYY-MM-DD format
  count: number;
}

interface TrendingTopicsData {
  date: string;
  [topic: string]: number | string;
}

const fetchUniqueValues = async (field: string): Promise<string[]> => {
  const response = await api.get<{ [key: string]: { _id: string }[] }>(`/demographics/${field}`);
  const key = Object.keys(response)[0];
  return ['all', ...response[key].map(item => item._id)];
};

const TrendsPage: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedAgeRange, setSelectedAgeRange] = useState<string>('all');
  const [commonTimeUnit, setCommonTimeUnit] = useState<string>('month');
  const { showLoader, hideLoader } = useLoader();

  const filters = {
    ...(selectedStage !== 'all' && { relationship_stage: selectedStage }),
    ...(selectedAgeRange !== 'all' && { age_range_op: selectedAgeRange }),
    timeUnit: commonTimeUnit,
  };

  const { data: postVolume, isFetching: isFetchingPostVolume, isError: isErrorPostVolume } = useQuery<PostVolumeData[]>({ queryKey: ['postVolume', filters], queryFn: () => fetchPostVolume(filters) });
  const { data: trendingTopics, isFetching: isFetchingTrendingTopics, isError: isErrorTrendingTopics } = useQuery<TrendingTopicsData[]>({ queryKey: ['trendingTopics', filters], queryFn: () => fetchTrendingTopics(commonTimeUnit, 'created_date', filters) });


  const { data: uniqueStages } = useQuery<string[]>({ queryKey: ['uniqueStages'], queryFn: () => fetchUniqueValues('relationship-stages') });
  const { data: uniqueAgeRanges } = useQuery<string[]>({ queryKey: ['uniqueAgeRanges'], queryFn: () => fetchUniqueValues('age-ranges') });

  useEffect(() => {
    if (isFetchingPostVolume || isFetchingTrendingTopics) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [isFetchingPostVolume, isFetchingTrendingTopics, showLoader, hideLoader]);

  const handleClearFilters = () => {
    setSelectedStage('all');
    setSelectedAgeRange('all');
    setCommonTimeUnit('month');
  };

  if (isErrorPostVolume || isErrorTrendingTopics) {
    return <p className="text-red-500">Failed to fetch trends data</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Trends</h1>

      <div className="mb-4 flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:items-end">
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

        <div>
          <label htmlFor="time-unit-select" className="block text-sm font-medium text-foreground">Time Unit:</label>
          <Select onValueChange={setCommonTimeUnit} value={commonTimeUnit}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select time unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="year">Year</SelectItem>
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
        <h2 className="text-xl font-semibold mb-2">Trending Topics Over Time</h2>
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