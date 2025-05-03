const products = require('../../models/products')
const category = require('../../models/category')






//Add Product

const getAdminAddProduct = async(req,res)=>{
    const cate = await category.find()
    console.log("category ===",cate)
    res.render('supAdmin/admin-addProduct',{titel:"Admin|Add Product",cate,currentPage:"Inventory"})  

}

//====================================================================================================
//delete Product

const deleteProduct = async(req,res)=>{
    const data = await products.findOne({_id: req.params.id})
    
    if(data.visible===true){
        await products.updateOne({_id: req.params.id},{$set:{visible:false}})
    }else{
        await products.updateOne({_id: req.params.id},{$set:{visible:true}})
    }

    res.redirect('/admin/inventory');

}













module.exports = {
    getAdminAddProduct,
    deleteProduct
}