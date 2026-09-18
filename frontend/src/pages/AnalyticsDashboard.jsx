import {
  Activity,
  ArrowLeft,
  Brain,
  Clock3,
  Users,
  Stethoscope,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "./AnalyticsDashboard.css";

function AnalyticsDashboard() {
  const navigate = useNavigate();

  return (
    <div className="analytics-page">

      {/* Header */}
      <div className="analytics-header">

        <div>
          <div className="analytics-title">
            <Brain size={30} />
            <div>
              <h1>Hospital Analytics</h1>
              <p>MediFlow AI • Real-Time Patient Flow</p>
            </div>
          </div>
        </div>

        <button
          className="back-btn"
          onClick={() => navigate("/staff")}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

      </div>

      {/* Summary Cards */}
      <div className="analytics-cards">

        <div className="analytics-card">
          <div className="analytics-card-icon">
            <Users size={24} />
          </div>

          <div>
            <p>Total Patients Today</p>
            <h2>247</h2>
            <span className="positive">
              <TrendingUp size={14} />
              12% from yesterday
            </span>
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-card-icon">
            <Clock3 size={24} />
          </div>

          <div>
            <p>Average Waiting Time</p>
            <h2>24 min</h2>
            <span className="positive">
              8 min lower than average
            </span>
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-card-icon">
            <Stethoscope size={24} />
          </div>

          <div>
            <p>Active Doctors</p>
            <h2>18</h2>
            <span>
              Out of 22 doctors
            </span>
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-card-icon">
            <Activity size={24} />
          </div>

          <div>
            <p>Patients Waiting</p>
            <h2>38</h2>
            <span>
              Across 8 departments
            </span>
          </div>
        </div>

      </div>

      {/* Main Analytics */}
      <div className="analytics-grid">

        {/* Patient Flow */}
        <div className="analytics-panel">

          <div className="panel-header">
            <div>
              <p>PATIENT FLOW</p>
              <h2>Patients Throughout the Day</h2>
            </div>

            <Activity size={24} />
          </div>

          <div className="chart">

            <div className="chart-y">
              <span>60</span>
              <span>45</span>
              <span>30</span>
              <span>15</span>
              <span>0</span>
            </div>

            <div className="chart-area">

              <div className="grid-line"></div>
              <div className="grid-line"></div>
              <div className="grid-line"></div>
              <div className="grid-line"></div>
              <div className="grid-line"></div>

              <div className="bars">

                <div className="bar-group">
                  <div
                    className="bar"
                    style={{ height: "35%" }}
                  ></div>
                  <span>9 AM</span>
                </div>

                <div className="bar-group">
                  <div
                    className="bar"
                    style={{ height: "50%" }}
                  ></div>
                  <span>10 AM</span>
                </div>

                <div className="bar-group">
                  <div
                    className="bar"
                    style={{ height: "65%" }}
                  ></div>
                  <span>11 AM</span>
                </div>

                <div className="bar-group">
                  <div
                    className="bar"
                    style={{ height: "80%" }}
                  ></div>
                  <span>12 PM</span>
                </div>

                <div className="bar-group">
                  <div
                    className="bar"
                    style={{ height: "92%" }}
                  ></div>
                  <span>1 PM</span>
                </div>

                <div className="bar-group">
                  <div
                    className="bar"
                    style={{ height: "72%" }}
                  ></div>
                  <span>2 PM</span>
                </div>

                <div className="bar-group">
                  <div
                    className="bar"
                    style={{ height: "55%" }}
                  ></div>
                  <span>3 PM</span>
                </div>

                <div className="bar-group">
                  <div
                    className="bar"
                    style={{ height: "42%" }}
                  ></div>
                  <span>4 PM</span>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Waiting Time */}
        <div className="analytics-panel">

          <div className="panel-header">
            <div>
              <p>AI PREDICTION</p>
              <h2>Waiting Time Status</h2>
            </div>

            <Brain size={24} />
          </div>

          <div className="wait-status">

            <div className="wait-circle">
              <strong>24</strong>
              <span>MIN</span>
            </div>

            <div className="wait-info">

              <div>
                <span>Current Average</span>
                <strong>24 min</strong>
              </div>

              <div>
                <span>Predicted Next Hour</span>
                <strong>28 min</strong>
              </div>

              <div>
                <span>Peak Waiting Time</span>
                <strong>41 min</strong>
              </div>

            </div>

          </div>

          <div className="ai-message">
            <Brain size={18} />

            <span>
              AI predicts a moderate increase in
              waiting time during the next hour.
            </span>
          </div>

        </div>

      </div>

      {/* Department Analytics */}
      <div className="analytics-panel department-panel">

        <div className="panel-header">
          <div>
            <p>DEPARTMENT ANALYTICS</p>
            <h2>Patient Queue by Department</h2>
          </div>

          <Stethoscope size={24} />
        </div>

        <div className="department-list">

          <Department
            name="General Medicine"
            patients="12"
            wait="18 min"
            percentage="80%"
          />

          <Department
            name="Cardiology"
            patients="7"
            wait="25 min"
            percentage="60%"
          />

          <Department
            name="Orthopedics"
            patients="6"
            wait="21 min"
            percentage="55%"
          />

          <Department
            name="Pediatrics"
            patients="5"
            wait="16 min"
            percentage="45%"
          />

          <Department
            name="Dermatology"
            patients="4"
            wait="12 min"
            percentage="35%"
          />

          <Department
            name="Emergency"
            patients="4"
            wait="8 min"
            percentage="30%"
          />

        </div>

      </div>

      {/* AI Insights */}
      <div className="insights-section">

        <div className="insight-card">
          <div className="insight-icon">
            <Brain size={22} />
          </div>

          <div>
            <h3>AI Queue Insight</h3>
            <p>
              Patient flow is currently stable.
              The system predicts moderate crowding
              around 1 PM.
            </p>
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-icon">
            <AlertTriangle size={22} />
          </div>

          <div>
            <h3>Attention Required</h3>
            <p>
              General Medicine currently has the
              highest number of waiting patients.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}

function Department({
  name,
  patients,
  wait,
  percentage,
}) {
  return (
    <div className="department-row">

      <div className="department-name">
        <strong>{name}</strong>
        <span>{patients} patients waiting</span>
      </div>

      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: percentage }}
          ></div>
        </div>
      </div>

      <div className="department-wait">
        <strong>{wait}</strong>
        <span>avg wait</span>
      </div>

    </div>
  );
}

export default AnalyticsDashboard;