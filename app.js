const express = require('express');
const bodyParser = require("body-parser");

const multer = require('multer');
const route = require('./routes/route.js');
const mongoose = require("mongoose");
require('dotenv').config();
const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended:true}));

app.use(multer().any())

mongoose.connect(process.env.mongo_uri)

.then( () => console.log("MongoDB is connected"))

.catch(err => console.log(err));

app.use('/', route); 

app.listen(process.env.PORT || 9000, function () {

    console.log(`Ecommerce Server running on port ` + (process.env.PORT || 9000 ));
    
})