const express = require('express');
const router = express.Router(); // Только Express Router!
const auth = require('../mid/auth.middleware');
const {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook
} = require('../controllers/book.controller');

// Убедитесь, что все обработчики являются функциями
router.post('/', auth, createBook);
router.get('/', auth, getBooks);
router.get('/:id', auth, getBookById);
router.put('/:id', auth, updateBook);
router.delete('/:id', auth, deleteBook);

module.exports = router;