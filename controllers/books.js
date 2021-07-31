const Book = require("../models/Book");

const BookController = {
	async	all (req, res) {
		const total = await Book.countDocuments({});
		const limit = 3;
		const page = parseInt(req.query.page) || 0;
		const books = await Book.find()
			.limit(limit)
			.skip(limit * page)
		res.status(200).json({ totalPages: Math.ceil(total / limit), books })
	},
	async byId (req, res) {
		await Book.findById({ _id: req.params.id }, function(err, data) {
			if(err) {
				res.json(err);
			} else {
				res.json({ status: 200, data: data });
			}
		});
	},
	async create (req, res) {
		await Book.create({ title: req.body.title, author: req.body.author, description: req.body.description, category: req.body.category, img_path: req.file.path }, function(err, book) {
			if(err) {
				console.log(err);
			} else {
				res.status(200).json({ message: "Successfully created" });
			}
		})
	},
	async delete (req, res) {
		await Book.findByIdAndDelete({_id: req.params.id}, function(err, data) {
			if(err) {
				console.log(err);
			} else {
				res.status(200).json({ message: "Successfully deleted" });
			}
		})
	}
};

module.exports = BookController;
