import { useState, useEffect } from 'react';
import { Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import { Spin, Typography } from 'antd';
import { getToken, getUserIdFromToken } from '../../utils/auth';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const API_URL = import.meta.env.VITE_API_URL;

const ChartSection = () => {
  const [songData, setSongData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(getUserIdFromToken);

  const token = getToken();

  useEffect(() => {
    if (token) {
      setUserId(getUserIdFromToken);
    }
  }, [userId, token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}song/GetAllByUserId/${userId}?PageNumber=1&PageSize=10`);
        setSongData(response.data.songs);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const lineChartData = {
    labels: songData.map(song => song.name),
    datasets: [
      {
        label: 'Play Count',
        data: songData.map(song => song.count),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const doughnutChartData = {
    labels: songData.map(song => song.name),
    datasets: [
      {
        data: songData.map(song => song.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Song Play Count Trends',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Play Count Distribution',
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-5 grid-rows-5 gap-4 p-6">
      <div className="col-span-3 row-span-3 bg-white p-4 rounded-lg shadow">
        <Line data={lineChartData} options={lineOptions} />
      </div>
      <div className="col-span-2 row-span-3 col-start-4 bg-white p-4 rounded-lg shadow">
        <Doughnut data={doughnutChartData} options={doughnutOptions} />
      </div>
      <div className="col-span-5 row-span-2 row-start-4 bg-white p-4 rounded-lg shadow">
        <Typography.Title level={4}>Top Songs Statistics</Typography.Title>
        {/* Add additional statistics or information here */}
      </div>
    </div>
  );
};

export default ChartSection;