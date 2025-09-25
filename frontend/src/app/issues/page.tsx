'use client';

import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button'; // Assuming Button component exists
import { api, fetchMostCommonIssuesDistribution } from '@/lib/api';
import TopIssuesChart from '@/components/TopIssuesChart';
import SecondaryIssuesWordCloud from '@/components/SecondaryIssuesWordCloud';
import KeyThemesChart from '@/components/KeyThemesChart';

interface Issue {
  _id: string;
  count: number;
}

const IssuesPage = () => {
  const [primaryIssues, setPrimaryIssues] = useState<Issue[]>([]);
  const [secondaryIssues, setSecondaryIssues] = useState<Issue[]>([]);
  const [redFlags, setRedFlags] = useState<Issue[]>([]);
  const [positiveIndicators, setPositiveIndicators] = useState<Issue[]>([]);
  const [keyThemes, setKeyThemes] = useState<Issue[]>([]);
  const [relationshipStages, setRelationshipStages] = useState<string[]>([]);
  const [ageRanges, setAgeRanges] = useState<string[]>([]);
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedAgeRange, setSelectedAgeRange] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [stagesRes, ageRangesRes] = await Promise.all([
          fetch('/api/demographics/relationship-stages'),
          fetch('/api/demographics/age-ranges'),
        ]);

        if (!stagesRes.ok) throw new Error(`HTTP error! status: ${stagesRes.status} for stages`);
        if (!ageRangesRes.ok) throw new Error(`HTTP error! status: ${ageRangesRes.status} for age ranges`);

        const stagesResponse = await stagesRes.json();
        const stagesData: string[] = stagesResponse.relationshipStagesDistribution.map((item: any) => item._id);
        const ageRangesResponse = await ageRangesRes.json();
        const ageRangesData: string[] = ageRangesResponse.ageDistribution.map((item: any) => item._id);

        setRelationshipStages(['all', ...stagesData]); // Add 'all' option for 'All'
        setAgeRanges(['all', ...ageRangesData]); // Add 'all' option for 'All'
      } catch (err: any) {
        console.error("Failed to fetch filters:", err);
        // setError(err.message); // Decide if you want to show this error to the user
      }
    };

    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchIssueData = async () => {
      setLoading(true);
      setError(null);
      try {
        const commonQueryParams = new URLSearchParams();
        if (selectedStage !== 'all') {
          commonQueryParams.append('relationship_stage', selectedStage);
        }
        if (selectedAgeRange !== 'all') {
          commonQueryParams.append('age_range_op', selectedAgeRange);
        }
        const commonQueryString = commonQueryParams.toString();

        // Fetch primary issues
        const primaryIssuesUrl = `/api/issues/primary${commonQueryString ? `?${commonQueryString}` : ''}`;
        const primaryIssuesResponse = await fetch(primaryIssuesUrl);
        if (!primaryIssuesResponse.ok) {
          throw new Error(`HTTP error! status: ${primaryIssuesResponse.status} for primary issues`);
        }
        const primaryIssuesData: Issue[] = await primaryIssuesResponse.json();
        setPrimaryIssues(primaryIssuesData);

        // Fetch secondary issues
        const secondaryIssuesUrl = `/api/issues/secondary${commonQueryString ? `?${commonQueryString}` : ''}`;
        const secondaryIssuesResponse = await fetch(secondaryIssuesUrl);
        if (!secondaryIssuesResponse.ok) {
          throw new Error(`HTTP error! status: ${secondaryIssuesResponse.status} for secondary issues`);
        }
        const secondaryIssuesData: Issue[] = await secondaryIssuesResponse.json();
        setSecondaryIssues(secondaryIssuesData);

        // Fetch red flags
        const redFlagsUrl = `/api/issues/red-flags${commonQueryString ? `?${commonQueryString}` : ''}`;
        const redFlagsResponse = await fetch(redFlagsUrl);
        if (!redFlagsResponse.ok) {
          throw new Error(`HTTP error! status: ${redFlagsResponse.status} for red flags`);
        }
        const redFlagsData: Issue[] = await redFlagsResponse.json();
        setRedFlags(redFlagsData);

        // Fetch positive indicators
        const positiveIndicatorsUrl = `/api/issues/positive-indicators${commonQueryString ? `?${commonQueryString}` : ''}`;
        const positiveIndicatorsResponse = await fetch(positiveIndicatorsUrl);
        if (!positiveIndicatorsResponse.ok) {
          throw new Error(`HTTP error! status: ${positiveIndicatorsResponse.status} for positive indicators`);
        }
        const positiveIndicatorsData: Issue[] = await positiveIndicatorsResponse.json();
        setPositiveIndicators(positiveIndicatorsData);

        // Fetch key themes
        const keyThemesUrl = `/api/issues/themes${commonQueryString ? `?${commonQueryString}` : ''}`;
        const keyThemesResponse = await fetch(keyThemesUrl);
        if (!keyThemesResponse.ok) {
          throw new Error(`HTTP error! status: ${keyThemesResponse.status} for key themes`);
        }
        const keyThemesData: Issue[] = await keyThemesResponse.json();
        setKeyThemes(keyThemesData);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIssueData();
  }, [selectedStage, selectedAgeRange]); // Re-fetch when selectedStage or selectedAgeRange changes

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

  if (loading) {
    return <div>Loading issues...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Issues & Themes</h1>

      <div className="mb-4 flex space-x-4">
        <div>
          <label htmlFor="relationship-stage-select" className="block text-sm font-medium text-gray-700">Filter by Relationship Stage:</label>
          <Select onValueChange={handleStageChange} value={selectedStage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a stage" />
            </SelectTrigger>
            <SelectContent>
              {relationshipStages.map((stage) => (
                <SelectItem key={stage} value={stage}>
                  {stage === 'all' ? 'All Stages' : stage}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="age-range-select" className="block text-sm font-medium text-gray-700">Filter by Age Range:</label>
          <Select onValueChange={handleAgeRangeChange} value={selectedAgeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select an age range" />
            </SelectTrigger>
            <SelectContent>
              {ageRanges.map((range) => (
                <SelectItem key={range} value={range}>
                  {range === 'all' ? 'All Age Ranges' : range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleClearFilters} className="mt-auto">Clear Filters</Button>
      </div>

      <h2 className="text-xl font-semibold mb-3">Primary Issues</h2>
      {primaryIssues.length > 0 ? (
        <TopIssuesChart data={primaryIssues} title="Primary Issues" />
      ) : (
        <p>No primary issues found for the selected filters.</p>
      )}

      <h2 className="text-xl font-semibold mb-3 mt-6">Secondary Issues</h2>
      {secondaryIssues.length > 0 ? (
        <SecondaryIssuesWordCloud data={secondaryIssues} />
      ) : (
        <p>No secondary issues found.</p>
      )}

      <h2 className="text-xl font-semibold mb-3 mt-6">Red Flags Frequency</h2>
      {redFlags.length > 0 ? (
        <TopIssuesChart data={redFlags} title="Red Flags" />
      ) : (
        <p>No red flags found.</p>
      )}

      <h2 className="text-xl font-semibold mb-3 mt-6">Positive Indicators</h2>
      {positiveIndicators.length > 0 ? (
        <TopIssuesChart data={positiveIndicators} title="Positive Indicators" />
      ) : (
        <p>No positive indicators found.</p>
      )}

      <KeyThemesChart selectedStage={selectedStage} selectedAgeRange={selectedAgeRange} />
    </div>
  );
};

export default IssuesPage;