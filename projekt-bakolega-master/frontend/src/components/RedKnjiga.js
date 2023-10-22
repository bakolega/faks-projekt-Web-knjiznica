import React from 'react'
import { useNavigate } from 'react-router-dom'


const RedKnjiga = (props) => {
    const navigate = useNavigate()
    const kn = props.kn
    return (
        <tr onClick={() => navigate(`Knjige/${kn.id}`)} className='prikazKnjige'>
            <th>{kn.naziv}</th>
            <th>{kn.autor.ime + " " + kn.autor.prezime}</th>
            <th>{kn.izdavac}</th>
            <th>{kn.godina}</th>
        </tr>
    )
}


export default RedKnjiga