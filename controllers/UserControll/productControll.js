const products = require('../../models/products')
const cartModel = require('../../models/cartModel')
const category = require('../../models/category')

//product list user-side==============
const productList1 = async (req, res) => {

  const listCount = await products.find().count()
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
  const productsList = await products.find().sort({ _id: -1 })
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
  const P_detail = await products.findOne({ _id: P_id })
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

module.exports = {
    producDetail,
    productList1
}