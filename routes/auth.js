const express = require('express');
const router = express.Router();

const users = [
  { username: 'admin', password: '1234', role: 'admin' },
  { username: 'user', password: 'abcd', role: 'user' }
];

router.post('/login', express.json(), (req, res) => {
  const { username, password } = req.body;
  const found = users.find(u => u.username === username && u.password === password);
  if (found) {
    res.json({ success: true, role: found.role, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

module.exports = router;