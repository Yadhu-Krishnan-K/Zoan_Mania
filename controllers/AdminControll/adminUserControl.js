const db = require('../../models/user')

//for user status
const 


userStatus = async(req,res)=>{
    try {
        const id = req.params.id
        const foo = await db.findOne({_id : id})
        if(foo.access){
            await db.updateOne({_id: id},{$set:{
                access:false
            }});
        }else{
            await db.updateOne({_id: id},{$set:{
                access:true
            }});
        }
        const userData = await db.find()
        let i = 0
        // res.render("supAdmin/admin-control-user", { userData, i })
        res.redirect('/admin/Customers')
    
    } catch (error) {
      console.error("error 500 :",error);
    }
    

}
//==================================================================================================================================================
//user-edit
 const userEdit = async(req,res)=>{

    try {
        const id = req.params.id
        const user_data = await db.findOne({_id : id})
        res.render('supAdmin/adminUserEdit',{user_data,currentPage:"Customers"})
    
    } catch (error) {
      console.error("error 500 :",error);
    }
    

}

//user-update
const userUpdate = async(req,res)=>{
    try {
        const id = req.params.id
        const CName = req.body.Uname;
        await db.updateOne({_id:id},{$set:{
            name:CName  
        }})
        res.redirect('/admin/Customers')
    
    } catch (error) {
      console.error("error 500 :",error);
    }
    

}
//===========================================================================================================================================================
//user-delete
const userDelete = async(req,res)=>{
    try {
        const id = req.params.id;
        await db.deleteOne({_id:id})
        res.redirect('/admin/Customers')
    
    } catch (error) {
      console.error("error 500 :",error);
    }
    
}





















module.exports = {
    userStatus,
    userEdit,
    userUpdate,
    userDelete
}