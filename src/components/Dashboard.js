import React, { useState, useEffect } from 'react';
import { getStatistics } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getStatistics();
        setStats(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch stats');
      }
    };
    fetchStats();
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!stats) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
        <div><span className="font-semibold">Total:</span> {stats.totalTasks}</div>
        <div><span className="font-semibold">Completed:</span> {stats.completedPercentage}%</div>
        <div><span className="font-semibold">Pending:</span> {stats.pendingPercentage}%</div>
        <div><span className="font-semibold">Avg Time:</span> {stats.averageCompletionTime} hrs</div>
      </div>
      <h2 className="text-xl font-bold mt-6 mb-4">Pending Tasks</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              {['Priority', 'Pending', 'Time Lapsed', 'Time to Finish'].map((h) => (
                <th key={h} className="border border-gray-300 px-4 py-2 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stats.pendingSummary.map((row) => (
              <tr key={row.priority} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{row.priority}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{row.pendingTasks}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{row.timeLapsed}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{row.balanceTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;