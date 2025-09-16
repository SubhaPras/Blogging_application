import React, { useEffect, useState } from "react";
import DashNavbar from "./DashNavbar";
import "./Dashboard.css";
import axios from "axios";

const Dashboard = () => {
  const [analysis, setAnalysis] = useState({
    writingStyle: "",
    strengths: "",
    suggestions: "",
  });

  const fetchAnalysis = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/user/analysis", {
        withCredentials: true,
      });

      if (res.data.success) {
        const text = res.data.result;
        localStorage.setItem("analysis", JSON.stringify(res.data.result));
        
        const lines = text.split("\n");

        let writing = "";
        let strengths = "";
        let suggestions = "";
        let currentSection = "";

        lines.forEach((line) => {
          if (line.toLowerCase().includes("writing style")) {
            currentSection = "writing";
          } else if (line.toLowerCase().includes("strength")) {
            currentSection = "strengths";
          } else if (line.toLowerCase().includes("suggestion")) {
            currentSection = "suggestions";
          } else {
            if (currentSection === "writing") writing += line + " ";
            if (currentSection === "strengths") strengths += line + " ";
            if (currentSection === "suggestions") suggestions += line + " ";
          }
        });

        setAnalysis({
          writingStyle: writing.trim() || "Not available",
          strengths: strengths.trim() || "Not available",
          suggestions: suggestions.trim() || "Not available",
        });
      }
    } catch (error) {
      console.log("Analysis fetch error:", error.message);
    }
  };

useEffect(() => {
  fetchAnalysis()
}, [])


  return (
    <>
      <DashNavbar />
      <div className="dashItems">
        <div className="analysis-card">
          <h2>📊 Profile & Blog Analysis</h2>
          <div className="analysis-sections">
            <div className="analysis-box style">
              <h3>✍️ Writing Style</h3>
              <br />
              <p>{analysis.writingStyle}</p>
            </div>
            <div className="analysis-box strengths">
              <h3>💪 Strengths</h3>
              <br />
              <p>{analysis.strengths}</p>
            </div>
            <div className="analysis-box suggestions">
              <h3>✨ Suggestions</h3>
              <br />
              <p>{analysis.suggestions}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
