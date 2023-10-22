import { useParams } from "react-router-dom"
import { useState, useEffect } from "react";

import knjigeAkcije from "../services/knjige"
import kopijeAkcije from "../services/kopije"
import korisniciAkcije from "../services/korisnici"
import knjiznicariAkcije from "../services/knjiznicari"
import IzracunZakasnine from "../utils/IzracunZakasnine"





const Knjiga = ({ korisnik }) => {

    const [data, setData] = useState();
    const [kopije, setKopije] = useState(null);
    const { id } = useParams();
    const [rezervacije, setRezervacije] = useState(null);



    useEffect(() => {
        knjigeAkcije.getIdKnjiga(id)
            .then(res => setData(res.data))
        kopijeAkcije.getKopijeByKnjigaID(id)
            .then(res => setKopije(res.data))
    }, [])

    useEffect(() => {
        if (korisnik != null)
            korisniciAkcije.getRezervacije(korisnik.id)
                .then(res => setRezervacije(res))
        else setRezervacije(null)
    }, [korisnik])

    const dodajKopijuClick = (e) => {
        kopijeAkcije.addKopija({ knjigaId: id })
            .then(res => setKopije(kopije.concat(res)))
    }

    const izbrisiKopijuCLick = (e,kopijaId) => {
        e.preventDefault()
        kopijeAkcije.deleteKopija(kopijaId)
        .then(res => {
            setKopije(kopije.filter((k)=>k.id!=res.id))
        })
    }

    if (data === undefined) return;
    return (
        <div>

            <h2>{data.naziv}</h2>
            <div>
                <p>{data.autor.ime + " " + data.autor.prezime}</p>
                <p>{data.izdavac}</p>
                <p>{data.godina}</p>
                <p>{data.isbn}</p>
                {korisnik === null || korisnik.isKnjiznicar
                    ? <button onClick={dodajKopijuClick}>Dodaj kopiju</button>
                    : <p></p>
                }
            </div>

            <table >
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>ID</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(kopije)
                        ? kopije.map((ko) =>
                            <KopijePrikaz key={ko.id} kop={ko} rezervacije={rezervacije} setRezervacije={setRezervacije} izbrisiKopijuCLick={izbrisiKopijuCLick} korisnik={korisnik} />
                        ) : null
                    }
                </tbody>
            </table>



        </div>

    )
}

