const express = require('express')
const {config} = require('dotenv')
const mongoose = require('mongoose')
const bookRoutes = require('./routes/books.routes')
const bodyParser = require('body-parser')

config()

//usamos express para los middlewares
const app = express();

const port = process.env.PORT || 3000

//parseador de bodies
app.use(bodyParser.json())

//conectamos base de datos
mongoose.connect(process.env.MONGO_URL, {dbName:process.env.MONGO_DB_NAME})
const db = mongoose.connection;
console.log("conexion base correcta");

app.use('/books', bookRoutes);

app.listen(port, ()=>{
    console.log(`servidor inicializado puerto ${port}`)
})