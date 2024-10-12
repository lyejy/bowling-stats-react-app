import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import './index.css';

const BowlingStats = () => {
  const [rawStats, setRawStats] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  // Function to fetch the Excel file and process it
  const fetchData = async () => {
    try {
      const response = await axios.get("/bowling_weekly_scores.xlsx", {
        responseType: "arraybuffer",
      });

      // Read the Excel file
      const workbook = XLSX.read(response.data, { type: "array" });

      // Extract the data from each sheet
      const rawStatsSheet = workbook.Sheets["Raw Stats"];
      const leaderboardSheet = workbook.Sheets["Leaderboard"];

      // Convert each sheet to JSON
      const rawStatsData = XLSX.utils.sheet_to_json(rawStatsSheet, { header: 1 });
      const leaderboardData = XLSX.utils.sheet_to_json(leaderboardSheet, { header: 1 });

      // Filter to only display the required portions of the Raw Stats table
      const filteredRawStats = rawStatsData.filter((row, index) => {
        return index >= 0 && index <= 4; // Show only rows for Historical Average, High Score, Wins, and HWA (1st)
      });

      // Filter to remove empty rows from Leaderboard
      const filteredLeaderboard = leaderboardData.filter((row, index) => {
        return index >= 0 && index <= 9;
      });

      setRawStats(filteredRawStats);
      setLeaderboard(filteredLeaderboard);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Bowling Stats</h1>

      {/* First Table: Filtered Raw Stats */}
      <h2>Raw Stats</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            {rawStats[0] && rawStats[0].map((heading, index) => (
              <th key={index}>{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rawStats.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Second Table: Filtered Leaderboard */}
      <h2>Leaderboard</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            {leaderboard[0] && leaderboard[0].map((heading, index) => (
              <th key={index}>{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leaderboard.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BowlingStats;