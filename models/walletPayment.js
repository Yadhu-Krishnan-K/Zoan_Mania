const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    userId:{type:ObjectId},
   
    payment:[
        {
            amount:{type: Number},
            date:{type: Date},
            purpose:{type: String},
            income:{type: String}

        }
    ]
})

const walletSchema = mongoose.model('wallet',Schema)

module.exports = walletSchema