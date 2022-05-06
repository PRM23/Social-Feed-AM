const mongoose = require("mongoose");
const bcryptThePassword = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const privateKey = process.env.secretKey;

const userSchema = new mongoose.Schema({
  // User Registration Data Schema

  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [emailValidator, "Incorrect Mail Format"],
  },
  password: {
    type: String,
    required: true,
    validate: [passwordValidator, "Invalid Password Format"],
  },
  bio: {
    type: String,
  },
  gender: { type: String },
  date_of_birth: { type: String },
  mobile: { type: String },
  created_at: { type: Date, required: true, default: Date.now },
});

function emailValidator(value) {
  return /^.+@.+\..+$/.test(value); // For Validating the Email
}

function passwordValidator(value) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,10}$/.test(
    value
  );
}

userSchema.pre("save", async function (next) {
  try {
    const salt = await bcryptThePassword.genSalt(10);
    const passwordHashed = await bcryptThePassword.hash(this.password, salt);
    this.password = passwordHashed;
    next();
  } catch (error) {
    res.status(500).json({
      error: {
        message: "Not able to process the password",
      },
    });
    next(error);
  }
});

userSchema.methods.checkPassword = async function (value) {
  if (!(await bcryptThePassword.compare(value, this.password))) {
    throw new Error("Password is incorrect");
  }
};

userSchema.methods.generateToken = async function (data) {
  const { _id, firstName, lastName, email } = data;
  try {
    return jwt.sign({ _id, lastName, firstName, email }, privateKey, {
      expiresIn: "1440min",
    });
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = mongoose.model("users", userSchema);
