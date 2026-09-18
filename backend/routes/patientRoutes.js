const express = require("express");
const Patient = require("../models/Patient");

const router = express.Router();

// Get all patients
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: 1 });

    res.json(patients);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get patients",
      error: error.message,
    });
  }
});

// Create a new patient and generate token
router.post("/", async (req, res) => {
  try {
    const { name, hospital, department, emergency } = req.body;

    if (!name || !hospital || !department) {
      return res.status(400).json({
        message: "Name, hospital and department are required",
      });
    }

    const lastPatient = await Patient.findOne()
      .sort({ createdAt: -1 });

    let nextNumber = 1;

    if (lastPatient && lastPatient.token) {
      const lastNumber = parseInt(
        lastPatient.token.substring(1)
      );

      nextNumber = lastNumber + 1;
    }

    const token = "A" + nextNumber;

    const patient = new Patient({
      token,
      name,
      hospital,
      department,
      emergency: emergency || false,
      status: "Waiting",
    });

    const savedPatient = await patient.save();

    res.status(201).json({
      message: "Patient registered successfully",
      patient: savedPatient,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to register patient",
      error: error.message,
    });
  }
});

// Call next patient
router.put("/call-next", async (req, res) => {
  try {
    const currentPatient = await Patient.findOne({
      status: "Consulting",
    });

    if (currentPatient) {
      return res.status(400).json({
        message: "A patient is already consulting",
      });
    }

    const nextPatient = await Patient.findOne({
      status: "Waiting",
    }).sort({
      emergency: -1,
      createdAt: 1,
    });

    if (!nextPatient) {
      return res.status(404).json({
        message: "No patients are waiting",
      });
    }

    nextPatient.status = "Consulting";

    await nextPatient.save();

    res.json({
      message: "Next patient called successfully",
      patient: nextPatient,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to call next patient",
      error: error.message,
    });
  }
});

// Complete consultation
router.put("/:id/complete", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    patient.status = "Completed";

    await patient.save();

    res.json({
      message: "Consultation completed successfully",
      patient,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to complete consultation",
      error: error.message,
    });
  }
});

// Mark patient as emergency
router.put("/:id/emergency", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    patient.emergency = true;

    await patient.save();

    res.json({
      message: "Emergency priority added",
      patient,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update emergency priority",
      error: error.message,
    });
  }
});

module.exports = router;