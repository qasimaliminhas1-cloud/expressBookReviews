const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });    
    }
  } 
  return res.status(404).json({ message: "Unable to register user." });
});

// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Task 10: Get all books using Async/Await
public_users.get('/async/books', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(books[isbn]);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/async/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => res.status(200).json(response.data))
    .catch(error => res.status(404).json({ message: "Book not found" }));
});

// Task 3: Get book details based on Author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let matchingBooks = [];
  Object.keys(books).forEach(key => {
    if (books[key].author === author) {
      matchingBooks.push(books[key]);
    }
  });
  if (matchingBooks.length > 0) {
    res.send(matchingBooks);
  } else {
    res.status(404).json({ message: "Author not found" });
  }
});

// Task 12: Get book details based on Author using Async/Await
public_users.get('/async/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({ message: "Author not found" });
  }
});

// Task 4: Get all books based on Title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let matchingBooks = [];
  Object.keys(books).forEach(key => {
    if (books[key].title === title) {
      matchingBooks.push(books[key]);
    }
  });
  if (matchingBooks.length > 0) {
    res.send(matchingBooks);
  } else {
    res.status(404).json({ message: "Title not found" });
  }
});

// Task 13: Get book details based on Title using Async/Await
public_users.get('/async/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({ message: "Title not found" });
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(books[isbn].reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;