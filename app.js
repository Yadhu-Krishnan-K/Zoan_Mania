require('dotenv').config()
const express = require("express")
const nocache = require("nocache")
const morgan = require('morgan')
require('./auth/authentication')
const mongoSanitize = require('express-mongo-sanitize')
const User = require('./models/user')
const path = require("path")


const user = require('./Routers/userRouter')
const admin = require('./Routers/supAdminRoute')
const mongoose = require('mongoose')
const app = express()
const session = require('express-session')
const {v4:uuidv4} = require('uuid')
const passport = require('passport')
const sessionSecret = uuidv4();

app.use(express.json())
app.use(express.urlencoded({extended: true}))

mongoose.set('strictQuery', false);
//no-sql sanitization====================================================-------
app.use(mongoSanitize())

// app.all('*', (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this Server!`, 404));
// });

// app.use(globalErrorHandler);
//-----------------------------------------=====================================


app.set('view engine','ejs')
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'assets')));

app.use(morgan('tiny'))
app.use(nocache())



app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: sessionSecret ,
    cookie:{
      secure:false,
      maxAge: 3600000
    }
  }));

  app.use(passport.initialize());









app.use('/',user)
app.use('/admin',admin)

app.post('/test-injection', async (req, res) => {
  try{
    const { email } = req.body;
    console.log('Querying with:', req.body);
    const user = await User.find({ email });
    if (user) {
      // res.send('Access granted',user);
      res.json({message:"Access granted",user})
    } else {
      res.send('Access denied');
    }
  }catch(error){
    console.error('Query failed:', error.message);
    res.status(400).send('Bad input');
  }
});











app.get('/auth/google',
  passport.authenticate('google', { scope: ['email','profile'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });




const port = process.env.port || 8080

mongoose.connect(process.env.DB_URI).then(()=>{
    app.listen(port, () => {
        console.log(`http://localhost:${port}`)
    })
}).catch((error)=>{
    console.log('DB not connected....',error);
})