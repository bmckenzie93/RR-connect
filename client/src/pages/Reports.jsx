import { useState, useEffect } from 'react'
import Container from '../components/UI/Container/Container'
import MainHeader from '../components/UI/MainHeader/MainHeader'
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
  const totalEmailsSent = users.reduce((total, user) => total + user.emailsReceived, 0)

  const currentOptInUsers = users.filter(user => user.optIn)
  const currentOptOutUsers = users.filter(user => !user.optIn)
  const totalUserTable = users.map(user => {
    const [name, domain] = user.email.split('@')
    const [date, time] = user.createdAt.split(', ')
    return (
      <tr key={name}>
        <td>{name.replace('.', ' ')}</td>
        <td>{date}</td>
        <td>{user.optIn ? 'Opt-In' : 'Opt-Out'}</td>
        <td>{user.emailsReceived}</td>
      </tr>
    )
  })

  /*=====================================================
    EXPORT USERS DATA AS CSV
  =====================================================*/
  const handleExportData = () => {
    const csvHeader = 'Name, Sign-up Date, Opt Status, Emails Received\n'
    const csvContent = users.map(user => {
      const [name, domain] = user.email.split('@')
      const [date, time] = user.createdAt.split(', ')
      return `${name.replace('.', ' ')},${date},${user.optIn ? 'Opt-In' : 'Opt-Out'},${user.emailsReceived}`
    }).join("\n");

    const csvData = csvHeader + csvContent;
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.download = "rrconnect-users.csv";
    link.href = url;
    link.click();
  }

  return (
    <Container>
      <MainHeader />
      {!isLoggedIn && <LoginForm onGrantPermission={handleGrantPermission} />}

      {isLoggedIn && (<>
        <h2>Total Users: {totalNumberOfUsers}</h2>
        <h2>Total Opt-In Users: {currentOptInUsers.length}</h2>
        <h2>Total Opt-Out Users: {currentOptOutUsers.length}</h2>
        <h2>Total Emails Sent: {totalEmailsSent}</h2>

        <table border='2'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Sign-up Date</th>
              <th>Opt Status</th>
              <th>Emails Received</th>
            </tr>
          </thead>
          <tbody>
            {totalUserTable}
          </tbody>
        </table>

        <div className="button-group">
          <button className='btn' onClick={handleExportData}>Export Table</button>
        </div>
      </>)}
    </Container>
  )
}

export default Reports