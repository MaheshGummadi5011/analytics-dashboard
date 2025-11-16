import React from 'react';
import './DataTable.css';

const DataTable = ({ data }) => {
    return (
        <div className="table-container">
            <h2>Raw Campaign Data</h2>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Channel</th>
                        <th>Impressions</th>
                        <th>Clicks</th>
                        <th>Cost</th>
                        <th>Conversions</th>
                        <th>Revenue</th> {/* <-- ADDED */}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        // We use row.id or a unique key, since we don't have id, we'll use date+channel
                        <tr key={`${row.report_date}-${row.channel}`}>
                            <td>{row.report_date}</td>
                            <td>{row.channel}</td>
                            <td>{row.impressions}</td>
                            <td>{row.clicks}</td>
                            <td>${row.cost}</td>
                            <td>{row.conversions}</td>
                            <td>${row.revenue}</td> {/* <-- ADDED */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;