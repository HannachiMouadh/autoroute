const express = require('express');
const app = express();
const port = 5000;
require('dotenv').config();
const DBconnect = require("./DBconnect");
const cors = require('cors');


app.use(cors());
app.use(express.json());
DBconnect();
app.use("/api/user",require('./routes/user'));
app.use("/auto",require("./routes/autoroute"));
app.use("/ent",require("./routes/entretient"));
app.use("/pat",require("./routes/patrouille"));

app.listen(port,(error)=>{
    error?console.log(error):console.log("server is running");
});