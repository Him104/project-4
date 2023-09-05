const cartModel = require("../models/cartModel.js");
const userModel = require("../models/userModel.js");
const productModel = require("../models/productModel.js");
const mongoose = require("mongoose");



//*** POST /users/:userId/cart *****/

   //---CREATING CART
   const createCart = async function(req, res){
    try{
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
        return res.status(400).send({ status: false, message: 'No data provided' })

       }
        let {productId, quantity } = reqBody
        let data = { userId }
        quantity = 1
        
      //==validating productId==//
      if (ObjectId.isValid(productId) == false) {

        return res.status(400).send({status: false, msg: "Enter a Valid productId"});
      }

        let findProductId = await productModel.findById({ _id: productId })
        if (!findProductId) {
          return res.status(404).send({ status: false, msg: "Product not found" });
         }
     
      //==validating quantity==//  
        // if (!(isValid(quantity)))  return res.status(400).send({ status: false, message: "quantity is required" })
        // if(!isValidNum(quantity)) return res.status(400).send({ status: false, message:"Please provide number only." })
        data["items"] = [{productId,quantity}]
        
      //==finding product by productId==//
        let getProduct = await productModel.findById(productId) 
       // console.log(getProduct)
        if(!getProduct )
         return  res.status(404).send({ status: false, message:"Product Not Found." })
        productPrice = getProduct.price
      
      //==checking if cart present ==//
        let presentCart = await cartModel.findOne({userId :userId})
    
      if(presentCart!== null){
    //==if cart present updating it:
  
      //==calculating total price and total items==//
        presentCart.totalPrice += (productPrice*quantity)
        data.totalPrice = presentCart.totalPrice
       
        let newData=[]
        let index = 0
        let product = 0
        let number = 0
        for(let i = 0; i<presentCart.items.length;i++){
          if(presentCart.items[i].productId == productId){
           
            index = i
            console.log("hii",i);
            product = presentCart.items[i].productId.toString()
            number = presentCart.items[i].quantity
          } else{
            console.log(i,"Hello");
            newData.push(presentCart.items[i])
          }
        }
        
      if(product == 0){
    //==if product not present in cart:
      //==updating cart==//
          presentCart.totalItems += 1
          data.totalItems = presentCart.totalItems
          let updateCart = await cartModel.findOneAndUpdate(
          {_id : presentCart._id},
          {
          userId : data.userId,
          $addToSet : {items: data.items},
          totalPrice : data.totalPrice,
          totalItems : data.totalItems
          },
          { new: true })
      //==sending updated cart==//
          return res.status(200).send({ status: true, message: 'Item added successfully', data: updateCart })
          } 
      else if(product !== 0){
    //==if product present in cart:
        data.totalItems = presentCart.totalItems
        presentCart.items[index].quantity= number + quantity
        newData.push(presentCart.items[index])  
        data.items =  newData
        
        //==updating cart==//
            let updateCart = await cartModel.findOneAndUpdate(
            {_id : presentCart._id},
            {
            userId : data.userId,
            $set : {items: data.items}, 
            totalPrice : data.totalPrice,
            totalItems : data.totalItems
            },
            { new: true })
      
        //==sending updated cart========//
            return res.status(200).send({ status: true, message: 'Item added successfully', data: updateCart })
          }
    }else{
    //==if cart not present creating it:===///
      //==calculating price and quantity==//
        let totalPrice = quantity * productPrice
        data.totalPrice = totalPrice
        let totalItems = quantity
        data.totalItems = totalItems
      //==creating new cart==//
        let cartCreated = await cartModel.create(
          { 
        userId : data.userId,
        items: data.items,
        totalPrice : data.totalPrice,
        totalItems : data.totalItems
        }
        )
     
      //==sending new cart in response==//
        return res.status(201).send({ status: true, message: 'Cart created successfully', data: cartCreated })
      }
     }catch (error) {
      return res.status(500).send({ status: false, msg: error.message })
    }
    }
  //***********************//


  

  module.exports.createCart = createCart;
