const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  fname: {type: String,required: true,trim: true},
  lname: {type: String,required: true,trim: true},
  email: {type: String, required: true,unique: true,trim: true },
  profileImage: {type: String,required: true,trim: true},
  phone: {type: Number, required: true,unique: true,trim: true },
  password: {type: String,required: true,trim: true, minlength:[8, 'Must be atleast 8 characters'], maxlength:[15, 'Must be atmost 15 characters']  },
  address: {
    shipping: {
      street: {type: String,required: true,trim: true},
      city: {type: String,required: true,trim: true},
      pincode: {type: Number,required: true,trim: true}
    },
    billing: {
      street: {type: String,required: true,trim: true},
      city: {type: String,required: true,trim: true},
      pincode: {type: Number,required: true,trim: true}


    }
        
      }
    }
    , { timestamps: true });
    
    module.exports = mongoose.model('users', userSchema);