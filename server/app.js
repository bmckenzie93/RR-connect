/*=====================================================

  TODO:

  - create an rr firebase account for the prod backend
  - deploy this node app to render or similar service (myself and an rr account)
  - automate the process using cron jobs -> node-cron
  - send real emails -> node-mailer
  - ability to generate reports from time frames

=====================================================*/



/*=====================================================
  INIT APP
=====================================================*/
const express = require('express')
const dotenv = require('dotenv').config()
const nodemailer = require("nodemailer")
const port = process.env.PORT || 5001

const app = express()
app.listen(port, () => console.log(`Server started on port  ${port}`))




/*=====================================================
  GLOBAL VARIABLES
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
  previousConnections: [],
  createdAt: '',
  updatedAt: ''
}



/*=====================================================
  UPDATE PREVIOUS CONNECTIONS
=====================================================*/
const updatePreviousConnections = async (user) => {
  try {
    const response = await fetch(DB_URL)
    const users = await response.json()

    if (!response.ok) {
      throw new Error('Sorry, something went wrong..')
    }

    let userKeyToUpdate
    for(const key in users) {
      if(users[key].email === user.email) {
        userKeyToUpdate = key
        break
      }
    }
    if(userKeyToUpdate) {
      const updateURL = `https://custom-http-hook-5f423-default-rtdb.firebaseio.com/rr-connect-users/${userKeyToUpdate}.json`
      const updateResponse = await fetch(
        updateURL,
        {
          method: 'PATCH',
          body: JSON.stringify({
            previousConnections: user.previousConnections,
            updatedAt: Date.now().toLocaleString('en-US', { timeZone: 'UTC' }),
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

    if (!updateResponse.ok) {
      throw new Error('Sorry, something went wrong..')
    }
  }

  } catch (err) {
    console.log(err)
  }
}




const rrConnect = async () => {
  /*=====================================================
    FETCH OPT IN USERS FROM DB
  =====================================================*/
  let activeUsers = []

  const fetchActiveUsers = async () => {
    const response = await fetch(DB_URL)
    const allUsers = await response.json()
    let usersArray = []
    
    for(const key in allUsers){
      usersArray.push(allUsers[key])  
    }

    usersArray.forEach(user => {
      if(user.optIn) {
        activeUsers.push(user) 
      }
    }) 
  }
  await fetchActiveUsers() 

  // dummyUsers.forEach(user => {
  //   if(user.optIn) {
  //     activeUsers.push(user)
  //   }
  // })



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
    PAIR OPT IN USERS
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
      updatePreviousConnections(currentUser)


      // SEND EMAILS WITH FALLBACK
      console.log(currentUser.name + ' HAS BEEN WITH EVERYONE, SO GETS ' + fallbackUserForOddNumberOfUsers.name)
      userQueue.splice(userQueue.indexOf(currentUser), 1);   
      continue
    }

    /*------------------------------------------ 
      ALT CASE OF ODD PERSON LEFT OUT
    ------------------------------------------*/
    if (!partner && userQueue.length === 1) {

      // SEND EMAILS WITH FALLBACK
      console.log(currentUser.name + ' IS ALONE, SO GETS ' + fallbackUserForOddNumberOfUsers.name)
      userQueue.splice(userQueue.indexOf(currentUser), 1);   
      continue
    } 



    /*=====================================================
      PAIR SUCCESSFULL, SEND EMAILS
    =====================================================*/
    console.log(currentUser.name + ' and ' + partner.name)



    /*===================================================== 
      UPDATE PAIRED USERS PREVIOUS CONNECTIONS
    =====================================================*/
    currentUser.previousConnections.push(partner.email);
    partner.previousConnections.push(currentUser.email);

    // update them both in the db here
    updatePreviousConnections(currentUser)
    updatePreviousConnections(partner)


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
    

  console.log('=====================START=====================================')
  console.log('===============================================================')
  console.log('===============================================================')
  console.log(activeUsers)
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
  NOTE FROM MONDAY:

    Previous connections are updating properly
    and resetting once everyone is full. 
*/

const sendEmail = () => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  
  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: "bar@example.com, baz@example.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    //
    // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
    //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
    //       <https://github.com/forwardemail/preview-email>
    //
  }
  
  main().catch(console.error);
}