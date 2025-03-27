const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcryptjs');


module.exports = {

  register: async (req, res) => {
    const { name, lastName, email, password, phone, region,role } = req.body;
  
    if (!name || !lastName || !email || !password || !phone || !region || !role) {
      return res.status(400).json({ msg: "Tous les champs sont obligatoires" });
    }
  
    try {
      // Vérifier si l'utilisateur existe
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: "L'email existe déjà" });
      }
  
      // Hacher le mot de passe
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Créer et enregistrer l'utilisateur
      const newUser = new User({
        name,
        lastName,
        email,
        password: hashedPassword,
        phone,
        region,
      });
  
      const savedUser = await newUser.save();
  
      res.status(200).json({ msg: "Utilisateur enregistré avec succès", user: savedUser });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error.message);
      res.status(500).json({ msg: "Erreur interne du serveur" });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const searchedUser = await User.findOne({ email });
      if (!searchedUser) return res.status(400).send({ msg: "bad Credential" });
      const match = await bcrypt.compare(password, searchedUser.password);
      if (!match) return res.status(400).send({ msg: "bad Credential" });
      const payload = {
        _id: searchedUser._id,
        name: searchedUser.name,
      };
      const token = await jwt.sign(payload, process.env.SecretOrKey);
      res.status(200).send({ user: searchedUser, msg: "success", token: `Bearer ${token}` });
    } catch (error) {
      console.log(error)
      res.status(500).send({ msg: "can not get the user" });
    }
  },

  current: async (req, res) => {
    res.status(200).send({ user: req.user });
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { password, ...otherUpdates } = req.body;

    try {
      let updateData = { ...otherUpdates };

      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        updateData.password = hashedPassword;
      }

      const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

      if (!updatedUser) {
        return res.status(404).json({ msg: 'User not found' });
      }

      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ msg: 'Server error' });
    }
  },
  getAll: async (req, res) => {
    try {
      const result = await User.find()
      res.send({ response: result, message: "Geting Users successful" })
    } catch (error) {
      res.status(400).send({ message: "Can not get Users" })
    }
  },
  delete: async (req, res) => {
    try {
      const result = await User.findByIdAndDelete({ _id: req.params.id });
      res.send("user deleted");
    } catch (error) {
      res.send({ msg: "cannot delete user" });
    }
  }

}