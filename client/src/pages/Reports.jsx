import { useState, useEffect } from 'react'
import Container from '../components/UI/Container/Container'
import LoginForm from '../components/LoginForm/LoginForm'

const Reports = () => {
  const [users, setUsers] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const DB_URL = import.meta.env.VITE_DB_URL


  /*=====================================================
    FETCH USERS ON INITIAL LOAD
  =====================================================*/
  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`${DB_URL}.json`)
        const users = await response.json()

        if (!response.ok) {
          throw new Error('Sorry, something went wrong..')
        }

        let usersArray = []
        for(const key in users) {
          usersArray.push(users[key])
        }
        setUsers(usersArray)

      } catch (error) {
        setError(error.message || 'Sorry, something went wrong..')
      }
    })()
  },[])

  
  /*=====================================================
    INSECURE PASSWORD FOR ILLUSION OF SECURITY
  =====================================================*/
  const handleGrantPermission = () => {
    setIsLoggedIn(true)
  }


  /*=====================================================
    REPORTS LOGIC
  =====================================================*/
  const totalNumberOfUsers = users.length

  const currentOptInUsers = users.filter(user => user.optIn)
  const activeUserList = ''



  return (<>
    <h1 className='main-header'>RR Connect Reports</h1>
    <Container>
      {!isLoggedIn && <LoginForm onGrantPermission={handleGrantPermission} />}

      {isLoggedIn && (<>
        <h2>Total number of users: {totalNumberOfUsers}</h2>
        <h2>Total number of opt in users: {currentOptInUsers.length}</h2>
        <ul></ul>
      </>)}
    </Container>
  </>)
}

export default Reports