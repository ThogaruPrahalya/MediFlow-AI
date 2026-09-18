import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./PatientToken.css";

const API = "http://localhost:5000/api";

const hospitals = [
  {
    name: "MediFlow Demo Hospital",
    location: "Main Campus",
  },
  {
    name: "City Care Hospital",
    location: "Central Campus",
  },
  {
    name: "Apollo Hospital",
    location: "Hyderabad",
  },
  {
    name: "Yashoda Hospital",
    location: "Hyderabad",
  },
];

const departments = [
  {
    name: "General Medicine",
    wait: 6,
  },
  {
    name: "Cardiology",
    wait: 8,
  },
  {
    name: "Orthopedics",
    wait: 7,
  },
  {
    name: "Pediatrics",
    wait: 5,
  },
  {
    name: "Emergency",
    wait: 3,
  },
];

function PatientToken() {
  const navigate = useNavigate();

  const [hospital, setHospital] = useState("");
  const [department, setDepartment] = useState("");
  const [name, setName] = useState("");

  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateToken = async (e) => {
    e.preventDefault();

    setError("");

    if (!hospital) {
      setError("Please select a hospital.");
      return;
    }

    if (!department) {
      setError("Please select a department.");
      return;
    }

    if (!name.trim()) {
      setError("Please enter patient name.");
      return;
    }

    try {
      setLoading(true);

      const selectedDepartment = departments.find(
        (item) => item.name === department
      );

      const tokenNumber =
        Math.floor(10 + Math.random() * 90);

      let prefix = "A";

      if (department === "Cardiology") {
        prefix = "C";
      } else if (department === "Orthopedics") {
        prefix = "O";
      } else if (department === "Pediatrics") {
        prefix = "P";
      } else if (department === "Emergency") {
        prefix = "E";
      }

      const token = prefix + tokenNumber;

      const response = await fetch(`${API}/patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          name: name.trim(),
          hospital,
          department,
          wait: selectedDepartment?.wait || 6,
          patientsAhead: 0,
          emergency: department === "Emergency",
          status: "Waiting",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to generate token"
        );
      }

      const result = {
        ...data,
        hospital,
        department,
      };

      setTokenData(result);

      localStorage.setItem(
        "currentPatientToken",
        data.token
      );

      localStorage.setItem(
        "currentPatient",
        JSON.stringify(data)
      );

    } catch (err) {
      console.error("TOKEN ERROR:", err);

      setError(
        err.message ||
        "Backend connection failed. Please make sure the server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const trackQueue = () => {
    navigate("/dashboard");
  };

  if (tokenData) {
    return (
      <div className="token-page">

        <div className="token-navbar">

          <Link to="/" className="token-brand">
            <div className="token-brand-icon">
              ♥
            </div>

            <div>
              <h2>
                MediFlow <span>AI</span>
              </h2>

              <p>Smart Hospital Queue</p>
            </div>
          </Link>

          <Link to="/" className="token-home-link">
            ← Home
          </Link>

        </div>


        <main className="token-result-page">

          <div className="success-icon">
            ✓
          </div>

          <p className="success-label">
            TOKEN GENERATED SUCCESSFULLY
          </p>

          <h1>
            You're in the queue!
          </h1>

          <p className="success-description">
            Keep this token safe and track your queue
            position in real time.
          </p>


          <div className="token-result-card">

            <div className="big-token">

              <span>YOUR TOKEN</span>

              <strong>
                {tokenData.token}
              </strong>

              <small>
                {tokenData.name}
              </small>

            </div>


            <div className="result-details">

              <div className="result-detail">
                <span>Hospital</span>
                <strong>{tokenData.hospital}</strong>
              </div>

              <div className="result-detail">
                <span>Department</span>
                <strong>{tokenData.department}</strong>
              </div>

              <div className="result-detail">
                <span>Patients Ahead</span>
                <strong>0</strong>
              </div>

              <div className="result-detail">
                <span>Estimated Wait</span>
                <strong>
                  {tokenData.wait || 0} min
                </strong>
              </div>

            </div>


            <div className="ai-result-box">

              <div className="ai-result-icon">
                ✦
              </div>

              <div>
                <strong>
                  AI Waiting-Time Prediction
                </strong>

                <p>
                  Your estimated waiting time will
                  update automatically as patients
                  move through the queue.
                </p>
              </div>

            </div>


            <button
              className="track-queue-button"
              onClick={trackQueue}
            >
              Track My Queue →
            </button>


            <button
              className="another-token-button"
              onClick={() => {
                setTokenData(null);
                setName("");
                setHospital("");
                setDepartment("");
                setError("");
              }}
            >
              Generate Another Token
            </button>

          </div>

        </main>

      </div>
    );
  }


  return (
    <div className="token-page">

      <div className="token-navbar">

        <Link to="/" className="token-brand">

          <div className="token-brand-icon">
            ♥
          </div>

          <div>
            <h2>
              MediFlow <span>AI</span>
            </h2>

            <p>Smart Hospital Queue</p>
          </div>

        </Link>

        <div className="token-nav-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/login">
            Login
          </Link>

        </div>

      </div>


      <main className="token-main">

        <div className="token-heading">

          <p>
            PATIENT REGISTRATION
          </p>

          <h1>
            Get Your Digital Token
          </h1>

          <span>
            Select your hospital and department to
            join the queue.
          </span>

        </div>


        <form
          className="token-form-card"
          onSubmit={generateToken}
        >

          {/* HOSPITAL */}

          <div className="form-group">

            <label>
              Select Hospital
            </label>

            <select
              value={hospital}
              onChange={(e) =>
                setHospital(e.target.value)
              }
            >
              <option value="">
                Choose a hospital
              </option>

              {hospitals.map((item) => (
                <option
                  key={item.name}
                  value={item.name}
                >
                  {item.name} — {item.location}
                </option>
              ))}
            </select>

          </div>


          {/* DEPARTMENT */}

          <div className="form-group">

            <label>
              Select Department
            </label>

            <select
              value={department}
              onChange={(e) =>
                setDepartment(e.target.value)
              }
            >
              <option value="">
                Choose a department
              </option>

              {departments.map((item) => (
                <option
                  key={item.name}
                  value={item.name}
                >
                  {item.name}
                </option>
              ))}
            </select>

          </div>


          {/* NAME */}

          <div className="form-group">

            <label>
              Patient Name
            </label>

            <input
              type="text"
              placeholder="Enter patient full name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

          </div>


          {/* INFO */}

          {department && (
            <div className="department-info">

              <span>
                Average consultation time
              </span>

              <strong>
                {
                  departments.find(
                    (item) =>
                      item.name === department
                  )?.wait
                }{" "}
                min / patient
              </strong>

            </div>
          )}


          {error && (
            <div className="token-error">
              {error}
            </div>
          )}


          <button
            type="submit"
            className="generate-token-button"
            disabled={loading}
          >
            {loading
              ? "Generating Token..."
              : "Generate Token →"}
          </button>


          <p className="form-note">
            Your queue information will be stored
            securely for this hospital session.
          </p>

        </form>


        <div className="token-features">

          <div>
            <span>✓</span>
            Digital token
          </div>

          <div>
            <span>✓</span>
            Live queue tracking
          </div>

          <div>
            <span>✓</span>
            AI waiting prediction
          </div>

        </div>

      </main>

    </div>
  );
}

export default PatientToken;