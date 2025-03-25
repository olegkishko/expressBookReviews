const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return users.filter((user) => user.username === username).length > 0;
}

const authenticatedUser = (username, password) => {
    return users.filter((user) => user.username === username && user.password === password).length > 0;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const user = req.body.user;

    if (!user.username || !user.password) {
        return res.status(404).json({ message: "User data is empty" });
    }

    if (!isValid(user.username)) {
        return res.status(404).json({message: "Username is not valid"});
    }

    if (!authenticatedUser(user.username, user.password)) {
        return res.status(404).json({message: "User cannot be authenticated"});
    }

    let accessToken = jwt.sign({
        data: user
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
        accessToken
    };

    return res.status(200).json({message: "User successfully logged in"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const user = req.user.data;
    const isbn = req.params.isbn;
    const review = req.body.review;

    if (!books[isbn]) {
        return res.status(404).json({message: "No books found"});
    }

    if (!review) {
        return res.status(404).json({message: "Review cannot be empty"});
    }

    books[isbn].reviews[user.username] = review;

    return res.status(200).json({message: "Review successfully saved"})
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const user = req.user.data;
    const isbn = req.params.isbn;
    
    if (!books[isbn]) {
        return res.status(404).json({message: "No books found"});
    }

    if (!books[isbn].reviews[user.username]) {
        return res.status(404).json({message: "No review of the user found"});
    }

    delete books[isbn].reviews[user.username];

    return res.status(200).json({message: "Review successfully deleted"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
