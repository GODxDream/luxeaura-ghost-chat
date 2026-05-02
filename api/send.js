const Pusher = require('pusher');

const pusher = new Pusher({
  appId: "2149402",
  key: "9d2c97b4999feb54da3d",
  secret: "f4229c7844ece549c984",
  cluster: "ap1",
  useTLS: true
});

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed. Only POST requests are accepted.' 
    });
  }

  try {
    const { username, message } = req.body;

    // Validate required fields
    if (!username || typeof username !== 'string' || username.trim() === '') {
      return res.status(400).json({ 
        error: 'Missing or invalid "username" field.' 
      });
    }

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ 
        error: 'Missing or invalid "message" field.' 
      });
    }

    // Trigger Pusher event
    await pusher.trigger('ghost-room', 'message-event', {
      username: username.trim(),
      message: message.trim(),
      timestamp: new Date().toISOString()
    });

    return res.status(200).json({ 
      status: 'sent',
      data: {
        username: username.trim(),
        message: message.trim(),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Pusher error:', error);
    return res.status(500).json({ 
      error: 'Failed to send message. Please try again later.',
      details: error.message 
    });
  }
}
