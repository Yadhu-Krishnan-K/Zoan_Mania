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


const addProduct = async (req, res) => {
    console.log('adding products...')
    console.log("req.files====", req.files, 'files');

    const images = req.files;
    console.log("images===", images)    

    const imageUrls = images.map(file => file.filename)
    let arr = []
    console.log('imageUrls = ',imageUrls)

    for (i = 0; i < imageUrls.length; i++) {
        let ar = imageUrls[i].split('.')
        console.log('ar = ',ar)
        arr.push(ar[1])
    }
    console.log('arr = ',arr)
    const validExts = ["jpg", "jpeg", "png"];
    for (i = 0; i < arr.length; i++) {
        console.log(!validExts.some(ext => arr[i].includes(ext)))
        if (!validExts.some(ext => arr[i].includes(ext))) {
            console.log('found imposter',i)
            return res.render('supAdmin/422error')
        }
    }
    console.log("when adding product, img==", imageUrls);
    const { Description, Pname, stock, price, category, Specification1, Specification2, Specification3, Suffix } = req.body
    //     // try {
    const product = new products({
        Description: Description,
        Name: Pname,
        Image: imageUrls,
        Stock: stock,
        Category: category,
        Price: price,
        Spec1: Specification1,
        Spec2: Specification2,
        Spec3: Specification3,
        Suffix: Suffix
    })
    const newProduct = await product.save();
    console.log('product saved....😮😮😮😮😮😮')
    console.log(newProduct);

    res.redirect('/admin/inventory')

}







module.exports = {
    getAdminAddProduct,
    deleteProduct,
    addProduct
}