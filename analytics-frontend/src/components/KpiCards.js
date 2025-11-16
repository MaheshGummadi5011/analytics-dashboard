import React from 'react';
import './KpiCards.css';

// Function to format numbers nicely
const formatNumber = (num, isCurrency = false, isPercent = false, isRatio = false) => {
    // Convert num to a number, just in case it's a string
    const number = Number(num);
    
    if (isCurrency) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number);
    }
    if (isPercent) {
        return `${number.toFixed(2)}%`;
    }
    if (isRatio) {
        // ROAS is a ratio, so 2 decimal places is standard
        return number.toFixed(2);
    }
    return new Intl.NumberFormat('en-US').format(number);
};

const KpiCards = ({ data }) => {
    // We get the 'data' as a prop from App.js
    // These keys (totalImpressions, etc.) MUST match your backend API response
    const {
        totalImpressions,
        totalClicks,
        totalCost,
        totalConversions,
        totalRevenue, // <-- NEW
        overallCTR,
        overallCPC,
        overallCPA,
        ROAS          // <-- NEW
    } = data;

    return (
        // We update the grid to look good with 8 cards (4 columns)
        <div className="kpi-grid eight-cards">
            <div className="kpi-card">
                <div className="kpi-title">Total Cost</div>
                <div className="kpi-value">{formatNumber(totalCost, true)}</div>
            </div>
            <div className="kpi-card">
                <div className="kpi-title">Total Revenue</div>
                <div className="kpi-value">{formatNumber(totalRevenue, true)}</div>
            </div>
            <div className="kpi-card">
                <div className="kpi-title">ROAS</div>
                <div className="kpi-value">{formatNumber(ROAS, false, false, true)}</div>
            </div>
             <div className="kpi-card">
                <div className="kpi-title">Overall CPA</div>
                <div className="kpi-value">{formatNumber(overallCPA, true)}</div>
            </div>
            <div className="kpi-card">
                <div className="kpi-title">Total Clicks</div>
                <div className="kpi-value">{formatNumber(totalClicks)}</div>
            </div>
            <div className="kpi-card">
                <div className="kpi-title">Total Conversions</div>
                <div className="kpi-value">{formatNumber(totalConversions)}</div>
            </div>
            <div className="kpi-card">
                <div className="kpi-title">Total Impressions</div>
                <div className="kpi-value">{formatNumber(totalImpressions)}</div>
            </div>
            <div className="kpi-card">
                <div className="kpi-title">Overall CPC</div>
                <div className="kpi-value">{formatNumber(overallCPC, true)}</div>
            </div>
            <div className="kpi-card">
                <div className="kpi-title">Overall CTR</div>
                <div className="kpi-value">{formatNumber(overallCTR, false, true)}</div>
            </div>
        </div>
    );
};

export default KpiCards;