const products = require('../../models/products')







//Add Product

const getAdminAddProduct = (req,res)=>{
    
    res.render('supAdmin/admin-addProduct')  

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