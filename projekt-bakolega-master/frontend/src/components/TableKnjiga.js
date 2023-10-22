import React, { useEffect, useState } from 'react'
import TableKnjigaCSS from './TableKnjiga.module.css'
import knjigeAkcije from '../services/knjige'
import { useNavigate } from 'react-router-dom'

import RedKnjiga from './RedKnjiga'

const TableKnjiga = () => {
    const [knjige, postaviKnjige] = useState([])

    const [pretragaTxt, setpretragaTxt] = useState('');

    const [sort, setSort] = useState({ polje: null, smijerDolje: true });

    const navigate = useNavigate()

    useEffect(() => {
        knjigeAkcije.dohvatiSve()
            .then(res => postaviKnjige(res.data))

    }, [])

    useEffect(() => {
        var knjigeTemp = [...knjige]
        if (sort.polje != null) {
            if (sort.polje != "autor" && sort.polje != "godina") {
                knjigeTemp = knjigeTemp.sort((kn1, kn2) => kn1[sort.polje].localeCompare(kn2[sort.polje]))
                if (sort.smijerDolje) {
                    knjigeTemp.reverse()
                }
            }
            else if (sort.polje == "autor") {
                knjigeTemp = knjigeTemp.sort((kn1, kn2) => (kn1.autor.prezime + kn1.autor.ime).localeCompare(kn2.autor.prezime + kn2.autor.ime))
                if (sort.smijerDolje) {
                    knjigeTemp.reverse()
                }
            } else if (sort.polje == "godina") {
                knjigeTemp = knjigeTemp.sort((kn1, kn2) => (kn1.godina > kn2.godina ? 1 : -1))
                if (sort.smijerDolje) {
                    knjigeTemp.reverse()
                }
            }
            postaviKnjige(knjigeTemp)
        }
    }, [sort])



    const pretraziClick = (e) => {
        e.preventDefault()
        if (pretragaTxt != '') {
            knjigeAkcije.pretrazi(pretragaTxt)
                .then(res => postaviKnjige(res.data))
        }
        else {
            knjigeAkcije.dohvatiSve()
                .then(res => postaviKnjige(res.data))
        }
    }

    const sortClick = (e, poljeSort) => {
        e.preventDefault()
        setSort({ polje: poljeSort, smijerDolje: !sort.smijerDolje })
    }

    return (
        <div>
            <form onSubmit={(e) => pretraziClick(e)}>
                <label>Pretraga: </label>
                <input type="text" name="PretragaTxt" onChange={(e) => setpretragaTxt(e.target.value)} ></input>
                <button>Pretraži</button>
            </form>
            <table className={TableKnjigaCSS.tbl}>
                <thead>
                    <tr>
                        <th onClick={(e) => sortClick(e, "naziv")} >Naziv</th>
                        <th onClick={(e) => sortClick(e, "autor")}>Autor</th>
                        <th onClick={(e) => sortClick(e, "izdavac")}>Izdavac</th>
                        <th onClick={(e) => sortClick(e, "godina")}>Godina</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        knjige != null && Array.isArray(knjige) ?
                            knjige.map((kn) =>
                                <RedKnjiga key={kn.id} kn={kn} />
                            ) : null
                    }

                </tbody>
            </table>

        </div>

    )
}



export default TableKnjiga