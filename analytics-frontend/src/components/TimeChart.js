import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register all the parts we need for a Line chart
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// Color mapping for our channels
const channelColors = {
    'Google Ads': 'rgb(255, 99, 132)',    // Pink
    'Facebook Ads': 'rgb(54, 162, 235)',   // Blue
    'LinkedIn Ads': 'rgb(255, 206, 86)',  // Yellow
    'default': 'rgb(150, 150, 150)'        // Grey fallback
};

const TimeChart = ({ data }) => {
    // 'data' is now an array like: 
    // [ { report_date: '2025-09-05', channel: 'Facebook Ads', totalClicks: 700 },
    //   { report_date: '2025-09-05', channel: 'Google Ads', totalClicks: 550 }, ... ]

    // 1. Get all unique dates from the data and sort them
    const allDates = [...new Set(data.map(item => item.report_date))]
                     .sort((a, b) => new Date(a) - new Date(b));
    
    // 2. Get all unique channel names
    const allChannels = [...new Set(data.map(item => item.channel))];

    // 3. Build the 'datasets' array (one dataset for each channel)
    const datasets = allChannels.map(channel => {
        
        // For each channel, create its data array
        const channelData = allDates.map(date => {
            // Find the data point for this specific channel AND this specific date
            const dataPoint = data.find(
                item => item.report_date === date && item.channel === channel
            );
            return dataPoint ? dataPoint.totalClicks : null;
        });

        // Get the color for this channel
        const color = channelColors[channel] || channelColors.default;

        // Return the dataset object for this channel
        return {
            label: channel,
            data: channelData,
            borderColor: color,
            backgroundColor: color.replace('rgb', 'rgba').replace(')', ', 0.5)'),
            fill: false,
            tension: 0.1,
            spanGaps: true // <-- THIS IS THE NEW LINE TO CONNECT THE DOTS
        };
    });

    // This is the final data object for Chart.js
    const chartData = {
        labels: allDates.map(date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })), // Format dates for display
        datasets: datasets 
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Clicks Over Time by Channel',
                font: { size: 18 }
            },
        },
        scales: { 
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Total Clicks'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Date'
                }
            }
        }
    };

    return <Line options={options} data={chartData} />;
};

export default TimeChart;