"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [kpis, setKpis] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/overview/kpis')
      .then(response => {
        console.log('Response:', response.data);
        setKpis(response.data);
      })
      .catch(error => {
        console.error('Error fetching KPIs:', error);
      });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Overview</h1>
      {kpis ? (
        <div>
          <h2 className="text-xl font-bold">KPIs</h2>
          <pre>{JSON.stringify(kpis, null, 2)}</pre>
        </div>
      ) : (
        <p>Loading KPIs...</p>
      )}
    </div>
  );
}