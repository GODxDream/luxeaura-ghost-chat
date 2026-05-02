const express = require('express');
const Pusher = require('pusher');
const app = express();

app.use(express.json());

// LuxeAura Engine
const pusher = new Pusher({
  appId: "2149402",
  key: "9d2c97b4999feb54da3d",
  secret: "f4229c7844ece549c984",
  cluster: "ap1",
  useTLS: true
});

app.post('/api/send', (req, res) => {
  const { username, message } = req.body;
  pusher.trigger("ghost-room", "message-event", {
    username: username,
    message: message
  });
  res.status(200).json({ status: 'sent' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('LuxeAura Server Active'));
