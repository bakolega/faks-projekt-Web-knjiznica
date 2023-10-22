const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Korisnik = require('../models/korisnik')
const Knjiga = require('../models/knjiga')
const Kopija = require('../models/kopijaKnjige')
const Autor = require('../models/autor')


const pomocni = require('./test_pomocni')
const config = require('../utils/config')

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const autor = require('../models/autor')


const api = supertest(app)

describe('Kada imamo samo jednog korisnika i jednog knjiznicara u bazi', () => {
    var token = 0
    var testKnjiznicarId = 0
    var testKorisnikId = 0
    var testPosudenaKopijaId = 0
    var testDostupnaKopijaId = 0
    var rezerviranaKopjaId = 0
    var testAutorId = 0
    var testKnjigaId = 0
    beforeEach(async () => {

        await Korisnik.deleteMany({})
        await Kopija.deleteMany({})
        await Knjiga.deleteMany({})
        await Autor.deleteMany({})


        const knjiga = new Knjiga({
            naziv: "Test naziv",
            godina: 1985,
            izdavac: "Testizdavac",
        })
        testKnjigaId = (await knjiga.save()).id

        const autor = new Autor({
            ime: "teastAutorIme",
            prezime: "TestAutorPrezime"
        })
        testAutorId = (await autor.save()).id

        const kopija = new Kopija({
            knjiga: testKnjigaId
        })
        testPosudenaKopijaId = (await kopija.save()).id

        const nePosuđenakopija = new Kopija({
            knjiga: testKnjigaId
        })
        testDostupnaKopijaId = (await nePosuđenakopija.save()).id

        const rezerviranaKopij = new Kopija({
            knjiga: testKnjigaId
        })
        rezerviranaKopjaId = (await rezerviranaKopij.save()).id

        const passHash = await bcrypt.hash("Lozinka", 10)

        const knjiznicar = new Korisnik({
            username: "KnjiznicarTestUsername",
            ime: "KnjiznicarTest Ime",
            isKnjiznicar: true,
            passHash
        })

        const stvoreniKnjiznicar = await knjiznicar.save()
        testKnjiznicarId = stvoreniKnjiznicar.id
        const knjiznicarToken = {
            username: stvoreniKnjiznicar.username,
            id: stvoreniKnjiznicar.id
        }
        token = "bearer " + jwt.sign(knjiznicarToken, process.env.SECRET)



        const korisnik = new Korisnik({
            username: "KorisnikTestUsername",
            ime: "KorisnikTest Ime",
            isKnjiznicar: false,
            rezervacije: rezerviranaKopjaId,
            passHash
        })

        const stvoreniKorisnik = await korisnik.save()
        testKorisnikId = stvoreniKorisnik.id


        var result = new Date();
        result.setDate(result.getDate() + config.duzina_posudbe);


        await Kopija.findOneAndUpdate({ _id: testPosudenaKopijaId, status: "Dostupno" }, { status: "Posuđeno", povrat: result }, { returnOriginal: false })
        await Korisnik.findOneAndUpdate({ username: stvoreniKorisnik.username }, { $addToSet: { posudbe: testPosudenaKopijaId } }, { returnOriginal: false })

        await Kopija.findOneAndUpdate({ _id: rezerviranaKopjaId, status: "Dostupno" }, { status: "Rezervirano", povrat: result }, { returnOriginal: false })
        await Korisnik.findOneAndUpdate({ username: stvoreniKorisnik.username }, { $addToSet: { rezervacije: rezerviranaKopjaId } }, { returnOriginal: false })
    })


    test('Posudba kopije', async () => {
        const korisnikNaPocetku = await Korisnik.findById(testKorisnikId)
        body = {
            username: korisnikNaPocetku.username,
            kopijaId: testDostupnaKopijaId
        }

        const odgovor = await api
            .patch(`/api/knjiznicari/posudba`)
            .set('Authorization', token)
            .send(body)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const korisnikKraj = await Korisnik.findById(testKorisnikId)
        expect(korisnikKraj.posudbe).toHaveLength(korisnikNaPocetku.posudbe.length + 1)
        const kopijaKraj = await Kopija.findById(testDostupnaKopijaId)
        expect(kopijaKraj.status).toEqual("Posuđeno")
        expect(odgovor.body).toEqual("Posuđeno")
    })

    test('Povrat kopije', async () => {
        const korisnikNaPocetku = await Korisnik.findById(testKorisnikId)
        body = {
            username: korisnikNaPocetku.username,
            kopijaId: testPosudenaKopijaId
        }

        const odgovor = await api
            .patch(`/api/knjiznicari/povrat`)
            .set('Authorization', token)
            .send(body)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const korisnikKraj = await Korisnik.findById(testKorisnikId)
        expect(korisnikKraj.posudbe).toHaveLength(korisnikNaPocetku.posudbe.length - 1)
        const kopijaKraj = await Kopija.findById(testPosudenaKopijaId)
        expect(kopijaKraj.status).toEqual("Dostupno")
        expect(odgovor.body).toEqual("Dostupno")
    })

    test('Dodavanje kopije', async () => {
        const kopijeNaPocetku = await Kopija.find()
        body = {
            knjigaId: testKnjigaId
        }

        const odgovor = await api
            .post(`/api/kopije`)
            .set('Authorization', token)
            .send(body)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const kopijeKraj = await Kopija.find({})
        expect(kopijeKraj).toHaveLength(kopijeNaPocetku.length + 1)

        expect(odgovor.body.knjiga).toEqual(testKnjigaId)
    })

    test('Dodavanje kopije bez id knjige', async () => {
        const kopijeNaPocetku = await Kopija.find()
        body = {
        }

        const odgovor = await api
            .post(`/api/kopije`)
            .set('Authorization', token)
            .send(body)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const kopijeKraj = await Kopija.find({})
        expect(kopijeKraj).toHaveLength(kopijeNaPocetku.length)

    })
    test('Brisanje kopije', async () => {
        const kopijeNaPocetku = await Kopija.find()

        const odgovor = await api
            .delete(`/api/kopije/${testDostupnaKopijaId}`)
            .set('Authorization', token)
            .send()
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const kopijeKraj = await Kopija.find({})
        expect(kopijeKraj).toHaveLength(kopijeNaPocetku.length - 1)
        expect(odgovor.body.id).toEqual(testDostupnaKopijaId)

    })
    test('Brisanje kopije ako je posuđena', async () => {

        const kopijeNaPocetku = await Kopija.find()
        const korisnikNaPocetku = await Korisnik.findById(testKorisnikId)

        const odgovor = await api
            .delete(`/api/kopije/${testPosudenaKopijaId}`)
            .set('Authorization', token)
            .send()
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const kopijeKraj = await Kopija.find({})
        expect(kopijeKraj).toHaveLength(kopijeNaPocetku.length - 1)
        expect(odgovor.body.id).toEqual(testPosudenaKopijaId)

        const korisnikKraj = await Korisnik.findById(testKorisnikId)
        expect(korisnikKraj.posudbe).toHaveLength(korisnikNaPocetku.posudbe.length - 1)
        expect(odgovor.body.id).toEqual(testPosudenaKopijaId)

    })

    test('Placanje clanarine', async () => {

        const korisnikNaPocetku = await Korisnik.findById(testKorisnikId)
        const noviRok = new Date(korisnikNaPocetku.clanarinaIstece)
        noviRok.setDate(noviRok.getDate() + 365)
        const body = {
            noviRok: noviRok
        }
        const odgovor = await api
            .patch(`/api/korisnici/${testKorisnikId}/clanarina`)
            .set('Authorization', token)
            .send(body)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const korisnikKraj = await Korisnik.findById(testKorisnikId)
        expect(korisnikKraj.clanarinaIstece).toEqual(noviRok)
        expect(odgovor.body.clanarinaIstece).toEqual(noviRok.toISOString())

    })

    test('Dodavanje knjige i autora', async () => {

        const autoriNaPocetku = await Autor.find({})

        const body = {
            ime: "ImeTest",
            prezime: "PrezimeTest"
        }
        const odgovor = await api
            .post(`/api/autori/`)
            .set('Authorization', token)
            .send(body)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const autorNaKraju = await Autor.findById(odgovor.body.id)
        expect(autorNaKraju.ime).toEqual(body.ime)
        expect(autorNaKraju.prezime).toEqual(body.prezime)


        const knjigeNaPocetku = await Knjiga.find({})
        const body2 = {
            naziv: "Test naziv2",
            godina: 2000,
            izdavac: "Testizdavac2",
            autorID: autorNaKraju.id
        }

        const odgovor2 = await api
            .post(`/api/knjige/`)
            .set('Authorization', token)
            .send(body2)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const knjigeNakraju = await Knjiga.find({})
        expect(knjigeNakraju).toHaveLength(knjigeNaPocetku.length + 1)

        const knjigeNakrajuJSON = JSON.parse(JSON.stringify(knjigeNakraju))

        expect(knjigeNakrajuJSON).toContainEqual(odgovor2.body)

    })
    test('Dodavanje autora bez prezimena', async () => {
        const autoriNaPocetku = await Autor.find({})
        const body = {
            ime: "ImeTest",
        }
        const odgovor = await api
            .post(`/api/autori/`)
            .set('Authorization', token)
            .send(body)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        const autoriNaKraju = await Autor.find({})
        expect(autoriNaKraju).toHaveLength(autoriNaPocetku.length)
    })
    test('Dohvat svih autora', async () => {

        const autoriNaPocetku = await Autor.find()
        const odgovor = await api
            .get(`/api/autori/`)
            .set('Authorization', token)
            .send()
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const autoriNaPocetkuJSON = JSON.parse(JSON.stringify(autoriNaPocetku))
        expect(odgovor.body).toEqual(autoriNaPocetkuJSON)

    })

    test('Dohvat autora po ID', async () => {

        const autorNaPocetku = await Autor.findById(testAutorId)
        const odgovor = await api
            .get(`/api/autori/${testAutorId}`)
            .set('Authorization', token)
            .send()
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const autorNaPocetkuJSON = JSON.parse(JSON.stringify(autorNaPocetku))
        expect(odgovor.body).toEqual(autorNaPocetkuJSON)

    })

    test('Brisanje rezervacije korisniku', async () => {
        const korisnikNaPocetku = await Korisnik.findById(testKorisnikId)
        body = {
            kopijaId: rezerviranaKopjaId
        }

        const odgovor = await api
            .patch(`/api/korisnici/${testKorisnikId}/rezervacije`)
            .set('Authorization', token)
            .send(body)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const korisnikKraj = await Korisnik.findById(testKorisnikId)
        expect(korisnikKraj.rezervacije).toHaveLength(korisnikNaPocetku.rezervacije.length - 1)
        const kopijaKraj = await Kopija.findById(rezerviranaKopjaId)
        expect(kopijaKraj.status).toEqual("Dostupno")
    })

    test('Brisanje rezervacije korisniku kao knjiznicar', async () => {
        const korisnikNaPocetku = await Korisnik.findById(testKorisnikId)
        body = {
            kopijaId: rezerviranaKopjaId
        }

        const odgovor = await api
            .patch(`/api/korisnici/${testKnjiznicarId}/rezervacije`)
            .set('Authorization', token)
            .send(body)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const korisnikKraj = await Korisnik.findById(testKorisnikId)
        expect(korisnikKraj.rezervacije).toHaveLength(korisnikNaPocetku.rezervacije.length - 1)
        const kopijaKraj = await Kopija.findById(rezerviranaKopjaId)
        expect(kopijaKraj.status).toEqual("Dostupno")
    })

    test('Pretraga autora', async () => {
        body = {
            ime: "teastAutorIme",
            prezime: "TestAutorPrezime"
        }
        
    
        const odgovor = await api
            .post(`/api/autori/pretragaJednog/`)
            .set('Authorization', token)
            .send(body)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const autor = JSON.parse(JSON.stringify(body))
        expect(odgovor.body.ime).toEqual(autor.ime)
        expect(odgovor.body.prezime).toEqual(autor.prezime)
    })

    test('Dohvat svih kopije knjie', async () => {
        const kopijeNaPocetku = await Kopija.find({knjiga: testKnjigaId})
        const odgovor = await api
            .get(`/api/kopije/sve/${testKnjigaId}`)
            .set('Authorization', token)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const kopijeNaPocetkuJSON = JSON.parse(JSON.stringify(kopijeNaPocetku))

        expect(odgovor.body).toEqual(kopijeNaPocetkuJSON)
    })

    
    test('Dohvat svih korisnika osim knjiznicara', async () => {
        const korisnici = await Korisnik.find({ isKnjiznicar: false })
        const odgovor = await api
            .get(`/api/korisnici`)
            .set('Authorization', token)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const korisniciJSON = JSON.parse(JSON.stringify(korisnici))

        expect(odgovor.body).toEqual(korisniciJSON)
    })



})

afterAll(async () => {
    await mongoose.connection.close()
})