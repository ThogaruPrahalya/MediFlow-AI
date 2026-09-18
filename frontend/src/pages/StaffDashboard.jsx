import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PhoneCall,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Users,
  Clock,
  Activity,
} from "lucide-react";
import "./StaffDashboard.css";

const API = `${import.meta.env.VITE_API_URL}/api`;

function StaffDashboard() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadPatients = async () => {
    try {
      const response = await fetch(`${API}/patients`);

      if (!response.ok) {
        throw new Error("Failed to load patients");
      }

      const data = await response.json();

      setPatients(data);
    } catch (error) {
      console.error("Staff dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();

    const interval = setInterval(() => {
      loadPatients();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const waitingPatients = patients
    .filter((patient) => patient.status === "Waiting")
    .sort((a, b) => {
      if (a.emergency && !b.emergency) return -1;
      if (!a.emergency && b.emergency) return 1;

      return (
        new Date(a.createdAt) -
        new Date(b.createdAt)
      );
    });

  const servingPatients = patients.filter(
    (patient) => patient.status === "Serving"
  );

  const completedPatients = patients.filter(
    (patient) => patient.status === "Completed"
  );

  const calculatePatientsAhead = (patient) => {
    return waitingPatients.filter(
      (item) =>
        item.department === patient.department &&
        new Date(item.createdAt) <
          new Date(patient.createdAt)
    ).length;
  };

  const calculateWait = (patient) => {
    const times = {
      "General Medicine": 6,
      Cardiology: 8,
      Orthopedics: 7,
      Pediatrics: 5,
      Dermatology: 6,
      Neurology: 8,
    };

    const time = times[patient.department] || 6;

    return calculatePatientsAhead(patient) * time;
  };

  const callPatient = async (token) => {
    if (servingPatients.length > 0) {
      alert(
        "Please complete the current patient before calling another patient."
      );
      return;
    }

    setActionLoading(true);

    try {
      const response = await fetch(
        `${API}/patients/call/${encodeURIComponent(token)}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error("Could not call patient");
      }

      await loadPatients();
    } catch (error) {
      console.error(error);
      alert("Unable to call patient.");
    } finally {
      setActionLoading(false);
    }
  };

  const completePatient = async (token) => {
    setActionLoading(true);

    try {
      const response = await fetch(
        `${API}/patients/complete/${encodeURIComponent(token)}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error("Could not complete patient");
      }

      await loadPatients();
    } catch (error) {
      console.error(error);
      alert("Unable to complete patient.");
    } finally {
      setActionLoading(false);
    }
  };

  const callNextPatient = async () => {
    if (servingPatients.length > 0) {
      alert(
        "Please complete the current patient first."
      );
      return;
    }

    if (waitingPatients.length === 0) {
      alert("No patients are waiting.");
      return;
    }

    await callPatient(waitingPatients[0].token);
  };

  const addEmergencyPatient = async () => {
    const name = prompt(
      "Enter emergency patient's name:"
    );

    if (!name || !name.trim()) return;

    setActionLoading(true);

    try {
      const tokenNumber =
        patients.length + 1;

      const patient = {
        token: `E${tokenNumber}`,
        name: name.trim(),
        hospital: "MediFlow Demo Hospital",
        department: "Emergency",
        wait: 0,
        patientsAhead: 0,
        emergency: true,
        status: "Waiting",
      };

      const response = await fetch(`${API}/patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patient),
      });

      if (!response.ok) {
        throw new Error("Could not add emergency patient");
      }

      await loadPatients();
    } catch (error) {
      console.error(error);
      alert("Unable to add emergency patient.");
    } finally {
      setActionLoading(false);
    }
  };

  const averageWait =
    waitingPatients.length > 0
      ? Math.round(
          waitingPatients.reduce(
            (sum, patient) =>
              sum + calculateWait(patient),
            0
          ) / waitingPatients.length
        )
      : 0;

  return (
    <div className="staff-dashboard">

      <header className="staff-header">

        <div>
          <h1>MediFlow AI</h1>
          <p>Hospital Staff Dashboard</p>
        </div>

        <div className="header-actions">

          <button
            onClick={loadPatients}
            disabled={loading}
          >
            <RefreshCw size={18} />
            Refresh
          </button>

          <button
            onClick={() => navigate("/analytics")}
          >
            Analytics
          </button>

          <button
            onClick={() => navigate("/")}
          >
            Home
          </button>

        </div>

      </header>

      <main className="staff-container">

        <div className="staff-stats">

          <div className="staff-stat-card">
            <Users size={26} />
            <div>
              <span>Waiting Patients</span>
              <strong>{waitingPatients.length}</strong>
            </div>
          </div>

          <div className="staff-stat-card">
            <Clock size={26} />
            <div>
              <span>Average Wait</span>
              <strong>{averageWait} min</strong>
            </div>
          </div>

          <div className="staff-stat-card">
            <Activity size={26} />
            <div>
              <span>Now Serving</span>
              <strong>{servingPatients.length}</strong>
            </div>
          </div>

          <div className="staff-stat-card">
            <CheckCircle size={26} />
            <div>
              <span>Completed Today</span>
              <strong>{completedPatients.length}</strong>
            </div>
          </div>

        </div>

        {servingPatients.length > 0 && (
          <section className="now-serving-section">

            <div className="section-heading">
              <h2>Now Serving</h2>
              <span className="live-badge">
                LIVE
              </span>
            </div>

            {servingPatients.map((patient) => (
              <div
                className="now-serving-card"
                key={patient._id || patient.token}
              >

                <div className="serving-token">
                  {patient.token}
                </div>

                <div className="serving-details">
                  <h3>{patient.name}</h3>
                  <p>{patient.department}</p>
                </div>

                <button
                  className="complete-button"
                  onClick={() =>
                    completePatient(patient.token)
                  }
                  disabled={actionLoading}
                >
                  <CheckCircle size={18} />
                  Complete Patient
                </button>

              </div>
            ))}

          </section>
        )}

        {servingPatients.length === 0 && (
          <section className="ready-next-card">

            <div>
              <h2>Ready for Next Patient</h2>
              <p>
                No patient is currently being served.
              </p>
            </div>

            <button
              className="call-next-button"
              onClick={callNextPatient}
              disabled={
                actionLoading ||
                waitingPatients.length === 0
              }
            >
              <PhoneCall size={19} />
              Call Next Patient
            </button>

          </section>
        )}

        <section className="queue-section">

          <div className="queue-header">

            <div>
              <h2>Waiting Queue</h2>
              <p>
                {waitingPatients.length} patients waiting
              </p>
            </div>

            <button
              className="emergency-button"
              onClick={addEmergencyPatient}
              disabled={actionLoading}
            >
              <AlertTriangle size={18} />
              Add Emergency Patient
            </button>

          </div>

          {loading ? (
            <div className="loading-state">
              <RefreshCw className="spinner" />
              <p>Loading queue...</p>
            </div>
          ) : waitingPatients.length === 0 ? (
            <div className="empty-state">
              <CheckCircle size={40} />
              <h3>No patients waiting</h3>
              <p>
                The queue is currently clear.
              </p>
            </div>
          ) : (
            <div className="table-container">

              <table>

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

                  {waitingPatients.map((patient) => {

                    const ahead =
                      calculatePatientsAhead(patient);

                    const wait =
                      calculateWait(patient);

                    return (
                      <tr
                        key={
                          patient._id ||
                          patient.token
                        }
                        className={
                          patient.emergency
                            ? "emergency-row"
                            : ""
                        }
                      >

                        <td>
                          <strong>
                            {patient.token}
                          </strong>

                          {patient.emergency && (
                            <span className="emergency-badge">
                              EMERGENCY
                            </span>
                          )}
                        </td>

                        <td>{patient.name}</td>

                        <td>
                          {patient.department}
                        </td>

                        <td>{ahead}</td>

                        <td>
                          {wait} min
                        </td>

                        <td>
                          <span className="waiting-status">
                            Waiting
                          </span>
                        </td>

                        <td>
                          <button
                            className="call-button"
                            onClick={() =>
                              callPatient(
                                patient.token
                              )
                            }
                            disabled={
                              actionLoading ||
                              servingPatients.length > 0
                            }
                          >
                            <PhoneCall size={16} />
                            Call Patient
                          </button>
                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>
          )}

        </section>

        <section className="workflow-section">

          <h2>Staff Workflow</h2>

          <div className="workflow-steps">

            <div>
              <span>1</span>
              <strong>Call Patient</strong>
              <p>
                Select a waiting patient.
              </p>
            </div>

            <div>
              <span>2</span>
              <strong>Consult Patient</strong>
              <p>
                Patient is marked as serving.
              </p>
            </div>

            <div>
              <span>3</span>
              <strong>Complete Patient</strong>
              <p>
                Finish the consultation.
              </p>
            </div>

            <div>
              <span>4</span>
              <strong>Call Next</strong>
              <p>
                Move to the next patient.
              </p>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default StaffDashboard;