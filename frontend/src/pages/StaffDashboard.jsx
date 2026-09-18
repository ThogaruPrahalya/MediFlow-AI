import React, { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock3,
  HeartPulse,
  RefreshCw,
  UserRound,
  Users,
  PhoneCall,
} from "lucide-react";
import "./StaffDashboard.css";

const API = "http://localhost:5000/api";

const consultationTime = {
  "General Medicine": 6,
  Cardiology: 8,
  Orthopedics: 7,
  Pediatrics: 5,
  Emergency: 3,
};

function StaffDashboard() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [callingToken, setCallingToken] = useState("");
  const [completingToken, setCompletingToken] = useState("");

  // =========================
  // LOAD PATIENTS
  // =========================

  const loadPatients = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      const response = await fetch(`${API}/patients`);

      if (!response.ok) {
        throw new Error("Could not connect to backend");
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setPatients(data);
      } else {
        setPatients([]);
      }

      setMessage("");
    } catch (error) {
      console.error("LOAD PATIENTS ERROR:", error);

      setMessage(
        "Backend connection failed. Make sure server.js is running on port 5000."
      );
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  // =========================
  // AUTO REFRESH
  // =========================

  useEffect(() => {
    loadPatients(true);

    const interval = setInterval(() => {
      loadPatients(false);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // =========================
  // GET WAITING PATIENTS
  // =========================

  const getWaitingPatients = () => {
    const waiting = patients.filter(
      (patient) => patient.status === "Waiting"
    );

    return [...waiting].sort((a, b) => {
      // Emergency patients first
      if (a.emergency && !b.emergency) return -1;
      if (!a.emergency && b.emergency) return 1;

      // Then token number
      const tokenA = String(a.token || "");
      const tokenB = String(b.token || "");

      const numberA =
        parseInt(tokenA.replace(/\D/g, ""), 10) || 0;

      const numberB =
        parseInt(tokenB.replace(/\D/g, ""), 10) || 0;

      return numberA - numberB;
    });
  };

  // =========================
  // PATIENTS AHEAD
  // =========================

  const getPatientsAhead = (patient) => {
    const waiting = getWaitingPatients();

    return waiting.filter(
      (item) =>
        item.department === patient.department &&
        item.token !== patient.token
    ).length;
  };

  // =========================
  // WAIT TIME
  // =========================

  const getWaitTime = (patient) => {
    const ahead = getPatientsAhead(patient);

    const time =
      consultationTime[patient.department] || 6;

    return ahead * time;
  };

  // =========================
  // PATIENT LISTS
  // =========================

  const waitingPatients = getWaitingPatients();

  const servingPatients = patients.filter(
    (patient) => patient.status === "Serving"
  );

  const completedPatients = patients.filter(
    (patient) => patient.status === "Completed"
  );

  const currentPatient = servingPatients[0] || null;

  // =========================
  // AVERAGE WAIT
  // =========================

  const averageWait =
    waitingPatients.length > 0
      ? Math.round(
          waitingPatients.reduce(
            (total, patient) =>
              total + getWaitTime(patient),
            0
          ) / waitingPatients.length
        )
      : 0;

  // =========================
  // CALL PATIENT
  // =========================

  const callPatient = async (token) => {
    if (!token) {
      setMessage("Patient token is missing.");
      return;
    }

    // Do not allow another patient while one is serving
    if (servingPatients.length > 0) {
      setMessage(
        "Please complete the current patient before calling the next patient."
      );
      return;
    }

    try {
      setCallingToken(token);
      setMessage("");

      console.log("Calling patient token:", token);

      const response = await fetch(
        `${API}/patients/call/${encodeURIComponent(token)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("CALL RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Could not call patient"
        );
      }

      setMessage(
        `${data.patient?.name || "Patient"} (${token}) is now being served.`
      );

      await loadPatients(false);
    } catch (error) {
      console.error("CALL PATIENT ERROR:", error);

      setMessage(
        `Could not call patient: ${error.message}`
      );
    } finally {
      setCallingToken("");
    }
  };

  // =========================
  // COMPLETE PATIENT
  // =========================

  const completePatient = async (token) => {
    if (!token) {
      setMessage("Patient token is missing.");
      return;
    }

    try {
      setCompletingToken(token);
      setMessage("");

      const response = await fetch(
        `${API}/patients/complete/${encodeURIComponent(token)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("COMPLETE RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Could not complete patient"
        );
      }

      setMessage(
        `${data.patient?.name || "Patient"} (${token}) consultation completed.`
      );

      await loadPatients(false);
    } catch (error) {
      console.error(
        "COMPLETE PATIENT ERROR:",
        error
      );

      setMessage(
        `Could not complete patient: ${error.message}`
      );
    } finally {
      setCompletingToken("");
    }
  };

  // =========================
  // CALL NEXT PATIENT
  // =========================

  const callNextPatient = () => {
    if (servingPatients.length > 0) {
      setMessage(
        "Please complete the current patient first."
      );
      return;
    }

    if (waitingPatients.length === 0) {
      setMessage("There are no waiting patients.");
      return;
    }

    const nextPatient = waitingPatients[0];

    callPatient(nextPatient.token);
  };

  // =========================
  // ADD EMERGENCY PATIENT
  // =========================

  const addEmergencyPatient = async () => {
    const name = window.prompt(
      "Enter emergency patient name:"
    );

    if (!name || !name.trim()) {
      return;
    }

    try {
      const emergencyToken =
        "E" + Math.floor(100 + Math.random() * 900);

      const response = await fetch(`${API}/patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: emergencyToken,
          name: name.trim(),
          hospital: "MediFlow Demo Hospital",
          department: "Emergency",
          wait: 0,
          patientsAhead: 0,
          emergency: true,
          status: "Waiting",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Could not add emergency patient"
        );
      }

      setMessage(
        `Emergency patient ${name.trim()} added successfully.`
      );

      await loadPatients(false);
    } catch (error) {
      console.error("EMERGENCY ERROR:", error);

      setMessage(
        `Could not add emergency patient: ${error.message}`
      );
    }
  };

  // =========================
  // LOADING SCREEN
  // =========================

  if (loading) {
    return (
      <div className="staff-page">
        <div className="staff-loading">
          <RefreshCw
            size={30}
            className="spin"
          />

          <p>Loading Staff Dashboard...</p>
        </div>
      </div>
    );
  }

  // =========================
  // MAIN DASHBOARD
  // =========================

  return (
    <div className="staff-page">

      {/* HEADER */}
      <header className="staff-header">

        <div className="staff-brand">

          <div className="staff-logo">
            <HeartPulse size={27} />
          </div>

          <div className="brand-text">
            <h1>
              MediFlow <span>AI</span>
            </h1>

            <p>Staff Dashboard</p>
          </div>

        </div>

        <div className="staff-header-actions">

          <button
            className="refresh-btn"
            onClick={() => loadPatients(true)}
          >
            <RefreshCw size={18} />
            Refresh
          </button>

          <button
            className="emergency-btn"
            onClick={addEmergencyPatient}
          >
            <AlertTriangle size={18} />
            Emergency Patient
          </button>

        </div>

      </header>

      <main className="staff-main">

        {/* MESSAGE */}
        {message && (
          <div className="staff-message">
            {message}
          </div>
        )}

        {/* =========================
            STATISTICS
        ========================= */}

        <section className="staff-stats">

          <div className="staff-stat-card">

            <div className="stat-icon">
              <Users size={22} />
            </div>

            <div>
              <p>Waiting Patients</p>
              <h2>{waitingPatients.length}</h2>
            </div>

          </div>

          <div className="staff-stat-card">

            <div className="stat-icon">
              <Clock3 size={22} />
            </div>

            <div>
              <p>Average Wait</p>
              <h2>{averageWait} min</h2>
            </div>

          </div>

          <div className="staff-stat-card">

            <div className="stat-icon">
              <Activity size={22} />
            </div>

            <div>
              <p>Now Serving</p>
              <h2>{servingPatients.length}</h2>
            </div>

          </div>

          <div className="staff-stat-card">

            <div className="stat-icon">
              <CheckCircle size={22} />
            </div>

            <div>
              <p>Completed</p>
              <h2>{completedPatients.length}</h2>
            </div>

          </div>

        </section>

        {/* =========================
            CURRENT PATIENT
        ========================= */}

        {currentPatient ? (

          <section className="now-serving-card">

            <div className="now-serving-content">

              <p className="now-serving-label">
                NOW SERVING
              </p>

              <h2>
                {currentPatient.token} —{" "}
                {currentPatient.name}
              </h2>

              <p>
                {currentPatient.department}

                {currentPatient.emergency &&
                  " • Emergency"}
              </p>

            </div>

            <button
              className="complete-serving-btn"
              onClick={() =>
                completePatient(
                  currentPatient.token
                )
              }
              disabled={
                completingToken ===
                currentPatient.token
              }
            >

              <CheckCircle size={18} />

              {completingToken ===
              currentPatient.token
                ? "Completing..."
                : "Complete Patient"}

            </button>

          </section>

        ) : (

          <section className="ready-next-card">

            <div className="ready-icon">
              <PhoneCall size={25} />
            </div>

            <div>
              <h2>Ready for Next Patient</h2>

              <p>
                {waitingPatients.length > 0
                  ? `${waitingPatients.length} patient${
                      waitingPatients.length === 1
                        ? ""
                        : "s"
                    } waiting in the queue.`
                  : "No patients are currently waiting."}
              </p>
            </div>

            <button
              className="call-next-btn"
              onClick={callNextPatient}
              disabled={
                waitingPatients.length === 0
              }
            >
              <PhoneCall size={18} />
              CALL NEXT PATIENT
            </button>

          </section>

        )}

        {/* =========================
            LIVE QUEUE
        ========================= */}

        <section className="queue-section">

          <div className="section-heading">

            <div>
              <h2>Live Patient Queue</h2>

              <p>
                Monitor and manage patients in real time
              </p>
            </div>

            <div className="queue-count">
              {waitingPatients.length} Waiting
            </div>

          </div>

          <div className="queue-table-wrapper">

            <table className="queue-table">

              <thead>

                <tr>
                  <th>Token</th>
                  <th>Patient Name</th>
                  <th>Department</th>
                  <th>Patients Ahead</th>
                  <th>AI Wait</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {waitingPatients.length === 0 ? (

                  <tr>

                    <td
                      colSpan="7"
                      className="empty-queue"
                    >
                      <CheckCircle size={25} />

                      <span>
                        No patients are currently
                        waiting.
                      </span>
                    </td>

                  </tr>

                ) : (

                  waitingPatients.map((patient) => {

                    const ahead =
                      getPatientsAhead(patient);

                    const wait =
                      getWaitTime(patient);

                    return (

                      <tr
                        key={patient.token}
                        className={
                          patient.emergency
                            ? "emergency-row"
                            : ""
                        }
                      >

                        {/* TOKEN */}

                        <td>

                          <strong className="token-value">
                            {patient.token}
                          </strong>

                        </td>

                        {/* PATIENT */}

                        <td>

                          <div className="patient-name-cell">

                            <div className="patient-small-icon">
                              <UserRound size={16} />
                            </div>

                            <span>
                              {patient.name}
                            </span>

                            {patient.emergency && (
                              <span className="emergency-badge">
                                Emergency
                              </span>
                            )}

                          </div>

                        </td>

                        {/* DEPARTMENT */}

                        <td>
                          {patient.department}
                        </td>

                        {/* AHEAD */}

                        <td>
                          {ahead}
                        </td>

                        {/* AI WAIT */}

                        <td>
                          <strong>
                            {wait} min
                          </strong>
                        </td>

                        {/* STATUS */}

                        <td>

                          <span className="waiting-status">
                            Waiting
                          </span>

                        </td>

                        {/* ACTION */}

                        <td>

                          <button
                            className="call-patient-btn"
                            onClick={() =>
                              callPatient(
                                patient.token
                              )
                            }
                            disabled={
                              callingToken ===
                                patient.token ||
                              servingPatients.length >
                                0
                            }
                          >

                            <PhoneCall size={15} />

                            {callingToken ===
                            patient.token
                              ? "Calling..."
                              : "CALL PATIENT"}

                          </button>

                        </td>

                      </tr>

                    );
                  })

                )}

              </tbody>

            </table>

          </div>

        </section>

        {/* =========================
            WORKFLOW GUIDE
        ========================= */}

        <section className="staff-workflow">

          <h2>Staff Workflow</h2>

          <div className="workflow-steps">

            <div className="workflow-step">
              <span>1</span>
              <div>
                <strong>Call Patient</strong>
                <p>
                  Select a waiting patient.
                </p>
              </div>
            </div>

            <div className="workflow-arrow">
              →
            </div>

            <div className="workflow-step">
              <span>2</span>
              <div>
                <strong>Consult Patient</strong>
                <p>
                  Patient status becomes Serving.
                </p>
              </div>
            </div>

            <div className="workflow-arrow">
              →
            </div>

            <div className="workflow-step">
              <span>3</span>
              <div>
                <strong>Complete Patient</strong>
                <p>
                  Finish the consultation.
                </p>
              </div>
            </div>

            <div className="workflow-arrow">
              →
            </div>

            <div className="workflow-step">
              <span>4</span>
              <div>
                <strong>Call Next</strong>
                <p>
                  Move to the next patient.
                </p>
              </div>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default StaffDashboard;