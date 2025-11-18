const Orders = require("../../models/order");
const product = require("../../models/products");
const chartHelper = require("../../helpers/chartHelper.js")

const getDashboard = async(req,res) => {
    try {
        // const productModel = await productModel.find().sort({ Selled: -1 }).limit(6);
        const products = await product.aggregate([
            {$sort : {
                Selled : -1
            }},
            {$limit : 6}
        ])
        const orders = await Orders.find().sort({ OrderDate: -1 }).exec();
        const earliestOrder = orders[0]
        // console.log('order listed==',orders);
        // console.log('earliest order ==',earliestOrder)

        res.render('supAdmin/admin-Dashboards',{title:"Admin Dash",Page:"Dashboard",products,earliestOrder})
    
    } catch (error) {
      console.error("error 500 :",error);
    }
}

const getChart = async(req,res) => {
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
        const earliestOrder = await Orders.findOne({}, null, { sort: { 'OrderDate': 1 } });
        if (!earliestOrder) {
          return res.json({ ordersData: [] });
        }
        
        const orders = await Orders.find();
        const ordersData = chartHelper.processOrdersForChart(orders,num);
        console.log(`ordersData = ${ordersData}`)
        res.json({ ordersData });
      } catch (error) {
        console.error('Error retrieving orders data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

module.exports = {
    getDashboard,
    getChart
}