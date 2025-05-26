const express = require("express");
const router = express.Router();
const matPatData = require("../models/matriculePatrouille");

// Route to handle patrol data submission
router.post("/", async (req, res) => {
  try {
    const newForm = new matPatData(req.body);
    const result = await newForm.save();
    res.send({ response: result, msg: "matPatData saved" });
  } catch (error) {
    res.status(200).send({ msg: `cannot save the matPatData${error}` });
    console.log("erroooorrr in matPatData",error);
  }
});


//GEt
//methode:GET
router.get("/", async (req, res) => {
  try {
    const result = await matPatData.find();
    res.send({ respond: result, msg: "matPatData retreived successfully" });
  } catch (error) {
    res.send({ msg: `cannot get matPatData${error}` });
  }
});

//GEt by id

//param:id

router.get("/:id", async (req, res) => {
  try {
    const result = await matPatData.findOne({ _id: req.params.id });
    res.send({ respond: result, msg: "matPatData get successfull" });
  } catch (error) {
    res.send({ msg: `cannot retreived the matPatData${error}` });
  }
});

//delete
//params :id
router.delete("/:id", async (req, res) => {
  try {
    const result = await matPatData.findByIdAndDelete({ _id: req.params.id });
    res.send("matPatData deleted");
  } catch (error) {
    res.send({ msg: "cannot delete matPatData" });
  }
});

//put

router.put('/:id', async (req, res) => {
  try{
    const result = await matPatData.updateOne({_id:req.params.id},{$set:{...req.body}});
    result.modifiedCount?res.send({message:"matPatData updated"}):res.send({message:"matPatData already updated"});
}catch(error){
    res.status(400).send({message:"No matPatData with this id"})
}
});


module.exports = router;
