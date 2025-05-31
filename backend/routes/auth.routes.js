const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');
const auth = require('../mid/auth.middleware');

router.post('/register', register);
router.post('/login', login);

// 👇 проверка токена
router.get('/protected', auth, (req, res) => {
  res.json({ message: `Welcome, user ${req.user.userId}` });
});


module.exports = router;
