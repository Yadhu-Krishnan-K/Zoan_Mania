const category = require('../../models/category')
const Cate = require('../../models/category')
const validator = require('../../helpers/textValidator')
const moneyVal = require('../../helpers/numberValidator')
const products = require('../../models/products')


//add category
const addCategory = async(req,res)=>{
    try {
        const catName = req.body.cate
        let catOffer = req.body.offer
        let date = req.body.offerEnd
        const ofer = moneyVal.categoryOffer(catOffer)
        console.log("ofer===",ofer)
        const name = validator.categoryValidator(catName)
        if(!(ofer.status)){
            res.json({
                status:false,message:ofer.message
            })
        }
        if(!(name.status)){
            res.json({
                status:false, message:name.message
            })
        }
        if(catOffer == ''){
            catOffer = 0
            date = null
        }
        const cat = await category.find({catName:{$regex: "^" + catName, $options: "i"}})
        console.log(cat)
    if(cat.length == 0){
        if(ofer.status && name.status){
            const colleeeection = await category.create({
                catName:catName,
                catOffer:catOffer,
                offerExpiry:date,
                expired:(catOffer==0)?true:false
            })
            res.json({
                status:true
            })
        }
    // res.redirect('/admin/Category') 
    }
    else if(cat.length > 0) {
        res.json({
            status:false,
            message:'category already exist'
        })
    
    } 
    
    } catch (error) {
      console.error("error 500 :",error);
    }
    
    
}
//====================================================================================================================================
//edit Category
const editCategory = async(req,res)=>{
    try {
        const id = req.params.id;
        const category = await Cate.findOne({_id:id})
        res.render('supAdmin/admin-category-edit',{title:"Admin-edit-Category",category,Page:"Category"})
    
    } catch (error) {
      console.error("error 500 :",error);
    }
    
}

//=======================
//cat update
const categoryUpdate = async(req,res)=>{
    try {
        const catName = req.body.cateName
        let catOffer = req.body.offer
        let date = req.body.offerEnd
        const ofer = moneyVal.categoryOffer(catOffer)
        console.log("ofer===",ofer)
        const name = validator.categoryValidator(catName)
        if(!(ofer.status)){
            res.json({
                status:false,message:ofer.message
            })
        }
        if(!(name.status)){
            res.json({
                status:false, message:name.message
            })
        }
        if(catOffer == ''){
            catOffer = 0
            date = null
        }
        const cat = await category.find({catName:{$regex: "^" + catName, $options: "i"}})
        console.log(cat)
    if(cat.length == 0){
        if(ofer.status && name.status){
            await category.updateOne({_id:req.params.id},{
                catName:catName,
                catOffer:catOffer,
                offerExpiry:date,
                expired:(catOffer==0)?true:false
            })
            res.json({
                status:true
            })
        }
    // res.redirect('/admin/Category') 
    }
    else if(cat.length > 0) {
        res.json({
            status:false,
            message:'category already exist'
        })
    
    } 
    
    } catch (error) {
      console.error("error 500 :",error);
    }
    




}
const cateOfferRemove = async(req,res)=>{
    try {
        await Cate.updateOne({_id:req.params.id},{
            catOffer:0,
            offerExpiry:null,
            expired:true
        })
        res.json({
            success:true
        })
    
    } catch (error) {
      console.error("error 500 :",error);
    }
    
}
//==========================================================================================================================================

//category Delete
const categoryDelete = async(req,res)=>{
    try {
        await Cate.findByIdAndDelete({_id:req.params.id})
        res.json({success:true})
    
    } catch (error) {
      console.error("error 500 :",error);
    }
    
}





































module.exports = {
    addCategory,
    editCategory,
    categoryUpdate,
    categoryDelete,
    cateOfferRemove
}

