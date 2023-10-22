const kopijeRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Kopija = require('../models/kopijaKnjige')
const Korisnik = require('../models/korisnik')
const DohvatiToken = require('../utils/dohvatiToken')

const { requireAuthKorisnik, requireAuthKnjiznicar } = require('../utils/authMiddleware')


//Dodavanje jedne kopije
kopijeRouter.post('/', requireAuthKnjiznicar, async (req, res) => {

    const podatak = req.body

    if (!podatak.knjigaId) {
        return res.status(400).json({
            error: 'Nedostaje id knjige'
        })
    }
    const novaKopija = new Kopija({
        knjiga: podatak.knjigaId
    })

    novaKopija.save().then(spremljenaKopija => {
        res.json(spremljenaKopija)
    })
})

//Sve kopije knjige pod ID knjige
kopijeRouter.get('/Sve/:id', async (req, res) => {
    const sve = await Kopija.find({
        knjiga: req.params.id
    })
    res.json(sve)
})

/* //Posudba kopije 
kopijeRouter.get('/:id', requireAuthKnjiznicar, async (req, res) => {

    const kopija = await Kopija.findById(req.params.id)
    if (kopija == null) {
        return res.status(404).json({ error: 'Kopija nije nije pronadena' })
    }
    const korisnik = await Korisnik.findOne({ posudbe: kopija.id })
    if (korisnik == null) {
        return res.status(404).json({ error: 'Korisnik koji je posudio knjigu nije nije pronaden' })
    }
    
    odgovor = {
        povrat: kopija.povrat,
        korisnik: korisnik
    }

    res.json(odgovor)
}) */

//Izbrisi kopiju
kopijeRouter.delete('/:id', requireAuthKnjiznicar, async (req, res) => {
    await Korisnik.updateMany({posudbe: req.params.id},{ $pull: { posudbe: req.params.id }});
    await Korisnik.updateMany({rezervacije: req.params.id},{ $pull: { rezervacije: req.params.id }});
    const odgovor = await Kopija.findByIdAndDelete(req.params.id)

    res.json(odgovor)
       
})



module.exports = kopijeRouter