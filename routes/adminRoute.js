const router = require("express").Router();
const adminController = require("../controllers/adminController");
const medicineController = require("../controllers/medicineController");
const { isAdmin, loggedOutAdmin } = require("../middlewares/auth");

router.get("/login", loggedOutAdmin, adminController.loadLogin);
router.post("/login", loggedOutAdmin, adminController.adminLogin);

router.get("/dashboard", isAdmin, adminController.dashboard);

router.get("/users/:id/edit", isAdmin, adminController.loadEditUser);
router.put("/users/:id", isAdmin, adminController.updateUser);
router.delete("/users/:id/destroy", isAdmin, adminController.deleteUser);

router.get("/createUser", isAdmin, adminController.AdminAddUser);
router.post("/createUser", isAdmin, adminController.createUser);

//patients
router.get("/addPatient", isAdmin, adminController.getAddPatient);
router.post("/addPatient", isAdmin, adminController.AddPatient);
router.get("/patients", isAdmin, adminController.getPatientsList);
router.post("/searchPatients", isAdmin, adminController.searchPatient);
router.get("/patients/:id/edit", isAdmin, adminController.editPatient);
router.post("/updatePatient", isAdmin, adminController.updatePatient);
router.delete("/patients/:id/destroy", isAdmin, adminController.deletePatient);

//medicine
router.get("/medicines", isAdmin, medicineController.showMedicines);
router.get("/addMedicine", isAdmin, medicineController.ShowAddMedicine);
router.post("/createMedicine", isAdmin, medicineController.addMedicine);
router.get("/medicines/:id/edit", isAdmin, medicineController.showEditMed);
router.post("/editMedicine", isAdmin, medicineController.updateMedicine);
router.delete("/medicines/:id/destroy",isAdmin,medicineController.deleteMedicine);
router.post("/medicines/search", isAdmin, medicineController.searchMedicine);


router.get("/medicineHistory", isAdmin, adminController.medicineHistory);
router.post("/logout", isAdmin, adminController.logoutAdmin);

module.exports = router;
