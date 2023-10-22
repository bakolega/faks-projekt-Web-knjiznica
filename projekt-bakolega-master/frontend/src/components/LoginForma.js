import React, { useState } from 'react'

import { useNavigate } from 'react-router-dom'



const LoginForma = (props) => {

    const navigate = useNavigate()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const logInClick = async (e) => {
        e.preventDefault()
        console.log("loug in")
        try {
            props.logIn(username,password)
            setPassword("")
            setUsername("")
            navigate(``)
        } catch (exception) {
            alert("Neispravni podaci");
        }
    }

    const logOutClick = async (e) => {
        console.log("loug OUt")
        e.preventDefault();
        props.logOut()
        navigate(``)
    }

    if (props.korisnik == null)
        return (

            <span >
                <form onSubmit={(e) =>logInClick(e,username,password)} >
                    <span  >
                        Korisničko ime:
                        <input className='username'
                            type="text"
                            value={username}
                            name="Username"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </span>
                    <span >
                        Lozinka:
                        <input className='password'
                            type="password"
                            value={password}
                            name="Pass"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </span>

                    <button type="submit">Log in</button>
                </form>
            </span>
        )
    else {
        var ime = props.korisnik.ime
        return (<span >
            <span>{ime} </span>
            <button className='logOutButton' onClick={(e) =>logOutClick(e)}>Log out</button>
        </span>
        )
    }
}




export default LoginForma
