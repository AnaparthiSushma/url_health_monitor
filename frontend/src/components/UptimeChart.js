import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const UptimeChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/health/history');
        const sorted = res.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        const labels = sorted.map(item => new Date(item.timestamp).toLocaleTimeString());
        const responseTimes = sorted.map(item => item.responseTime);
        const statuses = sorted.map(item => item.status === 'UP' ? 1 : 0);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Response Time (ms)',
              data: responseTimes,
              borderColor: 'blue',
              backgroundColor: 'lightblue',
              yAxisID: 'y',
            },
            {
              label: 'Status (1=UP, 0=DOWN)',
              data: statuses,
              borderColor: 'green',
              backgroundColor: 'lightgreen',
              yAxisID: 'y1',
            }
          ],
        });
      } catch (err) {
        console.error('Failed to load chart data:', err);
      }
    };
    fetchHistory();
  }, []);

  if (!chartData) return <p>Loading chart...</p>;

  return (
    <div>
      <h3>📈 Uptime & Response Time Chart</h3>
      <Line
        data={chartData}
        options={{
          responsive: true,
          interaction: { mode: 'index', intersect: false },
          stacked: false,
          scales: {
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              title: { display: true, text: 'Response Time (ms)' },
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              title: { display: true, text: 'Status (1=UP, 0=DOWN)' },
              grid: { drawOnChartArea: false },
            },
          },
        }}
      />
    </div>
  );
};

export default UptimeChart;
