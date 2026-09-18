const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
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
    required: true,
  },

  department: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    default: "Waiting",
  },

  emergency: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;