const mongoose = require("mongoose");

const MedDistribtion = new mongoose.Schema({
  medicine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine",
    required: true,
  },
  Slno:{type:Number,required:true},
  medicineName: { type: String, required: true },
  count: { type: Number, required: true },
  distributedDate: { type: Date, required: true },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  staffName: { type: String, required: true },
  patientName: { type: String, required: true },
  patientRgNo: { type: Number, required: true },
});

module.exports = mongoose.model("Distribution", MedDistribtion);
