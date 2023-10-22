const knjigeRouter = require('express').Router()

const Knjiga = require('../models/knjiga')

const { requireAuthKnjiznicar } = require('../utils/authMiddleware')

//Sve knjige
knjigeRouter.get('/', async (req, res) => {
    const knjige = await Knjiga.find()
        .populate('autor')
    res.json(knjige)
})
//pretraga
knjigeRouter.get('/pretraga/:searchString', async (req, res) => {
    console.log(req.params.searchString)
    const knjige = await Knjiga.find({ $text: { $search: req.params.searchString } })
        .populate('autor')
    res.json(knjige)
})

//Knjiga po autoru
/* knjigeRouter.get('/autor/:id', async (req, res) => {
    const knjige = await Knjiga.find({ autor: req.params.id})

    res.json(knjige)
}) */
//Knjiga po id-u sa autorom
knjigeRouter.get('/:id', async (req, res, next) => {

    const a = await Knjiga.findById(req.params.id)
        .populate('autor')

    res.json(a)
})

//Dodaj knjigu
knjigeRouter.post('/', requireAuthKnjiznicar, async (req, res) => {

    const podatak = req.body

    const novaKnjiga = new Knjiga({
        naziv: podatak.naziv,
        autor: podatak.autorID,
        godina: podatak.godina,
        izdavac: podatak.izdavac,
        isbn: podatak.isbn
    })

    novaKnjiga.save().then(spremljenaKnjiga => {
        res.json(spremljenaKnjiga)
    })
})

//Izbrisi knjigu
/* knjigeRouter.delete('/:id', requireAuthKnjiznicar, (req, res) => {
    Knjiga.findByIdAndRemove(req.params.id)
        .then(res => {
            res.status(204).end()
        })
        .catch(err => next(err))
})
 */

module.exports = knjigeRouter