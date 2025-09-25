"use client";

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function Home() {
  const [kpis, setKpis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKpis = async () => {
      try {
        setLoading(true);
        const response = await api.get('/overview/kpis');
        setKpis(response);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch KPIs');
      } finally {
        setLoading(false);
      }
    };

    fetchKpis();
  }, []);

  if (loading) {
    return <p>Loading KPIs...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Overview</h1>
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
                <ul>
                  {kpis.sentimentDistribution.map((sentiment: any) => (
                    <li key={sentiment._id} className="flex justify-between items-center py-1">
                      <span className="font-medium">{sentiment._id || 'Unknown'}:</span>
                      <span>{sentiment.count}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No sentiment data available.</p>
              )
            }
          </div>
        </div>
      )}
    </div>
  );
}