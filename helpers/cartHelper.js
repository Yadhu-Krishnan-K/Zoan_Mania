const cart = require('../models/cartModel')

const cartCount = async(req) => {
  try {
    
    const cartData = await cart.findOne({userId:req.session.userId})
    let cartcount = 0
    console.log('cartData==',cartData)
    if (cartData === null || cartData.Items == (null||0)) {
      
      cartcount = 0
  
    }else{
    cartData.Items.forEach((cart)=>{  
      cartcount += cart.Quantity
    })
  }
  return cartcount;
    
  } catch (error) {
    console.error("error 500 :",error);
  }
  
}





module.exports = { cartCount }