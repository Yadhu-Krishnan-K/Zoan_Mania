const category = require('../../models/category')
const Cate = require('../../models/category')
const validator = require('../../helpers/textValidator')
const moneyVal = require('../../helpers/numberValidator')


//add category
const addCategory = async(req,res)=>{
    
        const catName = req.body.cate
        const catOffer = req.body.offer
        const ofer = moneyVal.categoryOffer(catOffer)
        const name = validator.categoryValidator(catName)
        
    const cat = await category.find({catName:{$regex: "^" + catName, $options: "i"}})
    console.log(cat)
    if(cat.length == 0){
        if(ofer && name){
            const colleeeection = await category.create({
                catName:catName,
                catOffer:catOffer
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
}
//====================================================================================================================================
//edit Category
const editCategory = async(req,res)=>{
    const id = req.params.id;
    const category = await Cate.findOne({_id:id})
    res.render('supAdmin/admin-category-edit',{title:"Admin-edit-Category",category,Page:"Category"})

}

//=======================
//cat update
const categoryUpdate = async(req,res)=>{
    await Cate.updateOne({_id:req.params.id},{
        catName:req.body.catName
    })
    res.redirect('/admin/Category')
}
//==========================================================================================================================================

//category Delete
const categoryDelete = async(req,res)=>{
    await Cate.updateOne({_id:req.params.id},{
        catName:req.body.catName
    })
    res.redirect('/admin/Category')
}





































module.exports = {
    addCategory,
    editCategory,
    categoryUpdate,
    categoryDelete
}

