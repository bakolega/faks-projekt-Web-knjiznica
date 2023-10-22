require('dotenv').config()

const PORT = process.env.PORT

// Baza podataka
const password = process.env.ATLAS_PASS
const user = process.env.ATLAS_USER
const dbname = process.env.NODE_ENV === 'test' ? 'knjiznica-api-test' : 'knjiznica-api'
const DB_URI = `mongodb+srv://${user}:${password}@cluster0.jjldove.mongodb.net/${dbname}?
retryWrites=true&w=majority`


//Knjiznica
const duzina_posudbe = 21

module.exports = {PORT, DB_URI, duzina_posudbe}