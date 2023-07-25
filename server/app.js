/*=====================================================

  TODO:

  - create an rr firebase account for the prod backend
  - ability to generate reports from given time frames or periodicly
    maybe in its own db table or something
  - handle empty hobbies and passions

=====================================================*/



/*=====================================================
  INIT APP
=====================================================*/
const express = require('express')
const dotenv = require('dotenv').config()
const nodemailer = require("nodemailer")
const cron = require('node-cron')
const port = process.env.PORT || 5001

const app = express()
app.listen(port, () => console.log(`Server started on port ${port}`))




/*=====================================================
  GLOBAL VARIABLES
=====================================================*/
const DB_URL = process.env.DB_URL
const dummyUsers = require('./DUMMY_USERS/dummyUsers')
const fallbackUserForOddNumberOfUsers = {
  name: 'FALLBACK VOLUNTEER',
  email: 'brandon.mckenzie@rrpartners.com',
  job: 'FALLBACK',
  pillar: 'atlas',
  location: 'FB',
  hobbies: 'falling back',
  passions: 'fall and backs',
  funFact: 'fell back',
  optIn: true,
  previousConnections: [],
  createdAt: '',
  updatedAt: ''
}



/*=====================================================
  UPDATE PREVIOUS CONNECTIONS FUNCTION
=====================================================*/
const updatePreviousConnections = async (user) => {
  try {
    const response = await fetch(`${DB_URL}.json`)
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
      const updateURL = `${DB_URL}/${userKeyToUpdate}.json`
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



/*=====================================================
  SEND EMAIL FUNCTION
=====================================================*/
const sendEmail = (recipientUserObj, partnerUserObj) => {
  const bodyText = `Thank you for opting-in to RRconnect. Below is the person you have been randomly assigned to connect with over the next two weeks. We suggest you reach out and schedule a Teams meeting or call to get to know one another. YOUR CONNECTION: Name: ${partnerUserObj.name} Location: ${partnerUserObj.location} Pillar: ${partnerUserObj.pillar} Job Title: ${partnerUserObj.job} Hobbies: ${partnerUserObj.joy} Passions: ${partnerUserObj.passions} Fun fact: ${partnerUserObj.funFact}`
  const bodyHtml = `
    <h1>Thank you for opting-in to RRconnect.</h1>
    <p>Below is the person you have been randomly assigned to connect with over the next two weeks.</p>
    <p>We suggest you reach out and schedule a Teams meeting or call to get to know one another.</p>
    <br></br>
    <h2>Your Connection:</h2>
    <ul>
      <li>Name: ${partnerUserObj.name}</li>
      <li>Location: ${partnerUserObj.location}</li>
      <li>Pillar: ${partnerUserObj.pillar}</li>
      <li>Job Title: ${partnerUserObj.job}</li>
      <li>Hobbies: ${partnerUserObj.hobbies}</li>
      <li>Passions: ${partnerUserObj.passions}</li>
      <li>Fun fact: ${partnerUserObj.funFact}</li>
    </ul>
  `


  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });  
  

  async function main() {
    const info = await transporter.sendMail({
      from: `"RR Connect Test" <no-reply@rrconnect.com>`,
      to: recipientUserObj.email,
      subject: "RR Connect Test",
      text: bodyText,
      html: bodyHtml, 
    });
  
    console.log("Message sent: %s", info.messageId);
  }
  
  main().catch(console.error);
}


/*===================================================== 
!!!!!!!!!!!!!!!!!! RR CONNECT APP !!!!!!!!!!!!!!!!!!
=====================================================*/
const rrConnect = async () => {
  console.log('=======================START===========================')
  console.log('=======================START===========================')
  console.log('=======================START===========================')
  /*=====================================================
    FETCH OPT IN USERS FROM DB
  =====================================================*/
  let activeUsers = []

  const fetchActiveUsers = async () => {
    const response = await fetch(`${DB_URL}.json`)
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
    PAIR USERS, SEND EMAILS
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
      // console.log(currentUser.name + ' HAS BEEN WITH EVERYONE, SO GETS ' + fallbackUserForOddNumberOfUsers.name)
      sendEmail(currentUser, fallbackUserForOddNumberOfUsers)
      
      userQueue.splice(userQueue.indexOf(currentUser), 1);   
      continue
    }

    /*------------------------------------------ 
      ALT CASE OF ODD PERSON LEFT OUT
    ------------------------------------------*/
    if (!partner && userQueue.length === 1) {

      // SEND EMAILS WITH FALLBACK
      // console.log(currentUser.name + ' IS ALONE, SO GETS ' + fallbackUserForOddNumberOfUsers.name)
      sendEmail(currentUser, fallbackUserForOddNumberOfUsers)

      userQueue.splice(userQueue.indexOf(currentUser), 1);   
      continue
    } 



    /*=====================================================
      PAIR SUCCESSFULL, SEND EMAILS
    =====================================================*/
    // console.log(currentUser.name + ' and ' + partner.name)
    sendEmail(currentUser, fallbackUserForOddNumberOfUsers)


    /*===================================================== 
      UPDATE PAIRED USERS' PREVIOUS CONNECTIONS
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
      // console.log(currentUser.name + ' ?ALT CASE LEFT OVER? ' + fallbackUserForOddNumberOfUsers.name) 
      sendEmail(currentUser, fallbackUserForOddNumberOfUsers)

      userQueue.splice(userQueue.indexOf(currentUser), 1); 
      continue
    }            
  }

  console.log('=======================END=============================')
  console.log('=======================END=============================')
  console.log('=======================END=============================')
} 



/*=====================================================
  SCHEDULE CRON JOB
=====================================================*/
// cron.schedule("*/10 * * * * *", ()=> rrConnect()) // runs every 4 seconds 