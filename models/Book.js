const mongoose = require('mongoose');

const Book = new mongoose.Schema({
	title: String,
	author: String,
	description: String,
	category: String,
});

const BookModel = mongoose.model('Book', Book);

module.exports = mongoose.model('Book', Book);
