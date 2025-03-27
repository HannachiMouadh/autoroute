const express = require("express");
const router = express.Router();
const patData = require("../models/patrouille");
const User = require('../models/user'); // Assuming you have a User model

// Route to handle patrol data submission
router.post("/", async (req, res) => {
  try {
    const newForm = new patData(req.body);
    const result = await newForm.save();
    res.send({ response: result, msg: "patData saved" });
  } catch (error) {
    res.status(200).send({ msg: `cannot save the patData${error}` });
    console.log("erroooorrr in patData",error);
  }
});


//GEt
//methode:GET
router.get("/", async (req, res) => {
  try {
    const result = await patData.find();
    res.send({ respond: result, msg: "entdata retreived successfully" });
  } catch (error) {
    res.send({ msg: `cannot get patData${error}` });
  }
});

//GEt by id

//param:id

router.get("/:id", async (req, res) => {
  try {
    const result = await patData.findOne({ _id: req.params.id });
    res.send({ respond: result, msg: "patData get successfull" });
  } catch (error) {
    res.send({ msg: `cannot retreived the patData${error}` });
  }
});

//delete
//params :id
router.delete("/:id", async (req, res) => {
  try {
    const result = await patData.findByIdAndDelete({ _id: req.params.id });
    res.send("patData deleted");
  } catch (error) {
    res.send({ msg: "cannot delete patData" });
  }
});

//put

router.put('/:id', async (req, res) => {
  try{
    const result = await patData.updateOne({_id:req.params.id},{$set:{...req.body}});
    result.modifiedCount?res.send({message:"patData updated"}):res.send({message:"patData already updated"});
}catch(error){
    res.status(400).send({message:"No patData with this id"})
}
});


module.exports = router;
