/*=====================================================

  TODO:

  - create an rr firebase account for the prod backend
  - deploy this node app to render or similar service (myself and an rr account)
  - automate the process using cron jobs -> node-cron
  - send real emails -> node-mailer

=====================================================*/



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
  previousConnections: []
}



const rrConnect = () => {
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

  while (userQueue.length > 0) {
    const currentUser = userQueue[0]
    const partner = userQueue.find(user => !currentUser.previousConnections.includes(user.email))

    /*--------------------------------------- 
      NO PARTNER BECAUSE BEEN WITH EVERYONE
    ---------------------------------------*/
    if (!partner && userQueue.length > 1) {

      // reset their past connections
      currentUser.previousConnections = [currentUser.email]
      // update them in the db


      // SEND EMAILS WITH FALLBACK
      console.log(currentUser.name + ' HAS BEEN WITH EVERYONE, SO GETS ' + fallbackUserForOddNumberOfUsers.name)
      userQueue.splice(userQueue.indexOf(currentUser), 1);   
      continue
    }

    /*------------------------------------------ 
      ALT CASE OF ODD PERSON LEFT OUT
    ------------------------------------------*/
    if (!partner && userQueue.length === 1) {
      console.log(currentUser.name + ' IS ALONE, SO GETS ' + fallbackUserForOddNumberOfUsers.name)
      userQueue.splice(userQueue.indexOf(currentUser), 1);   
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

    /*------------------------------------ 
      CASE OF ODD PERSON LEFT OUT
    ------------------------------------*/
    if(userQueue.length === 1) {
      const currentUser = userQueue[0]

      // SEND EMAILS HERE
      console.log(currentUser.name + ' ?ALT CASE LEFT OVER? ' + fallbackUserForOddNumberOfUsers.name) 

      userQueue.splice(userQueue.indexOf(currentUser), 1); 
      continue
    }            
  }


  console.log('=======================END=====================================')
  console.log('===============================================================')
  console.log('===============================================================')
  console.log(userQueue)
  console.log('===============================================================')
  console.log('===============================================================')
  console.log('=======================END=====================================')
}



/*===================================================== 
  !!!!!!!!!!!!!!!!!!RUN THE PROGRAM!!!!!!!!!!!!!!!!!!
=====================================================*/

rrConnect()

/*===================================================== 
  !!!!!!!!!!!!!!!!!!RUN THE PROGRAM!!!!!!!!!!!!!!!!!!
=====================================================*/



/*
  NOTE FROM FRIDAY:

    I got the pairing logic down, and it is handling all cases.

    next up I need to update the database with each run and make
    sure that the previous connections are updating properly,
    and reseting when someone runs out of people to pair with. 
*/