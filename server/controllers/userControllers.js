const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const axios = require("axios");

const Users = require("../schema/users");

exports.register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const isUserExist = await Users.findOne({ email });
    if (isUserExist)
      return res
        .status(400)
        .json({ ok: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new Users({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await user.save();

    // * generate refresh token
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // * generate access token
    const accessToken = generateAccessToken(user);

    res
      .status(201)
      .json({ ok: true, message: "User registered successfully", accessToken });
  } catch (error) {
    console.error("Error occurred userControllers.register", error);
    res.status(500).json({ ok: false, message: "Server Error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Users.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ ok: false, message: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res
        .status(400)
        .json({ ok: false, message: "Invalid credentials" });

    // * generate refresh token
    const refreshToken = generateRefreshToken(user);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // * generate access token
    const accessToken = generateAccessToken(user);

    res
      .status(200)
      .json({ ok: true, message: "User logged in successfully", accessToken });
  } catch (error) {
    console.error("Error occurred userControllers.login", error);
    res.status(500).json({ ok: false, message: "Server Error" });
  }
};

exports.googleLogin = async (req, res) => {
  const { tokenId } = req.body;
  try {
    const googleUser = await getGoogleUserDetails(tokenId);
    const user = await Users.findOne({ email: googleUser.email });
    if (!user)
      return res
        .status(400)
        .json({ ok: false, message: "Invalid credentials" });

    // * generate refresh token
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // * generate access token
    const accessToken = generateAccessToken(user);

    res
      .status(200)
      .json({ ok: true, message: "User logged in successfully", accessToken });
  } catch (error) {
    console.error("Error occurred userControllers.googleLogin", error);
    res.status(500).json({ ok: false, message: "Server Error" });
  }
};

exports.googleRegister = async (req, res) => {
  const { tokenId } = req.body;
  try {
    const googleUser = await getGoogleUserDetails(tokenId);
    const user = await Users.findOne({ email: googleUser.email });
    if (user)
      return res
        .status(400)
        .json({ ok: false, message: "User already exists" });

    const newUser = new Users({
      firstName: googleUser.given_name,
      lastName: googleUser.family_name,
      email: googleUser.email,
      isGoogleLogin: true,
    });
    await newUser.save();

    // * generate refresh token
    const refreshToken = generateRefreshToken(newUser);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // * generate access token
    const accessToken = generateAccessToken(newUser);

    res.json({
      ok: true,
      message: "User registered successfully",
      accessToken,
    });
  } catch (error) {
    console.error("Error occurred userControllers.googleRegister", error);
    res.status(500).json({ ok: false, message: "Server Error" });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.id)
      return res.status(400).json({ ok: false, message: "Invalid user" });

    const userCheck = await Users.findById(user.id);
    if (!userCheck)
      return res.status(400).json({ ok: false, message: "Invalid user" });

    // * generate access token
    const accessToken = generateAccessToken(userCheck);
    res.status(200).json({ ok: true, accessToken });
  } catch (error) {
    console.error("Error occurred userControllers.refreshToken", error);
    res.status(500).json({ ok: false, message: "Server Error" });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken");
    res.status(200).json({ ok: true, message: "User logged out successfully" });
  } catch (error) {
    console.error("Error occurred userControllers.logout", error);
    res.status(500).json({ ok: false, message: "Server Error" });
  }
};

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "30m" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};

const getGoogleUserDetails = async (accessToken) => {
  const response = await axios.get(
    `https://www.googleapis.com/oauth2/v3/userinfo`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};
