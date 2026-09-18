import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    if (role === "staff") {
      navigate("/staff");
    } else {
      navigate("/token");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <Link to="/" style={styles.back}>
          ← Back to Home
        </Link>

        <div style={styles.logo}>
          <div style={styles.logoIcon}>❤</div>

          <div>
            <h1 style={styles.title}>
              MediFlow <span style={styles.ai}>AI</span>
            </h1>

            <p style={styles.subtitle}>Smart Hospital Queue</p>
          </div>
        </div>

        <h2 style={styles.loginTitle}>Welcome Back</h2>

        <p style={styles.loginText}>
          Login to access your MediFlow dashboard
        </p>

        <div style={styles.roles}>
          <button
            type="button"
            onClick={() => setRole("patient")}
            style={{
              ...styles.roleButton,
              ...(role === "patient" ? styles.activeRole : {}),
            }}
          >
            👤 Patient
          </button>

          <button
            type="button"
            onClick={() => setRole("staff")}
            style={{
              ...styles.roleButton,
              ...(role === "staff" ? styles.activeRole : {}),
            }}
          >
            🏥 Staff
          </button>
        </div>

        <form onSubmit={handleLogin}>
          <label style={styles.label}>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <label style={styles.label}>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          {error && (
            <p style={styles.error}>
              {error}
            </p>
          )}

          <button type="submit" style={styles.loginButton}>
            Login
          </button>
        </form>

        <p style={styles.demoText}>
          Demo login: enter any email and password
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f8fc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px",
    fontFamily: "Arial, sans-serif",
  },

  card: {
    width: "100%",
    maxWidth: "450px",
    background: "#ffffff",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
  },

  back: {
    textDecoration: "none",
    color: "#2563eb",
    fontSize: "14px",
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginTop: "25px",
    marginBottom: "30px",
  },

  logoIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "14px",
    background: "#2563eb",
    color: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "24px",
  },

  title: {
    margin: 0,
    fontSize: "25px",
    color: "#172033",
  },

  ai: {
    color: "#2563eb",
  },

  subtitle: {
    margin: "4px 0 0",
    color: "#64748b",
    fontSize: "13px",
  },

  loginTitle: {
    margin: 0,
    fontSize: "28px",
    color: "#172033",
  },

  loginText: {
    color: "#64748b",
    marginBottom: "25px",
  },

  roles: {
    display: "flex",
    gap: "10px",
    marginBottom: "25px",
  },

  roleButton: {
    flex: 1,
    padding: "12px",
    border: "1px solid #d7dee8",
    borderRadius: "10px",
    background: "#ffffff",
    cursor: "pointer",
    fontSize: "15px",
  },

  activeRole: {
    background: "#2563eb",
    color: "#ffffff",
    borderColor: "#2563eb",
  },

  label: {
    display: "block",
    marginBottom: "7px",
    marginTop: "15px",
    fontWeight: "600",
    color: "#334155",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px",
    border: "1px solid #d7dee8",
    borderRadius: "10px",
    fontSize: "15px",
    outline: "none",
  },

  error: {
    color: "#dc2626",
    fontSize: "14px",
  },

  loginButton: {
    width: "100%",
    marginTop: "22px",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },

  demoText: {
    textAlign: "center",
    marginTop: "20px",
    color: "#64748b",
    fontSize: "13px",
  },
};

export default Login;