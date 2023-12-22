const easyinvoice = require('easyinvoice');
const fs = require('fs'); // Node.js file system module
const Orders = require('../models/order'); // Update the path accordingly

// Assume orderId is the ID of the order you want to generate an invoice for
const easyInvoice = async(req,res)=>{
    try {
        const order = await Orders.findById({_id: req.params.orderId});
        if (!order) {
            console.error('Order not found');
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const invoiceData = {
            "sender": {
                "company": "ZOAN_MANiA",
                // ... other sender details
            },
            "client": order.Address.Name,
            "information": {
                "number": `Invoice-${order._id}`,
                "date": order.OrderDate,
                "due-date": order.ExpectedDeliveryDate,
            },
            "products": order.Items.map(item => ({
                "quantity": item.quantity,
                "description": `Product ${item.productId}`,
                "price": item.discounted,
            })),
            "TotalPrice": order.TotalPrice,
        };

        easyinvoice.createInvoice(invoiceData, function (result) {
            const pdfBase64 = result.pdf;
            const filePath = `./invoices/invoice-${order._id}.pdf`;

            fs.writeFileSync(filePath, Buffer.from(pdfBase64, 'base64'));

            // Send success response with the file path
            res.status(200).json({ success: true, filePath });
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
    module.exports = easyInvoice