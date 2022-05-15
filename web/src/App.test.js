import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import  App from './App'
import { HashRouter } from "react-router-dom"

test('Testa renderização da página', () => {
  const { container, getByText } = render(
    <HashRouter>
      <App />
    </HashRouter>
  )
  expect(container.innerHTML).toMatch('Base')
})
