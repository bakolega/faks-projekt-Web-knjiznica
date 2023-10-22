const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Korisnik = require('../models/korisnik')
const Knjiga = require('../models/knjiga')
const Kopija = require('../models/kopijaKnjige')


const pomocni = require('./test_pomocni')
const config = require('../utils/config')

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

describe('Kada imamo samo jednog korisnika u bazi', () => {
    var token = 0
    var testKorisnikId = 0
    var testPosudenaKopijaId = 0
    var testDostupnaKopijaId = 0
    var testKnjigaId = 0
    beforeEach(async () => {

        await Korisnik.deleteMany({})
        await Kopija.deleteMany({})
        await Knjiga.deleteMany({})



        const knjiga = new Knjiga({
            naziv: "Test naziv",
            godina: 1985,
            izdavac: "Testizdavac",
        })
        testKnjigaId = (await knjiga.save()).id

        const kopija = new Kopija({
            knjiga: testKnjigaId
        })
        testPosudenaKopijaId = (await kopija.save()).id

        const nePosuđenakopija = new Kopija({
            knjiga: testKnjigaId
        })
        testDostupnaKopijaId = (await nePosuđenakopija.save()).id

        const passHash = await bcrypt.hash("Lozinka", 10)
        const korisnik = new Korisnik({
            username: "KorisnikTestUsername",
            ime: "KorisnikTest Ime",
            isKnjiznicar: false,
            passHash
        })

        const stvoreniKorisnik = await korisnik.save()
        testKorisnikId = stvoreniKorisnik.id
        const userToken = {
            username: stvoreniKorisnik.username,
            id: stvoreniKorisnik.id
        }
        token = "bearer " + jwt.sign(userToken, process.env.SECRET)


        var result = new Date();
        result.setDate(result.getDate() + config.duzina_posudbe);


        await Kopija.findOneAndUpdate({ _id: testPosudenaKopijaId, status: "Dostupno" }, { status: "Posuđeno", povrat: result }, { returnOriginal: false })
        await Korisnik.findOneAndUpdate({ username: stvoreniKorisnik.username }, { $addToSet: { posudbe: testPosudenaKopijaId } }, { returnOriginal: false })
    })

    test('stvaranje novog korisnika bez potrebne autorizcje knjiznicar', async () => {
        const pocetniKorisnici = await pomocni.korisniciUBazi()
        const novi = {
            username: "KorisnikTestUsername",
            ime: "KorisnikTest Ime",
            isKnjiznicar: false,
            pass: 'lozinkatest'
        }
        await api
            .post('/api/korisnici')
            .set('Authorization', token)
            .send(novi)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        const korisniciKraj = await pomocni.korisniciUBazi()
        expect(korisniciKraj).toHaveLength(pocetniKorisnici.length)
    })

    test('rezervacija kopije, dohvat rezervacije, zatim brisanje rezervacije', async () => {
        const korisnikNaPocetku = await Korisnik.findById(testKorisnikId)
        body = {
            kopijaId: testDostupnaKopijaId
        }

        await api
            .post(`/api/korisnici/${testKorisnikId}/rezervacije`)
            .set('Authorization', token)
            .send(body)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const korisnikKraj = await Korisnik.findById(testKorisnikId)
        expect(korisnikKraj.rezervacije).toHaveLength(korisnikNaPocetku.rezervacije.length + 1)
        const kopijaKraj = await Kopija.findById(testDostupnaKopijaId)
        expect(kopijaKraj.status).toEqual("Rezervirano")



        const korisnikNaPocetku2 = await Korisnik.findById(testKorisnikId)
        const odgovor2 = await api
            .get(`/api/korisnici/${testKorisnikId}/rezervacije`)
            .set('Authorization', token)
            .send()
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const jsonKorisnik2 = JSON.parse(JSON.stringify(korisnikNaPocetku2))
        expect(odgovor2.body).toEqual(jsonKorisnik2.rezervacije)



        const korisnikNaPocetku3 = await Korisnik.findById(testKorisnikId)
        body = {
            kopijaId: testDostupnaKopijaId
        }
        const odgovor3 = await api
            .patch(`/api/korisnici/${testKorisnikId}/rezervacije`)
            .set('Authorization', token)
            .send(body)
            .expect(200)
            .expect('Content-Type', /application\/json/)

    
        expect(odgovor3.body).toHaveLength(korisnikNaPocetku3.rezervacije.length - 1)

        const korisnikKraj3 = await Korisnik.findById(testKorisnikId)
        expect(korisnikKraj3.rezervacije).toHaveLength(korisnikNaPocetku3.rezervacije.length - 1)
        expect(korisnikKraj3.rezervacije).not.toContain(testDostupnaKopijaId)

        const kopijaKraj3 = await Kopija.findById(testDostupnaKopijaId)
        expect(kopijaKraj3.status).toEqual("Dostupno")


    })

    test('dohvat posudba', async () => {

        const korisnikNaPocetku = await Korisnik.findById(testKorisnikId)

        const korisnikSaPosudbama = await api
            .get(`/api/korisnici/${testKorisnikId}/posudbe`)
            .set('Authorization', token)
            .send()
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(korisnikSaPosudbama.body.posudbe).toHaveLength(korisnikNaPocetku.posudbe.length)

        const kopijaKrajJSON = JSON.parse(JSON.stringify(await Kopija.findById(testPosudenaKopijaId).populate('knjiga')))

        expect(korisnikSaPosudbama.body.posudbe).toContainEqual(kopijaKrajJSON)

    })

    test('Produži posudbu', async () => {
        const kopijaNaPocetuku = await Kopija.findById(testPosudenaKopijaId)
        body = {
            kopijaId: testPosudenaKopijaId
        }

        const kopijaOdgovor = await api
            .patch(`/api/korisnici/${testKorisnikId}/posudbe`)
            .set('Authorization', token)
            .send(body)
            .expect(200)
            .expect('Content-Type', /application\/json/)



        const kopijaKrajJSON = JSON.parse(JSON.stringify(await Kopija.findById(testPosudenaKopijaId)))

        expect(kopijaOdgovor.body).toEqual(kopijaKrajJSON)

        const noviPovrat = new Date(kopijaNaPocetuku.povrat)
        noviPovrat.setDate(noviPovrat.getDate() + config.duzina_posudbe)

        expect(kopijaKrajJSON.povrat).toEqual(noviPovrat.toISOString())


    })

    test('Dohvati rok clanarine', async () => {
        const korisnikNaPocetku = await Korisnik.findById(testKorisnikId)

        const odgovor = await api
            .get(`/api/korisnici/${testKorisnikId}/clanarina`)
            .set('Authorization', token)
            .send()
            .expect(200)
            .expect('Content-Type', /application\/json/)



        const korisnikPocetakJSON = JSON.parse(JSON.stringify(korisnikNaPocetku))

        expect(odgovor.body).toEqual(korisnikPocetakJSON.clanarinaIstece)



    })






})

afterAll(async () => {
    await mongoose.connection.close()
})