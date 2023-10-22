const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const korisniciRouter = require('./controllers/korisnici')
const loginRouter = require('./controllers/login')
const autoriRouter = require('./controllers/autori')
const knjigeRouter = require('./controllers/knjige')
const kopijeRouter = require('./controllers/kopijeKnjige')
const knjiznicariRouter = require('./controllers/knjiznicari')

const middleware = require('./utils/middleware')




console.log("Spajamo se na bazu")

mongoose.connect(config.DB_URI)
    .then(result => {
        console.log("Spojeni smo na bazu");
    })
    .catch(error => {
        console.log("Greška pri spajanju", error.message);
    })



app.use(cors())
app.use(express.json())
app.use(express.static('build'))

app.use('/api/knjiznicari',knjiznicariRouter)
app.use('/api/korisnici', korisniciRouter)

app.use('/api/logIn', loginRouter)

app.use('/api/autori', autoriRouter)
app.use('/api/knjige', knjigeRouter)
app.use('/api/kopije', kopijeRouter)



app.use(middleware.nepoznataRuta)
app.use(middleware.errorHandler)

module.exports = app