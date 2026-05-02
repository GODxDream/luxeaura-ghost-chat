const Pusher = require('pusher');

const pusher = new Pusher({
  appId: "2149402",
  key: "9d2c97b4999feb54da3d",
  secret: "f4229c7844ece549c984",
  cluster: "ap1",
  useTLS: true
});

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { username, message } = req.body;

  // Validate required fields
  if (!username || !message) {
    return res.status(400).json({ error: 'Missing username or message' });
  }

  try {
    await pusher.trigger("ghost-room", "message-event", {
      username: username,
      message: message
    });

    res.status(200).json({ status: 'sent' });
  } catch (error) {
    console.error('Pusher error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
}
