// require('dotenv').config()
const express = require("express")
const path = require("path")
const user = require('./Routers/userRouter')
const admin = require('./Routers/supAdminRoute')

const app = express()

app.use('/',user)
app.use('/admin-login',admin)


app.set('view engine','ejs')
app.use(express.static(path.join(__dirname,'public')));
const port = process.env.port || 8080

app.get('/',(req,res)=>{
    res.render('user/user-login')
})
app.listen(port,()=>{
    console.log(`http://localhost:${port}`)
})