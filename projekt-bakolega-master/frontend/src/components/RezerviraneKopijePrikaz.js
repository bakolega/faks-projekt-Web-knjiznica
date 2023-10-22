import React, { useEffect, useState } from 'react'
import korisniciAkcije from '../services/korisnici'


const RezerviraneKopijePrikaz = ({ korisnik }) => {

    const [rezerviraneKopije, postavirezerviraneKopije] = useState([])

    useEffect(() => {
        if (korisnik != null) {
            korisniciAkcije.getRezervacijeInfo(korisnik.id)
                .then(res => postavirezerviraneKopije(res))
        }
        else (postavirezerviraneKopije(null))
    }, [korisnik])
    console.log(rezerviraneKopije)


    const otkaziRezervacijuClick = (kopijaId) => {
        korisniciAkcije.otkaziRezervaciju(korisnik.id, kopijaId)
            .then(res => {
                postavirezerviraneKopije(rezerviraneKopije.filter(
                    (rezervacije) => rezervacije.id != kopijaId
                )
                )
            })
        //console.log(korisniciAkcije.otkaziRezervaciju(korisnik.id,kopijaId))
    }
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Naziv</th>
                        <th>ID</th>
                        <th>Rezervacije</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        rezerviraneKopije != null && Array.isArray(rezerviraneKopije)
                            ? rezerviraneKopije.map((kopija) =>
                                <tr key={kopija.id}>
                                    <th>{kopija.knjiga.naziv}</th>
                                    <th>{kopija.id}</th>
                                    <th> <OtkaziRezervacijuButton otkaziRezervacijuClick={otkaziRezervacijuClick} kopijaId={kopija.id} /> </th>
                                </tr>
                            ) : null
                    }

                </tbody>
            </table>

        </div>

    )
}
const OtkaziRezervacijuButton = (props) => {

    return (
        <button onClick={() => { props.otkaziRezervacijuClick(props.kopijaId) }}>
            Otkazi rezervaciju
        </button>)
}

export default RezerviraneKopijePrikaz