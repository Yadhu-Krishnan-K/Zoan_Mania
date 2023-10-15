require('dotenv').config()
const express = require("express")
// const passport = require('passport')
require('./auth/authentication')

const path = require("path")

const user = require('./Routers/userRouter')
const admin = require('./Routers/supAdminRoute')
const mongoose = require('mongoose')
const app = express()
const session = require('express-session')
const {v4:uuidv4} = require('uuid')
const passport = require('passport')


app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.set('view engine','ejs')
app.use(express.static(path.join(__dirname,'public')));
// mongoose.connect(process.env.DB_URI,{
//     useNewUrlParser:true,useUnifiedTopology:true
// },(err)=>{
//     if(err){
//         console.log(err)
//     }else{
//         console.log("Successfully connected");
//     }
// })

// const sch = {
//     name:String,
//     email:String,
//     id:Number
// }
// 
// app.post('/pos',async(req,res)=>{
//     const data = new monmodel({
//         name:req.body.name,
//         email:req.body.email,
//         id:req.body.id
//     })
//     const val = await data.save()
//     res.json(val)
//     console.log(val);
// })

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET' ,
    cookie:{secure:false}
  }));

  app.use(passport.initialize());





app.use((req, res, next) => {
  // Set cache control headers to prevent caching for all routes
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  next();
});
  




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
    app.listen(port, () => {
        console.log(`http://localhost:${port}`)
    })
}).catch((error)=>{
    console.log('DB not connected....',error);
})




























































