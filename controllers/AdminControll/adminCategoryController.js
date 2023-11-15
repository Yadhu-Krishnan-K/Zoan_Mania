const category = require('../../models/category')
const Cate = require('../../models/category')



//add category
const addCategory = async(req,res)=>{
    // console.log(req.body.cate)
    // const categ = await new category({
        const catName = req.body.cate
    // })
    // console.log(catName);
    const cat = await category.find({catName:{$regex: "^" + catName, $options: "i"}})
    console.log(cat)
    if(cat == "[]"){
        res.redirect('admin/addCatgory')
    }
    else if (cat.length>0) {
        //    console.log(req.files,'files');
        res.render('supAdmin/admin-category-add', { error: 'The category already exists' });

    } else {
        const colleeeection = await category.create({catName:catName})
    res.redirect('/admin/Category') 
    }
}
//====================================================================================================================================
//edit Category
const editCategory = async(req,res)=>{
    const id = req.params.id;
    const category = await Cate.findOne({_id:id})
    res.render('supAdmin/admin-category-edit',{title:"Admin-edit-Category",category,currentPage:"Category"})

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

