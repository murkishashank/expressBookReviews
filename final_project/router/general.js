const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (!doesExist(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registred. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    //Write your code here
    // res.send(JSON.stringify(books, null, 4));
    try {
        const response = await axios.get('https://example.com/api/books');

        const bookList = response.data;

        res.status(200).json(bookList);
    } catch (error) {
        console.error('Error fetching book list:', error.message);
        res.status(500).json({ message: 'Error fetching book list' });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    //Write your code here
    // const isbn = req.params.isbn;
    // return res.status(200).json(books[isbn]);
    try {
        const isbn = req.params.isbn;

        const response = await axios.get(`https://example.com/api/books/${isbn}`);

        const bookDetails = response.data;

        res.status(200).json(bookDetails);
    } catch (error) {
        console.error(`Error fetching book details for ISBN ${isbn}:`, error.message);
        res.status(500).json({ message: `Error fetching book details for ISBN ${isbn}` });
    }
});

function findBooksByAuthor(authorName) {
    const foundBooks = [];

    for (const bookId in books) {
        if (books.hasOwnProperty(bookId)) {
            const book = books[bookId];
            if (book.author === authorName) {
                foundBooks.push(book);
            }
        }
    }

    return foundBooks;
}

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    //Write your code here
    // const author = req.params.author;
    // const booksByAuthor = findBooksByAuthor(author)
    // return res.status(200).json(booksByAuthor);
    try {
        const author = req.params.author;

        const response = await axios.get(`https://example.com/api/books/author/${author}`);

        const booksByAuthor = response.data;

        res.status(200).json(booksByAuthor);
    } catch (error) {
        console.error(`Error fetching book details for author ${author}:`, error.message);
        res.status(500).json({ message: `Error fetching book details for author ${author}` });
    }
});

function findBooksByTitle(title) {
    const foundBooks = [];

    for (const bookId in books) {
        if (books.hasOwnProperty(bookId)) {
            const book = books[bookId];
            if (book.title === title) {
                foundBooks.push(book);
            }
        }
    }

    return foundBooks;
}

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    const title = req.params.title;
    const booksByTitle = findBooksByTitle(title)
    return res.status(200).json(booksByTitle);
});

function getReviewsByIsbn(isbn) {
    const foundBooks = [];

    for (const bookId in books) {
        if (books.hasOwnProperty(bookId)) {
            const book = books[bookId];
            if (book.title === title) {
                foundBooks.push(book);
            }
        }
    }

    return foundBooks;
}

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    return res.status(200).json(books[isbn]["reviews"]);
});

module.exports.general = public_users;
