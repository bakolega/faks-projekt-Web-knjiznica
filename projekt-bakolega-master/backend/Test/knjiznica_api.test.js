const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Knjiga = require('../models/knjiga')
const pomocni = require('./test_pomocni')


beforeEach(async () => {
    await Knjiga.deleteMany({})
    let objektKnjige = new Knjiga(pomocni.pocenteKnjige[0])
    await objektKnjige.save()
    objektKnjige = new Knjiga(pomocni.pocenteKnjige[1])
    await objektKnjige.save()
    objektKnjige = new Knjiga(pomocni.pocenteKnjige[2])
    await objektKnjige.save()
})

test('Knjige se vraćaju kao JSON', async () => {
    await api
        .get('/api/knjige')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('dohvaća sve knjige', async () => {
    const odgovor = await api.get('/api/knjige')
    expect(odgovor.body).toHaveLength(pomocni.pocenteKnjige.length)
})

test('specificni naziv jedne knjige', async () => {
    const odgovor = await api.get('/api/knjige')
    const sadrzaj = odgovor.body.map(p => p.naziv)
    expect(sadrzaj).toContain('Knjiga 1')

})

test('dodavanje ispravne knjige bez autorizacije', async () => {
    const novaKnjiga = {
        naziv: 'Knjiga Nova',
        autor: "64850f51123a20a3b03e8768",
        godina: 1985,
        izdavac: "izdavac Novi"
    }
    await api
        .post('/api/knjige')
        .send(novaKnjiga)
        .expect(401)
        .expect('Content-Type', /application\/json/)

    const knjigeNaKraju = await pomocni.knjigeUBazi()

    expect(knjigeNaKraju).toHaveLength(pomocni.pocenteKnjige.length)

})

test('dohvat specificne knjige', async () => {

    const knjigePocetak = await pomocni.knjigeUBazi()
    const trazenaKnjiga = knjigePocetak[0]
    trazenaKnjiga.autor=null

    const odgovor = await api
        .get(`/api/knjige/${trazenaKnjiga.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const jsonKnjiga = JSON.parse(JSON.stringify(trazenaKnjiga))
    expect(odgovor.body).toEqual(jsonKnjiga)
})

test('Pretraga knjiga', async () => {

    const searchString= pomocni.pocenteKnjige[0].naziv

    const odgovor = await api
        .get(`/api/knjige/pretraga/${searchString}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    expect(odgovor.body[0].naziv).toEqual(pomocni.pocenteKnjige[0].naziv)
})




afterAll(() => {
    mongoose.connection.close()
})

