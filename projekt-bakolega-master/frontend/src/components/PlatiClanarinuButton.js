import { useState } from "react"

const PlatiClanarinuButton = (props) => {
    const [clanarinaRok, setClanarinaRok] = useState(props.clanarinaRok)

    const rok = new Date(clanarinaRok)
    console.log(props.clanarinaRok);
    const clanarinaClick = async () => {
        const odgovor = await  props.clanarinaUplata(rok, props.korisnikId)
        setClanarinaRok(odgovor)
    }
    return (
        <div>
            <p>{rok.toDateString()}</p>
            <button onClick={() => { clanarinaClick() }}>
                Uplati clanarinu
            </button></div>

    )
}

export default PlatiClanarinuButton