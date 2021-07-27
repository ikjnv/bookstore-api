const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require('path');
var upload = multer({
	storage: multer.diskStorage({
		destination: function(req, file, cb) {
			cb(null, 'uploads/');
		},
		filename: function(req, file, cb) {
			cb(null, file.originalname);
		}
	})
});
const PORT = process.env.PORT || 8000;
const Book = require("./models/Book");

mongoose.connect("mongodb://localhost:27017/bookstore", {useNewUrlParser: true, useUnifiedTopology: true})
	.then(() => console.log ('Database Connection Success'))
	.catch(err => console.log(err));

app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get("/", function(req, res) {
	res.send("Welcome to our bookstore library!");
});

//app.get("/v1/books", function(req, res) {
//	Book.find({})
//		.exec(function(err, data) {
//			if(err) {
//				res.send(err);
//			} else {
//				res.json({status: 200, data: data});
//			}
//		})
//});

app.get("/v1/books", async(req, res) => {
	try {
		const total = await Book.countDocuments({});
		const limit = 2;
		const page = parseInt(req.query.page) || 0;
		const books = await Book.find()
			.limit(limit)
			.skip(limit * page);
		res.status(200).json({ totalPages: Math.ceil(total / limit), books});
	} catch(err) {
		console.log(err);
	}
});

app.get("/v1/books/:id", function(req, res) {
	Book.findById({ _id: req.params.id }, function(err, data) {
		if(err) {
			res.json(err);
		} else {
			res.json({ status: 200, data: data });
		}
	});
});

app.use(bodyParser.json());
app.post("/v1/books", upload.single('picture'), function(req, res) {
	Book.create({ title: req.body.title, author: req.body.author, description: req.body.description, category: req.body.category, img_path: req.file.path}, function(err, data) {
		if(err) {
			res.json(err);
		} else {
			res.send("Successfully created!");
		}
	});
});

app.delete("/v1/books/:id", function(req, res) {
	Book.findByIdAndDelete({ _id: req.params.id }, function(err, data) {
		if(err) {
			res.json(err);
		} else {
			res.json({ status: 200, message: "Deleted successfully", data: data });
		}
	})
})

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
