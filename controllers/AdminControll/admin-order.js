const orderModel = require('../../models/order');
const socketManager = require('../../util/socket')
const mongoose = require('mongoose')
const json2csv = require('json2csv').parse;
const fs = require('fs');
const userModel = require('../../models/user')
const Orders = require('../../models/order')
const wallet = require('../../models/walletPayment');
const products = require('../../models/products');




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
    await orderModel.findByIdAndUpdate(orderId,{Status:newStatus,PaymentStatus:'Paid offline'},{new:true})

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
      let Wamount = item.quantity * item.productId.discountedPrice
      await userModel.findByIdAndUpdate({_id: order.UserId},{$inc:{Wallet:Wamount}})
      const walletHistory = await wallet.findOne({userId:order.UserId})
      // console.log('wallet==',walletHistory)
      walletHistory.payment.push( {
        amount:Wamount,
        date:new Date(),
        purpose:'Order Returned',
        income:'Debited'

    })
    await walletHistory.save()

      return res.json({
        response:"accepted"
      })
  
    } else if (num == 1) {
      await order.save();
      item.returnStatus = 'rejected';
        return res.json({
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

// Endpoint to generate and download the CSV file
const downloadCSV = async(req,res) => {
  try{
    const salesData = []

    const data = await Orders.find().populate('Items.productId').populate('UserId')
    // console.log('data==',data)
    data.forEach((order)=>{
      order.Items.forEach((product)=>{
        let obj = {
          _id: product.productId._id,
          product: product.productId.Name,
          purchaseDate: order.OrderDate,
          orderedBy: order.UserId.name,
          quantity: product.quantity,
          price: product.discounted,
        }
        salesData.push(obj)
      })
    })
console.log('salesData==',salesData)
    // const salesData = [
    //   { date: '2023-01-01', product: 'Product A', amount: 100 },
    //   { date: '2023-01-02', product: 'Product B', amount: 150 },
    //   // Add more data as needed
    // ];



  
    // Convert JSON data to CSV format
    const csv = json2csv(salesData, { fields: ['_id', 'product', 'purchase date','ordered by','quantity','price'] });
  
    // Set headers for file download
    res.setHeader('Content-disposition', 'attachment; filename=sales_report.csv');
    res.set('Content-Type', 'text/csv');
  
    // Send the CSV data to the client
    res.status(200).send(csv);
    // res.json({stayFocus: true})
  }catch(error){
    console.error(error)
  }
  
}







module.exports = {
    getOrder,
    updateOrderStatus,
    updateReturnStatus,
    orderDetailPage,
    downloadCSV
}