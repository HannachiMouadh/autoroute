const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require ('bcrypt');


module.exports = {

    register: async (req, res) => {
        const { name, lastName, email, password, phone } = req.body;
        try {
          // Check if the email already exists
          const existingUser = await User.findOne({ email });
          if (existingUser) {
            return res.status(400).json({ msg: "Email already exists" });
          }
    
          // Hash the password
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password, saltRounds);
    
          // Create a new user
          const newUser = new User({
            name,
            lastName,
            email,
            password: hashedPassword,
            phone
          });
    
          // Save the user to the database
          const savedUser = await newUser.save();
    
          // Respond with a success message
          res.status(200).json({ msg: "User registered successfully" });
        } catch (error) {
          console.error("Registration error:", error);
          res.status(500).json({ msg: "Registration failed" });
        }
      },

    login: async(req,res) =>{
        const {email,password} = req.body;
        try{
            const searchedUser = await User.findOne({email});
            if(!searchedUser) return res.status(400).send({msg:"bad Credential"});
            const  match = await bcrypt.compare(password,searchedUser.password);
            if(!match) return res.status(400).send({msg:"bad Credential"});
            const payload = {
                _id:searchedUser._id,
                name:searchedUser.name,
            };
            const token = await jwt.sign(payload,process.env.SecretOrKey);
            res.status(200).send({user:searchedUser,msg:"success",token:`Bearer ${token}`});
        }catch(error){
            console.log(error)
            res.status(500).send({msg:"can not get the user"});
        }
    },
    
    current :async(req,res) =>{
        res.status(200).send({user:req.user});
    },

    update : async(req,res) => {
      const { id } = req.params;
  const { password, ...otherUpdates } = req.body;

  try {
    let updateData = { ...otherUpdates };

    if (password) {
      // Hash the new password
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
    getAll : async(req,res)=>{
        try{
            const result = await User.find()
            res.send({response:result,message:"Geting Users successful"})
        }catch(error){
            res.status(400).send({message:"Can not get Users"})
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