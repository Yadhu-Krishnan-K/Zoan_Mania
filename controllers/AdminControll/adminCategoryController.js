const category = require('../../models/category')
const Cate = require('../../models/category')
const validator = require('../../helpers/textValidator')
const npmValid = require('validator')
const moneyVal = require('../../helpers/numberValidator')
const products = require('../../models/products')
const Categories = require('../../models/category')


//add category
const addCategory = async(req,res)=>{
    try {
        const catName = req.body.cate
        let catOffer = req.body.offer
        let date = req.body.offerEnd
        const ofer = moneyVal.categoryOffer(catOffer)
        // console.log("ofer===",ofer)
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
        // console.log(cat)
    if(cat.length == 0){
        if(ofer.status && name.status){
            const colleeeection = await category.create({
                catName:catName.toUpperCase(),
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

        const catName = req.body.cate
        // console.log("category name===",catName)
        const catId = req.params.id
        // console.log("catId==",catId)
        let catOffer = req.body.offer
        // console.log('catOffer==',catOffer)
        let date = req.body.offerEnd
        const ofer = moneyVal.categoryOffer(catOffer)
        // console.log("ofer===",ofer)
        const name = validator.categoryValidator(catName)
        const nameinValid = npmValid.isEmpty(catName.trim())
        // console.log("nameinvalid===",nameinValid)
        const oldCatName = await category.findOne({_id: req.params.id})
        // console.log('old name of category==',oldCatName)
        if(!(ofer.status)){
           return res.json({
                status:false,message:ofer.message
            })
        }
        if(!(name.status)){
           return res.json({
                status:false, message:name.message
            })
        }
        if(catOffer == ''){
            catOffer = 0
            date = null
        }
        const cat = await category.findOne({catName:{$regex:  catName, $options: "i"}})
        // console.log("catExist===",cat)
        // console.log("id from find of category==",cat._id)
        // console.log("is equal",catId==cat._id)
    
    if(cat === null||catId==cat._id || (cat.catName.length !== catName.length)){

        if(ofer.status && name.status){
            // console.log('old name of category==',oldCatName.catName)
            const Product = await products.find({ Category : { $in: [oldCatName.catName] } })
            for(let product of Product){
                product.Category.splice(product.Category.indexOf(oldCatName.catName),1)
                product.Category.push(catName.toUpperCase())
                if(product.catOffer.catName==oldCatName.catName||product.catOffer.catPer<=catOffer || new Date(product.catOffer.till)<=new Date()){
                    product.catOffer.catName = catName
                    product.catOffer.catPer = catOffer
                    product.catOffer.till = date
                    product.discountedPrice = product.Price - (product.Price*catOffer/100)
                }
                product.save()
            }
            
            // console.log('products when updating',Product)

            await category.updateOne({_id:req.params.id},{
                catName:catName.toUpperCase(),
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
    else if(cat.catName.length == catName.length) {
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
        let cate = await Cate.findOne({_id:req.params.id})

        await products.updateMany(
            { Category: { $elemMatch: { $eq: cate.catName } } },
            { $pull: { Category: cate.catName } }
          );

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

