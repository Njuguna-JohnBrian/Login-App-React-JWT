require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const jwt = require("jsonwebtoken");
const utils = require("./utils");

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

// static user details
const userData = {
  userId: "1",
  password: "123456",
  name: "John Brian",
  username: "johnbrian",
  isAdmin: true,
};
// Check whether request is authenticated or not
app.use(function (req, res, nect) {
  // Check header/url/post params for token
  let token = req.headers["authorization"];

  // if no token contuinue
  if (!token) return next();

  token = token.replace("Bearer ", "");
  jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
    if (err) {
      return res.status(401).json({
        error: true,
        message: "Invalid User.",
      });
    } else {
      // set the user to req so other routes can use it
      req.user = user;
      next();
    }
  });
});
// request handlers
app.get("/", (req, res) => {
  if (!req.user)
    return res
      .status(401)
      .json({ success: false, message: "Invalid User.\nAccess Denied." });
  res.send("Welcome " + req.user.name);
});

// validate user credentials
app.post("users/signin", (req, res) => {
  const user = req.body.username;
  const pwd = req.user.password;

  // return 400 status if username/password does not exist
  if (!user || !pwd) {
    return res.status(400).json({
      error: true,
      message: "Username or Password is required.",
    });
  }

  // return 401 status if credentials don't match
  if (user !== userData.username || pwd !== userData.password) {
    return res.status(401).json({
      error: true,
      message: "Username or Password is wrong",
    });
  }

  // generate token
  const token = utils.generateToken(userData);

  // get basic user details
  const userObj = utils.getCleanUser(userData);

  // return token along with user details
  return res.json({ user: userObj, token });
});

app.listen(port, () => {
  console.log(`Server Running On Port:${port}.`);
});
