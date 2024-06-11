const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const ws = require("ws");
const User = require("./models/User");
const Message = require("./models/Message");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URL);
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

async function getUserData(req) {
  return new Promise((resolve, reject) => {
    const token = req.cookies?.token;
    if (token) {
      jwt.verify(token, jwtSecret, {}, (err, userData) => {
        if (err) throw err;
        resolve(userData);
      });
    } else {
      reject("no token");
    }
  });
}

app.get("/test", (req, res) => {
  res.json("test ok");
});

app.get("/profile", (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) throw err;
      res.json(userData);
    });
  } else {
    res.status(401).json("no token");
  }
});

app.get("/messages/:userId", async (req, res) => {
  const { userId } = req.params;
  const userData = await getUserData(req);
  const messages = await Message.find({
    sender: { $in: [userId, userData.userId] },
    recipient: { $in: [userId, userData.userId] },
  }).sort({ createdAt: 1 });
  res.json(messages);
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findOne({ username });

  if (foundUser) {
    const passOk = bcrypt.compareSync(password, foundUser.password);
    if (passOk) {
      jwt.sign({ userId: foundUser._id, username }, jwtSecret, {}, (err, token) => {
        res.cookie("token", token, { sameSite: "none", secure: true }).json({
          id: foundUser._id,
        });
      });
    }
  }
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPass = bcrypt.hashSync(password, bcryptSalt);
    const createdUser = await User.create({ username, password: hashedPass });
    jwt.sign({ userId: createdUser._id, username }, jwtSecret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token, { sameSite: "none", secure: true }).status(201).json({
        id: createdUser._id,
      });
    });
  } catch (err) {
    if (err) throw err;
    res.status(500).json("error");
  }
});

const server = app.listen(4000);

const wss = new ws.WebSocketServer({ server });
wss.on("connection", (connection, req) => {
  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieStr = cookies.split(";").find((str) => str.startsWith("token="));
    if (tokenCookieStr) {
      const token = tokenCookieStr.split("=")[1];
      if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
          if (err) throw err;
          const { userId, username } = userData;
          connection.userId = userId;
          connection.username = username;
        });
      }
    }
  }

  connection.on("message", async (message) => {
    const messageData = JSON.parse(message.toString());
    const { recipient, text } = messageData;
    if (recipient && text) {
      const messageDoc = await Message.create({
        sender: connection.userId,
        recipient,
        text,
      });

      [...wss.clients]
        .filter((client) => client.userId === recipient)
        .forEach((client) =>
          client.send(JSON.stringify({ text, sender: connection.userId, recipient, _id: messageDoc._id }))
        );
    }
  });

  [...wss.clients].forEach((client) => {
    client.send(JSON.stringify({ online: [...wss.clients].map((c) => ({ userId: c.userId, username: c.username })) }));
  });
});
