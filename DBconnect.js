const mongoose = require("mongoose");

const DBconnect = async() =>{
    try {
        await mongoose.connect('mongodb://localhost:27017/datas');
        console.log("database is connected");
    } catch (error) {
        console.log(`cannot connect to database ${error}`);
    }
}
module.exports = DBconnect;