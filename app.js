require('dotenv').config()
const express = require("express")
const path = require("path")

const user = require('./Routers/userRouter')
const admin = require('./Routers/supAdminRoute')
const mongoose = require('mongoose')
const app = express()
const session = require('express-session')
const {v4:uuidv4} = require('uuid')


app.use(express.json())
app.use(express.urlencoded({extended:true}))
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







app.use('/',user)
app.use('/admin',admin)


app.set('view engine','ejs')
app.use(express.static(path.join(__dirname,'public')));
const port = process.env.port || 8080

mongoose.connect(process.env.DB_URI).then(()=>{
    app.listen(port, () => {
        console.log(`http://localhost:${port}`)
    })
}).catch((error)=>{
    console.log('DB not connected....',error);
})




























































//G00o0oilr34$5smv,2! -google