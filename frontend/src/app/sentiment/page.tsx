'use client';

import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Sentiment {
  _id: string;
  count: number;
}

const SentimentPage = () => {
  const [sentimentDistribution, setSentimentDistribution] = useState<Sentiment[]>([]);
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

        const stagesData: string[] = await stagesRes.json();
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
    const fetchSentimentDistribution = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        if (selectedStage !== 'all') {
          queryParams.append('relationship_stage', selectedStage);
        }
        if (selectedAgeRange !== 'all') {
          queryParams.append('age_range_op', selectedAgeRange);
        }

        const queryString = queryParams.toString();
        const url = `/api/sentiment/distribution${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Sentiment[] = await response.json();
        setSentimentDistribution(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSentimentDistribution();
  }, [selectedStage, selectedAgeRange]); // Re-fetch when selectedStage or selectedAgeRange changes

  const handleStageChange = (value: string) => {
    setSelectedStage(value);
  };

  const handleAgeRangeChange = (value: string) => {
    setSelectedAgeRange(value);
  };

  if (loading) {
    return <div>Loading sentiment data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Sentiment Analysis</h1>

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
      </div>

      <h2 className="text-xl font-semibold mb-3">Sentiment Distribution</h2>
      {sentimentDistribution.length > 0 ? (
        <ul>
          {sentimentDistribution.map((sentiment) => (
            <li key={sentiment._id} className="mb-1">
              {sentiment._id}: {sentiment.count}
            </li>
          ))}
        </ul>
      ) : (
        <p>No sentiment data found for the selected filters.</p>
      )}
    </div>
  );
};

export default SentimentPage;