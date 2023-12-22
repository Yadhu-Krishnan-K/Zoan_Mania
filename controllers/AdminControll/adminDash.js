
const orderModel = require('../../models/order')
const chartHelper = require('../../helpers/chartjs')


const chartGet = async(req,res)=>{
    try {
      let num
      // const productModel = await products.find().sort({ Selled: -1 }).limit(6);
      if(req.params.SO == 1){
        num=1
      }else if(req.params.SO == 2){
        num=2
      }else if(req.params.SO == 3){
        num=3
      }



        // Find the earliest order date
        const earliestOrder = await orderModel.findOne({}, null, { sort: { 'OrderDate': 1 } });
        // console.log('eearlist order ==== ',earliestOrder)
        if (!earliestOrder) {
          return res.json({ ordersData: [] });
        }
        
        const orders = await orderModel.find();
        // console.log("orders passing to processOrdersForChart====",orders)
        // Process the orders to structure the data for Chart.js
        const ordersData = chartHelper.processOrdersForChart(orders,num);
        // console.log("ordersData=====",ordersData)
        // Send the data to the frontend
        res.json({ ordersData });
      } catch (error) {
        console.error('Error retrieving orders data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}




module.exports = {
    chartGet
}