  // try {
  //     const order = await Orders.findById({ _id: req.params.orderId }).populate('Items.productId');
  //     console.log('order--', order);
  //     if (!order) {
  //         console.error('Order not found');
  //         return res.status(404).json({ success: false, message: 'Order not found' });
  //     }

  //     const ar = order.Items.map((item) => ({
  //         quantity: item.quantity,
  //         description: item.productId.Name,
  //         tax: 0,
  //         price: item.productId.discountedPrice,

  //     }));

  //     const data = {

  //     information: {
  //         // Invoice number
  //         "number": order._id,
  //         // Invoice data
  //         "date": order.OrderDate,
  //         // Invoice due date
  //         // "due-date": order.OrderDate
  //     },
  //     products: ar,
  //         // logo: 'Zoan_Mania',
  //         sender: {
  //             company: 'Zoan_Mania',
  //             address: '123 Main Street',
  //             zip: '12345',
  //             city: 'Chr',
  //             country: 'India',
  //         },
  //         client: {
  //             name: order.Address.Name,
  //             address: order.Address.Address,
  //             pin: order.Address.Pincode,
  //             city: order.Address.City,
  //             state: order.Address.State,
  //         },
  //         settings: {
  //             "currency": "USD",
  //         },
  //         // calculations: {
  //         //     subtotal: ord,

  //         //     tax: 0,
  //         //     total: ,
  //         // },
  //     };

  //     const pdfData = await pdf.createInvoice(data)

  //     if (!pdfData) {
  //         throw new Error('Empty PDF data');
  //     }

  //     // Write the PDF string to a file
  //     await fs.promises.writeFile('invoice.pdf', pdfData.pdf, 'base64');

  //     // Set the response headers for downloading the file
  //     res.setHeader('Content-Type', 'application/pdf');
  //     res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');

  //     // Pipe the PDF file to the response stream
  //     const fileStream = fs.createReadStream('invoice.pdf');
  //     fileStream.pipe(res);

  //     return res.json({ success: true });

  // } catch (error) {
  //     console.error('Error generating or writing PDF:', error);
  //     return res.status(500).json({ success: false, message: 'Failed to generate or write PDF' });
  // }