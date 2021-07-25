const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, "./uploads/");
	},
	filename: function(req, file, cb) {
		cb(null, new Date().toISOString() + file.originalname);
	}
});

const fileFilter = (req, res, cb) => {
	if(file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 5
	},
	fileFilter: fileFilter
});

const Book = require("../models/Book");

router.get("/", (req, res, next) => {
	Book.find()
		.select("title author description category img_path")
		.exec()
		.then(docs => {
			const response = {
				count: docs.length,
				books: docs.map(doc => {
					return {
						title: doc.title,
						author: doc.author,
						description: doc.description,
						category: doc.category,
						image: doc.img_path,
						_id: doc._id,
						request: {
							type: "GET",
							url: "http://localhost:8000/books/" + doc._id
						}
					}
				})
			}
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
});

router.post("/create", upload.single("img_path"), (req, res, next) => {
	const book = new Product({
		_id: new mongoose.Types.ObjectId(),
		title: req.body.title,
		author: req.body.author,
		description: req.body.description,
		category: req.body.category,
		img_path: req.file.path
	});
	book
		.save()
		.then(result => {
			console.log(result);
			res.status(201).json({
				message: "Create book successfully",
				createdBook: {
					title: result.title,
					author: result.author,
					description: result.description,
					_id: result._id,
					img_path: result.img_path,
					request: {
						type: "GET",
						url: "http://localhost:8000/v1/books/" + result._id
					}
				}
			})
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			})
		});
});

router.get("/:id", (req, res, next) => {
	const id = req.params.id;
	Book.findById(id)
		.select("title author description category img_path")
		.exec()
		.then(doc => {
			console.log("From database", doc);
			if(doc) {
				res.status(200).json({
					product: doc,
					request: {
						type: "GET",
						url: "http://localhost:8000/v1/books/"
					}
				});
			} else {
				res
					.status(404)
					.json({ message: "No valid entry found for provided ID" })
			}
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: err });
		});
});

module.exports = router;
