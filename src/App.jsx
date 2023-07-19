import { useState } from 'react'

import Container from './components/UI/Container/Container'
import WelcomeForm from './components/WelcomeForm/WelcomeForm'

function App() {
  const [count, setCount] = useState(0)

  return (
    // opt in form
    // opt out form
    // pair each user from the database with a random person
    // handle case of odd users ( a default person to get the odd person = Dan Freeman)
    // send email to each person in database, telling them who they are paired with
    // fire off twice a month automatically

    <>
      <h1 className='main-header'>RR Connect App</h1>
      <Container>
        <WelcomeForm />
      </Container>
    </>
  )
}

export default App
