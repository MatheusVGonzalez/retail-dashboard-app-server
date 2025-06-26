const express = require('express');
const router = express.Router();

const users = [
  { username: 'admin', password: '1234' },
  { username: 'user', password: 'abcd' }
];

router.post('/login', express.json(), (req, res) => {
  const { username, password } = req.body;
  const found = users.find(u => u.username === username && u.password === password);
  if (found) {
    res.json({ success: true, message: 'Login bem-sucedido' });
  } else {
    res.status(401).json({ success: false, message: 'Credenciais inválidas' });
  }
});

module.exports = router;