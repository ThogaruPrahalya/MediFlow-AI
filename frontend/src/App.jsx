import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

import "./App.css";

import PatientToken from "./pages/PatientToken";
import PatientDashboard from "./pages/PatientDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import Login from "./pages/Login";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">

      {/* =========================================
          NAVBAR
      ========================================= */}

      <nav className="home-navbar">

        <Link to="/" className="home-brand">

          <div className="brand-heart">
            ♥
          </div>

          <div className="brand-info">
            <h2>
              MediFlow <span>AI</span>
            </h2>

            <p>
              Smart Hospital Queue
            </p>
          </div>

        </Link>

        <div className="home-navigation">

          <Link
            to="/"
            className="nav-active"
          >
            Home
          </Link>

          {/* IMPORTANT:
              Get Token goes to LOGIN first
          */}

          <Link to="/login">
            Get Token
          </Link>

          <Link to="/dashboard">
            My Queue
          </Link>

          <Link to="/analytics">
            Analytics
          </Link>

          <Link
            to="/login"
            className="nav-login"
          >
            Login
          </Link>

        </div>

      </nav>


      {/* =========================================
          HERO
      ========================================= */}

      <section className="hero-section">

        <div className="hero-left">

          <div className="hero-badge">
            <span className="badge-dot"></span>
            AI-POWERED HOSPITAL MANAGEMENT
          </div>

          <h1>
            Smarter Queues.
            <br />
            <span>Better Healthcare.</span>
          </h1>

          <p className="hero-description">
            MediFlow AI makes hospital visits easier
            with digital tokens, live queue tracking
            and intelligent waiting-time prediction.
          </p>

          <div className="hero-buttons">

            {/* GET TOKEN → LOGIN */}

            <button
              className="hero-primary"
              onClick={() => navigate("/login")}
            >
              Get Your Token
              <span>→</span>
            </button>

            {/* STAFF LOGIN */}

            <button
              className="hero-secondary"
              onClick={() => navigate("/login")}
            >
              Staff Login
            </button>

          </div>

          <div className="hero-trust">

            <div className="trust-item">

              <strong>24/7</strong>

              <span>
                Queue Monitoring
              </span>

            </div>

            <div className="trust-line"></div>

            <div className="trust-item">

              <strong>AI</strong>

              <span>
                Wait Prediction
              </span>

            </div>

            <div className="trust-line"></div>

            <div className="trust-item">

              <strong>Live</strong>

              <span>
                Queue Updates
              </span>

            </div>

          </div>

        </div>


        {/* =========================================
            DASHBOARD PREVIEW
        ========================================= */}

        <div className="hero-right">

          <div className="dashboard-preview">

            <div className="preview-top">

              <div>

                <p>
                  Hospital Queue
                </p>

                <h3>
                  Live Patient Flow
                </h3>

              </div>

              <div className="live-status">

                <span></span>

                LIVE

              </div>

            </div>


            <div className="serving-box">

              <div className="serving-icon">
                ♥
              </div>

              <div>

                <p>
                  NOW SERVING
                </p>

                <h2>
                  A10
                </h2>

                <span>
                  Sneha • General Medicine
                </span>

              </div>

            </div>


            <div className="preview-stats">

              <div className="preview-stat">

                <span className="stat-number">
                  06
                </span>

                <span className="stat-label">
                  Waiting
                </span>

              </div>


              <div className="preview-stat">

                <span className="stat-number">
                  04
                </span>

                <span className="stat-label">
                  Avg. Wait
                </span>

              </div>


              <div className="preview-stat">

                <span className="stat-number">
                  AI
                </span>

                <span className="stat-label">
                  Prediction
                </span>

              </div>

            </div>


            <div className="queue-preview">

              <div className="queue-preview-title">

                <span>
                  Today's Queue
                </span>

                <span>
                  6 Patients
                </span>

              </div>


              <div className="mini-patient">

                <span className="mini-token active-token">
                  A10
                </span>

                <div>

                  <strong>
                    Sneha
                  </strong>

                  <small>
                    General Medicine
                  </small>

                </div>

                <span className="mini-serving">
                  Serving
                </span>

              </div>


              <div className="mini-patient">

                <span className="mini-token">
                  A11
                </span>

                <div>

                  <strong>
                    Ravi
                  </strong>

                  <small>
                    Cardiology
                  </small>

                </div>

                <span className="mini-wait">
                  Waiting
                </span>

              </div>


              <div className="mini-patient">

                <span className="mini-token">
                  A12
                </span>

                <div>

                  <strong>
                    Priya
                  </strong>

                  <small>
                    General Medicine
                  </small>

                </div>

                <span className="mini-wait">
                  6 min
                </span>

              </div>

            </div>


            <div className="ai-preview">

              <div className="ai-icon">
                ✦
              </div>

              <div>

                <strong>
                  AI Queue Prediction
                </strong>

                <p>
                  Waiting time is calculated
                  using real-time patient flow.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================
          FEATURES
      ========================================= */}

      <section className="features-section">

        <div className="section-heading">

          <p>
            HOW MEDIFLOW AI HELPS
          </p>

          <h2>
            Everything you need for
            <span> smarter patient flow.</span>
          </h2>

        </div>


        <div className="features-grid">

          <div className="feature-card">

            <div className="feature-icon token-icon">
              🎫
            </div>

            <h3>
              Digital Token
            </h3>

            <p>
              Get a digital hospital token
              without standing in a physical queue.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon tracking-icon">
              ⏱
            </div>

            <h3>
              Live Queue Tracking
            </h3>

            <p>
              See your position, patients ahead
              and estimated waiting time.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon ai-feature-icon">
              ✦
            </div>

            <h3>
              AI Wait Prediction
            </h3>

            <p>
              Get an estimated consultation time
              based on current patient flow.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon staff-icon">
              🏥
            </div>

            <h3>
              Staff Management
            </h3>

            <p>
              Hospital staff can manage queues,
              emergencies and consultations.
            </p>

          </div>

        </div>

      </section>


      {/* =========================================
          HOW IT WORKS
      ========================================= */}

      <section className="how-section">

        <div className="section-heading">

          <p>
            SIMPLE PROCESS
          </p>

          <h2>
            From token to consultation
            <span> in simple steps.</span>
          </h2>

        </div>


        <div className="steps-container">

          <div className="step">

            <div className="step-number">
              01
            </div>

            <div>

              <h3>
                Login
              </h3>

              <p>
                Enter your details to start
                your hospital visit.
              </p>

            </div>

          </div>


          <div className="step-arrow">
            →
          </div>


          <div className="step">

            <div className="step-number">
              02
            </div>

            <div>

              <h3>
                Select Hospital
              </h3>

              <p>
                Choose your hospital and
                medical department.
              </p>

            </div>

          </div>


          <div className="step-arrow">
            →
          </div>


          <div className="step">

            <div className="step-number">
              03
            </div>

            <div>

              <h3>
                Get Token
              </h3>

              <p>
                Generate your digital queue
                token instantly.
              </p>

            </div>

          </div>


          <div className="step-arrow">
            →
          </div>


          <div className="step">

            <div className="step-number">
              04
            </div>

            <div>

              <h3>
                Track Your Turn
              </h3>

              <p>
                Watch your queue and know
                when it is your turn.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================
          CTA
      ========================================= */}

      <section className="cta-section">

        <div>

          <p className="cta-small">
            READY TO EXPERIENCE SMARTER QUEUES?
          </p>

          <h2>
            Skip the waiting room.
            <br />
            Start with MediFlow AI.
          </h2>

        </div>

        <button
          className="cta-button"
          onClick={() => navigate("/login")}
        >
          Get Your Token →
        </button>

      </section>


      {/* =========================================
          FOOTER
      ========================================= */}

      <footer className="home-footer">

        <div className="footer-brand">

          <div className="brand-heart small-heart">
            ♥
          </div>

          <div>

            <strong>
              MediFlow <span>AI</span>
            </strong>

            <p>
              Intelligent Hospital Queue Management
            </p>

          </div>

        </div>

        <p>
          © 2026 MediFlow AI • Hackathon MVP
        </p>

      </footer>

    </div>
  );
}


/* =============================================
   APP ROUTES
============================================= */

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* HOME */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* LOGIN */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* HOSPITAL + DEPARTMENT + TOKEN */}

        <Route
          path="/token"
          element={<PatientToken />}
        />


        {/* PATIENT QUEUE */}

        <Route
          path="/dashboard"
          element={<PatientDashboard />}
        />


        {/* STAFF */}

        <Route
          path="/staff"
          element={<StaffDashboard />}
        />


        {/* ANALYTICS */}

        <Route
          path="/analytics"
          element={<AnalyticsDashboard />}
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;