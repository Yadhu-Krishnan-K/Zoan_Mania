const fs = require("fs");
const pdf = require("easyinvoice");
const Orders = require("../models/order");

const easyInvoice = async (req, res) => {

  try {
    let order = await Orders.findOne({ _id: req.params.orderId }).populate('Items.productId');
    const ar = order.Items.map((item) => ({
      "quantity": `${item.quantity}`,
      "description": item.productId.Name,
      "tax-rate": 0,
      "price": isNaN(item.discounted) ? 0 : item.discounted,
    }));
    var data = {
      
      "sender": {
        "company": 'ZOAN_MANiA',
        "address": "Sample Street 123",
        "zip": "1234 AB",
        "city": "CHR",
        "country": "INDIA"
      },
      "client": {
        "company": "Client Corp",
        "address": order.Address.Address,
        "zip": order.Address.Pincode,
        "city": order.Address.City,
        "country": "INDIA"
      },
      "information": {
        // Invoice number
        number: order._id,
        // Invoice data
        date: order.OrderDate 
      },
      "products": ar,
      "bottom-notice": "Thank you for your purchase",
      settings: {
        "currency": "INR",
        "tax-notation": "GST",
        "margin-top": 50,
        "margin-right": 50,
        "margin-left": 50,
        "margin-bottom": 25
      },
    };
    console.log(data)

    //Create your invoice! Easy!

        const result = await pdf.createInvoice(data);
        if (!result || !result.pdf) {
            throw new Error('PDF generation failed or returned empty result');
        }
        // console.log('result==',result)
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=myInvoice.pdf');
    
        // Send the PDF data as the response
        res.send(Buffer.from(result.pdf, 'base64'));
  } catch (error) {
    console.log(error);
    res.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
};

module.exports = easyInvoice;
