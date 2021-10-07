const express = require('express');
const userRouter = express.Router();

const User = require("../models/user");


//add new user
//method: post
//req-body

userRouter.post("/",async(req,res)=>{
    try{
        const newUser = new User(req.body);
        let result = await newUser.save();
        console.log(result);
        res.send({result: result,msg:"user added successfully"});
    } catch (error){
        res.send({msg:error});
    }
});


//get user
//method: get

userRouter.get("/",async(req,res)=>{
    try{
        let result = await User.find();
        res.send({users: result});
    } catch (error){
        res.send({msg:error});
    }
});



//get user by id
//method: get
//params id

userRouter.get("/:id",async(req,res)=>{
    try{
        let result = await User.findOne({_id:req.params.id});
        res.send({user: result});
    } catch (error){
        res.send({msg:error});
    }
});



//delete user
//method: delet
//params id

userRouter.delete("/:id",async(req,res)=>{
    try{
        let result = await User.findByIdAndDelete({_id:req.params.id});
        res.send({msg:"user deleted successfully"});
    } catch (error){
        res.send({msg:error});
    }
});



//update user
//method: put
//params id
//req,body
userRouter.put("/:id",async(req,res)=>{
    try{
        let result = await User.findByIdAndUpdate({_id:req.params.id},{$set: {...req.body}});
        res.send({msg:"user updated successfully"});
    } catch (error){
        res.send({msg:error});
    }
});

module.exports = userRouter;