const mongoose = require("mongoose");

const DBconnect = async() =>{
    try {
        await mongoose.connect('mongodb+srv://mouadh:0000@cluster0.f3xlx.mongodb.net/');
        console.log("database is connected");
    } catch (error) {
        console.log(`cannot connect to database ${error}`);
    }
}
module.exports = DBconnect;