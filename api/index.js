const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URL);
jwtSecret = process.env.JWT_SECRET;

const app = express();
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

app.get("/test", (req, res) => {
  res.json("test ok");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const createdUser = await User.create({ username, password });
  jwt.sign({ userId: createdUser._id }, jwtSecret, {}, (err, token) => {
    if (err) throw err;
    res.cookie("token", token).status(201).json("ok");
  });
});

app.listen(4000);
