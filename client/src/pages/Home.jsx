import { useState } from 'react'
import Container from '../components/UI/Container/Container'
import MainHeader from '../components/UI/MainHeader/MainHeader'
import Hero from '../components/UI/Hero/Hero'
import WelcomeForm from '../components/WelcomeForm/WelcomeForm'
import OptForm from '../components/OptForm/OptForm'

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


  return (
    <Container>
      <MainHeader />
      
      {showWelcomeForm && <WelcomeForm 
        onShowOptOutForm={handleShowOptOutForm}
        onShowOptInForm={handleShowOptInForm} />
      }

      {optForm.show && <OptForm 
      optOut={optForm.optOut} 
      onShowWelcomeForm={handleShowWelcomeForm}
      />}
    </Container>
  )
}

export default Home