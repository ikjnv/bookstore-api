const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const upload = multer();
const PORT = process.env.PORT || 8000;
const Book = require("./models/Book");

mongoose.connect("mongodb://localhost:27017/bookstore", {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("CONNECTED!");	
});

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

app.post("/v1/book1", upload.none(), function(req, res) {
	Book.create({ title: req.body.title, author: req.body.author, description: req.body.descriptin, category: req.body.category  }, function(err, data) {
		if(err) {
			res.json(err);
		} else {
			res.json({ status: 200, data: data });
		}
	});
});

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
