const cartModel = require("../models/cartModel.js");
const userModel = require("../models/userModel.js");
const productModel = require("../models/productModel.js");
const mongoose = require("mongoose");  
  
  //---REMOVE PRODUCT FROM CART
  const removeProduct = async function(req,res){
    let userId = req.params.userId
    let reqBody = req.body
    
   //==validating userId==//
   var ObjectId = require('mongoose').Types.ObjectId;
   if (ObjectId.isValid(userId) == false) {

     return res.status(400).send({status: false, msg: "Enter a Valid UserId"});
   }

     let findUserId = await userModel.findById({ _id: userId })
     if (!findUserId) {
       return res.status(404).send({ status: false, msg: "user not found" });
      }
  
  //==validating request body==//
  if (Object.keys(reqBody).length == 0) { 
    return res.status(400).send({ status: false, message: 'No data for remove cart' })

   }
    let {productId, removeProduct} = reqBody
    let data = { userId }
    
  //==validating productId==//
  if(!productId ){
    return res.status(400).send({status: false, msg: "productId Id is required"});

  }

  if (ObjectId.isValid(productId) == false) {

    return res.status(400).send({status: false, msg: "Enter a Valid productId"});
  }
  
  //==validating removeProduct==//   
    if (!removeProduct)  {return res.status(400).send({ status: false, message: "removeProduct is required" })}
    if(removeProduct !== 0 && removeProduct !== 1) {return res.status(400).send({ status: false, message:"Please provide number among 0 & 1." }) }
  
  //==checking product is present or not in product model==//
    let getProduct = await productModel.findById({ _id : productId}) 
    if(getProduct == null) return  res.status(404).send({ status: false, message:"Product Not Found." })
    productPrice = getProduct.price
    
  //==checking cart is present or not in cart model==//
    let presentCart = await cartModel.findOne({userId : userId})
    if(presentCart == null) return  res.status(404).send({ status: false, message:"Cart Not Found. First create cart." })
    let cartId = presentCart._id
  
  //==checking product is present or not in cart==//
  data["items"] = []
  let index = 0
  let product = 0
  let number = 0
  for(let i = 0; i<presentCart.items.length;i++){
    if(presentCart.items[i].productId == productId){
         index = i
         product = presentCart.items[i].productId.toString()
         number = presentCart.items[i].quantity
    }else{
    data["items"].push(presentCart.items[i])
  }
  }
  if(product === 0) return res.status(404).send({ status: false, message:"Product Not in cart." })
  
  //==removing complete product from cart:
  if(removeProduct === 0){
  //==calculating total price and items==//
    presentCart.totalPrice -= productPrice * number
    data.totalPrice = presentCart.totalPrice
    presentCart.totalItems -= 1
    data.totalItems = presentCart.totalItems
  
  //==updating cart==//
    let removeItem = await cartModel.findOneAndUpdate(
      {_id : cartId},
      {
      $set : {items : data.items},
      totalPrice : data.totalPrice,
      totalItems : data.totalItems},
      { new : true})
     return res.status(200).send({ status: true, message: 'product removed successfully', data: removeItem })
  
  } 
  //==decreasing quantity of product by 1:
  else if (removeProduct === 1){
  //==calculating total price and items==//
    presentCart.totalPrice -= productPrice * 1
    data.totalPrice = presentCart.totalPrice
    data.totalItems = presentCart.totalItems
    presentCart.items[index].quantity -= 1
    data["items"] = presentCart.items
  
  if(presentCart.items[index].quantity!==0){
  //== after removing, quantity is still >0(minimum one present):
  //==updating cart==//
    let removeItem = await cartModel.findOneAndUpdate(
      {_id : cartId},
      {
      $set : {items : data.items},
      totalPrice : data.totalPrice,
      totalItems : data.totalItems},
      { new : true})
      return res.status(200).send({ status: true, message: 'product removed successfully', data: removeItem })
    }else{
    //== after removing, quantity is 0(remove complete object):
      data["items"] =[]
      for(let i = 0; i<presentCart.items.length;i++){
         if(i !== index){
          data["items"].push(presentCart.items[i])
         }
      }
      presentCart.totalItems -= 1
      data.totalItems = presentCart.totalItems
  
    //==updating cart==//
      let removeItem = await cartModel.findOneAndUpdate(
        {_id : cartId},
        {
        $set : {items : data.items},
        totalPrice : data.totalPrice,
        totalItems : data.totalItems},
        { new : true})
        return res.status(200).send({ status: true, message: 'product removed successfully', data: removeItem })
      }
    }
  }
  
  //***********************//


  module.exports.removeProduct = removeProduct;