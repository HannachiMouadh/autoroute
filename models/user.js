const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    phone:{type:Number,required:true},

  });

  const User = mongoose.model("user", userSchema);

  module.exports = User;