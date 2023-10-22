import React, { useEffect, useState } from 'react'
import korisniciAkcije from '../services/korisnici'
import Zakasnina from '../utils/IzracunZakasnine';

const PosudeneKopijePrikaz = ({ korisnik }) => {
    const [PosudeneKopije, postaviPosudeneKopije] = useState([])

    useEffect(() => {
        if (korisnik != null) {
            korisniciAkcije.getAllPosudbe(korisnik.id)
                .then(res => postaviPosudeneKopije(res))
            console.log(PosudeneKopije)
        }
        else (postaviPosudeneKopije(null))
    }, [korisnik])

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Naziv</th>
                        <th>Autor</th>
                        <th>ID</th>
                        <th>Povrat</th>
                        <th>Zakasnina</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        PosudeneKopije != null && Array.isArray(PosudeneKopije.posudbe)
                            ? PosudeneKopije.posudbe.map((kopija) =>
                                <PosudenaKopija key={kopija.id} kopija={kopija} korisnikId={korisnik.id} />
                            ) : null
                    }

                </tbody>
            </table>

        </div>

    )
}

const PosudenaKopija = (props) => {

    const kopija = props.kopija
    const [povrat, postaviPovrat] = useState(kopija.povrat)
    const [brProduzenja, postaviBrProduzenja] = useState(kopija.brProduzenja)
    const produziClick = (e) => {
        console.log(kopija.id)
        korisniciAkcije.produziPosudbu(props.korisnikId, kopija.id, povrat)
            .then(res => postaviPovrat(res.povrat))
        postaviBrProduzenja(brProduzenja + 1)
    }
    const povratRok = new Date(povrat)

    return (
        <tr key={kopija.id}>
            <th>{kopija.knjiga.naziv}</th>
            <th>{kopija.autor}</th>
            <th>{kopija.id}</th>
            <th>{povratRok.toDateString()}</th>
            <th>{Zakasnina(kopija.povrat)}</th>
            <Produzba brProduzenja={brProduzenja} produziClick={produziClick} />
        </tr>
    )
}

const Produzba = (props) => {
    return (
        <th>
            <p>Produzeno {props.brProduzenja} puta</p>

            {props.brProduzenja < 2
                ? <button onClick={props.produziClick}>Produzi</button>
                : <p>Max produzeno</p>
            }
        </th>

    )
}
export default PosudeneKopijePrikaz