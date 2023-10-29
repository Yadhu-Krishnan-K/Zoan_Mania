const mongoose = require('mongoose')

const sch = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
   
    email:{
        type:String,
        unique:true,
        required:true
    },
    Gender: {
        type:String
    },
    password:{
        type:String,
        required:true
    },
    address:[
        {
            userName: {type: String},
            AddressLane: { type: String },
            City: { type: String },
            Pincode: { type: Number },
            State: { type: String },
            Mobile: { type: Number },
        }
        ],
    MobileNumber:{type:Number},
    access:{
        type:Boolean, 
        default:true
    }
})
const monmodel = mongoose.model("user",sch);

module.exports = monmodel