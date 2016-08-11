var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
app.use(bodyParser.json());
var path = require('path');
app.use(express.static(path.normalize(__dirname + "/../client")));
mongoose.connect('mongodb://localhost/fide');
var db = mongoose.connection;
Genre = require('./models/genre.js');
Book = require('./models/book.js');
Member = require('./models/member.js');

app.get('/api/genres', function (req, res) {
    Genre.getGenres(function (err, genres) {
        if (err) {
            throw err;
        }
        res.json(genres);
    })
});

app.get('/api/members', function (req, res) {
    Member.getMembers(function (err, Members) {
        if (err) {
            throw err;
        }
        res.json(Members);
    })
});
app.get('/api/members/:name', function (req, res) {
    console.log(req.params.name);
    Member.getMemberByName(req.params.name, function (err, member) {
        if (err) {
            throw err;
        }
        res.json(member);
    })
});
app.post('/api/genres', function (req, res) {
    console.log(req);
    var genre = req.body;
    Genre.addGenre(genre, function (err, genre) {
        if (err) {
            throw err;
        }
        res.json(genre);
    })
});
app.put('/api/genres/:_id', function (req, res) {
    var id = req.params._id;
    var genre = req.body;
    Genre.updateGenre(id, genre, {}, function (err, genre) {
        if (err) {
            throw err;
        }
        res.json(genre);
    });
});
app.get('/api/books', function (req, res) {
    Book.getBooks(function (err, Books) {
        if (err) {
            throw err;
        }
        res.json(Books);
    })
});
app.post('/api/books', function (req, res) {
    var book = req.body;
    Book.addBook(book, function (err, Book) {
        if (err) {
            throw err;
        }
        res.json(Book);
    })
});
app.get('/api/books/:_id', function (req, res) {
    Book.getBookById(req.params._id, function (err, Book) {
        if (err) {
            throw err;
        }
        res.json(Book);
    })
});
app.listen(3000);
console.log('Running on port 3000.......');