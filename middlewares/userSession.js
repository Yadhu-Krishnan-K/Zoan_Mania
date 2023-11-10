const { session } = require('passport');
const userModel =require('../models/user');

const userAccess = async(req,res,next)=>{
const user = await userModel.findOne({name:req.session.name})
    if(user.access == false){
            req.session.userAuth = false;
            req.session.loggedIn = false;
            res.redirect('/');     
    }else{
        next()
    }
}

module.exports = userAccess;