/*=====================================================

  TODO:

  - break forms into seperate components
  - make one function for opt in/ opt out user
  - add fancy comments to the react files
  - allow them to update their entries? edit mode?
  - eventually use auth? passwords?

  - create a stats page
  -- current opt in users
  -- users opt in this month
  

=====================================================*/

import { useState } from 'react'

import Container from './components/UI/Container/Container'
import WelcomeForm from './components/WelcomeForm/WelcomeForm'

function App() {

  return (
    <>
      <h1 className='main-header'>RR Connect App</h1>
      <Container>
        <WelcomeForm />
      </Container>
    </>
  )
}

export default App
