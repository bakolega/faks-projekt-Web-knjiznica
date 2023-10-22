import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import tokenAkcije from './utils/token';

import KnjigaForma from './components/KnjigaForma'
import RegistracijaForma from './components/RegistracijaForma';
import LoginForma from './components/LoginForma';
import Header from './components/Header';
import Knjiga from './components/Knjiga';
import TableKnjiga from './components/TableKnjiga';
import PosudeneKopijePrikaz from './components/PosudeneKopijePrikaz';
import PrezerviraneKopijePrikaz from './components/RezerviraneKopijePrikaz';
import KorisniciPrikaz from './components/Korisnici';

import registracijaAkcije from './services/registracija';
import korisniciAkcije from './services/korisnici';
import logInAkcije from './services/logIn';
import knjigeAkcije from './services/knjige'
import autoriAkcije from './services/autori'


const helper = async () => {
    let a = await window.localStorage.getItem(
        "prijavljeniKorisnik"
    )
    return a
}

const App = () => {
    const [korisnik, setKorisnik] = useState(null);

    useEffect(() => {
        const logiraniKorisnikJSON = tokenAkcije.getKorisnikLocalStorage()
        if (logiraniKorisnikJSON) {
            setKorisnik(logiraniKorisnikJSON)
            tokenAkcije.postaviToken(logiraniKorisnikJSON.token)
        }
        else {
            tokenAkcije.postaviToken(null)
        }
    }, [])





    const registriraj = async (username, ime, password) => {

        try {
            const korisnik = await registracijaAkcije.registracija({
                username,
                ime,
                password
            });
           // console.log(korisnik);
        } catch (exception) {
            alert("Neispravni podaci");
        }
    };

    const logIn = async (username, password) => {

        try {
            const korisnik = await logInAkcije.logIn({
                username,
                password
            });
            window.localStorage.setItem(
                "prijavljeniKorisnik",
                JSON.stringify(korisnik)
            );
            setKorisnik(korisnik)
            tokenAkcije.postaviToken(korisnik.token)

        } catch (exception) {
            alert("Krivi podatci")
        }
    }

    const logOut = async () => {

        setKorisnik(null)
        tokenAkcije.postaviToken(null)
        localStorage.clear()

    }

    const dodajKnjigu = async (novaKnjiga) => {
        knjigeAkcije.addKnjiga(novaKnjiga)
            .then((response) => {

            })
    }
    const [autori, setAutor] = useState('');

    const dodajAutora = async (noviAutor) => {
        const odgovor = await autoriAkcije.addAutor(noviAutor)
        setAutor(autori.concat(odgovor))
    }

    useEffect(() => {
        autoriAkcije.dohvatiSve()
            .then(res => setAutor(res.data))
    }, [])

    return (


        <Router>
            <div>

                <Header korisnik={korisnik} setKorisnik={setKorisnik} logIn={logIn} logOut={logOut} />

                <Routes>
                    <Route exact path="/" element={<TableKnjiga korisnik={korisnik} />}></Route>

                    <Route exact path="/AddKnjige" element={<KnjigaForma dodajKnjigu={dodajKnjigu} dodajAutora={dodajAutora} autori={autori}/>}></Route>

                    <Route exact path="/Registracija" element={<RegistracijaForma registriraj={registriraj} />}></Route>

                    <Route exact path="Knjige/:id" element={<Knjiga korisnik={korisnik} />}></Route>

                    <Route exact path=":id/posudeno" element={<PosudeneKopijePrikaz korisnik={korisnik} />}></Route>

                    <Route exact path=":id/rezervirano" element={<PrezerviraneKopijePrikaz korisnik={korisnik} />} />

                    <Route exact path="/korisnici" element={<KorisniciPrikaz korisnik={korisnik} />} />
                </Routes>



            </div>
        </Router>
    )
}





export default App