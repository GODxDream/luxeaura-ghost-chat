const Pusher = require('pusher');

const pusher = new Pusher({
  appId: "2149402",
  key: "9d2c97b4999feb54da3d",
  secret: "f4229c7844ece549c984",
  cluster: "ap1",
  useTLS: true
});

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { username, message } = req.body;
      await pusher.trigger('ghost-room', 'message-event', {
        username: username,
        message: message
      });
      return res.status(200).json({ status: 'sent' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  res.status(405).send('Method Not Allowed');
};
