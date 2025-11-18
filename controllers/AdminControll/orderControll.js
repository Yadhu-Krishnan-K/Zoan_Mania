const Orders = require("../../models/order");
const { io, getReceiverSocketId } = require('../../backendHelpers/socketIO');

const getOrders = async (req, res) => {
    // const ordersData = await orderModel.find()
    // res.render('supAdmin/admin-order-tracker',{title:"Orders",ordersData,currentPage:"Orders"})
    const page = parseInt(req.query.page) || 1;
    const options = {
        page: page,
        limit: 6,
        sort: { _id: -1 }
    };

    const ordersData = await Orders.paginate({}, options);

    res.render('supAdmin/admin-order-tracker', {
        title: "Orders",
        ordersData: ordersData.docs,
        Page: 'Orders',
        totalPages: ordersData.totalPages,
        currentPage: ordersData.page
    });

}

const updateOrder = async (req, res) => {
    try {
        console.log('hit on target')
        console.log('orderId = ',req.params.orderId)
        const orderId = req.params.orderId
        const newStatus = req.body.newStatus
        await Orders.findByIdAndUpdate(orderId, { Status: newStatus })
        res.status(201).json({success:true})
    } catch (error) {
        console.log('Error: ',error.message)
    }finally{
        console.log('working with order update on socket.io')
        const userId = req.session.userId
        const socketId = getReceiverSocketId(userId)
        console.log('updating... socketId = ',socketId)
        io.emit('order update')
    }

}


const orderDetails = async (req, res) => {
    let orderId = req.params.orderId;
    let order = await Orders.findOne({ _id: orderId }).populate('Items.productId')
    let ProductAllDetails = order.Items
    res.render('supAdmin/adminSide-order-detail-page', { title: "Order Detail", ProductAllDetails, Page: "Orders" })
}

module.exports = {
    getOrders,
    updateOrder,
    orderDetails
}