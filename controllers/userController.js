const User = require("../models/userModel");
const Patient = require("../models/patientModel");
const Medicine = require("../models/medicineModel");
const MedicineDistribution = require("../models/MdcnDstrbtionModel");
const bcrypt = require("bcrypt");

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

const loadRegister = async (req, res) => {
  try {
    res.render("users/registration", { error: null, message: null });
  } catch (error) {
    console.log(error.message);
  }
};
const insertUser = async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists)
      return res.render("users/registration", {
        message: null,
        error: "User already exists.",
      });
    const secPassword = await securePassword(req.body.password);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      password: secPassword,
    });

    const userData = await user.save();
    if (userData) {
      res.redirect("/login");
    } else {
      res.render("users/registration", {
        error: "Your registration has been failed",
        message: null,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadLogin = async (req, res) => {
  const { error } = req.query;
  try {
    res.render("users/login", { message: null, error: error ? error : null });
  } catch (error) {
    console.log(error.message);
  }
};

const validLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.render("users/login", {
        message: null,
        error: "User not found.",
      });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.render("users/login", {
        error: "Wrong password.",
        message: null,
      });
    if (user.is_varified === 1) {
      req.session.user = user._id;
      res.redirect("/");
    } else {
      res.render("users/login", {
        error: "Please wait for the verification by the admin",
        message: null,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadIndex = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const patients = await Patient.aggregate([
      {
        $lookup: {
          from: "medicines",
          localField: "Medicines.medicine",
          foreignField: "_id",
          as: "Medicines.medicine",
        },
      },
    ]);
    res.render("users/index", { user, patients, message: null, error: null });
  } catch (error) {
    console.log(error.message);
  }
};

const searchPatient = async (req, res) => {
  const user = await User.findById(req.user);
  const { q } = req.body;
  try {
    let patients;
    if (q) {
      patients = await Patient.aggregate([
        {
          $match: {
            name: { $regex: ".*" + q + ".*" },
          },
        },
        {
          $lookup: {
            from: "medicines",
            localField: "Medicines.medicine",
            foreignField: "_id",
            as: "Medicines.medicine",
          },
        },
      ]);
    } else {
      patients = await Patient.aggregate([
        {
          $lookup: {
            from: "medicines",
            localField: "Medicines.medicine",
            foreignField: "_id",
            as: "Medicines.medicine",
          },
        },
      ]);
    }
    res.render("users/index", { user, patients, message: null, error: null });
  } catch (error) {
    console.log(error.message);
  }
};

const getMedicines = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const medicines = await Medicine.find();
    res.render("users/medicines", {
      user,
      medicines,
      message: null,
      error: null,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const searchMedicine = async (req, res) => {
  const user = await User.findById(req.user);
  const { q } = req.body;
  try {
    let medicines;
    if (q) {
      medicines = await Medicine.find({ name: { $regex: ".*" + q + ".*" } });
    } else {
      medicines = await Medicine.find();
    }
    res.render("users/medicines", {
      user,
      medicines,
      message: null,
      error: null,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const getPatientMedicines = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(req.user);
  const Pid = await Patient.findById(id);
  try {
    const patient = await Patient.aggregate([
      {
        $match: {
          _id: Pid._id,
        },
      },
      {
        $lookup: {
          from: "medicines",
          localField: "Medicines.medicine",
          foreignField: "_id",
          as: "Medicines.medicine", // Store the medicine details in an array
        },
      },
    ]);
    const patientsMedicines = patient[0].Medicines;
    const recievedMedicines = await MedicineDistribution.find({ patient: id });
    console.log(recievedMedicines);

    res.render("users/patientMedicine", {
      message: null,
      error: null,
      patient,
      user,
      patientsMedicines,
      error: req.flash("error"),
      success: req.flash("success"),
      recievedMedicines,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const distributeMedicines = async (req, res) => {
  const staff = await User.findById(req.session.user);
  const { patientId } = req.params;
  const { medicineId, count } = req.body;
  try {
    const selectedMedicine = await Medicine.findById(medicineId);
    const patient = await Patient.findById(patientId);

    if (!patient) {
      req.flash("error", "patient not found");
      res.redirect("/patientMedicines");
    }

    const countNumber = parseInt(count, 10);

    if (isNaN(countNumber)) {
      req.flash("error", "please enter a valid count");
      return res.status(400).json({ error: "Invalid medicine count" });
    }
    if (countNumber > selectedMedicine.stock) {
      req.flash("error", "please enter a count less than stock");
      return res.redirect(`/patientMedicines/${patientId}`);
    }
    if (countNumber < 1) {
      req.flash("error", "Invalid medicine count");
      return res.redirect(`/patientMedicines/${patientId}`);
    }
    const medicineDetails = {
      medicine: medicineId,
      name: selectedMedicine.name,
      count: countNumber,
      recievedDate: Date.now(),
    };

    const Newstock = selectedMedicine.stock - countNumber;

    await Patient.findByIdAndUpdate(patientId, {
      $push: { MedicinesReceived: medicineDetails },
    });
    await Medicine.findByIdAndUpdate(medicineId, {
      $set: { stock: Newstock },
    });
    await MedicineDistribution.create({
      Slno: selectedMedicine.Slno,
      medicine: medicineId,
      medicineName: selectedMedicine.name,
      count: countNumber,
      distributedDate: Date.now(),
      staffName: staff.name, 
      patient: patientId,
      patientName:patient.name,
      patientRgNo:patient.RegNo
    });
    const mds = await MedicineDistribution.find();
    req.flash(
      "success",
      `${selectedMedicine.name} is disitributed successfully`
    );
    res.redirect(`/patientMedicines/${patientId}`);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const distributioHistory = async (req, res) => {
  try {
    const user = await User.findById(req.session.user);
    const medicineDistributions = await MedicineDistribution.find().populate(
      "patient"
    );
    res.render("users/medicineHistory", { medicineDistributions, user });
  } catch (error) {
    console.log(error.message);
  }
};

const printList = async (req, res) => {
  const { id } = req.params;
  const patient = await Patient.findById(id);
  const recievedMedicines = await MedicineDistribution.find({ patient: id });
  res.render("users/printList", { recievedMedicines, patient });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};

module.exports = {
  loadRegister,
  insertUser,
  loadLogin,
  validLogin,
  loadIndex,
  logout,
  searchPatient,
  getMedicines,
  searchMedicine,
  getPatientMedicines,
  distributeMedicines,
  distributioHistory,
  printList,
};
