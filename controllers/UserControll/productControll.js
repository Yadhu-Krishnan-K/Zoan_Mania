const cartModel = require('../../models/cartModel')
const category = require('../../models/category')
const productModel = require('../../models/products')

//product list user-side==============
const productList1 = async (req, res) => {

  const listCount = await productModel.find().count()
  const name = req.session.name
  const userId = req.session.userId
  const cartData = await cartModel.findOne({ userId: userId }).populate('Items.ProductId')
  let cartcount = 0
  let categories = await category.find()
  console.log("cartData====", cartData);
  if (cartData === null || cartData.Items == (null || 0)) {

    cartcount = 0

  } else {
    cartData.Items.forEach((cart) => {
      cartcount += cart.Quantity
    })
  }

  let page = Number(req.query.page) || 1;
  let perPage = 8
  let pageNums = Math.ceil(listCount / perPage)
  let currentPage = page;
  const productsList = await productModel.find().sort({ _id: -1 })
    .skip((page - 1) * perPage)
    .limit(perPage)

  res.render('user/product-list', { name, productsList, title: "Zoan List", cartData, cartcount, pageNums, listCount, page, currentPage, categories });

}



//product detail user side

const producDetail = async (req, res) => {
  const name = req.session.name
  const P_id = req.params.id
  const userId = req.session.userId
  console.log("Product id=", P_id)
  const P_detail = await productModel.findOne({ _id: P_id })
  console.log(P_detail)
  const cartData = await cartModel.findOne({ userId: userId }).populate('Items.ProductId')
  let cartcount = 0
  if (cartData === null || cartData.Items == (null || 0)) {

    cartcount = 0

  } else {
    cartData.Items.forEach((cart) => {
      cartcount += cart.Quantity

    })
  }

  res.render('user/product-page', { P_detail, name, cartcount, title: 'Product Page' })
}

//search product

const searchProducts = async (req, res) => {
  try {
    // let text = req.body.text;
    // const regex = new RegExp(`^${text}`, 'i');
    // const things = await products.find({ name: regex });
    // if(things.length){
    //   res.status(200).json({
    //     success:true,
    //     things
    //   })
    // }else{
      
    // }
    const products = await productModel.find()
    res.status(200).json({success:true,products})
  } catch (error) {
    console.log('Error: ',error)
  }
  
}

module.exports = {
    producDetail,
    productList1,
    searchProducts
}