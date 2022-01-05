const jwt = require("jsonwebtoken");

// generate token using secret key and return it

function generateToken(user) {
  if (!user) return null;

  let u = {
    userId: user.userId,
    name: user.name,
    username: user.username,
    isAdmin: user.isAdmin,
  };

  return jwt.sign(u, process.env.JWT_SECRET, {
    //   expires in 24 hours
    expiresIn: 60 * 60 * 24,
  });
}

// return user details
function getCleanUser(user) {
  if (!user) return null;

  return {
    userId: user.userId,
    name: user.name,
    username: user.username,
    isAdmin: user.isAdmin,
  };
}

module.exports = {
  generateToken,
  getCleanUser,
};
