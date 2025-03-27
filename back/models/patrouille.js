const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PatrouilleSchema = new Schema({
  matricule: { type: String, required: true },
  startKilometrage: { type: String, required: true },
  endKilometrage: { type: String }, // Set when patrol ends
  pointKilo: { type: String },
  tache: { type: String },     // Multiple form entries
  observation: { type: String },
  createdBy: {                      // Reference user
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("PatData", PatrouilleSchema);
