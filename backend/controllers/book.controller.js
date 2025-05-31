const Book = require('../models/book.model');

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // Разрешаем удалять владельцу или админу
    if (book.owner.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await book.deleteOne();
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
exports.createBook = async (req, res) => {
  try {
    const { title, author, description } = req.body;

    const book = new Book({
      title,
      author,
      description,
      owner: req.user.userId
    });

    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Получить все книги
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find().populate('owner', 'username email role');
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Получить книгу по id
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('owner', 'username email role');
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Обновить книгу (только владелец или админ)
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (book.owner.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, author, description } = req.body;
    if (title) book.title = title;
    if (author) book.author = author;
    if (description !== undefined) book.description = description;

    await book.save();
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Удалить книгу (только админ)
exports.deleteBook = async (req, res) => {
  try {
    console.log('User role:', req.user.role); // Логируем роль для отладки
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Access denied: admin rights required',
        yourRole: req.user.role // Добавляем информацию о роли в ответ
      });
    }
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};