const korisniciRouter = require('express').Router()

const Korisnik = require('../models/korisnik')
const Kopija = require('../models/kopijaKnjige')
const Knjiga = require('../models/knjiga')

const config = require('../utils/config')

const bcrypt = require('bcrypt')

const { requireAuthKorisnik, requireAuthKnjiznicar } = require('../utils/authMiddleware')

//Svi korisnici osim knjiznicara
korisniciRouter.get('/', requireAuthKnjiznicar, async (req, res) => {
    const korisnici = await Korisnik.find({ isKnjiznicar: false })
    res.json(korisnici)
})

//Dodaj korisnika
korisniciRouter.post('/', requireAuthKnjiznicar, async (req, res) => {
    const sadrzaj = req.body
    const runde = 10
    const passHash = await bcrypt.hash(sadrzaj.password, runde)

    const korisnik = new Korisnik({
        username: sadrzaj.username,
        ime: sadrzaj.ime,
        isKnjiznicar: false,
        passHash
    })

    const sprKorisnik = await korisnik.save()
    res.json(sprKorisnik)
})

//Sve posudbe korisnika
korisniciRouter.get('/:id/posudbe/', requireAuthKorisnik, async (req, res) => {
    const odgovor = await Korisnik.findById(req.params.id).populate({
        path: 'posudbe',
        populate: {
            path: 'knjiga'
        }
    })
    res.json(odgovor)
})

//Produzi
korisniciRouter.patch('/:id/posudbe/', requireAuthKorisnik, async (req, res) => {

    const temp = await Kopija.findOneAndUpdate({ _id: req.body.kopijaId, status: "Posuđeno" }, { $inc: { 'brProduzenja': 1 } }, { returnOriginal: false })
    const noviPovrat = new Date(temp.povrat)
    noviPovrat.setDate(noviPovrat.getDate() + config.duzina_posudbe)



    const odgovor = await Kopija.findOneAndUpdate({ _id: req.body.kopijaId, status: "Posuđeno" }, { povrat: noviPovrat }, { returnOriginal: false })

    res.json(odgovor)
})

//Sve rezervacije korisnika
korisniciRouter.get('/:id/rezervacije/', requireAuthKorisnik, async (req, res) => {
    const korisnik = await Korisnik.findById(req.params.id)
    res.json(korisnik.rezervacije)
})

korisniciRouter.get('/:id/rezervacije/detalji', requireAuthKorisnik, async (req, res) => {
    const odgovor = await Korisnik.findById(req.params.id).populate({
        path: 'rezervacije',
        populate: {
            path: 'knjiga'
        }
    })
    res.json(odgovor)
})


//Rezerviraj 
korisniciRouter.post('/:id/rezervacije', requireAuthKorisnik, async (req, res) => {
    const rez = await Kopija.findOneAndUpdate({ _id: req.body.kopijaId, status: "Dostupno" }, { status: "Rezervirano" })
    if (rez == null) {
        return res.status(404).json({ error: 'Dostupna kopija sa tim id-jem nije pronadena' })
    }
    const korisnik = await Korisnik.findByIdAndUpdate(req.params.id, { $addToSet: { rezervacije: rez.id } }, { returnOriginal: false })
    res.json(korisnik.rezervacije)

})


//Izbriši rezervaciju
korisniciRouter.patch('/:id/rezervacije', requireAuthKorisnik, async (req, res) => {
    const korisnik = await Korisnik.findOneAndUpdate({ _id: req.params.id, rezervacije: req.body.kopijaId }, { $pull: { rezervacije: req.body.kopijaId } }, { returnOriginal: false })
    if (korisnik == null) {
        const korisnik2 = await Korisnik.findById(req.params.id)
        if (korisnik2.isKnjiznicar) {
            await Korisnik.findOneAndUpdate({ rezervacije: req.body.kopijaId }, { $pull: { rezervacije: req.body.kopijaId } })
            await Kopija.findOneAndUpdate({ _id: req.body.kopijaId, status: "Rezervirano" }, { status: "Dostupno" })
            return res.json("Knjižničar izbrisao rezervaciju")
        }
        else
            return res.status(404).json({ error: 'Ovaj korisnik nije rezervirao tu kopiju' })
    }

    const rez = await Kopija.findOneAndUpdate({ _id: req.body.kopijaId, status: "Rezervirano" }, { status: "Dostupno" })
    if (rez == null) {
        return res.status(404).json({ error: 'Rezervirana kopija sa tim id-jem nije pronadena' })
    }
    res.json(korisnik.rezervacije)
})


//Postavi rok clanarine
korisniciRouter.patch('/:id/clanarina', requireAuthKnjiznicar, async (req, res) => {
    const novirok = new Date(req.body.noviRok)
    const odgovor = await Korisnik.findByIdAndUpdate({ _id: req.params.id }, { clanarinaIstece: novirok }, { returnOriginal: false })
    res.json(odgovor)
})
//Dohvati rok clanarine
korisniciRouter.get('/:id/clanarina', requireAuthKorisnik, async (req, res) => {
    const odgovor = await Korisnik.findById({ _id: req.params.id })
    res.json(odgovor.clanarinaIstece)
})


module.exports = korisniciRouter