const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const MatriculePatrouilleSchema = new Schema({
  matricule: { type: String, required: true },
  endKilometrage: { type: String, required: true },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    }
});

module.exports = mongoose.model("MatPatData", MatriculePatrouilleSchema);