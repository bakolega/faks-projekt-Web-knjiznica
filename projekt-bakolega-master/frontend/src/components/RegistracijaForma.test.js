import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import RegistracijaForma from './RegistracijaForma'

test('Ako ispunimo sve inpute', () => {
    const registriraj = jest.fn()

    const komponenta = render(
        <RegistracijaForma registriraj={registriraj} />
    )

    const usernameInput = komponenta.container.querySelector('.username')
    const usernameIme = komponenta.container.querySelector('.ime')
    const usernamePassword = komponenta.container.querySelector('.password')
    const forma = komponenta.container.querySelector('form')

    fireEvent.change(usernameInput, {
        target: { value: 'Test Username' }
    })
    fireEvent.change(usernameIme, {
        target: { value: 'Test Ime' }
    })
    fireEvent.change(usernamePassword, {
        target: { value: 'Test Password' }
    })
    fireEvent.submit(forma)
    /* const button = komponenta.getByText('Registriaj se')
    fireEvent.click(button) */

    expect(registriraj.mock.calls).toHaveLength(1)
    expect(registriraj.mock.calls[0][0]).toBe('Test Username')
    expect(registriraj.mock.calls[0][1]).toBe('Test Ime')
    expect(registriraj.mock.calls[0][2]).toBe('Test Password')
})

test('Ako ne ispunimo sve inpute', () => {
    const registriraj = jest.fn()

    const komponenta = render(
        <RegistracijaForma registriraj={registriraj} />
    )

    const usernameInput = komponenta.container.querySelector('.username')
    const usernameIme = komponenta.container.querySelector('.ime')
    const usernamePassword = komponenta.container.querySelector('.password')
    const forma = komponenta.container.querySelector('form')

    fireEvent.change(usernameInput, {
        target: { value: '' }
    })
    fireEvent.change(usernameIme, {
        target: { value: '' }
    })
    fireEvent.change(usernamePassword, {
        target: { value: '' }
    })
    fireEvent.submit(forma)
    /* const button = komponenta.getByText('Registriaj se')
    fireEvent.click(button) */

    expect(registriraj.mock.calls).toHaveLength(0)
})