const KopijePrikaz = (props) => {

    const kop = props.kop
    const [status, setStatus] = useState(kop.status);
    const [prikaziPosudbaPovrat, setPrikaziPosudbaPovrat] = useState(false);
    const rezervirajClick = (e) => {
        if (props.korisnik == null)
            alert("Niste ulogirani")
        else {
            korisniciAkcije.rezerviraj(props.korisnik.id, kop.id)
                .then(res => {
                    props.setRezervacije(res)
                    setStatus("Rezervirano")
                })
        }
    }

    const otkaziRezervacijuClick = (e) => {
        if (props.korisnik == null)
            alert("Niste ulogirani")
        else {
            korisniciAkcije.otkaziRezervaciju(props.korisnik.id, kop.id)
                .then(res => {
                    props.setRezervacije(res)
                    setStatus("Dostupno")
                })
        }
    }

    const posudbaFormaClick = (e) => {
        console.log(prikaziPosudbaPovrat)
        setPrikaziPosudbaPovrat(!prikaziPosudbaPovrat)
    }


    const [posudba, setPosudba] = useState([]);
    /*  const clickPovrat = (e) => {
         console.log(prikaziPosudbaPovrat)
         setPrikaziPosudbaPovrat(!prikaziPosudbaPovrat)
     } */

    const [posudivac, setPosudivac] = useState('');
    const clickPosudbaOk = (e) => {
        e.preventDefault()
        knjiznicariAkcije.posudba(posudivac, kop.id)
            .then(res => {
                setStatus(res)
            })
        posudbaFormaClick(e)
    }

    const clicPovratOk = (e) => {
        e.preventDefault()

        knjiznicariAkcije.povrat(posudba.korisnik.username, kop.id)
            .then(res => {
                setStatus(res)
            })
        posudbaFormaClick(e)

    }

    if (props.korisnik === null || !props.korisnik.isKnjiznicar) {
        return (
            <tr key={kop.id}>
                <th>{status}</th>
                <th>{kop.id}</th>
                <th><RezervirajButton status={status} kopijaId={kop.id} rezervacije={props.rezervacije} rezervirajClick={rezervirajClick} otkaziRezervacijuClick={otkaziRezervacijuClick} /></th>
            </tr>
        )
    }
    else {
        return (
            <tr key={kop.id}>
                <th>{status}</th>
                <th>{kop.id}</th>
                <th><KnjiznicarKopijaButton status={status} kopijaId={kop.id} rezervacije={props.rezervacije} posudbaFormaClick={posudbaFormaClick} otkaziRezervacijuClick={otkaziRezervacijuClick} prikaziPosudbaPovrat={prikaziPosudbaPovrat} /></th>
                {
                    prikaziPosudbaPovrat && status == "Dostupno"
                        ? <Posudba clickPosudbaOk={clickPosudbaOk} setPosudivac={setPosudivac} />

                        : prikaziPosudbaPovrat && status == "Posuđeno"
                            ? <Povrat posudba={posudba} setPosudba={setPosudba} kopijaId={kop.id} clicPovratOk={clicPovratOk} />
                            : null
                }
                <th><IzbrisiKopijuButton kopijaId={kop.id} izbrisiKopijuCLick={props.izbrisiKopijuCLick}/></th>
            </tr>
        )
    }
}
const KnjiznicarKopijaButton = (props) => {
    if (props.prikaziPosudbaPovrat) {
        return (
            <button onClick={props.posudbaFormaClick} >
                Odustani
            </button>
        )
    }
    else if (props.status == "Rad u knjižnici")
        return (
            <p>X</p>
        )
    else if (props.status == "Posuđeno")
        return (
            <button onClick={props.posudbaFormaClick} >
                Povrat
            </button>
        )
    else if (props.status == "Dostupno")
        return (
            <button onClick={props.posudbaFormaClick} >
                Posudba
            </button>
        )
    else if (props.status == "Rezervirano") {
        return (
            <button onClick={props.otkaziRezervacijuClick}>
                Otkaži rezervaciju
            </button>
        )
    }
}

const RezervirajButton = (props) => {
    if (props.status == "Rad u knjižnici" || props.status == "Posuđeno")
        return (
            <p>X</p>
        )
    else if (props.status == "Dostupno")
        return (
            <button onClick={props.rezervirajClick} >
                Rezerviraj
            </button>
        )
    else if (props.status == "Rezervirano") {
        console.log(props.rezervacije)
        if (props.rezervacije == null || !props.rezervacije.includes(props.kopijaId))
            return (
                <p>Rezervirano</p>
            )
        else if (props.rezervacije.includes(props.kopijaId))
            return (
                <button onClick={props.otkaziRezervacijuClick}>
                    Odustani od rezervacije
                </button>
            )
    }
}

const IzbrisiKopijuButton = (props) => {
    
    return (
        <button onClick={(e) => props.izbrisiKopijuCLick(e,props.kopijaId)}>
            Izbriši
        </button>)

}


const Posudba = (props) => {
    console.log("render fomra Posudba")
    const [korisnici, setKorisnici] = useState('');

    useEffect(() => {
        korisniciAkcije.getAllKorisnike()
            .then(res => setKorisnici(res))
    }, [])
    return (
        <th>
            <form onSubmit={props.clickPosudbaOk}>
                <input type='text' list='korisnici'
                    onChange={(e) => {
                        props.setPosudivac(e.target.value)
                    }} />
                <datalist id='korisnici'>
                    {Array.isArray(korisnici)
                        ? korisnici.map((a) =>
                            <option key={a.id} value={a.username}></option>
                        ) : null
                    }
                </datalist>
                <button>OK</button>
            </form>
        </th>
    )

}

const Povrat = (props) => {
    const date = new Date();
    useEffect(() => {
        kopijeAkcije.getPosudbuKopije(props.kopijaId)
            .then(res => props.setPosudba(res))
    }, [])
    console.log(props.posudba)
    return (
        <th>
            <form onSubmit={props.clicPovratOk}>
                {props.posudba.korisnik == null
                    ? null
                    : < p > Zakasnina: {IzracunZakasnine.Zakasnina(props.posudba.povrat)} Korisnik: {props.posudba.korisnik.ime}</p>
                }
                <button>OK</button>
            </form>
        </th >
    )

}


export default Knjiga