const express = require("express");
const router = express.Router();
const entData = require("../models/entretient");




//POST
//methode:POST
//params: req.body
router.post("/", async (req, res) => {
  try {
    const newForm = new entData(req.body);
    const result = await newForm.save();
    res.send({ response: result, msg: "entdata saved" });
  } catch (error) {
    res.status(200).send({ msg: `cannot save the entdata${error}` });
    console.log("erroooorrr in entdata",error);
  }
});
//GEt
//methode:GET
router.get("/", async (req, res) => {
  try {
    const result = await entData.find();
    res.send({ respond: result, msg: "entdata retreived successfully" });
  } catch (error) {
    res.send({ msg: `cannot get entdata${error}` });
  }
});

//GEt by id

//param:id

router.get("/:id", async (req, res) => {
  try {
    const result = await entData.findOne({ _id: req.params.id });
    res.send({ respond: result, msg: "entdata get successfull" });
  } catch (error) {
    res.send({ msg: `cannot retreived the entdata${error}` });
  }
});

//delete
//params :id
router.delete("/:id", async (req, res) => {
  try {
    const result = await entData.findByIdAndDelete({ _id: req.params.id });
    res.send("entdata deleted");
  } catch (error) {
    res.send({ msg: "cannot delete entdata" });
  }
});

//put

router.put('/:id', async (req, res) => {
  try{
    const result = await entData.updateOne({_id:req.params.id},{$set:{...req.body}});
    result.modifiedCount?res.send({message:"entdata updated"}):res.send({message:"entdata already updated"});
}catch(error){
    res.status(400).send({message:"No entdata with this id"})
}
});




module.exports = router;
