const User = require('../models/userModel')

const isLogout = (req, res, next) => {
    if (!req.session.user) {
        next()
    } else {
        res.redirect('/')
    }
}
// 
const isLogged = (req, res, next) => {
    if (req.session.user) {
        req.user = req.session.user
        next()
    } else {
        res.redirect('/login')
    }
}
const isAdmin = (req, res, next) => {
    if(req.session.admin) {
        req.admin = req.session.admin 
        next()
    }else{
        res.redirect('/admin/login')
    }
}

const loggedOutAdmin=  (req, res, next) => {
    if(!req.session.admin){
        next()
    }else{
        res.redirect('/admin/dashboard')
    }
}

const isVerified = async  (req,res,next) => {
    const user = await User.findById(req.user)
    if (user.is_varified === 1) {
        next()
    } else {
        res.redirect('/login')
    }
}

module.exports = {
    isLogout,
    isLogged,
    isAdmin,
    loggedOutAdmin,
    isVerified
}