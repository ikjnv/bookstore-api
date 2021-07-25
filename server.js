const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
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

mongoose.connect("mongodb://localhost:27017/bookData", {useNewUrlParser: true, useUnifiedTopology: true})
	.then(() => console.log ('Database Connection Success'))
	.catch(err => console.log(err));

app.use(cors());
app.get("/", function(req, res) {
	res.send("Welcome to our bookstore library!");
});

app.get("/v1/books", function(req, res) {
	Book.find({})
		.exec(function(err, data) {
			if(err) {
				res.send(err);
			} else {
				res.json({status: 200, data: data});
			}
		})
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
			res.json({ status: 200, data: data });
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
