# RR-connect


Vite React JS Front End:
New users can opt into RR connect using a 'welcome form'.
Existing users can opt-out and opt-in using another 'opt form'.
Users are stored inside a Firebase 'Realtime Database'.
Front end is hosted on netlify using 'Continuous Deployment' from the github repo main branch.



Node JS Backend:
All users are fetched from the database using 'node-fetch'.
Each opt-in user is paired with another random opt-in user.
Both users are sent an introduction email using 'node-mailer'.
App runs repeatedly on a set schedule using 'node-cron'.
A user will not be paired with the same partner twice, unless they have previously been paired with everybody.
A volunteer 'fallback user' will be paired with any odd person left out.


R&R Internal Ubuntu Server: 'Ubuntu51' 
The script is kept running using the 'forever' node package.
'forever start app.js'
'forever stop app.js'