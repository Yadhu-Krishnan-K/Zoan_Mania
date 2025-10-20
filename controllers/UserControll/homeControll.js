const User = require('../../models/user')
const products = require('../../models/products')
const cartModel = require('../../models/cartModel')


const getHome = async (req, res) => {

  const name = req.session.name
  
  const loger = await User.findOne({ name: name })
  const userId = loger._id
  console.log("userId====", userId)
  req.session.userId = userId
  // const Pcount = await products.find().count()
  
  // const page = Number(req.query.page) || 1
  // const currentPage = page
  // const pageNums = Math.ceil(Pcount/8)
  const productModel = await products.find().sort({ Selled: -1 }).limit(8)
  console.log('products = ',productModel)
  
  if(!name){
    return res.render('user/userHome', { title: "Zoan Home", productModel})
  }
  const cartData = await cartModel.findOne({ userId: userId }).populate('userId')
  let cartcount = 0
  if (cartData === null || cartData.Items == (null || 0)) {
    
    cartcount = 0
    
  } else {
    cartData.Items.forEach((cart) => {
      cartcount += cart.Quantity
    })
  }
  await cartModel.updateOne({ userId: userId }, { $set: { totalQuantity: cartcount } })
  // console.log("cartcount=====",cartcount)
  // console.log("cartData====",cartData);
  
  req.session.loggedIn = true;
  res.render('user/userHome', { title: "Zoan Home", productModel, name, cartData, cartcount })

}


module.exports = {
    getHome
}