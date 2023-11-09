const user_route = require('express').Router()
const userController = require('../controllers/userController');
const { isLogout, isLogged, isVerified } = require('../middlewares/auth')


user_route.get('/register', isLogout, userController.loadRegister);
user_route.post('/register', isLogout, userController.insertUser);

user_route.get('/login', isLogout, userController.loadLogin)
user_route.post('/login', isLogout, userController.validLogin)

user_route.get('/', isLogged, isVerified,  userController.loadIndex)
user_route.post('/logout', isLogged, userController.logout)

user_route.post('/searchPatient',isLogged,isVerified,userController.searchPatient)

user_route.get('/medicines',isLogged,isVerified,userController.getMedicines)
user_route.post('/searchMedicine',isLogged,isVerified,userController.searchMedicine)

user_route.get('/patientMedicines/:id',isLogged,isVerified,userController.getPatientMedicines)
user_route.post("/distribute-medicines/:patientId", isLogged,isVerified,userController.distributeMedicines);
user_route.get("/distributionHistory",isLogged,isVerified, userController.distributioHistory);
user_route.get('/printList/:id',isLogged,isVerified,userController.printList)



module.exports = user_route;

