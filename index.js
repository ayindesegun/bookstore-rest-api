const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const e = require('express')
const port = 4000
const app = express()
mongoose.connect('mongodb://localhost:27017/booksDB')
app.use(bodyParser.urlencoded({ extended: false }))

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId
const BookSchema = new Schema({
  author: String,
  title: String,
  genre: String,
  date: Date,
})
const Book = mongoose.model('Book', BookSchema)

app.get('/books', (req, res) => {
  Book.find((err, foundBooks) => {
    if (!err) {
      res.send(foundBooks)
    } else {
      res.send(err)
    }
  })
})
app.post('/', (req, res) => {
  const { author, title, genre } = req.body
  const books = new Book({
    author: author,
    title: title,
    genre: genre,
    date: new Date().getTime(),
  })
  books.save((err) => {
    if (!err) {
      res.redirect('/books')
    } else {
      res.send(err)
    }
  })
})
app.get('/books/:books', (req, res) => {
  const requestedBooksId = req.params.books
  Book.find({ author: requestedBooksId }, (err, foundBooks) => {
    if (!err) {
      res.send(foundBooks)
    } else {
      res.send(err)
    }
  })
})

app.delete('/books/:books', (req, res) => {
  Book.findByIdAndDelete({ _id: req.params.books }, (err, foundBooks) => {
    if (!err) {
      console.log('Entry succesfully deleted')
      res.send(foundBooks)
    } else {
      res.send(err)
    }
  })
})
app.patch('/books/:books', (req, res) => {
  const { author, title, genre } = req.body
  const requestedBooksId = req.params.books
  Book.findByIdAndUpdate(
    { _id: requestedBooksId },
    { author: author, title: title, genre: genre },
    (err, foundBooks) => {
      if (!err) {
        console.log(
          `Entry with id ${requestedBooksId} has been updated successfully`
        )
        res.send(foundBooks)
      } else {
        res.send(err)
      }
    }
  )
})
app.listen(port, () => {
  console.log(`This server is alive and well on port ${port}`)
})
