const express = require('express');
const mysql = require('mysql2/promise'); 
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// --- CRITICAL: CORS Configuration ---
// I have put your NEW Vercel URL from your screenshot here.
const VERCEL_FRONTEND_URL = "https://analytics-dashboard-navy-gamma.vercel.app"; 

const corsOptions = {
    // This now allows requests from your new live Vercel app and from localhost
    origin: [VERCEL_FRONTEND_URL, "http://localhost:3000"],
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// --- CRITICAL: Database Connection ---
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { "rejectUnauthorized": false } // The fix for Aiven's SSL
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
// (All endpoints remain the same)

// Endpoint 1: For the main KPI "Cards"
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

// Endpoint 2: For the "Cost per Channel" Pie Chart
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

// Endpoint 3: For the "Performance Over Time" Line Chart
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
        `;

        const [rows] = await pool.query(sql, params); 
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Endpoint 4: For the "Raw Data" Table
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
