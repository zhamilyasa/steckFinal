const Review = require('../models/review.model');
const Book = require('../models/book.model');

// Создать отзыв
// review.controller.js
exports.createReview = async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;
  
    if (!bookId || !rating) {
        return res.status(400).json({ message: 'Book ID and rating are required' });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const newReview = new Review({
      book: bookId,
      user: req.user.userId,
      rating,
      comment
    });

    await newReview.save();
    res.status(201).json(newReview); // Возвращаем весь объект отзыва
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Получить все отзывы по книге
exports.getReviewsForBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    const reviews = await Review.find({ book: bookId }).populate('user', 'username');
    res.status(200).json(reviews);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Удалить отзыв (владелец или админ)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await review.deleteOne();
    res.status(200).json({ message: 'Review deleted' });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};