const Book = require("../models/Book");

const BookController = {
	async	all (req, res) {
		try {
			const total = await Book.countDocuments({});
			const limit = 3;
			const page = parseInt(req.query.page) || 0;
			const books = await Book.find()
				.limit(limit)
				.skip(limit * page)
			res.status(200).json({ totalPages: Math.ceil(total / limit), books })
		} catch(err) {
			res.status(404).json({ errorMessage: err })
		}
	}
};

module.exports = BookController;
