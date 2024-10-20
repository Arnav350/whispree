const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const ws = require("ws");
const User = require("./models/User");
const Message = require("./models/Message");
const fs = require("fs");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URL);
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

const app = express();
app.use("/uploads", express.static(__dirname + "/uploads"));
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

app.get("/people", async (req, res) => {
  const users = await User.find({}, { _id: 1, username: 1 });
  res.json(users);
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

  try {
    const foundUser = await User.findOne({ username });

    if (!foundUser || !bcrypt.compareSync(password, foundUser.password)) {
      return res.status(400).json("invalid credentials");
    }

    jwt.sign({ userId: foundUser._id, username }, jwtSecret, {}, (err, token) => {
      res.cookie("token", token, { sameSite: "none", secure: true }).json({
        id: foundUser._id,
      });
    });
  } catch (err) {
    if (err) throw err;
    res.status(500).json("error");
  }
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json("user exists");

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

app.post("/logout", async (req, res) => {
  res.cookie("token", "", { sameSite: "none", secure: true }).json("ok");
});

const server = app.listen(4000);

const wss = new ws.WebSocketServer({ server });
wss.on("connection", (connection, req) => {
  function notifyPeople() {
    [...wss.clients].forEach((client) => {
      client.send(
        JSON.stringify({ online: [...wss.clients].map((c) => ({ userId: c.userId, username: c.username })) })
      );
    });
  }

  connection.isAlive = true;

  connection.timer = setInterval(() => {
    connection.ping();
    connection.deathTimer = setTimeout(() => {
      connection.isAlive = false;
      clearInterval(connection.timer);
      connection.terminate();
      notifyPeople();
    }, 1000);
  }, 5000);

  connection.on("pong", () => {
    clearTimeout(connection.deathTimer);
  });

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
    const { recipient, text, file } = messageData;

    let filename = null;
    if (file) {
      const parts = file.name.split(".");
      const ext = parts[parts.length - 1];
      filename = Date.now() + "." + ext;
      const path = __dirname + "/uploads/" + filename;
      const bufferData = new Buffer(file.data.split(",")[1], "base64");

      fs.writeFile(path, bufferData, () => {
        console.log("filed saved:" + path);
      });
    }

    if (recipient && (text || file)) {
      const messageDoc = await Message.create({
        sender: connection.userId,
        recipient,
        text,
        file: filename,
      });

      [...wss.clients]
        .filter((client) => client.userId === recipient)
        .forEach((client) =>
          client.send(
            JSON.stringify({
              text,
              sender: connection.userId,
              recipient,
              file: filename,
              _id: messageDoc._id,
            })
          )
        );
    }
  });

  notifyPeople();
});
