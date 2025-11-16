const express = require('express');
const mysql = require('mysql2/promise'); 
const cors = require('cors');

const app = express();
// Render will set the PORT environment variable.
// We use that, or 5000 for local development.
const port = process.env.PORT || 5000;

// --- CRITICAL: CORS Configuration ---
// This is a placeholder. After you deploy your Vercel frontend,
// you will need to come back and replace this URL.
const VERCEL_FRONTEND_URL = "http://localhost:3000"; // <-- We will change this later

const corsOptions = {
    // We allow both the future Vercel URL and our local development URL
    origin: [VERCEL_FRONTEND_URL, "http://localhost:3000"],
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// --- CRITICAL: Database Connection ---
// This code now reads from the Render Environment Variables
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT, // We now use the port from Aiven
    ssl: { "rejectUnauthorized": true } // Aiven requires SSL
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