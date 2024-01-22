// import { PDFDocument } from 'pdf-lib';
// import { drawTable } from 'pdf-lib-draw-table';
// const PDFDocument = require('pdf-lib')
const orderModel = require('../../models/order');
const socketManager = require('../../util/socket')
const mongoose = require('mongoose')
const json2csv = require('json2csv').parse;
const fs = require('fs');
// const pdf = require("../../util/salesReportPDF");
const pdf = require('../../util/salesReportPDF')
// const PDFDocument = require('pdfkit-table'); // Use 'pdfkit-tables' instead of 'pdfkit'
const userModel = require('../../models/user')
const Orders = require('../../models/order')
const wallet = require('../../models/walletPayment');
const products = require('../../models/products');
const coupon = require('../../models/coupons');
// require('pdfkit-tables');



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
    // console.log("item in updateReturnStatus===",order.Items)
    // console.log("num from updateReturnStatus===",num)
    if (num == 0) {
      item.returnStatus = 'returned';
      if(item.quantity * item.discounted < order.Returned){
        order.Returned -= item.quantity * item.discounted;
        var Wamount = item.quantity * item.discounted
      }else{
        var Wamount = order.Returned
        order.Returned = 0
      }
      await order.save();
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
    if(order.couponAmount.amount>0){
      var Coupon =await coupon.findOne({_id:order.couponAmount.coupnId})
    }
    let ProductAllDetails = order.Items
    res.render('supAdmin/adminSide-order-detail-page',{title:"Order Detail", ProductAllDetails, order,Page:"Orders",Coupon})    
    
  } catch (error) {
    console.error("error 500 :",error);
  }
  
}

// Endpoint to generate and download the CSV file
const downloadCSV = async(req,res) => {
  try{
    const salesData = []
    let startDate = new Date(req.body.startDate).toISOString().split('T')[0]
    let endDate = new Date(req.body.endDate).toISOString().split('T')[0]
    // console.log('startDate=',startDate,' ,endDate=',endDate)

    const data = await Orders.find().populate('Items.productId').populate('UserId')
    // console.log('data==',data)
    data.forEach((order)=>{
      let orderDate = new Date(order.OrderDate).toISOString().split('T')[0]
      // console.log('orderDate=',orderDate)
      // Check if the order date is within the specified range
      if (orderDate >= startDate && orderDate <= endDate) {
        order.Items.forEach((product) => {
          let obj = {
            _id: product.productId._id,
            product: product.productId.Name,
            purchaseDate: order.OrderDate,
            orderedBy: order.UserId.name,
            quantity: product.quantity,
            price: product.discounted,
          };
          salesData.push(obj);
        });
      }
    })
// console.log('salesData==',salesData)
  
    // Convert JSON data to CSV format
    const csv = json2csv(salesData, { fields: ['_id', 'product', 'purchaseDate','orderedBy','quantity','price'] });
  
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







const downloadPdf = async (req, res) => {
  try{
    // console.log('reached...')
    let startDate = new Date(req.body.startDate).toISOString().split('T')[0]
      // const format = req.body.fileFormat;
      let endDate = new Date(req.body.endDate).toISOString().split('T')[0]
     

      const orders = await Orders.find().populate("Items.productId");
          // PaymentStatus: { $ne: 'pending' },
        //   OrderDate: {
        //     $gte: startDate,
        //     $lte: endDate,
        //   },
        // })
        // console.log('orders before pdf==',orders)
      let filteredOrders = orders.filter(order=>startDate<=new Date(order.OrderDate).toISOString().split('T')[0]&&endDate>=new Date(order.OrderDate).toISOString().split('T')[0]&&order.PaymentStatus!=='Pending')
      // console.log('orders===when====pdfdownlod===',filteredOrders)
      let totalSales = 0;
      filteredOrders.forEach((order) => {
        totalSales += order.TotalPrice || 0;
      });

      // console.log(totalSales, "orderssss");
      const sum = totalSales.length > 0 ? totalSales[0].totalSales : 0;
      const pdfBuffer = await pdf.generatePdfBuffer(filteredOrders, startDate, endDate, totalSales);

      // Set the content type and response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=sales_report.pdf`);

      // Send the PDF buffer as the response
      res.send(pdfBuffer);
  }catch(error){
    console.log('pdf error:',error)
  }
};







const cancelOrder = async(req,res) => {

// const order = await orderModel.findByIdAndUpdate({_id:req.params.orderId},{Status:"Canceled"})

    // console.log(order)
    // for (const product of order.Items) {
    //   const P_id = product.productId;
    //   const count = product.quantity;
    //   await products.findByIdAndUpdate({ _id: P_id }, { $inc: { Stock: count } });
    // }
    // let total = order.TotalPrice
    // let userId = req.session.userId
    // if(order.PaymentMethod == 'online'||order.PaymentMethod=='Wallet'){
    //   await userModel.findByIdAndUpdate({_id:userId},{$inc:{Wallet:total}},{new:true})
    //   const walletHisto = await wallet.findOne({userId:req.session.userId})
    //   walletHisto.payment.push( {
    //     amount:total,
    //     date:new Date(),
    //     purpose:'Order Cancelled',
    //     income:'Debited'
    // })
    // await walletHisto.save()
    // }

 try {
  const num = req.body.num
  // console.log(req.body.orderId)
  let orderId = new mongoose.Types.ObjectId(req.body.orderId)
  const order = await orderModel.findOne({_id:orderId})
  const userId = order.UserId
  if(num == 0){
    order.Cancel.AdminReply = 'Accepted'
    order.Status = 'Canceled'
      for (const product of order.Items) {
      const P_id = product.productId;
      const count = product.quantity;
      await products.findByIdAndUpdate({ _id: P_id }, { $inc: { Stock: count } });
    }
    let total = order.TotalPrice
    
    if(order.PaymentMethod == 'online'||order.PaymentMethod=='Wallet'){
      await userModel.findByIdAndUpdate({_id:userId},{$inc:{Wallet:total}},{new:true})
      const walletHisto = await wallet.findOne({userId:userId})
      walletHisto.payment.push( {
        amount:total,
        date:new Date(),
        purpose:'Order Cancelled',
        income:'Debited'
    })
    await walletHisto.save()
    }
  }else if(num == 1){
    order.Cancel.AdminReply = 'Denied'
  }
  await order.save()
  res.json({
    success:true
  })

 } catch (error) {
  console.error('internall server error:500:',error)
 }
}













module.exports = {
    getOrder,
    updateOrderStatus,
    updateReturnStatus,
    orderDetailPage,
    downloadCSV,
    downloadPdf,
    cancelOrder
}