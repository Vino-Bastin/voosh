const jwt = require("jsonwebtoken");

const Users = require("../../schema/users");

exports.refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await Users.findById(decoded.id);
    if (!user) return res.status(400).json({ message: "Invalid user" });

    req.user = {
      id: user._id,
      email: user.email,
    };
    next();
  } catch (error) {
    console.error("Error occurred userControllers.refreshToken", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

exports.accessToken = async (req, res, next) => {
  try {
    const bearToken = req.headers.authorization;
    if (!bearToken) return res.status(401).json({ message: "Unauthorized" });

    const token = bearToken.split(" ")?.[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await Users.findById(decoded.id);
    if (!user) return res.status(400).json({ message: "Invalid user" });

    req.user = {
      id: user._id,
      email: user.email,
    };
    next();
  } catch (error) {
    console.error("Error occurred userControllers.accessToken", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};
