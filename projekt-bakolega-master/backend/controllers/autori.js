const autoriRouter = require('express').Router()
const Autor = require('../models/autor')
const {requireAuthKnjiznicar } = require('../utils/authMiddleware')


//Svi autori
autoriRouter.get('/', async (req, res) => {
    const odgovor = await Autor.find()
    res.json(odgovor)
})
//Autor po id
autoriRouter.get('/:id', async (req, res, next) => {
    const odgovor = await Autor.findById(req.params.id)
    res.json(odgovor)

})
//Pretraga autora
autoriRouter.post('/pretragaJednog', async (req, res) => {
    const odgovor = await Autor.findOne({
        prezime: req.body.prezime,
        ime: req.body.ime
    })
    res.json(odgovor)

})

//Dodaj autora
autoriRouter.post('/',requireAuthKnjiznicar, async (req, res) => {

    const podatak = req.body

    if (!podatak.prezime) {
        return res.status(400).json({
            error: 'Nedostaje prezime'
        })
    }
    const noviAutor = new Autor({
        ime: podatak.ime,
        prezime: podatak.prezime,
    })

    noviAutor.save().then(spremljeniAutor => {
        res.json(spremljeniAutor)
    })
})
//Izbrisi autora
/* autoriRouter.delete('/:id',requireAuthKnjiznicar, (req, res) => {
    Autor.findByIdAndRemove(req.params.id)
        .then(res => {
            res.status(204).end()
        })
        .catch(err => next(err))
})
 */

module.exports = autoriRouter