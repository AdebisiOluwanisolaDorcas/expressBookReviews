const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.some((user) => user.username === username);

  if (userExists) {
    return res.status(409).json({ message: "User already exists!" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered" });
});

// Task 1 — Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Task 2 — Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});

// Task 3 — Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const bookKeys = Object.keys(books);
  const authorBooks = [];

  bookKeys.forEach((key) => {
    if (books[key].author === author) {
      authorBooks.push(books[key]);
    }
  });

  if (authorBooks.length > 0) {
    res.send(authorBooks);
  } else {
    res.status(404).json({ message: "No books found for this author" });
  }
});

// Task 4 — Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const bookKeys = Object.keys(books);
  const titleBooks = [];

  bookKeys.forEach((key) => {
    if (books[key].title === title) {
      titleBooks.push(books[key]);
    }
  });

  if (titleBooks.length > 0) {
    res.send(titleBooks);
  } else {
    res.status(404).json({ message: "No books found for this title" });
  }
});

// Task 5 — Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

// Task 10 — Get all books using async/await with Axios
public_users.get('/async/books', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 11 — Get book by ISBN using async/await with Axios
public_users.get('/async/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 12 — Get books by author using async/await with Axios
public_users.get('/async/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// Task 13 — Get books by title using async/await with Axios
public_users.get('/async/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(404).json({ message: "No books found for this title" });
  }
});

module.exports.general = public_users;