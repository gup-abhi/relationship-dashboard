"use client";

import { useQuery } from '@tanstack/react-query';
import { api, fetchTopIssues, fetchRecentTrends } from '@/lib/api';
import BarChart from '@/components/TopIssuesChart'; // Reusing TopIssuesChart as a generic BarChart
import RecentTrendsChart from '@/components/RecentTrendsChart';
import Sidebar from '@/components/Sidebar';
import SentimentDistributionChart from '@/components/SentimentDistributionChart';

const fetchKpis = async () => {
  const response = await api.get('/overview/kpis');
  return response;
};

export default function Home() {
  const { data: kpis, isLoading: kpisLoading, isError: kpisError, error: kpisFetchError } = useQuery<any>({ queryKey: ['kpis'], queryFn: fetchKpis });
  const { data: topIssues, isLoading: topIssuesLoading, isError: topIssuesError, error: topIssuesFetchError } = useQuery<any>({ queryKey: ['topIssues'], queryFn: () => fetchTopIssues(5) });
  const { data: recentTrends, isLoading: recentTrendsLoading, isError: recentTrendsError, error: recentTrendsFetchError } = useQuery<any>({ queryKey: ['recentTrends'], queryFn: () => fetchRecentTrends('month', 'created_date') });

  if (kpisLoading || topIssuesLoading || recentTrendsLoading) {
    return <p>Loading Overview Data...</p>;
  }

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
        <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Quick Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Total Posts</p>
              <p className="text-3xl font-bold text-blue-600">{kpis.totalPosts}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Most Common Issue</p>
              <p className="text-xl font-bold text-green-600">{kpis.mostCommonIssue?._id || 'N/A'}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Avg. Complexity Score</p>
              <p className="text-3xl font-bold text-purple-600">{kpis.averageComplexity?.toFixed(2) || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}
      {kpis && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-xl font-semibold">Total Posts</h2>
            <p className="text-3xl font-bold">{kpis.totalPosts}</p>
          </div>
          <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-xl font-semibold">Most Common Issue</h2>
            <p className="text-lg">{kpis.mostCommonIssue?._id || 'N/A'}</p>
          </div>
          <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-xl font-semibold">Average Complexity Score</h2>
            <p className="text-3xl font-bold">{kpis.averageComplexity?.toFixed(2) || 'N/A'}</p>
          </div>
          <div className="bg-white p-4 shadow rounded-lg col-span-full">
            <h2 className="text-xl font-semibold mb-2">Sentiment Distribution</h2>
            {
              kpis.sentimentDistribution && kpis.sentimentDistribution.length > 0 ? (
                <SentimentDistributionChart data={kpis.sentimentDistribution} />
              ) : (
                <p>No sentiment data available.</p>
              )
            }
          </div>

          <div className="bg-white p-4 shadow rounded-lg col-span-full">
            <h2 className="text-xl font-semibold mb-2">Top 5 Issues</h2>
            {topIssues && topIssues.topIssues.length > 0 ? (
              <BarChart data={topIssues.topIssues} />
            ) : (
              <p>No top issues data available.</p>
            )}
          </div>

          <div className="bg-white p-4 shadow rounded-lg col-span-full">
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