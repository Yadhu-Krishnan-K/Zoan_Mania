const User = require('../../models/user')
const otpModel = require('../../models/otpModel')
const bcrypt = require('bcrypt')

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const uname = await User.findOne({ name: name })
    if (uname) {
      req.session.exist = "The username already exists"
      return res.redirect('/signup')
    }
    const exist = await User.findOne({ email })
    if (!exist) {
      await otp({ name, email, password });
      req.session.authEmail = email
      // res.status(200).json({success:true})
      res.redirect('/otp')
    } else {
        res.status(400).json({ message: "This email is already registered", success: false })
    }
  } catch (error) {
    console.error('Error from signup = ', error.message)
  }
}

const userSignup = (req,res)=>{
    const exist = req.session.exist
    res.render('user/userSignUp',{title:"SignuUp",exist})  
}


const otpForm = (req, res) => {
  res.render('user/otpRegister', { title: "Register" })
}

const verifyOtp = async (req, res) => {
  console.log('req.body from verify otp = ',req.body)
  try {
    
    let userOtp = req.body.otp
    // const vaotp = req.session.vaotp
    const email = req.session.authEmail

    const userToBeSaved = await otpModel.findOne({email})
    if(!userToBeSaved){
      req.session.authEmail = null
      return res.status(400).json({success:false, url:'/signup'})
    }
    if(userToBeSaved.otp == userOtp){
      const hashPass = await bcrypt.hash(userToBeSaved.password, saltRounds);
      const savedUser = await User.create({ name: userToBeSaved.name, email, password: hashPass });
      req.session.userAuth = true;
      req.session.userId = savedUser._id
      return res.status(201).json({url:'/userHome', success:true})
    }else{
      console.log('enter valid otp')
      return res.status(400).json({success:false,message:"enter a valid otp"})
    }

  } catch (error) {
    console.log('error form verifying otp = ',error.message)
  }
}



const userLogin = (req, res) => {
    let txt = req.session.txt;
    if (req.session.err) {
        res.render('user/userLogin', { title: 'login', txt });
        req.session.err = false; 
    } else {
        res.render('user/userLogin', { title: 'login' });
    }
}
const userLoginBackend = async (req, res) => {
  const { email, password } = req.body;
  console.log('email===', email, "    passord===", password);
  const logins = await User.findOne({ email: email })

  if (!logins) {
    req.session.txt = "No users found"
    res.json({
      success: false,
      message: "No users found"
    })
  } else {
    let isChecked = await bcrypt.compare(password, logins.password)

    req.session.name = logins.name

    if (isChecked == true && logins.access) {
      req.session.userAuth = true;
      req.session.email = email
      req.session.userId = logins._id
      req.session.save()
      console.log('userId=' + req.session.userId)
      res.json({
        success: true
      })
    } else if (logins.access === false) {

      res.json({
        success: false,
        message: "User is blocked"
      })
    } else if (isChecked === false) {

      res.json({
        success: false,
        message: "Check your password"
      })
    }
  }
}




const logout = (req, res) => {

  req.session.userAuth = false
  req.session.loggedIn = false

  res.redirect('/')

}

module.exports = {
    signup,
    userSignup,
    otpForm,
    verifyOtp,
    userLogin,
    userLoginBackend,
    logout
}