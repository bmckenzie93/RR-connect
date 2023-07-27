import { useState } from 'react'
import Container from '../components/UI/Container/Container'
import WelcomeForm from '../components/WelcomeForm/WelcomeForm'
import OptForm from '../components/OptForm/OptForm'
import StatsPage from '../components/StatsPage/StatsPage'

const Home = () => {
  const [showWelcomeForm, setShowWelcomeForm] = useState(true)
  const [showStatsPage, setShowStatsPage] = useState(false)
  const [optForm, setOptForm] = useState({
    show: false,
    optOut: true
  })

  const handleShowWelcomeForm = () => {
    setShowWelcomeForm(true)
    setOptForm({ show: false, optOut: true })
  }

  const handleShowOptOutForm = () => {
    setShowWelcomeForm(false)

    setOptForm({
      show: true,
      optOut: true
    })
  }

  const handleShowOptInForm = () => {
    setShowWelcomeForm(false)

    setOptForm({
      show: true,
      optOut: false
    })
  }


  return (<>
    <h1 className='main-header'>RR Connect App</h1>
    <Container>
      {showWelcomeForm && <WelcomeForm 
        onShowOptOutForm={handleShowOptOutForm}
        onShowOptInForm={handleShowOptInForm} />
      }

      {optForm.show && <OptForm 
      optOut={optForm.optOut} 
      onShowWelcomeForm={handleShowWelcomeForm}
      />}

      {showStatsPage && <StatsPage />}
    </Container>
  </>)
}

export default Home