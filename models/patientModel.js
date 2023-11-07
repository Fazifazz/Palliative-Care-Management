const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  RegNo: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },

  mobile: {
    type: String,
    required: true,
  },
  disease: {
    type: String,
    required: true,
  },
  addingDate: {
    type: Date,
    required: true,
  },
  DoctorName: {
    type: String,
    required: true,
  },
  MedicinesReceived:[{
      medicine:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicine",
        required:true,
      },
      name:{type:String,required:true},
      count:{type:Number,required:true},
      recievedDate:{type:Date,required:true}
  }],
  Medicines: [
    {
      medicine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicine",
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Patient", patientSchema);
