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
  const { showLoader, hideLoader } = useLoader();

  const filters = {
    ...(selectedStage !== 'all' && { relationship_stage: selectedStage }),
    ...(selectedAgeRange !== 'all' && { age_range_op: selectedAgeRange }),
  };

  const { data: primaryIssues, isLoading: primaryIssuesLoading, isError: primaryIssuesError } = useQuery<Issue[]>({ queryKey: ['primaryIssues', filters], queryFn: () => fetchPrimaryIssues(filters) });
  const { data: secondaryIssues, isLoading: secondaryIssuesLoading, isError: secondaryIssuesError } = useQuery<Issue[]>({ queryKey: ['secondaryIssues', filters], queryFn: () => fetchSecondaryIssues(filters) });
  const { data: redFlags, isLoading: redFlagsLoading, isError: redFlagsError } = useQuery<Issue[]>({ queryKey: ['redFlags', filters], queryFn: () => fetchRedFlags(filters) });
  const { data: positiveIndicators, isLoading: positiveIndicatorsLoading, isError: positiveIndicatorsError } = useQuery<Issue[]>({ queryKey: ['positiveIndicators', filters], queryFn: () => fetchPositiveIndicators(filters) });
  const { data: keyThemes, isLoading: keyThemesLoading, isError: keyThemesError } = useQuery<Issue[]>({ queryKey: ['keyThemes', filters], queryFn: () => fetchKeyThemes(filters) });

  const { data: relationshipStages } = useQuery<string[]>({ queryKey: ['uniqueRelationshipStages'], queryFn: () => api.get<{ relationshipStagesDistribution: { _id: string }[] }>('/demographics/relationship-stages').then(res => ['all', ...res.relationshipStagesDistribution.map(item => item._id)]) });
  const { data: ageRanges } = useQuery<string[]>({ queryKey: ['uniqueAgeRanges'], queryFn: () => api.get<{ ageDistribution: { _id: string }[] }>('/demographics/age-ranges').then(res => ['all', ...res.ageDistribution.map(item => item._id)]) });

  useEffect(() => {
    if (primaryIssuesLoading || secondaryIssuesLoading || redFlagsLoading || positiveIndicatorsLoading || keyThemesLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [primaryIssuesLoading, secondaryIssuesLoading, redFlagsLoading, positiveIndicatorsLoading, keyThemesLoading, showLoader, hideLoader]);

  const handleStageChange = (value: string) => {
    setSelectedStage(value);
  };

  const handleAgeRangeChange = (value: string) => {
    setSelectedAgeRange(value);
  };

  const handleClearFilters = () => {
    setSelectedStage('all');
    setSelectedAgeRange('all');
  };

  if (primaryIssuesError || secondaryIssuesError || redFlagsError || positiveIndicatorsError || keyThemesError) {
    return <div>Error fetching issues data.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Issues & Themes</h1>

      <div className="mb-4 flex space-x-4">
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
          <ComplexityScoreHistogram relationshipStage={selectedStage} ageRangeOp={selectedAgeRange} />
        </div>

        <div className="bg-card p-4 shadow rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">Key Themes</h2>
          <KeyThemesChart selectedStage={selectedStage} selectedAgeRange={selectedAgeRange} />
        </div>
      </div>
    </div>
  );
};

export default IssuesPage;