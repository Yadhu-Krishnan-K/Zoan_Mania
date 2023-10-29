const products = require('../../models/products')







//Add Product

const getAdminAddProduct = (req,res)=>{
    
    res.render('supAdmin/admin-addProduct')  
    // res.send('hei')
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
    // await products.findByIdAndDelete({_id: req.params.id})
    res.redirect('/admin/inventory');

}













module.exports = {
    getAdminAddProduct,
    deleteProduct
}