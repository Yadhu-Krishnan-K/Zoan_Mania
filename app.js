require('dotenv').config()
const express = require("express")
const nocache = require("nocache")
const morgan = require('morgan')
require('./auth/authentication')

const mongoSanitize = require('express-mongo-sanitize')

const path = require("path")


const user = require('./Routers/userRouter')
const admin = require('./Routers/supAdminRoute')
const mongoose = require('mongoose')
const app = express()
const session = require('express-session')
const {v4:uuidv4} = require('uuid')
const passport = require('passport')
const sessionSecret = uuidv4();
const cron = require('./util/cron')


//web socket setup
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);
const socketManager = require('./util/socket');
socketManager.initialize(io);


app.use(express.json())
app.use(express.urlencoded({extended: true}))

mongoose.set('strictQuery', false);
//no-sql sanitization====================================================-------
app.use(mongoSanitize())



app.set('view engine','ejs')
app.use(express.static(path.join(__dirname,'public')));

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












app.get('/auth/google',
  passport.authenticate('google', { scope: ['email','profile'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/userHome');
  });




const port = process.env.port || 8080

mongoose.connect(process.env.DB_URI).then(()=>{
 cron.start()

    httpServer.listen(port, () => {
        console.log(`http://localhost:${port}`)
    })
}).catch((error)=>{
    console.log('DB not connected....',error);
})