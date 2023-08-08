/*=====================================================

  TODO:

  - show non required fields contitionally in email
  - change environment variables after switching firebase accounts on netlify
  - store and deploy from an rr github repo
  - maybe show list of all users in the reports with the ability to delete bad ones
  - plug in official cron-job schedule
  - style email blast and scheduled emails
  - establish a real fallback user

=====================================================*/



/*=====================================================
  INIT APP
=====================================================*/
const express = require('express')
const dotenv = require('dotenv').config()
const nodemailer = require('nodemailer')
const cron = require('node-cron')
const fetch = require('node-fetch')
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
  const bodyText = `Thank you for opting-in to RRconnect. Your Connection: Name: ${partnerUserObj.name} Email: ${partnerUserObj.email} Location: ${partnerUserObj.location} Pillar: ${partnerUserObj.pillar} Job Title: ${partnerUserObj.job} About Them: ${partnerUserObj.aboutYou} Fun fact: ${partnerUserObj.funFact}`
  const bodyHtml = `
    <table style="background:black; color:white; width: 100vw; height: 100vh;">
      <tr>
        <td>
          <img src="https://rr-connect.netlify.app/assets/rr-connect-d33be0ef.svg">
        </td>
      </tr>

      <tr style="padding: 0 20px;">
        <td>
          <h1>
            <b>
              Thank you for opting-in to<br>RRconnect.
            </b>
            </h1>
        </td>
      </tr>
      
      <tr style="padding: 0 20px;">
        <td>
          <b>Your connection:</b>
        </td>
      </tr>

      <tr style="padding: 0 20px;">
        <td>
          <ul>
            <li>Name: ${partnerUserObj.name}</li>
            <li>Email: ${partnerUserObj.email}</li>
            <li>Job Title: ${partnerUserObj.job}</li>
            <li>Pillar: ${partnerUserObj.pillar}</li>
            <li>Location: ${partnerUserObj.location}</li>
            <li>About: ${partnerUserObj.aboutYou}</li>
            <li>Fun Fact: ${partnerUserObj.funFact}</li>
          </ul>
        </td>
      </tr>
    </table>
  `

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: '',
      pass: ''
    },
    tls: {
      ciphers:'SSLv3'
    }
  });  
  

  async function main() {
    const info = await transporter.sendMail({
      from: `"RR Connect" <noreply@rrconnect.com>`,
      to: recipientUserObj.email,
      subject: "RR Connect",
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
      console.log(currentUser.name + ' HAS BEEN WITH EVERYONE, SO GETS ' + fallbackUserForOddNumberOfUsers.name + ' and their previous connections reset to zero..')
      sendEmail(currentUser, fallbackUserForOddNumberOfUsers)
      sendEmail(fallbackUserForOddNumberOfUsers, currentUser)
      
      userQueue.splice(userQueue.indexOf(currentUser), 1);   
      continue
    }

    /*------------------------------------------ 
      ALT CASE OF ODD PERSON LEFT OUT
    ------------------------------------------*/
    if (!partner && userQueue.length === 1) {

      // SEND EMAILS WITH FALLBACK
      console.log(currentUser.name + ' IS ALONE, SO GETS ' + fallbackUserForOddNumberOfUsers.name)
      sendEmail(currentUser, fallbackUserForOddNumberOfUsers)
      sendEmail(fallbackUserForOddNumberOfUsers, currentUser)

      userQueue.splice(userQueue.indexOf(currentUser), 1);   
      continue
    } 



    /*=====================================================
      PAIR SUCCESSFULL, SEND EMAILS
    =====================================================*/
    console.log(currentUser.name + ' and ' + partner.name)
    sendEmail(currentUser, partner)
    sendEmail(partner, currentUser)


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
      console.log(currentUser.name + ' ALT CASE LEFT OVER, SO GETS ' + fallbackUserForOddNumberOfUsers.name) 
      sendEmail(currentUser, fallbackUserForOddNumberOfUsers)
      sendEmail(fallbackUserForOddNumberOfUsers, currentUser)

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
// cron.schedule("0 * * * *", ()=> rrConnect())
rrConnect()