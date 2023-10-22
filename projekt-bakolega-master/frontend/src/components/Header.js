import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import LoginForma from './LoginForma'

import korisniciAkcije from '../services/korisnici'
import PrikazClanarine from './PrikazClanarine'

const Header = (props) => {
    const navigate = useNavigate()
    const [clanariaRok, setClanariaRok] = useState('null')


    useEffect(() => {
        if(props.korisnik!=null)
        korisniciAkcije.getClanarina(props.korisnik.id)
            .then(res => setClanariaRok(res))
    }, [props.korisnik])


    return (
        <span >
            <h1 onClick={() => navigate(``)}>Katalog Knjiznice</h1>
            <LoginForma korisnik={props.korisnik} setKorisnik={props.setKorisnik} logIn={props.logIn} logOut={props.logOut}/>
            {
                props.korisnik === null
                    ? null
                    : props.korisnik.isKnjiznicar
                        ? <span  >
                            <button onClick={() => navigate(`AddKnjige`)}>Dodaj u katalog</button>
                            <button onClick={() => navigate(`Korisnici`)}>Korisnici</button>
                            <button onClick={() => navigate(`Registracija`)}>Registracija Korisnika</button>
                        </span>
                        : <span>

                            <button onClick={() => navigate(`${props.korisnik.id}/posudeno`)}>Moje posudbe</button>
                            <button onClick={() => navigate(`${props.korisnik.id}/rezervirano`)}>Moje rezervacije</button>
                            <PrikazClanarine clanariaRok={clanariaRok} />
                        </span>
            }

            <br /><br />
        </span>
    )
}


export default Header