const express = require("express");
const { shards, selectShard } = require('./db'); 

const { registerWithoutDescript } = require("./auth.module");
const { addMessageToPersonalChat } = require('./user.entity');


const app = express();
app.use(express.json());

const http = require("http");
http.globalAgent.maxSockets = Infinity;



app.post("/register", async (req, res) => {
  try {
    const userId = req.body.userId;
    const shard = selectShard(userId);
    const response = await registerWithoutDescript(req.body, shard);
    res.status(200).json({ response });
  } catch (error) {
    res.status(400).send(error);
  }
});


app.post('/message', async(req, res) => {
  try {
    const {
      toChat,
      forwardMessage,
      answerMessage,
      is_personal,
      code,
      attachments,
      uploadStack,
      text,
      userId
    } = req.body.data;

    const shard = selectShard(userId);

    
    const response = await addMessageToPersonalChat(shard, toChat, forwardMessage, answerMessage, attachments, text, userId);
    res.status(200).json({ response });
  } catch (error) {
    console.log("errro in message: ", error);
    res.status(500).json({ message: error });
  }
});

Object.values(shards).forEach(shard => {
  shard.sync({force: true});
});

app.listen(3000, () => console.log("Server is running on port 3000"));
