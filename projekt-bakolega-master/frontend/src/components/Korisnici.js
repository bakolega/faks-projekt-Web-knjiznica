import React, { useEffect, useState } from 'react'
import korisniciAkcije from '../services/korisnici'
import PlatiClanarinuButton from './PlatiClanarinuButton'


const KorisniciPrikaz = ({ korisnik }) => {

    const [korisnici, setKorisnike] = useState([])

    useEffect(() => {
        if (korisnik != null) {
            korisniciAkcije.getAllKorisnike()
                .then(res => setKorisnike(res))
        }
        else (setKorisnike(null))
    }, [korisnik])

    const clanarinaUplata = async (rok, korisnikId) => {
        rok.setDate(rok.getDate() + 365);
        const odgovor = await korisniciAkcije.uplatiClanarinu(korisnikId, rok.toDateString())
        return odgovor.clanarinaIstece
        
    }


    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Ime</th>
                        <th>Username</th>
                        <th>Rezervacije</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        korisnici != null && Array.isArray(korisnici)
                            ? korisnici.map((korisnik) =>
                                <tr key={korisnik.id}>
                                    <th>{korisnik.ime}</th>
                                    <th>{korisnik.username}</th>
                                    <th> <PlatiClanarinuButton korisnikId={korisnik.id} clanarinaRok={korisnik.clanarinaIstece} clanarinaUplata={clanarinaUplata} /> </th>
                                </tr>
                            ) : null
                    }

                </tbody>
            </table>

        </div>

    )
}


export default KorisniciPrikaz