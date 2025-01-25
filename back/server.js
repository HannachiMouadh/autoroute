const express = require('express');
const app = express();
const port = 5000;
require('dotenv').config();
const DBconnect = require("./DBconnect");
const cors = require('cors');




const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
  };
  app.use(cors(corsOptions));
app.use(express.json());
DBconnect();
app.use("/api/user",require('./routes/user'));
app.use("/auto",require("./routes/autoroute"));


app.listen(port,(error)=>{
    error?console.log(error):console.log("server is running");
});