const express = require("express");
// const { User } = require("./db");
const { shards, selectShard } = require('./db'); // Предполагая, что файл называется db.js

const { registerWithoutDescript } = require("./auth.module");

const app = express();
app.use(express.json());

const http = require("http");
http.globalAgent.maxSockets = Infinity;

app.post("/register", async (req, res) => {
  try {
    const userId = req.body.userId; // предположим, что userId передается в теле запроса
    const shard = selectShard(userId);
    const response = await registerWithoutDescript(req.body, shard);

    // const response = await registerWithoutDescript(req.body);
    res.status(200).json({ response });
  } catch (error) {
    res.status(400).send(error);
  }
});

Object.values(shards).forEach(shard => {
  shard.model('User').sync({force: true});
});

app.listen(3000, () => console.log("Server is running on port 3000"));
