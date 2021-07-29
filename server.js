const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
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

// controllers
const bookController = require("./controllers/books");

mongoose.connect("mongodb://localhost:27017/bookstore", {useNewUrlParser: true, useUnifiedTopology: true})
	.then(() => console.log ('Database Connection Success'))
	.catch(err => console.log(err));

app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get("/v1/books", bookController.all);
app.get("/v1/books/:id", bookController.byId);
app.use(bodyParser());
app.post("/v1/books", upload.single('picture'), bookController.create);
app.delete("/v1/books/:id", bookController.delete);

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
