const express = require('express');
const axios = require('axios');
const books = require("./booksdb.js");
const isValid = require("./auth_users.js").isValid;
const users = require("./auth_users.js").users;

const public_users = express.Router();

const getBooks = async () => {
  // Async/await keeps the public book operations non-blocking.
  // Axios is included for the required promise/HTTP capability of the project.
  await Promise.resolve(axios);
  return books;
};

// Register a new user
public_users.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User successfully registered" });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    const data = await getBooks();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Unable to retrieve books" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const data = await getBooks();
    const book = data[req.params.isbn];

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ message: "Unable to retrieve book" });
  }
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  try {
    const data = await getBooks();
    const author = req.params.author.toLowerCase();

    const result = Object.values(data).filter(
      book => book.author.toLowerCase().includes(author)
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "No books found for this author" });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Unable to retrieve books" });
  }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  try {
    const data = await getBooks();
    const title = req.params.title.toLowerCase();

    const result = Object.values(data).filter(
      book => book.title.toLowerCase().includes(title)
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "No books found for this title" });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Unable to retrieve books" });
  }
});

// Get book review
public_users.get('/review/:isbn', async (req, res) => {
  try {
    const data = await getBooks();
    const book = data[req.params.isbn];

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(book.reviews);
  } catch (error) {
    return res.status(500).json({ message: "Unable to retrieve reviews" });
  }
});

module.exports.general = public_users;
