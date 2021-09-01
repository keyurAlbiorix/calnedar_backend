const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

const authenticate = async (req:any, res:any, next:any) => {
  try {
    var token = req.header("x-auth");
    if (!token) {
      throw new Error("Unatuhorized user");
    }
    var decoded = jwt.verify(token, "thisismydemo");
    const user = await User.findOne({ _id: decoded._id, token: token });

    if (!user) {
      throw new Error("Unauthorized user");
    }
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    console.log(err);

    res.status(401).send({ message: "Please authenticate" });
  }
};

module.exports = authenticate;
