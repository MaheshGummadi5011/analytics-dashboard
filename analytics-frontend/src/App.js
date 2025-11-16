import React, { useState, useEffect } from 'react';
import axios from 'axios';
import KpiCards from './components/KpiCards';
import ChannelChart from './components/ChannelChart';
import TimeChart from './components/TimeChart';
import DataTable from './components/DataTable';
import './App.css'; 

function App() {
    // State for all 4 data pieces
    const [kpis, setKpis] = useState(null);
    const [channelData, setChannelData] = useState(null);
    const [timeData, setTimeData] = useState(null);
    const [rawData, setRawData] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Loading state

    // --- UPDATED State for Date Filtering ---
    // We now set the default to cover all our new data (Sept-Nov)
    const [formStartDate, setFormStartDate] = useState('2025-09-01');
    const [formEndDate, setFormEndDate] = useState('2025-11-30');
    
    // This state "triggers" the API call
    const [activeFilter, setActiveFilter] = useState({
        start: '2025-09-01',
        end: '2025-11-30'
    });

    // Your backend API URL
    const API_URL = 'https://analytics-dashboard-backend-zehc.onrender.com';

    // This useEffect now depends on 'activeFilter'
    // It will run on first load, AND any time 'activeFilter' changes
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true); // Show loading spinner
            try {
                // Get start and end dates from the activeFilter state
                // THIS IS THE CORRECTED LINE:
                const { start, end } = activeFilter;

                // Build the query parameter string
                const params = new URLSearchParams({ startDate: start, endDate: end });

                // Fetch all 4 endpoints with the new date parameters
                const [kpiRes, channelRes, timeRes, rawRes] = await Promise.all([
                    axios.get(`${API_URL}/api/kpis?${params}`),
                    axios.get(`${API_URL}/api/cost-by-channel?${params}`),
                    axios.get(`${API_URL}/api/performance-over-time?${params}`),
                    axios.get(`${API_URL}/api/raw-data?${params}`)
                ]);

                // Set all 4 pieces of data
                setKpis(kpiRes.data);
                setChannelData(channelRes.data);
                setTimeData(timeRes.data);
                setRawData(rawRes.data);

            } catch (err) {
                console.error("Error fetching data:", err);
            }
            setIsLoading(false); // Hide loading spinner
        };

        fetchData();
    }, [activeFilter]); // <-- This dependency is the key

    // This function runs when the user clicks the "Filter" button
    const handleFilterClick = () => {
        // This updates the 'activeFilter', which triggers the useEffect
        setActiveFilter({
            start: formStartDate,
            end: formEndDate
        });
    };

    // Show a loading message while fetching
    if (isLoading) {
        return <div className="loading-container">Loading your dashboard...</div>;
    }

    // --- Main Dashboard Render ---
    return (
        <div className="dashboard-container">
            <header>
                <h1>My Marketing KPI Dashboard</h1>
            </header>
            
            {/* --- Date Filter Bar --- */}
            <section className="filter-bar">
                <div className="filter-group">
                    <label htmlFor="start-date">Start Date</label>
                    <input 
                        type="date" 
                        id="start-date"
                        value={formStartDate}
                        onChange={(e) => setFormStartDate(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <label htmlFor="end-date">End Date</label>
                    <input 
                        type="date" 
                        id="end-date"
                        value={formEndDate}
                        onChange={(e) => setFormEndDate(e.target.value)}
                    />
                </div>
                <button className="filter-button" onClick={handleFilterClick}>
                    Apply Filter
                </button>
            </section>

            {/* Section 1: KPI Cards */}
            <section className="kpi-section">
                <KpiCards data={kpis} />
            </section>
            
            {/* Section 2: Charts */}
            <section className="chart-section">
                <div className="chart-wrapper">
                    {/* We must check if data exists, as filtering can return empty data */}
                    {channelData && channelData.length > 0 ? 
                        <ChannelChart data={channelData} /> : 
                        <p>No channel data for this period.</p>}
                </div>
                <div className="chart-wrapper">
                    {timeData && timeData.length > 0 ? 
                        <TimeChart data={timeData} /> :
                        <p>No performance data for this period.</p>}
                </div>
            </section>
            
            {/* Section 3: Raw Data Table */}
            <section className="table-section">
                {rawData && rawData.length > 0 ? 
                    <DataTable data={rawData} /> :
                    <p>No raw data for this period.</p>}
            </section>
        </div>
    );
}

export default App;
