import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import KnjigaForma from './KnjigaForma';

test('Dodavanje autora', () => {
    const autori =null
    const dodajKnjigu = jest.fn()
    const dodajAutora = jest.fn()
 
    const komponenta = render(
        <Router>
            <Routes>
                <Route exact path="/" element={<KnjigaForma dodajAutora={dodajAutora} dodajKnjigu={dodajKnjigu} autori={autori}/>}></Route>
            </Routes>
        </Router>

    )

    const imeInput = komponenta.container.querySelector('.imeAutora')
    const prezimeInput = komponenta.container.querySelector('.prezimeAutora')
    const autorForma = komponenta.container.querySelector('.autorForma')

    fireEvent.change(imeInput, {
        target: { value: 'Test Ime' }
    })
    fireEvent.change(prezimeInput, {
        target: { value: 'Test Prezime' }
    })

    fireEvent.submit(autorForma)

    expect(dodajAutora.mock.calls).toHaveLength(1)
    expect(dodajAutora.mock.calls[0][0].ime).toBe('Test Ime')
    expect(dodajAutora.mock.calls[0][0].prezime).toBe('Test Prezime')
   
})

test('Dodavanje knjige', () => {
    const autori =null
    const dodajKnjigu = jest.fn()
    const dodajAutora = jest.fn()
 
    const komponenta = render(
        <Router>
            <Routes>
                <Route exact path="/" element={<KnjigaForma dodajAutora={dodajAutora} dodajKnjigu={dodajKnjigu} autori={autori}/>}></Route>
            </Routes>
        </Router>

    )

    const nazivInput = komponenta.container.querySelector('.nazivInput')
    const autorInput = komponenta.container.querySelector('.autorInput')
    const godinaInput = komponenta.container.querySelector('.godinaInput')
    const izdavacInput = komponenta.container.querySelector('.izdavacInput')
    const knjigaForma = komponenta.container.querySelector('.knjigaForma')

    fireEvent.change(nazivInput, {
        target: { value: 'Test Naziv' }
    })
    fireEvent.change(autorInput, {
        target: { value: 'Test Auor' }
    })
    fireEvent.change(godinaInput, {
        target: { value: 2000 }
    })
    fireEvent.change(izdavacInput, {
        target: { value: 'Test Izdavac' }
    })
    

    fireEvent.submit(knjigaForma)

    expect(dodajKnjigu.mock.calls).toHaveLength(1)
    expect(dodajKnjigu.mock.calls[0][0].naziv).toBe('Test Naziv')
    expect(dodajKnjigu.mock.calls[0][0].godina).toBe("2000")
   
})


