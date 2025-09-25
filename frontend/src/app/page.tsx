"use client";

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, fetchTopIssues, fetchRecentTrends } from '@/lib/api';
import BarChart from '@/components/TopIssuesChart'; // Reusing TopIssuesChart as a generic BarChart
import RecentTrendsChart from '@/components/RecentTrendsChart';
import SentimentDistributionChart from '@/components/SentimentDistributionChart';
import { useLoader } from '@/components/LoaderProvider';

interface KpiData {
  totalPosts: number;
  mostCommonIssue: { _id: string };
  averageComplexity: number;
  sentimentDistribution: Array<{ _id: string; count: number }>;
}

interface IssueData {
  _id: string;
  count: number;
}

interface TrendData {
  _id: string;
  count: number;
}

const fetchKpis = async (): Promise<KpiData> => {
  const response = await api.get<KpiData>('/overview/kpis');
  return response;
};

export default function Home() {
  const { showLoader, hideLoader } = useLoader();
  const { data: kpis, isFetching: kpisFetching, isError: kpisError, error: kpisFetchError } = useQuery<KpiData>({ queryKey: ['kpis'], queryFn: fetchKpis });
  const { data: topIssues, isFetching: topIssuesFetching, isError: topIssuesError, error: topIssuesFetchError } = useQuery<{ topIssues: IssueData[] }>({ queryKey: ['topIssues'], queryFn: () => fetchTopIssues(5) });
  const { data: recentTrends, isFetching: recentTrendsFetching, isError: recentTrendsError, error: recentTrendsFetchError } = useQuery<{ recentTrends: TrendData[] }>({ queryKey: ['recentTrends'], queryFn: () => fetchRecentTrends('month', 'created_date') });

  useEffect(() => {
    if (kpisFetching || topIssuesFetching || recentTrendsFetching) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [kpisFetching, topIssuesFetching, recentTrendsFetching, showLoader, hideLoader]);

  if (kpisError || topIssuesError || recentTrendsError) {
    return (
      <p className="text-red-500">
        Error: {kpisFetchError?.message || topIssuesFetchError?.message || recentTrendsFetchError?.message || 'Failed to fetch data'}
      </p>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Overview</h1>
      {kpis && (
        <div className="mb-6 p-4 bg-card rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Quick Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-card p-4 rounded-lg shadow">
              <p className="text-sm">Total Posts</p>
              <p className="text-3xl font-bold text-blue-600">{kpis.totalPosts}</p>
            </div>
            <div className="bg-card p-4 rounded-lg shadow">
              <p className="text-sm">Most Common Issue</p>
              <p className="text-xl font-bold text-green-600">{kpis.mostCommonIssue?._id || 'N/A'}</p>
            </div>
            <div className="bg-card p-4 rounded-lg shadow">
              <p className="text-sm">Avg. Complexity Score</p>
              <p className="text-3xl font-bold text-purple-600">{kpis.averageComplexity?.toFixed(2) || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}
      {kpis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-card p-4 shadow rounded-lg col-span-full">
            <h2 className="text-xl font-semibold mb-2">Sentiment Distribution</h2>
            {
              kpis.sentimentDistribution && kpis.sentimentDistribution.length > 0 ? (
                <SentimentDistributionChart data={kpis.sentimentDistribution.map((item) => ({ name: item._id, value: item.count }))} />
              ) : (
                <p>No sentiment data available.</p>
              )
            }
          </div>

          <div className="bg-card p-4 shadow rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Top 5 Issues</h2>
            {topIssues && topIssues.topIssues.length > 0 ? (
              <BarChart data={topIssues.topIssues} title="Top 5 Issues" />
            ) : (
              <p>No top issues data available.</p>
            )}
          </div>

          <div className="bg-card p-4 shadow rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Recent Trends (Posts per Month)</h2>
            {recentTrends && recentTrends.recentTrends.length > 0 ? (
              <RecentTrendsChart data={recentTrends.recentTrends} />
            ) : (
              <p>No recent trends data available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}