import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import PlatiClanarinuButton from './PlatiClanarinuButton'
import { act } from 'react-dom/test-utils';

test('Plati clanarinu button', () => {
    const clanarinaUplata = jest.fn()
    const korisnikId = "TestKorinsikId"
    const clanarinaIstece = new Date("2023-06-06T22:00:00.000Z")

    const komponenta = render(
        <PlatiClanarinuButton korisnikId={korisnikId} clanarinaRok={clanarinaIstece} clanarinaUplata={clanarinaUplata} />
    )
    const button = komponenta.container.querySelector('button')
    fireEvent.click(button)

    expect(clanarinaUplata.mock.calls).toHaveLength(1)
    expect(clanarinaUplata.mock.calls[0][0]).toEqual(clanarinaIstece)
    expect(clanarinaUplata.mock.calls[0][1]).toEqual(korisnikId)

})
