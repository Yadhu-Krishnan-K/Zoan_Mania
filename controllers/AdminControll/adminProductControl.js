const products = require('../../models/products')
const category = require('../../models/category')
const { default: mongoose, isObjectIdOrHexString } = require('mongoose');






//Add Product

const getAdminAddProduct = async(req,res)=>{
    try {
        const cate = await category.find()
        console.log("category ===",cate)
        res.render('supAdmin/admin-addProduct',{titel:"Admin|Add Product",cate,currentPage:"Inventory"})  
    
    } catch (error) {
      console.error("error 500 :",error);
    }
    

}



const postAddProduct = async(req,res)=>{
    try {
        
     
        const images = req.files;
      
        
         const imageUrls = images.map(file=>file.filename)
        let arr =[]
        
     
         for(i=0;i<imageUrls.length;i++){
            let ar=imageUrls[i].split('.')
            arr.push(ar[1])
         }

         for(i=0;i<arr.length;i++){
          
             if(!(["jpg","jpeg","png"].includes(arr[i]))){
                
                 return res.render('supAdmin/422error')
             }
         }
     
     console.log("when adding product, img==",imageUrls);
        const {Description,Pname,stock,price,offer,Specification1,Specification2,Specification3,Suffix}=req.body
        const categories = Array.isArray(req.body.categories) ? req.body.categories : req.body.categories.split(',');
        const catWithOffer = await category.find({catOffer:{$gt:0}})
        console.log("catWithOffer ==== ",catWithOffer)
        let highestOffer = 0;
        let matchingCategoryName = null;
        let expDate = null
        if (catWithOffer.length > 0) {

            // Iterate over each category in categories
            categories.forEach(categoryName => {
                console.log("Eeeeeeeeenttttttttttttttttttttttttered category offercheck");
                const matchingCategory = catWithOffer.find(cat => cat.catName === categoryName);
                
                if (matchingCategory && matchingCategory.catOffer > highestOffer) {

                    highestOffer = matchingCategory.catOffer;
                    matchingCategoryName = categoryName;
                    expDate = new Date(matchingCategory.offerExpiry)
                    
                }
                console.log("hiiiiiiiiiiiiiiiiiiiiiiiigest=",highestOffer)
            });
        }
        const discountedPrice = price-price*highestOffer/100
        // const BigOffer
        // console.log(Description,Pname,stock,price,category,"offer====",offer,Specification1,Specification2,Specification3,Suffix)
        console.log("categories from adding products====",categories)
        console.log("hO=",highestOffer,", mC=",matchingCategoryName,", eD=",expDate);
        

    
        //     // try {
             const product = new products({
                 Description:Description,
                 Name:Pname,
                 Image:imageUrls,
                 Stock:stock,
                 Category:categories,
                 catOffer: {
                    catName: matchingCategoryName,
                    catPer: highestOffer,
                    till: expDate
                },
                 Price:price,
                 discountedPrice:discountedPrice,
                 Offer:req.body.offer,
                 Spec1:Specification1,
                 Spec2:Specification2,
                 Spec3:Specification3,
                 Suffix:Suffix
             })
             const newProduct = await product.save();
             // console.log(newProduct);
             console.log(newProduct)
    
            //  res.json(('/admin/inventory')
            res.json({
                success:true
            })
    
    } catch (error) {
      console.error("error 500 :",error);
    }
    
  
         
 }




const getAdminEditProduct = async(req,res)=>{
    try {
        
        const id = req.params.id
        const P_detail = await products.findOne({_id: id})
        const cate = await category.find()
        // console.log("efef",cate);
        // console.log(P_detail.Image);
        res.render('supAdmin/admin-edit-product',{P_detail,cate,title:"Edit Product",Page:"Inventory"});
    
    } catch (error) {
      console.error("error 500 :",error);
    }
}




const postProductEdit = async(req,res)=>{
    try {
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
        const discountedPrice = req.body.Price - (req.body.Price * productData.catOffer.catPer/100)
        const data = {
            Name: req.body.ProductName,
            Description: req.body.Description,
            Category: req.body.Category,
            Stock: req.body.Stock,
            Price: req.body.Price,
            discountedPrice: discountedPrice,
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
    
    } catch (error) {
      console.error("error 500 :",error);
    }
    

    
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
    try {
        
        const data = await products.findOne({_id: req.params.id})
        
        if(data.visible===true){
            await products.updateOne({_id: req.params.id},{$set:{visible:false}})
        }else{
            await products.updateOne({_id: req.params.id},{$set:{visible:true}})
        }
    
        res.redirect('/admin/inventory');
    
    } catch (error) {
      console.error("error 500 :",error);
    }

}










module.exports = {
    getAdminAddProduct,
    deleteProduct,
    getAdminEditProduct,
    deleteSingleImage,
    postProductEdit,
    postAddProduct
}