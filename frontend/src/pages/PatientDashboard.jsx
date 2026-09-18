import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  CheckCircle,
  Clock,
  HeartPulse,
  RefreshCw,
  Users,
  MapPin,
  ArrowLeft,
} from "lucide-react";

import "./PatientDashboard.css";

const API = "http://localhost:5000/api";

const consultationTime = {
  "General Medicine": 6,
  Cardiology: 8,
  Orthopedics: 7,
  Pediatrics: 5,
  Emergency: 3,
};

function PatientDashboard() {
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // GET CURRENT TOKEN
  // --------------------------------------------------

  const getCurrentToken = () => {
    const token = localStorage.getItem("currentPatientToken");

    if (token) {
      return token;
    }

    const savedPatient = localStorage.getItem("currentPatient");

    if (savedPatient) {
      try {
        const parsed = JSON.parse(savedPatient);

        if (parsed.token) {
          localStorage.setItem(
            "currentPatientToken",
            parsed.token
          );

          return parsed.token;
        }
      } catch (err) {
        console.log("Local storage error:", err);
      }
    }

    return null;
  };

  // --------------------------------------------------
  // CALCULATE PATIENTS AHEAD
  // --------------------------------------------------

  const calculatePatientsAhead = (
    currentPatient,
    allPatients
  ) => {
    if (!currentPatient) {
      return 0;
    }

    if (currentPatient.status !== "Waiting") {
      return 0;
    }

    const sameDepartment = allPatients.filter(
      (item) =>
        item.status === "Waiting" &&
        item.department === currentPatient.department
    );

    const sortedPatients = [...sameDepartment].sort(
      (a, b) => {
        if (a.emergency && !b.emergency) {
          return -1;
        }

        if (!a.emergency && b.emergency) {
          return 1;
        }

        const numberA =
          parseInt(
            String(a.token || "").replace(/\D/g, ""),
            10
          ) || 0;

        const numberB =
          parseInt(
            String(b.token || "").replace(/\D/g, ""),
            10
          ) || 0;

        return numberA - numberB;
      }
    );

    const index = sortedPatients.findIndex(
      (item) =>
        String(item.token) ===
        String(currentPatient.token)
    );

    return index >= 0 ? index : 0;
  };

  // --------------------------------------------------
  // LOAD PATIENT
  // --------------------------------------------------

  const loadPatient = async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      setError("");

      const token = getCurrentToken();

      if (!token) {
        setPatient(null);
        return;
      }

      const response = await fetch(
        `${API}/patients`
      );

      if (!response.ok) {
        throw new Error(
          "Unable to connect to the hospital system."
        );
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error(
          "Invalid data received from the server."
        );
      }

      const foundPatient = data.find(
        (item) =>
          String(item.token) === String(token)
      );

      if (!foundPatient) {
        setPatient(null);

        setError(
          `Token ${token} was not found.`
        );

        return;
      }

      const patientsAhead =
        calculatePatientsAhead(
          foundPatient,
          data
        );

      const time =
        consultationTime[
          foundPatient.department
        ] || 6;

      const calculatedWait =
        patientsAhead * time;

      const updatedPatient = {
        ...foundPatient,
        patientsAhead,
        calculatedWait,
      };

      setPatient(updatedPatient);

      localStorage.setItem(
        "currentPatientToken",
        foundPatient.token
      );

      localStorage.setItem(
        "currentPatient",
        JSON.stringify(updatedPatient)
      );

    } catch (err) {
      console.error(
        "PATIENT DASHBOARD ERROR:",
        err
      );

      setError(
        err.message ||
        "Something went wrong."
      );
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  // --------------------------------------------------
  // AUTO REFRESH
  // --------------------------------------------------

  useEffect(() => {
    loadPatient(true);

    const interval = setInterval(() => {
      loadPatient(false);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="patient-dashboard-page">

        <div className="dashboard-loading">

          <RefreshCw size={34} />

          <h2>
            Loading your queue...
          </h2>

          <p>
            Please wait.
          </p>

        </div>

      </div>
    );
  }

  // --------------------------------------------------
  // NO TOKEN
  // --------------------------------------------------

  if (!patient) {
    return (
      <div className="patient-dashboard-page">

        <header className="patient-header">

          <Link
            to="/"
            className="patient-brand"
          >

            <div className="patient-logo">
              <HeartPulse size={26} />
            </div>

            <div>
              <h1>
                MediFlow <span>AI</span>
              </h1>

              <p>
                Patient Dashboard
              </p>
            </div>

          </Link>

          <div className="patient-nav">

            <Link to="/">
              Home
            </Link>

            <Link to="/token">
              Get Token
            </Link>

          </div>

        </header>

        <main className="no-token-container">

          <div className="no-token-icon">
            🎫
          </div>

          <h1>
            No Active Token
          </h1>

          <p>
            You do not currently have a
            hospital queue token.
          </p>

          {error && (
            <p className="dashboard-error">
              {error}
            </p>
          )}

          <button
            className="get-token-button"
            onClick={() => navigate("/token")}
          >
            Get Hospital Token
          </button>

        </main>

      </div>
    );
  }

  const isWaiting =
    patient.status === "Waiting";

  const isServing =
    patient.status === "Serving";

  const isCompleted =
    patient.status === "Completed";

  return (
    <div className="patient-dashboard-page">

      {/* ==========================================
          HEADER
      ========================================== */}

      <header className="patient-header">

        <Link
          to="/"
          className="patient-brand"
        >

          <div className="patient-logo">
            <HeartPulse size={26} />
          </div>

          <div>
            <h1>
              MediFlow <span>AI</span>
            </h1>

            <p>
              Patient Dashboard
            </p>
          </div>

        </Link>

        <div className="patient-nav">

          <Link to="/">
            Home
          </Link>

          <Link to="/token">
            Get Token
          </Link>

          <Link to="/analytics">
            Analytics
          </Link>

        </div>

      </header>

      {/* ==========================================
          MAIN
      ========================================== */}

      <main className="patient-main">

        {/* WELCOME */}

        <section className="patient-welcome">

          <div>

            <p className="welcome-small">
              PATIENT QUEUE
            </p>

            <h2>
              Hello, {patient.name} 👋
            </h2>

            <p>
              Here is your current hospital
              queue status.
            </p>

          </div>

          <button
            className="dashboard-refresh"
            onClick={() =>
              loadPatient(true)
            }
          >
            <RefreshCw size={18} />
            Refresh
          </button>

        </section>

        {/* ========================================
            STEP 1 — YOUR TOKEN
        ======================================== */}

        <section className="main-token-card">

          <div className="token-heading">

            <div className="token-heading-icon">
              <Activity size={26} />
            </div>

            <div>

              <p>
                YOUR QUEUE TOKEN
              </p>

              <h3>
                Keep this token with you
              </h3>

            </div>

          </div>

          <div className="big-token">
            {patient.token}
          </div>

          <div className="token-information">

            <div>
              <span>
                Hospital
              </span>

              <strong>
                {patient.hospital ||
                  "City Care Hospital"}
              </strong>
            </div>

            <div>
              <span>
                Department
              </span>

              <strong>
                {patient.department}
              </strong>
            </div>

          </div>

        </section>

        {/* ========================================
            STEP 2 — CURRENT STATUS
        ======================================== */}

        {isServing && (
          <section className="turn-alert serving-alert">

            <div className="turn-alert-icon">
              <CheckCircle size={38} />
            </div>

            <div>

              <p>
                IMPORTANT
              </p>

              <h2>
                IT'S YOUR TURN!
              </h2>

              <span>
                Please go to the consultation
                room now.
              </span>

            </div>

          </section>
        )}

        {isCompleted && (
          <section className="turn-alert completed-alert">

            <div className="turn-alert-icon">
              <CheckCircle size={38} />
            </div>

            <div>

              <p>
                CONSULTATION STATUS
              </p>

              <h2>
                Consultation Completed
              </h2>

              <span>
                Your consultation has been
                completed successfully.
              </span>

            </div>

          </section>
        )}

        {isWaiting && (
          <section className="waiting-message-card">

            <div className="waiting-icon">
              <Clock size={32} />
            </div>

            <div>

              <h2>
                You are waiting in the queue
              </h2>

              <p>
                Please stay nearby and watch
                your queue status.
              </p>

            </div>

          </section>
        )}

        {/* ========================================
            STEP 3 — QUEUE INFORMATION
        ======================================== */}

        <section className="queue-section">

          <div className="section-title">

            <div>

              <p>
                YOUR QUEUE
              </p>

              <h2>
                Queue Information
              </h2>

            </div>

            <span className="live-badge">
              <span></span>
              LIVE
            </span>

          </div>

          <div className="queue-stats-grid">

            {/* POSITION */}

            <div className="large-queue-stat">

              <div className="large-stat-icon">
                <Activity size={28} />
              </div>

              <div>

                <span>
                  Queue Position
                </span>

                <strong>
                  {isWaiting
                    ? patient.patientsAhead + 1
                    : isServing
                    ? "NOW"
                    : "DONE"}
                </strong>

                <small>
                  {isWaiting
                    ? "Your position"
                    : isServing
                    ? "Your turn"
                    : "Finished"}
                </small>

              </div>

            </div>

            {/* PATIENTS AHEAD */}

            <div className="large-queue-stat">

              <div className="large-stat-icon">
                <Users size={28} />
              </div>

              <div>

                <span>
                  Patients Ahead
                </span>

                <strong>
                  {isWaiting
                    ? patient.patientsAhead
                    : 0}
                </strong>

                <small>
                  {isWaiting
                    ? "Before your turn"
                    : "No patients ahead"}
                </small>

              </div>

            </div>

            {/* WAIT */}

            <div className="large-queue-stat">

              <div className="large-stat-icon">
                <Clock size={28} />
              </div>

              <div>

                <span>
                  Estimated Wait
                </span>

                <strong>
                  {isWaiting
                    ? `${patient.calculatedWait} min`
                    : isServing
                    ? "NOW"
                    : "DONE"}
                </strong>

                <small>
                  {isWaiting
                    ? "Approximate time"
                    : isServing
                    ? "Please proceed"
                    : "Completed"}
                </small>

              </div>

            </div>

          </div>

        </section>

        {/* ========================================
            STEP 4 — WHAT TO DO
        ======================================== */}

        <section className="what-to-do-card">

          <div className="what-to-do-heading">

            <div className="what-to-do-icon">
              <MapPin size={25} />
            </div>

            <div>

              <p>
                WHAT SHOULD YOU DO?
              </p>

              <h2>
                Simple Instructions
              </h2>

            </div>

          </div>

          {isWaiting && (
            <div className="instruction-list">

              <div className="instruction-item">

                <div className="instruction-number">
                  1
                </div>

                <div>
                  <strong>
                    Stay near the hospital
                  </strong>

                  <span>
                    Please remain available
                    until your turn.
                  </span>
                </div>

              </div>

              <div className="instruction-item">

                <div className="instruction-number">
                  2
                </div>

                <div>
                  <strong>
                    Watch your queue
                  </strong>

                  <span>
                    Your queue information
                    updates automatically.
                  </span>
                </div>

              </div>

              <div className="instruction-item">

                <div className="instruction-number">
                  3
                </div>

                <div>
                  <strong>
                    Wait for your token to be called
                  </strong>

                  <span>
                    When your token is called,
                    proceed to the consultation room.
                  </span>
                </div>

              </div>

            </div>
          )}

          {isServing && (
            <div className="instruction-ready">

              <CheckCircle size={28} />

              <div>

                <strong>
                  Please proceed now
                </strong>

                <span>
                  Your token has been called
                  by the hospital staff.
                </span>

              </div>

            </div>
          )}

          {isCompleted && (
            <div className="instruction-ready">

              <CheckCircle size={28} />

              <div>

                <strong>
                  Your visit is complete
                </strong>

                <span>
                  Thank you for using MediFlow AI.
                </span>

              </div>

            </div>
          )}

        </section>

        {/* ========================================
            STEP 5 — AI PREDICTION
        ======================================== */}

        <section className="ai-prediction-card">

          <div className="ai-prediction-icon">
            ✦
          </div>

          <div>

            <p>
              AI QUEUE PREDICTION
            </p>

            {isWaiting && (
              <>
                <h3>
                  Estimated waiting time:
                  {" "}
                  {patient.calculatedWait} minutes
                </h3>

                <span>
                  This estimate is based on the
                  current queue and average
                  consultation time for
                  {` ${patient.department}`}.
                </span>
              </>
            )}

            {isServing && (
              <>
                <h3>
                  Your consultation is ready
                </h3>

                <span>
                  The hospital staff has called
                  your token.
                </span>
              </>
            )}

            {isCompleted && (
              <>
                <h3>
                  Consultation completed
                </h3>

                <span>
                  Your queue journey is complete.
                </span>
              </>
            )}

          </div>

        </section>

        {/* ========================================
            STEP 6 — PATIENT DETAILS
        ======================================== */}

        <section className="patient-details-card">

          <div className="details-heading">

            <div>

              <p>
                PATIENT INFORMATION
              </p>

              <h2>
                Your Details
              </h2>

            </div>

          </div>

          <div className="details-grid">

            <div>
              <span>
                Patient Name
              </span>

              <strong>
                {patient.name}
              </strong>
            </div>

            <div>
              <span>
                Token Number
              </span>

              <strong>
                {patient.token}
              </strong>
            </div>

            <div>
              <span>
                Hospital
              </span>

              <strong>
                {patient.hospital ||
                  "City Care Hospital"}
              </strong>
            </div>

            <div>
              <span>
                Department
              </span>

              <strong>
                {patient.department}
              </strong>
            </div>

            <div>
              <span>
                Queue Status
              </span>

              <strong
                className={
                  isServing
                    ? "status-serving"
                    : isCompleted
                    ? "status-completed"
                    : "status-waiting"
                }
              >
                {patient.status}
              </strong>
            </div>

            <div>
              <span>
                Emergency
              </span>

              <strong>
                {patient.emergency
                  ? "Yes"
                  : "No"}
              </strong>
            </div>

          </div>

        </section>

        {/* ========================================
            BOTTOM BUTTONS
        ======================================== */}

        <div className="dashboard-bottom-actions">

          <button
            className="new-token-button"
            onClick={() =>
              navigate("/token")
            }
          >
            Get Another Token
          </button>

          <Link
            to="/"
            className="home-dashboard-link"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>

        </div>

      </main>

    </div>
  );
}

export default PatientDashboard;