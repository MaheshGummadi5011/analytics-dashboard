import React from 'react';
import { Doughnut } from 'react-chartjs-2'; // <-- Change Pie to Doughnut
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// This is a crucial step!
// We must register the components we're using from Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const ChannelChart = ({ data }) => {
    // 'data' is the array from your '/api/cost-by-channel' endpoint
    // e.g., [ { channel: 'Google Ads', totalCost: '...' }, { channel: 'Facebook Ads', totalCost: '...' } ]

    const chartData = {
        labels: data.map(item => item.channel),
        datasets: [
            {
                label: 'Cost by Channel',
                data: data.map(item => item.totalCost),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Cost by Channel',
                font: { size: 18 }
            },
        },
    };

    return <Doughnut data={chartData} options={options} />; // <-- Change Pie to Doughnut
};

export default ChannelChart;