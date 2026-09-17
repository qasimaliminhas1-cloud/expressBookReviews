const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let userswithsamename = users.filter((user) => user.username === username);
  return userswithsamename.length > 0;
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => user.username === username && user.password === password);
  return validusers.length > 0;
};

// Task 7: Only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = { accessToken, username };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Task 8: Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review || req.body.review;
  const username = req.session.authorization ? req.session.authorization['username'] : null;

  if (!username) {
    return res.status(403).json({ message: "User not authenticated" });
  }

  if (books[isbn]) {
    books[isbn].reviews[username] = review;
    return res.status(200).json({ 
      message: `The review for the book with ISBN ${isbn} has been added/updated.` 
    });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 9: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization ? req.session.authorization['username'] : null;

  if (!username) {
    return res.status(403).json({ message: "User not authenticated" });
  }

  if (books[isbn]) {
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({ 
        message: `Reviews for the ISBN ${isbn} posted by the user ${username} deleted.` 
      });
    } else {
      return res.status(404).json({ message: "No review found for this user" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;