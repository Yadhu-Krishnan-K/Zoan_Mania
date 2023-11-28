const orderModel = require('../../models/order');
const socketManager = require('../../util/socket')




const getOrder = async(req,res)=>{
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
    
}



const updateOrderStatus = async(req,res)=>{
    const orderId = req.params.orderId
    const newStatus = req.body.newStatus
    await orderModel.findByIdAndUpdate(orderId,{Status:newStatus})
    socketManager.getIO().emit('OrderStatusUpdated', { orderId, newStatus });
    res.json({success:true})
}

const orderDetailPage = async(req,res)=>{
    let orderId=req.params.orderId;
    let order = await orderModel.findOne({_id: orderId}).populate('Items.productId')
    let ProductAllDetails = order.Items
    res.render('supAdmin/adminSide-order-detail-page',{title:"Order Detail",ProductAllDetails, Page:"Orders"})    
}







module.exports = {
    getOrder,
    updateOrderStatus,
    orderDetailPage
}