import React, { useState } from 'react'



const RegistracijaForma = (props) => {

    const [username, setUsername] = useState('');
    const [ime, setIme] = useState('');
    const [password, setPassword] = useState('');

    const regstrirajClick = (e) => {
        e.preventDefault()
        if(username=='' || ime == '' || password == ''){
            alert("Sva polja moraju biti ispunjena")
            
        }
        else{
        props.registriraj(username,ime,password)
        setUsername('')
        setIme('')
        setPassword('')
    }
    }

    return (
        <div>
            <form onSubmit={regstrirajClick}>
                <div>
                    Korisničko ime:
                    <input 
                    className="username"
                        type="text"
                        value={username}
                        name="Username"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    Ime:
                    <input
                            className="ime"
                        type="text"
                        value={ime}
                        name="Ime"
                        onChange={(e) => setIme(e.target.value)}
                    />
                </div>
                <div>
                    Lozinka:
                    <input
                    className="password"
                        type="password"
                        value={password}
                        name="Pass"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button type="submit">Registriaj se</button>
            </form>
        </div>
    )
}

export default RegistracijaForma
