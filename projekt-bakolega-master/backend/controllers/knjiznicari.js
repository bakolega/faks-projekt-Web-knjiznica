const knjiznicariRouter = require('express').Router()
const Korisnik = require('../models/korisnik')
const Kopija = require('../models/kopijaKnjige')
const config = require('../utils/config')
const { requireAuthKnjiznicar } = require('../utils/authMiddleware')

//Posudba 
knjiznicariRouter.patch('/posudba', requireAuthKnjiznicar, async (req, res) => {
    
    var result = new Date();
    result.setDate(result.getDate() + config.duzina_posudbe);


    const posudba = await Kopija.findOneAndUpdate({ _id: req.body.kopijaId, status: "Dostupno" }, { status: "Posuđeno", povrat: result }, { returnOriginal: false })
    if (posudba == null) {
        console.log("Dostupna kopija sa tim id-jem nije pronadena")
        return res.status(404).json({ error: 'Dostupna kopija sa tim id-jem nije pronadena' })
    }




    const korisnik = await Korisnik.findOneAndUpdate({ username: req.body.username }, { $addToSet: { posudbe: req.body.kopijaId } }, { returnOriginal: false })
    if (korisnik == null) {
        console.log("Korisnik nije nije pronaden")
        return res.status(404).json({ error: 'Korisnik nije nije pronaden' })
    }
    res.json(posudba.status)

})

//Brisanje posudbe
knjiznicariRouter.patch('/povrat', requireAuthKnjiznicar, async (req, res) => {

    const posudba = await Kopija.findOneAndUpdate({ _id: req.body.kopijaId, status: "Posuđeno" }, {brProduzenja : 0, status: "Dostupno" }, { returnOriginal: false })
    if (posudba == null) {
        return res.status(404).json({ error: 'Posuđenoa kopija sa tim id-jem nije pronadena' })
    }

    const korisnik = await Korisnik.findOneAndUpdate({ username: req.body.username }, { $pull: { posudbe: req.body.kopijaId }}, { returnOriginal: false })
    if (korisnik == null) {
        return res.status(404).json({ error: 'Korisnik nije nije pronadena' })
    }
    res.json(posudba.status)
})

module.exports = knjiznicariRouter