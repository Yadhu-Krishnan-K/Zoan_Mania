const fs = require("fs");
const pdf = require("easyinvoice");
const Orders = require("../models/order");

const easyInvoice = async (req, res) => {

  try {
    let order = await Orders.findOne({ _id: req.params.orderId }).populate('Items.productId');
    const ar = order.Items.map((item) => ({
      quantity: item.quantity,
      description: item.productId.Name,
      tax: 0,
      price: item.productId.discountedPrice,
    }));
    // console.log('ar=',ar)
    // let totalWithoutOffers = ar.reduce((total,products) => total + prodcuts)
    var data = {
      // "apiKey": "123abc", // Get apiKey through: https://app.budgetinvoice.com/register

      // Customize enables you to provide your own templates
      // Please review the documentation for instructions and examples
      customize: {
        //  "template": fs.readFileSync('template.html', 'base64') // Must be base64 encoded html
      },
      // images: {
      //   // The logo on top of your invoice
      //   logo: "https://public.budgetinvoice.com/img/logo_en_original.png",
      //   // The invoice background
      //   background: "https://public.budgetinvoice.com/img/watermark-draft.jpg",
      // },
      // Your own data
      sender: {
        company: "Zoan_Mania",
        address: "CCCCCChr",
        zip: "123456",
        city: "chr",
        country: "India",
   
      },
      // Your recipient
      client: {
        company: order.Address.Name,
        address: order.Address.Address,
        zip: order.Address.Pincode,
        city: order.Address.City,
        country: 'IND',
 
      },
      information: {
        // Invoice number
        number: order._id,
        // Invoice data
        date: order.OrderDate,
      },

      products: ar,

      settings: {
        currency: "USD",
      },
      discount: order.couponAmount.amount,
      total:  order.TotalPrice,
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
