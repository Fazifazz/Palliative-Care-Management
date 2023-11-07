const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const userRoute = require('./routes/userRoute')
const nocache = require('nocache')
const flash = require('express-flash')
const methodOverride = require('method-override')

mongoose.connect('mongodb://127.0.0.1:27017/USM').then(() => console.log('DB Connected')).catch(err => console.log(err))

const app = express()

app.set('view engine','ejs')

app.use(express.urlencoded({extended:true}));
app.use(session({
    secret: "dghsagdhgasdfasgfsaf",
    resave: false,
    saveUninitialized: true
}))
app.use(nocache())
app.use(flash())
app.use(methodOverride('_method'))


app.use('/', userRoute)
app.use('/admin', require('./routes/adminRoute'))

app.listen(5000, () => {
    console.log("Server Started!");
})