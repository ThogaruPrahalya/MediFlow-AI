import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PatientDashboard.css";

const API = `${import.meta.env.VITE_API_URL}/api`;

function PatientDashboard() {
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [queueInfo, setQueueInfo] = useState({
    position: 0,
    patientsAhead: 0,
    wait: 0,
  });

  const loadPatient = async () => {
    try {
      const token =
        localStorage.getItem("currentPatientToken");

      const savedPatient =
        localStorage.getItem("currentPatient");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API}/patients`);

      if (!response.ok) {
        throw new Error("Failed to load patients");
      }

      const patients = await response.json();

      const currentPatient = patients.find(
        (item) => item.token === token
      );

      if (!currentPatient) {
        if (savedPatient) {
          setPatient(JSON.parse(savedPatient));
        }
        return;
      }

      setPatient(currentPatient);

      localStorage.setItem(
        "currentPatient",
        JSON.stringify(currentPatient)
      );

      const waitingPatients = patients.filter(
        (item) =>
          item.department === currentPatient.department &&
          item.status === "Waiting"
      );

      const patientsAhead = waitingPatients.filter(
        (item) => {
          if (item.emergency) {
            return false;
          }

          return (
            new Date(item.createdAt) <
            new Date(currentPatient.createdAt)
          );
        }
      ).length;

      const consultationTimes = {
        "General Medicine": 6,
        Cardiology: 8,
        Orthopedics: 7,
        Pediatrics: 5,
        Dermatology: 6,
        Neurology: 8,
      };

      const consultationTime =
        consultationTimes[currentPatient.department] || 6;

      setQueueInfo({
        position: patientsAhead + 1,
        patientsAhead,
        wait: patientsAhead * consultationTime,
      });
    } catch (error) {
      console.error("Dashboard error:", error);
    }
  };

  useEffect(() => {
    loadPatient();

    const interval = setInterval(() => {
      loadPatient();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!patient) {
    return (
      <div className="patient-dashboard">
        <div className="loading-container">
          <h2>Loading your queue...</h2>
        </div>
      </div>
    );
  }

  const getStatusText = () => {
    if (patient.status === "Serving") {
      return "IT'S YOUR TURN!";
    }

    if (patient.status === "Completed") {
      return "Consultation Completed";
    }

    return "Waiting";
  };

  return (
    <div className="patient-dashboard">

      <div className="dashboard-header">
        <div>
          <h1>Patient Dashboard</h1>
          <p>Track your hospital queue in real time</p>
        </div>

        <button
          className="back-button"
          onClick={() => navigate("/")}
        >
          Home
        </button>
      </div>

      <div className="dashboard-container">

        <div className="token-card">

          <div className="token-label">
            YOUR TOKEN
          </div>

          <div className="token-number">
            {patient.token}
          </div>

          <div
            className={`status-badge ${
              patient.status === "Serving"
                ? "serving"
                : patient.status === "Completed"
                ? "completed"
                : "waiting"
            }`}
          >
            {getStatusText()}
          </div>

        </div>

        <div className="queue-section">

          <h2>Queue Information</h2>

          <div className="queue-cards">

            <div className="queue-info-card">
              <span>Queue Position</span>
              <strong>
                {patient.status === "Completed"
                  ? "-"
                  : patient.status === "Serving"
                  ? "Now"
                  : queueInfo.position}
              </strong>
            </div>

            <div className="queue-info-card">
              <span>Patients Ahead</span>
              <strong>
                {patient.status === "Completed"
                  ? "-"
                  : patient.status === "Serving"
                  ? "0"
                  : queueInfo.patientsAhead}
              </strong>
            </div>

            <div className="queue-info-card">
              <span>Estimated Wait</span>
              <strong>
                {patient.status === "Completed"
                  ? "-"
                  : patient.status === "Serving"
                  ? "Now"
                  : `${queueInfo.wait} min`}
              </strong>
            </div>

          </div>

        </div>

        {patient.status === "Serving" && (
          <div className="turn-alert">
            <h2>🔔 IT'S YOUR TURN!</h2>
            <p>
              Please proceed to the consultation area.
              The doctor is ready to see you.
            </p>
          </div>
        )}

        {patient.status === "Completed" && (
          <div className="turn-alert completed-alert">
            <h2>✓ Consultation Completed</h2>
            <p>
              Your consultation has been completed.
              Thank you for using MediFlow AI.
            </p>
          </div>
        )}

        <div className="instructions-card">

          <h2>How It Works</h2>

          <div className="instruction-list">

            <div>
              <span>1</span>
              <p>Stay updated on your queue position.</p>
            </div>

            <div>
              <span>2</span>
              <p>Monitor your estimated waiting time.</p>
            </div>

            <div>
              <span>3</span>
              <p>Come to the consultation area when called.</p>
            </div>

          </div>

        </div>

        <div className="ai-card">

          <div className="ai-title">
            🤖 AI Queue Prediction
          </div>

          <p>
            Our AI prediction estimates your waiting time
            using the current queue, department and
            consultation patterns.
          </p>

          <strong>
            Current prediction:{" "}
            {patient.status === "Waiting"
              ? `${queueInfo.wait} minutes`
              : patient.status === "Serving"
              ? "Your turn now"
              : "Completed"}
          </strong>

        </div>

        <div className="patient-details">

          <h2>Patient Details</h2>

          <div className="details-grid">

            <div>
              <span>Name</span>
              <strong>{patient.name}</strong>
            </div>

            <div>
              <span>Hospital</span>
              <strong>{patient.hospital}</strong>
            </div>

            <div>
              <span>Department</span>
              <strong>{patient.department}</strong>
            </div>

            <div>
              <span>Status</span>
              <strong>{patient.status}</strong>
            </div>

          </div>

        </div>

        <div className="dashboard-actions">

          <button
            onClick={() => navigate("/token")}
          >
            Get Another Token
          </button>

          <button
            onClick={loadPatient}
          >
            Refresh Queue
          </button>

        </div>

      </div>
    </div>
  );
}

export default PatientDashboard;