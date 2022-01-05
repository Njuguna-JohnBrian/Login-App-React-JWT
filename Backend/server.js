require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const jwt = require("jsonwebtoken");

//create an express app instance
const app = express();

const port = process.env.PORT || 4000;

// MOUNT MIDDLEWARES
// enable cors
app.use(cors());
// parse application/json
app.use(bodyparser.json());
// parse application/x-www-form-urlencoded
app.use(bodyparser.urlencoded({ extended: true }));

// request handlers
app.get("/", (req, res) => {
  res.send("Welcome " + req.user.name);
});

app.listen(port, () => {
  console.log(`Server Running On Port:${port}`);
});
