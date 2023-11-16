const mongoose = require('mongoose')

const mongoosePaginate = require('mongoose-paginate-v2');

const sch = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    profileImage:{
        type:String
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
        {   Name: {type: String},
            AddressLine: { type: String },
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

sch.plugin(mongoosePaginate);

const monmodel = mongoose.model("user",sch);

module.exports = monmodel