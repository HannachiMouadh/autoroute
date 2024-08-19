const mongoose = require('mongoose');
const schema = mongoose.Schema


const AutoRouteSchema = new schema({
    barrier:{type:String,required:true},
    nbrmort:{type:Number,required:true},
    nbrblesse:{type:Number,required:true},
    cause:{type:String,required:true},
    d:{type:String,required:false},
    c:{type:String,required:false},
    b:{type:String,required:false},
    a:{type:String,required:true},
    sens:{type:String,required:true},
    mtr:{type:String,required:true},
    nk:{type:String,required:true},
    months:{type:String,required:true},
    minutes:{type:String,required:true},
    hours:{type:String,required:true},
    years:{type:String,required:true},
    day:{type:String,required:true},
    ddate:{type:String,required:false},
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    }
});


module.exports = mongoose.model("data",AutoRouteSchema);