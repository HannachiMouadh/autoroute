const mongoose = require('mongoose');
const schema = mongoose.Schema


const EntretientSchema = new schema({
    ddate:{type:String},
    time:{type:String},
    tache:{type:String},
    pointKilo:{type:String},
    nbOuvrier:{type:String},
    materiel:{type:String},
    image:[String],
    observation:{type:String},
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
});


module.exports = mongoose.model("EntData",EntretientSchema);