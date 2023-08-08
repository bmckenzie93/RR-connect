/*=====================================================

  TODO:

  - deploy from rr github repo on netlify
    (change environment variables in netlify after switching repo)

  - use internal smtp 

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
  name: 'Chris Bell',
  email: 'chris.bell@rrpartners.com',
  job: 'Office Manager',
  pillar: 'atlas',
  location: 'SLC, UT',
  aboutYou: 'I was a TV director in San Francisco for years before moving to Utah.',
  funFact: 'I love camping and being in nature. If I go on vacation, it better be near water.',
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
    <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet">
        <title></title>
        <style>
          * {
            box-sizing: border-box;
          }
          html {
            background-color: black;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: 'Poppins', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: black;
            color: white;
            min-height: 100vh;
            max-width: 600px;
            font-size: 14px;
          }
          .img-container {
            max-width: 600px;
            border: 1px solid white;
            padding: 30px 0;
            width: 100vw;
            text-align: center;
          }
          img {
            display: block;
            width: 100%;
            max-width: 175px;
            margin: 0 auto;
          }
          h1 {
            margin-top: 50px;
            font-size: 30px;
          }
          ol {
            margin: 0;
            padding: 0;
            max-width: 100%;
          }
          li {
            margin: 0 0 6px 0;
            padding: 0;
          }
        </style>
      </head>
      <body>
          <table>
            <tr>
              <td class="img-container">
                <img src="https://rr-connect.netlify.app/assets/rr-connect-d33be0ef.svg">
              </td>
            </tr>
      
            <tr>
              <td>

              <h1>THIS IS A TEST, THANK YOU!</h1>



                <h1>
                  <b>
                    Thank you for opting-in to<br>RRconnect.
                  </b>
                  </h1>
              </td>
            </tr>
            
            <tr>
              <td style="padding-bottom: 30px;">
                <b>Your connection:</b>
              </td>
            </tr>
            <tr>&nbsp;</tr>
      
            <tr>
              <td>
                <ol>
                  <li>Name: ${partnerUserObj.name}</li>
                  <li>Email: <a style="color: #FFE74F;" href="mailto:${partnerUserObj.email}">${partnerUserObj.email}</a></li>
                  <li>Job Title: ${partnerUserObj.job}</li>
                  <li>Pillar: ${partnerUserObj.pillar}</li>
                  <li>Location: ${partnerUserObj.location}</li>
                  <li>About: ${partnerUserObj.aboutYou}</li>
                  <li>Fun Fact: ${partnerUserObj.funFact}</li>
                </ol>
              </td>
            </tr>
          </table>
      </body>
    </html>
  `

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: '!important2C#@!'
    }
  });  
  

  async function main() {
    const info = await transporter.sendMail({
      from: `"RR Connect" <brandon.mckenzie@rrconnect.com>`,
      to: recipientUserObj.email,
      subject: "TEST: RR Connect",
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
      console.log(currentUser.name + ' HAS ALT LEFT OVER CASE, SO GETS ' + fallbackUserForOddNumberOfUsers.name) 
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
// cron.schedule('0 0 1,15 * *', ()=> rrConnect()) // Run every month on 1st and 15th.
rrConnect()
// sendEmail({email: 'brandon.mckenzie@rrpartners.com'},{email: 'brandon.mckenzie@rrpartners.com'})