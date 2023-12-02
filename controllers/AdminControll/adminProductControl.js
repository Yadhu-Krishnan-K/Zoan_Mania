const products = require('../../models/products')
const category = require('../../models/category')
const { default: mongoose, isObjectIdOrHexString } = require('mongoose');






//Add Product

const getAdminAddProduct = async(req,res)=>{
    const cate = await category.find()
    console.log("category ===",cate)
    res.render('supAdmin/admin-addProduct',{titel:"Admin|Add Product",cate,currentPage:"Inventory"})  

}

const   postAddProduct = async(req,res)=>{
  
    console.log("req.files====",req.files,'files');
 
    const images = req.files;
    console.log("images===",images)
    
     const imageUrls = images.map(file=>file.filename)
    let arr =[]
    console.log("imageUrls====",imageUrls)
 
     for(i=0;i<imageUrls.length;i++){
        let ar=imageUrls[i].split('.')
        arr.push(ar[1])
     }
    //  console.log("arr==",arr)
     for(i=0;i<arr.length;i++){
        // console.log(["jpg","jpeg","png"].includes(arr[0]));
         if(!(["jpg","jpeg","png"].includes(arr[i]))){
            // console.log("done in arr[",i,"] ==",arr[i]);
            // console.log("type = ",typeof(arr[i]))
             return res.render('supAdmin/422error')
         }
     }
 
 console.log("when adding product, img==",imageUrls);
    const {Description,Pname,stock,price,category,offer,Specification1,Specification2,Specification3,Suffix}=req.body
    console.log(Description,Pname,stock,price,category,"offer====",offer,Specification1,Specification2,Specification3,Suffix)



    //     // try {
         const product = new products({
             Description:Description,
             Name:Pname,
             Image:imageUrls,
             Stock:stock,
             Category:category,
             Price:price,
             Offer:req.body.offer,
             Spec1:Specification1,
             Spec2:Specification2,
             Spec3:Specification3,
             Suffix:Suffix
         })
         const newProduct = await product.save();
         // console.log(newProduct);
         console.log(newProduct)

         res.redirect('/admin/inventory')
         
 }


const getAdminEditProduct = async(req,res)=>{
    const id = req.params.id
    const P_detail = await products.findOne({_id: id})
    const cate = await category.find()
    console.log("efef",cate);
    console.log(P_detail.Image);
    res.render('supAdmin/admin-edit-product',{P_detail,cate,title:"Edit Product",Page:"Inventory"});
}




const postProductEdit = async(req,res)=>{

    const P_id = req.params.P_id
    const productData = await products.findOne({_id:P_id})
    const image1 = req.files && req.files.image1 ? req.files.image1[0].filename : (productData.Image[0] ? productData.Image[0] : '0');
    const image2 = req.files && req.files.image2 ? req.files.image2[0].filename : (productData.Image[1] ? productData.Image[1] : '0');
    const image3 = req.files && req.files.image3 ? req.files.image3[0].filename : (productData.Image[2] ? productData.Image[2] : '0');
    const image4 = req.files && req.files.image4 ? req.files.image4[0].filename : (productData.Image[3] ? productData.Image[3] : '0');

    console.log("image.filename===",image1)
    const imageUrls = [
        image1,
        image2,
        image3,
        image4
    ];
    const images = imageUrls.filter(img=>img!=='0')
    console.log("/update-product=======",images)


        // const {Description,ProductName,Category,Stock,Price} = req.body

    const data = {
        Name: req.body.ProductName,
        Description: req.body.Description,
        Category: req.body.Category,
        Stock: req.body.Stock,
        Price: req.body.Price,
        Image: images,
        Spec1: req.body.Spec1,
        Spec2: req.body.Spec2,
        Spec3: req.body.Spec3

    }
    const updatedProduct = await products.findByIdAndUpdate(P_id, data);
    if (!updatedProduct) {
            return res.status(404).send('Product not found');
    }
    res.redirect('/admin/inventory');
    
}


//delete product images single
const deleteSingleImage = async(req,res)=>{
    try {
        const P_id = new mongoose.Types.ObjectId(req.params.P_id)
    const num = req.body.num

    const productDetail = await products.findOneAndUpdate({_id:P_id},{})
    let removed = productDetail.Image.splice(num,1)
    console.log("productDetail after deleting an image from an array")
    console.log(removed)
    await productDetail.save()
    res.json({success:true})    
    } catch (error) {
        console.log(error)
    }
    
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
    deleteProduct,
    getAdminEditProduct,
    deleteSingleImage,
    postProductEdit,
    postAddProduct
}