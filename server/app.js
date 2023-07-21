/*=====================================================
  INIT APP
=====================================================*/
const express = require('express')
const app = express()

/*=====================================================
  MY GLOBAL VARIABLES
=====================================================*/
const DB_URL = 'https://custom-http-hook-5f423-default-rtdb.firebaseio.com/rr-connect-users.json'
const dummyUsers = require('./DUMMY_USERS/dummyUsers')
const fallbackUserForOddNumberOfUsers = {
  name: 'FALLBACK VOLUNTEER',
  email: 'FALLBACK@rrpartners.com',
  job: 'FALLBACK',
  pillar: 'atlas',
  location: 'AZ',
  joy: 'coding',
  passion: 'coding',
  secret: 'none',
  optIn: true,
  pastConnections: []
}

/*=====================================================
  FETCH OPT IN USERS FROM DB
=====================================================*/
let activeUsers = []

// const fetchActiveUsers = async () => {
//   const response = await fetch(DB_URL)
//   const allUsers = await response.json()
  
//   allUsers.forEach(user => {
//     if(user.optedIn) {
//       activeUsers.push(user)
//     }
//   })
// }
// fetchActiveUsers()

dummyUsers.forEach(user => {
  if(user.optIn) {
    activeUsers.push(user)
  }
})

/*=====================================================
  SHUFFLE OPT IN USERS
=====================================================*/
const shuffledUsers = [...activeUsers]
let i = shuffledUsers.length
let randomNum;
let randomIndexValue;

while(--i > 0){ // count down from end of arry
  randomNum = Math.floor(Math.random() * (i + 1)) // random num between 0 and i
  randomIndexValue = shuffledUsers[randomNum] // hold the chosen value for a moment
  shuffledUsers[randomNum] = shuffledUsers[i] // give chosen value to i
  shuffledUsers[i] = randomIndexValue // give i's original value to chosen index
}

/*=====================================================
  PAIR USERS
=====================================================*/
const userQueue = [...shuffledUsers]

while (userQueue.length > 1) {
  const currentUser = userQueue[0]
  const partner = userQueue.find(user => !currentUser.previousConnections.includes(user.email))

  if (!partner) {
    // If no partner found for the current user, 
    // it means they have been paired with everyone in the array.
    // In this case, we'll reset them with 0 past connections.
    currentUser.previousConnections = []
    const partner = userQueue.find(user => !currentUser.previousConnections.includes(user.email))
    continue
  }

/*=====================================================
  SEND EMAILS
=====================================================*/
  console.log(currentUser.name + ' and ' + partner.name)

/*=====================================================
  UPDATE PAIRED USERS PREVIOUS CONNECTIONS
=====================================================*/
  currentUser.previousConnections.push(partner.email);
  partner.previousConnections.push(currentUser.email);
  // update them both in the db here

  // Remove both users from the array
  userQueue.splice(userQueue.indexOf(currentUser), 1);
  userQueue.splice(userQueue.indexOf(partner), 1);

/*=====================================================
  HANDLE CASE OF LEFT OVER PERSON
=====================================================*/
  if(userQueue.length === 1) {
    const currentUser = userQueue[0]

    console.log(currentUser.name + ' and ' + fallbackUserForOddNumberOfUsers.name)
  }
}


console.log('===============================================================')
console.log('===============================================================')
console.log('===============================================================')
// console.log(userQueue)
console.log('===============================================================')
console.log('===============================================================')
console.log('===============================================================')

