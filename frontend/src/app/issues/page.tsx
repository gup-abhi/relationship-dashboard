'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { api, fetchPrimaryIssues, fetchSecondaryIssues, fetchRedFlags, fetchPositiveIndicators, fetchKeyThemes } from '@/lib/api';
import TopIssuesChart from '@/components/TopIssuesChart';
import SecondaryIssuesWordCloud from '@/components/SecondaryIssuesWordCloud';
import KeyThemesChart from '@/components/KeyThemesChart';
import ComplexityScoreHistogram from '@/components/ComplexityScoreHistogram';
import { useLoader } from '@/components/LoaderProvider';

interface Issue {
  _id: string;
  count: number;
}

const IssuesPage = () => {
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedAgeRange, setSelectedAgeRange] = useState<string>('all');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<string>('all');
  const { showLoader, hideLoader } = useLoader();

  const filters = {
    ...(selectedStage !== 'all' && { relationship_stage: selectedStage }),
    ...(selectedAgeRange !== 'all' && { age_range_op: selectedAgeRange }),
    ...(selectedTimePeriod !== 'all' && { time_period: selectedTimePeriod }),
  };

  const { data: primaryIssues, isFetching: primaryIssuesFetching, isError: primaryIssuesError } = useQuery<Issue[]>({ queryKey: ['primaryIssues', filters], queryFn: () => fetchPrimaryIssues(filters) });
  const { data: secondaryIssues, isFetching: secondaryIssuesFetching, isError: secondaryIssuesError } = useQuery<Issue[]>({ queryKey: ['secondaryIssues', filters], queryFn: () => fetchSecondaryIssues(filters) });
  const { data: redFlags, isFetching: redFlagsFetching, isError: redFlagsError } = useQuery<Issue[]>({ queryKey: ['redFlags', filters], queryFn: () => fetchRedFlags(filters) });
  const { data: positiveIndicators, isFetching: positiveIndicatorsFetching, isError: positiveIndicatorsError } = useQuery<Issue[]>({ queryKey: ['positiveIndicators', filters], queryFn: () => fetchPositiveIndicators(filters) });
  const { data: keyThemes, isFetching: keyThemesFetching, isError: keyThemesError } = useQuery<Issue[]>({ queryKey: ['keyThemes', filters], queryFn: () => fetchKeyThemes(filters) });

  const { data: relationshipStages } = useQuery<string[]>({ queryKey: ['uniqueRelationshipStages'], queryFn: () => api.get<{ relationshipStagesDistribution: { _id: string }[] }>('/demographics/relationship-stages').then(res => ['all', ...res.relationshipStagesDistribution.map(item => item._id)]) });
  const { data: ageRanges } = useQuery<string[]>({ queryKey: ['uniqueAgeRanges'], queryFn: () => api.get<{ ageDistribution: { _id: string }[] }>('/demographics/age-ranges').then(res => ['all', ...res.ageDistribution.map(item => item._id)]) });

  useEffect(() => {
    if (primaryIssuesFetching || secondaryIssuesFetching || redFlagsFetching || positiveIndicatorsFetching || keyThemesFetching) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [primaryIssuesFetching, secondaryIssuesFetching, redFlagsFetching, positiveIndicatorsFetching, keyThemesFetching, showLoader, hideLoader]);

  const handleStageChange = (value: string) => {
    setSelectedStage(value);
  };

  const handleAgeRangeChange = (value: string) => {
    setSelectedAgeRange(value);
  };

  const handleClearFilters = () => {
    setSelectedStage('all');
    setSelectedAgeRange('all');
    setSelectedTimePeriod('all');
  };

  if (primaryIssuesError || secondaryIssuesError || redFlagsError || positiveIndicatorsError || keyThemesError) {
    return <div>Error fetching issues data.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Issues & Themes</h1>

      <div className="mb-4 flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:items-end">
        <div>
          <label htmlFor="relationship-stage-select" className="block text-sm font-medium text-foreground">Filter by Relationship Stage:</label>
          <Select onValueChange={handleStageChange} value={selectedStage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a stage" />
            </SelectTrigger>
            <SelectContent>
              {relationshipStages?.map((stage) => (
                <SelectItem key={stage} value={stage}>
                  {stage === 'all' ? 'All Stages' : stage}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="age-range-select" className="block text-sm font-medium text-foreground">Filter by Age Range:</label>
          <Select onValueChange={handleAgeRangeChange} value={selectedAgeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select an age range" />
            </SelectTrigger>
            <SelectContent>
              {ageRanges?.map((range) => (
                <SelectItem key={range} value={range}>
                  {range === 'all' ? 'All Age Ranges' : range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="time-period-select" className="block text-sm font-medium text-foreground">Filter by Time Period:</label>
          <Select onValueChange={setSelectedTimePeriod} value={selectedTimePeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="last_24_hours">Last 24 hours</SelectItem>
              <SelectItem value="last_7_days">Last 7 days</SelectItem>
              <SelectItem value="last_30_days">Last 30 days</SelectItem>
              <SelectItem value="last_12_months">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleClearFilters} className="mt-auto">Clear Filters</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <div className="bg-card p-4 shadow rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">Primary Issues</h2>
          {primaryIssues && primaryIssues.length > 0 ? (
            <TopIssuesChart data={primaryIssues} title="Primary Issues" />
          ) : (
            <p>No primary issues found for the selected filters.</p>
          )}
        </div>

        <div className="bg-card p-4 shadow rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">Secondary Issues</h2>
          {secondaryIssues && secondaryIssues.length > 0 ? (
            <SecondaryIssuesWordCloud data={secondaryIssues} />
          ) : (
            <p>No secondary issues found.</p>
          )}
        </div>

        <div className="bg-card p-4 shadow rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">Red Flags Frequency</h2>
          {redFlags && redFlags.length > 0 ? (
            <TopIssuesChart data={redFlags} title="Red Flags" />
          ) : (
            <p>No red flags found.</p>
          )}
        </div>

        <div className="bg-card p-4 shadow rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">Positive Indicators</h2>
          {positiveIndicators && positiveIndicators.length > 0 ? (
            <TopIssuesChart data={positiveIndicators} title="Positive Indicators" />
          ) : (
            <p>No positive indicators found.</p>
          )}
        </div>

        <div className="bg-card p-4 shadow rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">Complexity Score Distribution</h2>
          <ComplexityScoreHistogram relationshipStage={selectedStage} ageRangeOp={selectedAgeRange} timePeriod={selectedTimePeriod} />
        </div>

        <div className="bg-card p-4 shadow rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">Key Themes</h2>
          {keyThemes && keyThemes.length > 0 ? (
            <KeyThemesChart data={keyThemes} />
          ) : (
            <p>No key themes data found for the selected filters.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IssuesPage;