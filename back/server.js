const express = require('express');
const app = express();
const port = 5000;
require('dotenv').config();
const DBconnect = require("./DBconnect");
const cors = require('cors');
const mongoose = require('mongoose');



app.use(cors({
  origin: 'https://autoroute-nu.vercel.app', // Replace with your actual frontend
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization','app-type','Access-Control-Allow-Headers', 'Origin, X-Requested-With, Accept, Access-Control-Allow-Headers, Access-Control-Request-Method, Access-Control-Request-Headers'], // <== INCLUDE THIS!
  methods: ['Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH, OPTIONS']
}));
app.options('*', cors());
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use("/api/user",require('./routes/user'));
app.use("/auto",require("./routes/autoroute"));
app.use("/ent",require("./routes/entretient"));
app.use("/pat",require("./routes/patrouille"));
app.use("/matPat",require("./routes/matriculePatrouille"));
app.use("/api/upload",require("./routes/upload"));
app.use("/api/uploadSingle",require("./routes/uploadSingle"));
app.use("/api/updatePhoto",require("./routes/updatePhoto"));

mongoose.set('strictQuery', true);
DBconnect().then(() => {
  app.listen(port, () => console.log(`Server running on port ${port}`));
});
