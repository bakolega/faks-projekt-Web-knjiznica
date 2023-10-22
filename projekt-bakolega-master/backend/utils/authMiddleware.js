const jwt = require('jsonwebtoken')
const { dohvatiToken } = require('./dohvatiToken')
const Korisnik = require('../models/korisnik')

/* const requireAuth = (req, res, next) => {
    const token = dohvatiToken(req)

    if (token) {
        jwt.verify(token, process.env.SECRET, (err, dekToken) => {
            if (err) {
                res.status(401).json({ error: 'neispravni ili nepostojeći token' })
            } else {
                Korisnik.findById(dekToken.id).then(rezultat => {
                    next()
                })
            }
        })
    }
    else {
        res.status(401).json({ error: 'nepostojeći token' })
    }
} */

const requireAuthKorisnik = (req, res, next) => {

    const token = dohvatiToken(req)
    const poslanID = req.params.id
    if (token) {
        jwt.verify(token, process.env.SECRET, (err, dekToken) => {
            if (err) { 
                res.status(401).json({ error: 'neispravni ili nepostojeći token' })
            } else {
                Korisnik.findById(dekToken.id).then(rezultat => {
                    if (rezultat.isKnjiznicar) {
                        //Knjižnicar
                       
                        next()
                        //res.status(401).json({ error: 'Token je od knjižničara, ne korisnika' })
                    }
                    else if (poslanID == dekToken.id) {
                        //Nije Knjižnicar i isti je id tokena kao i Id korinsika koji mijenjamo 
                        
                        next()
                    }
                    else {
                        res.status(401).json({ error: 'Token je od drugog korisnika' })
                    }

                })
            }
        })
    }
    else {
        res.status(401).json({ error: 'nepostojeći token' })
    }
}

const requireAuthKnjiznicar = (req, res, next) => {

    const token = dohvatiToken(req)

    if (token) {
        jwt.verify(token, process.env.SECRET, (err, dekToken) => {
            if (err) {
                res.status(401).json({ error: 'neispravni ili nepostojeći token' })
            } else {
                Korisnik.findById(dekToken.id).then(rezultat => {
                    if (rezultat.isKnjiznicar) {
                        //Knjižnicar
                        next()
                    }
                    else {
                        //Nije Knjitnicar
                        res.status(401).json({ error: 'Token je od korisnika, ne knjižničara' })
                    }
                })
            }
        })
    }
    else {
        res.status(401).json({ error: 'nepostojeći token' })
    }
}

module.exports = { requireAuthKorisnik, requireAuthKnjiznicar, /* requireAuth */ }