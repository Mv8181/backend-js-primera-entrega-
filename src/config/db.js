






const mongoose = require("mongoose");

const connectDB = async (mongoUrl) => {
  try {
    await mongoose.connect(mongoUrl);
    console.log("MongoDB conectado ✅");
  } catch (error) {
    console.log("Error conectando MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;