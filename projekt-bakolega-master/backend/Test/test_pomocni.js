const Knjige = require('../models/knjiga')
const Korisnik = require('../models/korisnik')

const pocenteKnjige = [
    {
        id: 1,
        naziv: 'Knjiga 1',
        autor: "64850f51123a20a3b03e8768",
        godina: 1985,
        izdavac: "izdavac 2"
    },
    {
        id: 2,
        naziv: 'Knjiga 2',
        autor: "64850f51123a20a3b03e8768",
        godina: 1985,
        izdavac: "izdavac 2"
    },
    {
        id: 3,
        naziv: 'Knjiga 2',
        autor: "64850f51123a20a3b03e8768",
        godina: 1985,
        izdavac: "izdavac 3"
    }
]

const korisniciUBazi = async () => {
    const korisnici = await Korisnik.find({})
    return korisnici.map(k => k.toJSON())
   }
const kopijeUBazi = async () => {
    const kopije = await Korisnik.find({})
    return kopije.map(k => k.toJSON())
   }
   

const knjigeUBazi = async () => {
    const knjige = await Knjige.find({})
    return knjige.map(k => k.toJSON())
}

module.exports = {pocenteKnjige, knjigeUBazi, korisniciUBazi,kopijeUBazi}
