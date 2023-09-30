// require('dotenv').config()
const express = require("express")
const path = require("path")
const user = require('./Routers/userRouter')
const admin = require('./Routers/supAdminRoute')
const mongoose = require('mongoose')
const app = express()
// mongoose.connect("mongodb://127.0.0.1:27017/Zoan",{
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
// const monmodel = mongoose.model("user",sch);
// app.post("/post",async(req,res)=>{
//     const data = new monmodel({
//         name:req.body.name,
//         email:req.body.email,
//         id:req.body.id
//     })
//     const val = await data.save()
//     res.json(val)
// })



app.use('/',user)
app.use('/admin-login',admin)


app.set('view engine','ejs')
app.use(express.static(path.join(__dirname,'public')));
const port = process.env.port || 8080

app.listen(port,()=>{
    console.log(`http://localhost:${port}`)
})