import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import PrikazClanarine from './PrikazClanarine'

test('aa', () =>{
    const rok = new Date()


 const komponenta = render(
 <PrikazClanarine  clanariaRok={rok}/>
 )

 expect(komponenta.container).toHaveTextContent(rok.toDateString())

})
