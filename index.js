const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const userRoute = require('./routes/userRoute')
const nocache = require('nocache')
const flash = require('express-flash')
const path = require('path')
const methodOverride = require('method-override')

// mongoose.connect('mongodb://127.0.0.1:27017/USM').then(() => console.log('DB Connected')).catch(err => console.log(err))
mongoose.connect('mongodb+srv://fazzfasi7:fazi5566@palliative-care.bjmyy8m.mongodb.net/USM?retryWrites=true&w=majority').then(() => console.log('DB Connected')).catch(err => console.log(err))

const app = express()

app.set('view engine','ejs')
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({extended:true}));
app.use(session({
    secret: "dghsagdhgasdfasgfsaf",
    resave: false,
    saveUninitialized: true
}))
app.use(nocache())
app.use(methodOverride('_method'))
app.use(flash())


app.use('/', userRoute)
app.use('/admin', require('./routes/adminRoute'))

app.listen(4000, () => {
    console.log("Server Started!");
})