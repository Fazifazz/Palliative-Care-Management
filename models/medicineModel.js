const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  Slno: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  expiry: {
    type: Date,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Medicine", medicineSchema);