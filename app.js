const path = require("path")
require('dotenv').config()
const mongoose = require('mongoose')
const express = require("express")
const nocache = require("nocache")
const morgan = require('morgan')
const mongoSanitize = require('express-mongo-sanitize')
const { v4: uuidv4 } = require('uuid')
const session = require('express-session')
const cron = require('./util/cron')
// require('./auth/authentication')
// const passport = require('passport')

//@declarations
const app = express()
const sessionSecret = uuidv4();


//@roues import
const user = require('./Routers/userRouter')
const admin = require('./Routers/supAdminRoute')


// web socket setup
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);
const socketManager = require('./util/socket');
socketManager.initialize(io);

//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('tiny'))
app.use(nocache())
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: sessionSecret,
  cookie: {
    secure: false,
    maxAge: 3600000
  }
}));

//no-sql sanitization====================================================-------
mongoose.set('strictQuery', false);
app.use(mongoSanitize())


//setting view engine(ejs)
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')));





// app.use(passport.initialize());
// app.get('/auth/google',
//   passport.authenticate('google', { scope: ['email', 'profile'] }));

// app.get('/google/callback',
//   passport.authenticate('google', { failureRedirect: '/' }),
//   function (req, res) {
  //     // Successful authentication, redirect home.
  //     res.redirect('/userHome');
  //   });
  
  //@routes on work
  app.use('/', user)
  app.use('/admin', admin)


const port = process.env.port || 8080

mongoose.connect(process.env.DB_URI)
  .then(() => {
    //  cron.start()

    httpServer.listen(port, () => {
      console.log(`http://localhost:${port}`)
    })
  }).catch((error) => {
    console.log('DB not connected....', error);
  })