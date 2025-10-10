const User = require('../../models/user')
const products = require('../../models/products')
const cartModel = require('../../models/cartModel')



//render manage address
const renderManageAddress = async (req, res) => {
  const userId = req.session.userId
  const userData = await User.findOne({ _id: req.session.userId })
  //  console.log("userdataaa",userData);
  const name = req.session.name
  const cartData = await cartModel.findOne({ userId: userId })
  let cartcount = 0
  if (cartData === null || cartData.Items == (null || 0)) {

    cartcount = 0

  } else {
    cartData.Items.forEach((cart) => {
      cartcount += cart.Quantity

    })
  }
  res.render('user/userAddress', { title: "Zoan | Address", name, userData, cartcount })
}


//add address
const addAddress = async (req, res) => {
  console.log("req.body==", req.body)
  const { Name, Address, City, Pincode, State, Mobile } = req.body;
  console.log("Name=", Name,
    "AddressLine=", Address,
    "City=", City,
    "Pincode=", Pincode,
    "State=", State,
    "Mobile=", Mobile)

  const addr = {
    Name: Name,
    AddressLine: Address,
    City: City,
    Pincode: Pincode,
    State: State,
    Mobile: Mobile
  }
  await User.updateOne({ _id: req.session.userId }, { $push: { address: addr } })
  // const customer = await User.findOne({_id:req.session.userId})
  // console.log("custData=======",customer)
  // customer.addr.push()
  // customer.save()
  // res.redirect('/manageAddress ')
  console.log("reached success response")
  res.json({ success: true, message: "Address saved successfully" });

}
//customer update Address

const updateAddress = async (req, res) => {
  console.log("userId from updateAddress===", req.params.userId)
  const userId = req.params.userId;

  const { addressId, Name, Address, City, Pincode, State, Mobile } = req.body;
  console.log("AddressId====", addressId)
  const addr = {
    Name: Name,
    AddressLine: Address,
    City: City,
    Pincode: Pincode,
    State: State,
    Mobile: Mobile
  }
  const userData = await User.findOne({ _id: userId })
  // console.log('ith userData======',userData)
  // await User.updateOne({_id:userId},{$set:{}})
  await User.findOneAndUpdate({ 'address._id': addressId }, { $set: { 'address.$': addr } })
  res.json({ success: true, message: "Address updated successfully" });
}

//delete address
const deleteAddress = async (req, res) => {
  try {
    let userId = req.params.userId
    console.log("reached /delete address")

    let id = req.params.addresId
    console.log(id);
    const data = await User.findOne({ _id: userId })
    await User.updateOne({ _id: data._id }, {
      $pull: {
        address: { _id: id }
      }
    })
    console.log("delete:" + data);
    res.redirect('/manageAddress')
  } catch (error) {
    console.log(error)
  }
}


module.exports = {
  renderManageAddress,
  addAddress,
  updateAddress,
  deleteAddress
}
