const User = require('../../models/user')
const products = require('../../models/products')
const cartModel = require('../../models/cartModel')

//get user profile

const getUserProfile = async (req, res) => {
  const name = req.session.name
  const userId = req.session.userId
  // req.session.save()
  const userData = await User.findOne({ name: name })
  req.session.email = userData.email
  req.session.save()
  console.log("email===" + userData.email);
  const cartData = await cartModel.findOne({ userId: userId })
  let cartcount = 0
  if (cartData === null || cartData.Items == (null || 0)) {

    cartcount = 0

  } else {
    cartData.Items.forEach((cart) => {
      cartcount += cart.Quantity

    })
  }
  // console.log("name===",name)
  res.render('user/userProfile', { name, userData, title: "Zoan | profile", cartcount })
}




//update user info in profile

const updateUserProfile = async (req, res) => {
  const userId = req.session.userId
  console.log("req.body===", req.body)
  const { name, email, phone } = req.body
  const item = await User.findOne({ _id: userId })
  let flag = 0
  if (!name) {
    name = item.name
  }
  if (!email) {
    email = item.email
  }
  if (!phone) {
    if (!item.MobileNumber) {
      await User.updateOne({ _id: userId }, { $set: { name: name, email: email } })
      flag = 1

    } else {
      phone = item.MobileNumber
    }
  }
  if (flag == 0) {
    req.session.name = name
    req.session.email = email
    await User.updateOne({ _id: userId }, { $set: { name: name, email: email, MobileNumber: phone } })
  }
  res.json({
    success: true,
  })
}

module.exports = {
  getUserProfile,
  updateUserProfile
}
