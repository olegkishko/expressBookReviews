const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({message: "Unable to register user."});
    }

    if (isValid(username)) {
        return res.status(404).json({message: "User already exists!"});
    }

    users.push({"username": username, "password": password});

    return res.status(200).json({message: "User successfully registered."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let promise = new Promise((resolve, reject) => {
        resolve(books);
    });

    promise.then((books) => {
        return res.status(200).json(books);
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    let promise = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("No books found");
        }
    });

    promise
        .then((book) => {
            return res.status(200).json(book);
        })
        .catch((error) => {
            return res.status(404).json({message: error});
        });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;

    let promise = new Promise((resolve, reject) => {
        let filteredBooks = Object.values(books).filter((book) => book.author === author);

        if (filteredBooks.length) {
            resolve(filteredBooks);
        } else {
            reject("No books found");
        }
    });

    promise
        .then((books) => {
            return res.status(200).json(books);
        })
        .catch((error) => {
            return res.status(404).json({message: error});
        });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

    let promise = new Promise((resolve, reject) => {
        let filteredBooks = Object.values(books).filter((book) => book.title === title);

        if (filteredBooks.length) {
            resolve(filteredBooks);
        } else {
            reject("No books found");
        }
    });

    promise
        .then((books) => {
            return res.status(200).json(books);
        })
        .catch((error) => {
            return res.status(404).json({message: error});
        })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.send(JSON.stringify(books[isbn].reviews));
    }

    return res.status(404).json({message: "No books found"});
});

module.exports.general = public_users;
