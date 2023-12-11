const orderModel = require('../../models/order');
const socketManager = require('../../util/socket')
const mongoose = require('mongoose')
const userModel = require('../../models/user')




const getOrder = async(req,res)=>{
  try {
    const page = parseInt(req.query.page) || 1;
    const options = {
      page: page,
      limit: 6,
      sort: { _id: -1 }
    };

    const ordersData = await orderModel.paginate({}, options);

    res.render('supAdmin/admin-order-tracker', {
      title: "Orders",
      ordersData: ordersData.docs,
      Page: 'Orders',
      totalPages: ordersData.totalPages,
      currentPage: ordersData.page
    }); 
    
  } catch (error) {
    console.error("error 500 :",error);
  }
    
}



const updateOrderStatus = async(req,res)=>{
  try {
    const orderId = req.params.orderId
    const newStatus = req.body.newStatus
    await orderModel.findByIdAndUpdate(orderId,{Status:newStatus})
    socketManager.getIO().emit('OrderStatusUpdated', { orderId, newStatus });
    res.json({success:true})
    
  } catch (error) {
    console.error("error 500 :",error);
  }
}


const updateReturnStatus = async(req,res)=>{
  try {
    const num = req.body.num
    const P_id = req.body.productId
    const O_id = req.params.orderId
    // console.log('typeof(P-id)==',typeof(P_id),", typeof(O_id)==",typeof(O_id))
    // console.log("req.body===",req.body)
    let order = await orderModel.findOne({_id:O_id}).populate('Items.productId')
    console.log("order === ",order)
    let item = order.Items.find((item)=>item.productId._id == P_id)
    console.log("item in updateReturnStatus===",order.Items)
    console.log("num from updateReturnStatus===",num)
    if (num == 0) {
      item.returnStatus = 'returned';
      await order.save();
      let Wamount = item.quantity * item.productId.Price
      await userModel.findByIdAndUpdate({_id: order.UserId},{$inc:{Wallet:Wamount}})
      
      res.json({
        response:"accepted"
      })
  
    } else if (num == 1) {
      item.returnStatus = 'rejected';
      await order.save();
      res.json({
        response:"rejected"
      })
  
    }
    
  } catch (error) {
    console.error("error 500 :",error);
  }
  


}


const orderDetailPage = async(req,res)=>{
  try {
    let orderId=req.params.orderId;
    let order = await orderModel.findOne({_id: orderId}).populate('Items.productId')
    let ProductAllDetails = order.Items
    res.render('supAdmin/adminSide-order-detail-page',{title:"Order Detail", ProductAllDetails, order,Page:"Orders"})    
    
  } catch (error) {
    console.error("error 500 :",error);
  }
  
}







module.exports = {
    getOrder,
    updateOrderStatus,
    updateReturnStatus,
    orderDetailPage,

}