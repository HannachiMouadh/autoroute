const express = require("express");
const router = express.Router();
const data = require("../models/autoroute");




//POST
//methode:POST
//params: req.body
router.post("/", async (req, res) => {
  try {
    const newForm = new data(req.body);
    const result = await newForm.save();
    res.send({ response: result, msg: "form saved" });
  } catch (error) {
    res.status(200).send({ msg: `cannot save the form${error}` });
    console.log("erroooorrr",error);
  }
});
//GEt
//methode:GET
router.get("/", async (req, res) => {
  try {
    const result = await data.find();
    res.send({ respond: result, msg: "form retreived successfully" });
  } catch (error) {
    res.send({ msg: `cannot get form${error}` });
  }
});

//GEt by id

//param:id

router.get("/:id", async (req, res) => {
  try {
    const result = await data.findOne({ _id: req.params.id });
    res.send({ respond: result, msg: "Form get successfull" });
  } catch (error) {
    res.send({ msg: `cannot retreived the form${error}` });
  }
});

//delete
//params :id
router.delete("/:id", async (req, res) => {
  try {
    const result = await data.findByIdAndDelete({ _id: req.params.id });
    res.send("form deleted");
  } catch (error) {
    res.send({ msg: "cannot delete form" });
  }
});

//put

router.put('/:id', isAuth(), async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ message: 'New password is required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});




module.exports = router;
