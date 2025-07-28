export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  // Clear cookie (for demo, set to expired)
  res.setHeader('Set-Cookie', 'token=; Path=/; HttpOnly; Max-Age=0');
  res.status(200).json({ message: 'Logged out' });
} 