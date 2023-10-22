import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginForma from './LoginForma'

test('Ako se logiramo a nismo ulogirani', () => {
    const logIn = jest.fn()
    const logOut = jest.fn()
   
    const komponenta = render(
        <Router>
            <Routes>
                <Route exact path="/" element={<LoginForma logIn={logIn} logOut={logOut} korisnik={null}/>}></Route>
            </Routes>
        </Router>

    )

    const usernameInput = komponenta.container.querySelector('.username')
    const passwordInput = komponenta.container.querySelector('.password')
    const forma = komponenta.container.querySelector('form')

    fireEvent.change(usernameInput, {
        target: { value: 'Test Username' }
    })
    fireEvent.change(passwordInput, {
        target: { value: 'Test Password' }
    })

    fireEvent.submit(forma)
    /* const button = komponenta.getByText('Registriaj se')
    fireEvent.click(button) */

    expect(logIn.mock.calls).toHaveLength(1)
    expect(logIn.mock.calls[0][0]).toBe('Test Username')
    expect(logIn.mock.calls[0][1]).toBe('Test Password')
   
})

test('Ako se izlogiramo', () => {
    const logIn = jest.fn()
    const logOut = jest.fn()
    const korisnik = {
        ime:"test ime"
    }
    const komponenta = render(
        <Router>
            <Routes>
                <Route exact path="/" element={<LoginForma logIn={logIn} logOut={logOut} korisnik={korisnik}/>}></Route>
            </Routes>
        </Router>

    )

    const logOutButton = komponenta.getByText('Log out')

    

    fireEvent.click(logOutButton)
    /* const button = komponenta.getByText('Registriaj se')
    fireEvent.click(button) */

    expect(logIn.mock.calls).toHaveLength(0)
    expect(logOut.mock.calls).toHaveLength(1)
   
})
