const express = require('express');
const app = express();
const port = 5000;
require('dotenv').config();
const DBconnect = require("./DBconnect");
const cors = require('cors');
const mongoose = require('mongoose');



app.use(cors({
  origin: 'http://localhost:3000', // Replace with your actual frontend
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization','app-type'], // <== INCLUDE THIS!
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.options('*', cors());
app.use("/uploads", express.static("uploads"));
app.use(express.json());
DBconnect();
app.use("/api/user",require('./routes/user'));
app.use("/auto",require("./routes/autoroute"));
app.use("/ent",require("./routes/entretient"));
app.use("/pat",require("./routes/patrouille"));
app.use("/matPat",require("./routes/matriculePatrouille"));
app.use("/api/upload",require("./routes/upload"));

mongoose.set('strictQuery', true);
app.listen(port,(error)=>{
    error?console.log(error):console.log("server is running");
});