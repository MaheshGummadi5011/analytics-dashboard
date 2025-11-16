const express = require('express');
const mysql = require('mysql2/promise'); 
const cors = require('cors');

const app = express();
app.use(cors());
const port = 5000;

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root', // <-- !! REMEMBER TO CHECK YOUR PASSWORD !!
    database: 'marketing_db'
});

// Helper function
const buildWhereClause = (startDate, endDate) => {
    let whereClause = "";
    let params = [];
    if (startDate && endDate) {
        whereClause = "WHERE report_date BETWEEN ? AND ?";
        params = [startDate, endDate];
    }
    return { whereClause, params };
};


// --- API Endpoints ---

// Endpoint 1: For the main KPI "Cards" (No Change)
app.get('/api/kpis', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const { whereClause, params } = buildWhereClause(startDate, endDate);
        const sql = `
            SELECT
                SUM(impressions) AS totalImpressions,
                SUM(clicks) AS totalClicks,
                SUM(cost) AS totalCost,
                SUM(conversions) AS totalConversions,
                SUM(revenue) AS totalRevenue,
                (SUM(clicks) / SUM(impressions)) * 100 AS overallCTR,
                (SUM(cost) / SUM(clicks)) AS overallCPC,
                (SUM(cost) / SUM(conversions)) AS overallCPA,
                (SUM(revenue) / SUM(cost)) AS ROAS
            FROM campaign_data
            ${whereClause}; 
        `; 
        const [rows] = await pool.query(sql, params); 
        res.json(rows[0]); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Endpoint 2: For the "Cost per Channel" Pie Chart (No Change)
app.get('/api/cost-by-channel', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const { whereClause, params } = buildWhereClause(startDate, endDate);
        const sql = `
            SELECT
                channel,
                SUM(cost) AS totalCost
            FROM campaign_data
            ${whereClause}
            GROUP BY channel;
        `;
        const [rows] = await pool.query(sql, params);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// --- Endpoint 3: (UPGRADED) ---
// This now groups by date AND channel to get data for each line
app.get('/api/performance-over-time', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const { whereClause, params } = buildWhereClause(startDate, endDate);

        const sql = `
            SELECT
                DATE_FORMAT(report_date, '%Y-%m-%d') AS report_date,
                channel,
                SUM(clicks) AS totalClicks
            FROM campaign_data
            ${whereClause}
            GROUP BY report_date, channel
            ORDER BY report_date ASC, channel ASC;
        `; // <-- QUERY IS NOW UPGRADED

        const [rows] = await pool.query(sql, params); 
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Endpoint 4: For the "Raw Data" Table (No Change)
app.get('/api/raw-data', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const { whereClause, params } = buildWhereClause(startDate, endDate);
        const sql = `
            SELECT 
                DATE_FORMAT(report_date, '%Y-%m-%d') AS report_date,
                channel,
                impressions,
                clicks,
                cost,
                conversions,
                revenue
            FROM campaign_data
            ${whereClause}
            ORDER BY report_date DESC;
        `;
        const [rows] = await pool.query(sql, params); 
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Analytics backend listening at http://localhost:${port}`);
});