const User = require('../../models/user')
const products = require('../../models/products')
const cartModel = require('../../models/cartModel')
const mongoose = require('mongoose')

//user-add-cart-========-=-----------------==============------------------======================-------------=

const userAddtoCart = async (req, res) => {
  try {
    const userData = await User.findOne({ name: req.session.name });
    const productId = req.params.id;
    const userId = userData._id;
    const userExist = await cartModel.findOne({ userId: userId });
    const ProductId = new mongoose.Types.ObjectId(productId)
    if (!userExist) {

      const cart = await cartModel.create({
        userId: userId,
        Items: [{ ProductId: ProductId }]
      });
      await cart.save()

    } else {
      const product = await cartModel.findOne({ userId: userId, 'Items.ProductId': ProductId })

      if (!product) {

        await cartModel.findByIdAndUpdate(userExist._id, {
          $push: {
            Items: { ProductId: ProductId }
          }
        });

      } else {

        await cartModel.findOneAndUpdate({ userId: userId, 'Items.ProductId': ProductId }, { $inc: { 'Items.Quantity': 1 } })
          .then(() => { console.log('success') })
          .catch((err) => { console.log(err) })
      }
    }

    // res.redirect('/Product-list');
    res.json({
      success: true
    })
  } catch (error) {
    console.error("error=", error);
  }
}

//user-getCart================

const userGetCart = async (req, res) => {
  try {

    const name = req.session.name
    const id = req.session.userId
    const userId = new mongoose.Types.ObjectId(req.session.userId)
    const cartDetail = await cartModel.findOne({ userId: userId })
      .populate('Items.ProductId')

    let cartcount = 0
    const cartData = await cartModel.findOne({ userId: id })
    if (cartData === null || cartData.Items == (null || 0)) {

      cartcount = 0

    } else {
      cartData.Items.forEach((cart) => {
        cartcount += cart.Quantity
      })
    }

    if (cartDetail) {

      const carts = cartDetail.Items

      let sum = 0

      carts.forEach(cart => {

        sum += (cart.Quantity * cart.ProductId.Price)
      });
      console.log("cartcount when entering cartpage====", cartcount)
      req.session.totalAmount = sum;
      const totalPrice = await cartModel.updateOne({ userId: userId }, { $set: { totalAmount: sum } })

      res.render('user/cart-page', { title: 'My cart', name, cartDetail, sum, cartcount })

    } else {
      res.render('user/cart-page', { title: 'No item found', cartDetail, name, cartcount })
    }
  } catch (error) {

    console.error(error);

  }
}



//Quantity uupdation-cart

const cartQuantityUpdate = async (req, res) => {
  console.log(req.body);
  const { inc, productId } = req.body

  //product detail
  const product = await products.findOne({ _id: productId })
  const userId = new mongoose.Types.ObjectId(req.session.userId)
  const productItem = new mongoose.Types.ObjectId(product._id)
  const cartDetail = await cartModel.findOne({ userId: userId })

  //cart detail
  const cartItem = cartDetail.Items.find((item) => {
    return item.ProductId.equals(productItem)
  })

  //total amount
  cartDetail.totalAmount += Number(inc) * product.Price
  req.session.totalAmount = cartDetail.totalAmount
  //newQuandity
  const newQuantity = cartItem.Quantity + Number(inc)

  //cart Items price
  if (newQuantity >= 1 && newQuantity <= product.Stock) {
    cartDetail.totalQuantity += Number(inc)
    cartItem.Price = newQuantity * product.Price

    //
    cartItem.Quantity = newQuantity
    cartDetail.save()
  }





  res.json(
    {
      success: true,
      Quantity: newQuantity,
      Stock: product.Stock,
      price: cartItem.Price,
      totalPrice: cartDetail.totalAmount,
      totalQuantity: cartDetail.totalQuantity
    }
  )

}


//cart item deletion===========================================

const cartItemDeletion = async (req, res) => {
  try {
    const ParentId = req.body.ParentId
    const cartId = req.params.cartId
    console.log("ParentId====", ParentId);
    console.log("cartId=====", cartId)
    await cartModel.updateOne({ _id: ParentId }, {
      $pull: {
        Items: { _id: cartId }
      }
    })
    res.json({
      success: true,
      message: "Password Updated Successfully"
    })


  } catch (error) {

  }
}


module.exports = {
  userAddtoCart,
  userGetCart,
  cartQuantityUpdate,
  cartItemDeletion
}
