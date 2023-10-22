import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import RedKnjiga from './RedKnjiga'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


test('Prikaz Knjige', () => {
    const testKnjiga = {
        naziv: "Test Naziv",
        autor: {
            ime: "Autor Ime Test",
            prezime: "Autor Prezime Test"
        },
        izdavac: "Test Izdavac",
        godina: 2000
    }

    const komponenta = render(
        <Router>
            <Routes>
                <Route exact path="/" element={<RedKnjiga kn={testKnjiga} />}></Route>
            </Routes>
        </Router>
    )

    const prikaz = komponenta.container.querySelector('.prikazKnjige')
    expect(prikaz).toHaveTextContent(testKnjiga.naziv)

})