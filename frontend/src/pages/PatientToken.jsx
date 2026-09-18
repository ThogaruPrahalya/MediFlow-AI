import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PatientToken.css";

const API = `${import.meta.env.VITE_API_URL}/api`;

function PatientToken() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [department, setDepartment] = useState("General Medicine");
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const departments = {
    "General Medicine": {
      prefix: "A",
      consultationTime: 6,
    },
    Cardiology: {
      prefix: "C",
      consultationTime: 8,
    },
    Orthopedics: {
      prefix: "O",
      consultationTime: 7,
    },
    Pediatrics: {
      prefix: "P",
      consultationTime: 5,
    },
    Dermatology: {
      prefix: "D",
      consultationTime: 6,
    },
    Neurology: {
      prefix: "N",
      consultationTime: 8,
    },
  };

  const generateToken = async () => {
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API}/patients`);

      if (!response.ok) {
        throw new Error("Could not connect to backend.");
      }

      const patients = await response.json();

      const departmentPatients = patients.filter(
        (patient) =>
          patient.department === department &&
          patient.status !== "Completed"
      );

      const selectedDepartment = departments[department];

      const tokenNumber = departmentPatients.length + 1;

      const token = `${selectedDepartment.prefix}${tokenNumber}`;

      const patientsAhead = departmentPatients.filter(
        (patient) => !patient.emergency
      ).length;

      const wait = patientsAhead * selectedDepartment.consultationTime;

      const patient = {
        token,
        name: name.trim(),
        hospital: "MediFlow Demo Hospital",
        department,
        wait,
        patientsAhead,
        emergency: false,
        status: "Waiting",
      };

      const saveResponse = await fetch(`${API}/patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patient),
      });

      if (!saveResponse.ok) {
        throw new Error("Could not generate token.");
      }

      const savedPatient = await saveResponse.json();

      localStorage.setItem("currentPatientToken", savedPatient.token);
      localStorage.setItem("currentPatient", JSON.stringify(savedPatient));

      setTokenData(savedPatient);
    } catch (error) {
      console.error(error);
      setError(
        "Unable to connect to MediFlow server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const trackQueue = () => {
    navigate("/dashboard");
  };

  return (
    <div className="token-page">
      <div className="token-container">

        {!tokenData ? (
          <>
            <div className="token-header">
              <h1>Get Your Token</h1>
              <p>
                Enter your details to join the hospital queue
              </p>
            </div>

            <div className="token-form">

              <div className="form-group">
                <label>Patient Name</label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Select Department</label>

                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  {Object.keys(departments).map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <button
                className="generate-button"
                onClick={generateToken}
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate My Token"}
              </button>
            </div>
          </>
        ) : (
          <div className="token-result">

            <div className="success-icon">
              ✓
            </div>

            <h1>Token Generated Successfully!</h1>

            <p className="result-subtitle">
              Your place in the queue has been reserved.
            </p>

            <div className="big-token-card">
              <span>Your Token Number</span>
              <strong>{tokenData.token}</strong>
            </div>

            <div className="result-details">

              <div>
                <span>Patient</span>
                <strong>{tokenData.name}</strong>
              </div>

              <div>
                <span>Hospital</span>
                <strong>{tokenData.hospital}</strong>
              </div>

              <div>
                <span>Department</span>
                <strong>{tokenData.department}</strong>
              </div>

              <div>
                <span>Patients Ahead</span>
                <strong>{tokenData.patientsAhead}</strong>
              </div>

              <div>
                <span>Estimated Wait</span>
                <strong>{tokenData.wait} min</strong>
              </div>

            </div>

            <div className="ai-prediction">
              <h3>🤖 AI Queue Prediction</h3>
              <p>
                Based on current queue conditions, your estimated
                waiting time is approximately{" "}
                <strong>{tokenData.wait} minutes</strong>.
              </p>
            </div>

            <button
              className="generate-button"
              onClick={trackQueue}
            >
              Track My Queue
            </button>

          </div>
        )}
      </div>
    </div>
  );
}

export default PatientToken;