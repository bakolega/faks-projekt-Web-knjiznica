import React, { useEffect, useState } from 'react'

import KnjigaFormaCSS from './KnjigaForma.module.css'

const KnjigaForma = (props) => {

    const [naziv, setNaziv] = useState('');
    const [autorTxt, setAutorTxt] = useState('');
    const [godina, setGodina] = useState('');
    const [izdavac, setIzdavac] = useState('');

    const unosKnjige = (e) => {
        e.preventDefault()
        const autorSplit = autorTxt.split(', ')
        if (godina == null && naziv == null) {
            alert("Godina i naziv su obavezni")
        } else {
            const novaKnjiga = {
                naziv: naziv,
                autor: {
                    ime: autorSplit[1],
                    prezime: autorSplit[0]
                },
                godina: godina,
                izdavac: izdavac
            }
            props.dodajKnjigu(novaKnjiga)
        }

    }


    const [ime, setIme] = useState('');
    const [prezime, setPrezime] = useState('');

    const unosAutora = (e) => {
        e.preventDefault()
        if (prezime == null) {
            alert("Prezime je obavezno")
        } else {
            const noviAutor = {
                ime: ime,
                prezime: prezime,
            }
            //console.log(noviAutor);
            props.dodajAutora(noviAutor)
        }
    }




    return (
        <div className={KnjigaFormaCSS.KnjigaForma}>
            <h2>Unesi Knjigu</h2>
            <form onSubmit={unosKnjige} className ='knjigaForma'>
                <label>Naziv</label>
                <input className ='nazivInput' type='text' required onChange={(e) => setNaziv(e.target.value)} />

                <label>Autor</label>
                <input className ='autorInput' type='text' list='autori'
                    onChange={(e) => {
                        setAutorTxt(e.target.value)
                    }} />
                <datalist id='autori'>
                    {
                        Array.isArray(props.autori)
                            ? props.autori.map((a) =>
                                <option key={a.id} value={a.prezime + ", " + a.ime}></option>
                            ) : null
                    }
                </datalist>

                <label>Godina</label>
                <input className ='godinaInput' type='number' onChange={(e) => setGodina(e.target.value)} />

                <label>Izdavac</label>
                <input className ='izdavacInput' type='text' onChange={(e) => setIzdavac(e.target.value)} />

                <button type="submit">Spremi</button>
            </form>

            <h2>Dodaj autora</h2>
            <form onSubmit={unosAutora} className='autorForma'>
                <label>Ime</label>
                <input className ='imeAutora' type='text' required onChange={(e) => setIme(e.target.value)} />

                <label>Prezime</label>
                <input className='prezimeAutora' type='text' onChange={(e) => setPrezime(e.target.value)} />

                <button type="submit">Dodaj</button>
            </form>

        </div>
    )
}

export default KnjigaForma
