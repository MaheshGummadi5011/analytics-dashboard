# Digital Campaign Analytics Dashboard 📈

[![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)](https://analytics-dashboard-navy-gamma.vercel.app/)
[![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)](https://reactjs.org/)
[![Database](https://img.shields.io/badge/Database-MySQL_Cloud-orange?style=for-the-badge)](https://aiven.io/)

> **A full-stack BI solution engineered to calculate, benchmark, and visualize high-volume digital marketing data.**

🔗 **[Launch Live Dashboard](https://analytics-dashboard-navy-gamma.vercel.app/)**

---

## 📋 Executive Summary
This project addresses a critical challenge in digital marketing: **fragmented data**. By unifying campaign metrics from Google, Facebook, and LinkedIn into a single dashboard, this tool enables stakeholders to monitor **ROAS** (Return on Ad Spend) and **CPA** (Cost Per Acquisition) in real-time.

It demonstrates not just full-stack development capability, but an understanding of **marketing analytics pipelines**—from raw data ingestion to actionable visualization.

---

## 📷 Interface Preview

### 1. The Dashboard (Live)
*Real-time visualization of multi-channel performance trends.*

<details>
<summary><b>🔽 Click here to view the Full-Page Scrolling Screenshot</b></summary>
<br>
  <img width="1865" height="2613" alt="analytics-dashboard-navy-gamma vercel app_" src="https://github.com/user-attachments/assets/5e56b30b-af7d-43ae-88ee-07e2ae0aa3ac" />

</details>

---

## 💡 The Analyst Approach: "Verify Before You Build"
*As an aspiring Digital Media Analyst, I believe data accuracy is paramount. Before writing a single line of code, I prototyped the logic to ensure statistical correctness.*

### Phase 1: Excel Validation 📊
I utilized **Microsoft Excel (Pivot Tables & Calculated Fields)** to:
1.  **Aggregate** raw daily data to verify the "Source of Truth."
2.  **Model** the formulas for **ROAS** and **CPA** manually.
3.  **Cross-reference** these values against the SQL outputs to guarantee 100% reporting accuracy.
<img width="1920" height="995" alt="excel" src="https://github.com/user-attachments/assets/d6345d37-43e1-4be3-ac10-a82938e2865b" />

---

## 🚀 Technical Architecture

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | React.js, Chart.js | Dynamic rendering of line charts & KPI cards. |
| **Backend** | Node.js, Express.js | REST API architecture to handle data requests. |
| **Database** | MySQL (Aiven Cloud) | Relational storage for structured campaign data. |
| **DevOps** | Vercel & Render | CI/CD pipeline for automated deployment. |

### Key Features Implemented
* **Dynamic SQL Aggregation:** Backend logic sums traffic and conversion data dynamically based on user-selected date ranges.
* **Cross-Platform Benchmarking:** Normalized data structures to allow direct comparison of disparate platforms (e.g., comparing LinkedIn 'Leads' vs. Google 'Conversions').
* **Security & Optimization:** Implemented strict **CORS** policies and SSL database connections to ensure data integrity during transit.

---

## 🛠 Installation & Setup

To audit the code or run this locally:

```bash
# 1. Clone the repository
git clone [https://github.com/MaheshGummadi5011/Digital-Campaign-Dashboard.git](https://github.com/MaheshGummadi5011/Digital-Campaign-Dashboard.git)

# 2. Install Dependencies
cd client && npm install
cd ../server && npm install

# 3. Setup Environment (.env)
# Create a .env file in /server with:
# DB_HOST=your-aiven-host
# DB_USER=your-user
# DB_PASS=your-password

# 4. Launch Application
npm start
