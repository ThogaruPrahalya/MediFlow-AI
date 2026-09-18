const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.log("MONGO_URI is missing in .env file");
}

const patientSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    hospital: {
      type: String,
      default: "MediFlow Demo Hospital",
    },

    department: {
      type: String,
      required: true,
    },

    wait: {
      type: Number,
      default: 0,
    },

    patientsAhead: {
      type: Number,
      default: 0,
    },

    emergency: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      default: "Waiting",
    },
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model("Patient", patientSchema);

/* =========================
   HOME
========================= */

app.get("/", (req, res) => {
  res.json({
    message: "MediFlow AI Backend is running successfully!",
  });
});

/* =========================
   GET ALL PATIENTS
========================= */

app.get("/api/patients", async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: 1 });

    res.json(patients);
  } catch (error) {
    console.error("GET PATIENTS ERROR:", error);

    res.status(500).json({
      message: "Failed to get patients",
      error: error.message,
    });
  }
});

/* =========================
   ADD PATIENT
========================= */

app.post("/api/patients", async (req, res) => {
  try {
    console.log("NEW PATIENT REQUEST:", req.body);

    const patient = new Patient({
      token: req.body.token,
      name: req.body.name,
      hospital: req.body.hospital || "MediFlow Demo Hospital",
      department: req.body.department,
      wait: req.body.wait || 0,
      patientsAhead: req.body.patientsAhead || 0,
      emergency: req.body.emergency || false,
      status: req.body.status || "Waiting",
    });

    const savedPatient = await patient.save();

    console.log("PATIENT SAVED:", savedPatient);

    res.status(201).json(savedPatient);
  } catch (error) {
    console.error("ADD PATIENT ERROR:", error);

    res.status(500).json({
      message: "Failed to add patient",
      error: error.message,
    });
  }
});

/* =========================
   CALL PATIENT
========================= */

app.put("/api/patients/call/:token", async (req, res) => {
  try {
    const token = req.params.token;

    console.log("CALL REQUEST FOR TOKEN:", token);

    const patient = await Patient.findOne({
      token: token,
    });

    if (!patient) {
      console.log("PATIENT NOT FOUND:", token);

      return res.status(404).json({
        message: `Patient with token ${token} not found`,
      });
    }

    /*
      Only one patient should normally be serving.
      If another patient is currently serving,
      finish that patient before calling another one.
    */

    const alreadyServing = await Patient.findOne({
      status: "Serving",
      _id: { $ne: patient._id },
    });

    if (alreadyServing) {
      return res.status(400).json({
        message: `${alreadyServing.name} (${alreadyServing.token}) is already being served.`,
      });
    }

    patient.status = "Serving";

    await patient.save();

    console.log(
      "NOW SERVING:",
      patient.token,
      patient.name,
      patient.department
    );

    res.json({
      message: "Patient called successfully",
      patient: patient,
    });
  } catch (error) {
    console.error("CALL PATIENT ERROR:", error);

    res.status(500).json({
      message: "Failed to call patient",
      error: error.message,
    });
  }
});

/* =========================
   COMPLETE PATIENT
========================= */

app.put("/api/patients/complete/:token", async (req, res) => {
  try {
    const token = req.params.token;

    console.log("COMPLETE REQUEST FOR TOKEN:", token);

    const patient = await Patient.findOne({
      token: token,
    });

    if (!patient) {
      return res.status(404).json({
        message: `Patient with token ${token} not found`,
      });
    }

    patient.status = "Completed";

    await patient.save();

    console.log(
      "PATIENT COMPLETED:",
      patient.token,
      patient.name
    );

    res.json({
      message: "Patient completed successfully",
      patient: patient,
    });
  } catch (error) {
    console.error("COMPLETE PATIENT ERROR:", error);

    res.status(500).json({
      message: "Failed to complete patient",
      error: error.message,
    });
  }
});

/* =========================
   DELETE PATIENT
========================= */

app.delete("/api/patients/:id", async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    res.json({
      message: "Patient deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PATIENT ERROR:", error);

    res.status(500).json({
      message: "Failed to delete patient",
      error: error.message,
    });
  }
});

/* =========================
   DATABASE CONNECTION
========================= */

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");

    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error("MongoDB Connection Error:", error);
  });