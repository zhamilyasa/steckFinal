const express = require('express');
const router = express.Router();
const auth = require('../mid/auth.middleware');
const {
  createReview,
  getReviewsForBook,
  deleteReview
} = require('../controllers/review.controller');

router.post('/', auth, createReview);
router.get('/:bookId', getReviewsForBook);
router.delete('/:id', auth, deleteReview);

module.exports = router;