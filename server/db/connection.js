const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connectionURL = process.env.DB_CONNECTION_URL;
    if (!connectionURL) throw new Error("DB connection URL is not provided");

    await mongoose.connect(connectionURL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    exit(1);
  }
};

module.exports = connectDB;
