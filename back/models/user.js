const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    district:{
        type:String,
        required:true
    },
    autonum:{
        type:String,
        required:true
    },
    role: { 
        type: String,
        required:true 
    },
    image:[String],
    isAuth:{
        type:Boolean,
        default:false
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
});

module.exports = mongoose.model("user", UserSchema);