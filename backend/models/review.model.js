const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  book:     { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating:   { type: Number, min: 1, max: 5, required: true },
  comment:  { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
