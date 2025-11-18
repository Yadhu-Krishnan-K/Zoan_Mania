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


module.exports = {
    downloadCSV,
    downloadPdf
}