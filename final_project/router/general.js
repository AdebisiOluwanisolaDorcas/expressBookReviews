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

// Task 10 — Get all books using async/await
public_users.get('/async/books', async function (req, res) {
  try {
    const getBooks = () => new Promise((resolve) => resolve(books));
    const allBooks = await getBooks();
    return res.status(200).json(allBooks);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 11 — Get book by ISBN using async/await
public_users.get('/async/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const getBook = () => new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) resolve(book);
      else reject("Book not found");
    });
    const book = await getBook();
    return res.status(200).json(book);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

// Task 12 — Get books by author using async/await
public_users.get('/async/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const getByAuthor = () => new Promise((resolve, reject) => {
      const result = Object.values(books).filter(b => b.author === author);
      if (result.length > 0) resolve(result);
      else reject("No books found for this author");
    });
    const matched = await getByAuthor();
    return res.status(200).json(matched);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

// Task 13 — Get books by title using async/await
public_users.get('/async/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const getByTitle = () => new Promise((resolve, reject) => {
      const result = Object.values(books).filter(b => b.title === title);
      if (result.length > 0) resolve(result);
      else reject("No books found for this title");
    });
    const matched = await getByTitle();
    return res.status(200).json(matched);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

module.exports.general = public_users;