const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

module.exports = async (req, res, next) => {
  console.log('[DEBUG] Auth middleware started');
  
  // Проверка наличия заголовка Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    console.log('[ERROR] Missing or invalid Authorization header');
    return res.status(401).json({ message: 'No token provided' });
  }

  // Извлечение токена
  const token = authHeader.split(' ')[1].trim();
  console.log('[DEBUG] Token extracted:', token);

  try {
    // Верификация токена
    console.log('[DEBUG] JWT_SECRET:', process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[DEBUG] Decoded token:', decoded);

    // Поиск пользователя в БД
    const user = await User.findById(decoded.userId);
    if (!user) {
      console.log('[ERROR] User not found in database');
      return res.status(401).json({ message: 'User not found' });
    }

    // Добавление пользователя в запрос
    req.user = {
      userId: user._id.toString(),
      role: decoded.role || user.role
    };
    console.log('[DEBUG] User authenticated:', req.user);
    
    next();
  } catch (err) {
    console.error('[ERROR] Token verification failed:', err);
    res.status(401).json({ 
      message: 'Invalid token',
      error: err.message // Более детальная информация об ошибке
    });
  }
};