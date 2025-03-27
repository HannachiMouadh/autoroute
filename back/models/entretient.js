const mongoose = require('mongoose');
const schema = mongoose.Schema


const EntretientSchema = new schema({
    matricul:{type:String,required:true},
    kilometrage:{type:String,required:true},
    pointKilo:{type:String,required:true},
    obstacle:{type:String,required:true},
    ddate:{type:String,required:false},
    time:{type:String,required:false},
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    }
});


module.exports = mongoose.model("EntData",EntretientSchema);