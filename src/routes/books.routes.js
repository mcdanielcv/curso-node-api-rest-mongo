const express = require('express')
const router = express.Router()
const Book = require('../models/book.model')

//middleware
const getBook = async (req, res, next) => {
    let book;
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json({
            message: "El id del libro no es valido"
        })
    }

    try {
        book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({
                message: "El libro no fue encontrado"
            })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

    res.book = book;
    next()
}

//obtener todos los libros
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        if (books.length === 0) {
            return res.status(204).json({ message: "No hay registros" })
        }
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//obtener un libro
router.get('/:id', getBook, async (req, res) => {
    res.json(res.book);
})

//actualizar un libro
router.put('/:id', getBook, async (req, res) => {
    try {
        const book = res.book;
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genere = req.body.genere || book.genere;
        book.publication_date = req.body.publication_date || book.publication_date;

        const updateBook = await book.save()
        res.json(updateBook);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//patch un libro
router.patch('/:id', getBook, async (req, res) => {

    if(!req.body.title && !req.body.author && !req.body.genere && !req.body.publication_date){
        return res.status(400).json({ message: "Al menos uno de los campos debe ser enviado" })
    }

    try {
        const book = res.book;
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genere = req.body.genere || book.genere;
        book.publication_date = req.body.publication_date || book.publication_date;

        const updateBook = await book.save()
        res.json(updateBook);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//patch un libro
router.delete('/:id', getBook, async (req, res) => {

   try {
        const book = res.book
        await book.deleteOne({
            _id: book._id
        })
        res.json({
            message:`El libro ${book.title} ha sido borrado`
        })
   } catch (error) {
    res.status(500).json({ message: error.message })
   }
  
})

//crar un libro
router.post('/', async (req, res) => {
    const {
        title,
        author,
        genere,
        publication_date
    } = req?.body

    if (!title || !author || !genere || !publication_date) {
        return res.status(400).json({
            message: " los campos son obligatorios"
        })
    }

    const book = new Book(
        {
            title,
            author,
            genere,
            publication_date
        })


    try {
        const newBook = await book.save()
        res.status(201).json(newBook);
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
})


module.exports = router