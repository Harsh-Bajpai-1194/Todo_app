import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const res = await api.get('/todos/stats', {
          params: { timezone: userTimezone }
        });
        const stats = res.data;

        // Process data to ensure all of the last 7 days are shown, even with 0 tasks
        const labels = [];
        const dataPoints = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);

          // Format date to 'YYYY-MM-DD' in the user's local timezone to match the backend aggregation
          const year = date.getFullYear();
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const day = date.getDate().toString().padStart(2, '0');
          const dateString = `${year}-${month}-${day}`;
          labels.push(date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }));

          const statForDay = stats.find(stat => stat._id === dateString);
          dataPoints.push(statForDay ? statForDay.count : 0);
        }

        setChartData({
          labels,
          datasets: [
            {
              label: 'Tasks Completed',
              data: dataPoints,
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        });
        setError(null);
      } catch (err) {
        setError('Could not fetch statistics.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Tasks Completed in the Last 7 Days', font: { size: 18 } },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  if (loading) return <div className="text-center p-4">Loading dashboard...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Productivity Dashboard</h1>
      <div className="bg-white p-4 rounded-lg shadow-md">
        {chartData ? <Bar options={options} data={chartData} /> : <p>No data to display.</p>}
      </div>
    </div>
  );
};

export default Dashboard;