import { useState } from 'react'

import styles from './WelcomeForm.module.css'

const WelcomeForm = () => {
  // initial opt in state
  // opt out state
  const [] = useState()



  const handleSubmit = (e) => {
    e.preventDefault()
    // validate all inputs
    // check for duplicate eamil, this email alread exists..
    // post user to firebase
    // fetch users from firebase and pair them
    // send email to them both introducing eachother
    alert('submit does nothing so far, but will soon!')
  }

  return (
    <>
      <header className={styles.header}>
        <p>Thank you for opting-in to RRconnect.</p>
        <p>Twice a month you will receive an email that randomly assigns you to another R&R employee. You can meet via teams and chat.</p>
        <p>Once the program beings, you will receive $15 of Recognize points to use in the revamped Recognize Rewards store.</p>
        <p>Answering these questions is completely voluntary, but we highly encourage you to share your interests, hobbies, and experiences to foster meaningful connections and strengthen bonds.</p>
        <p><b>If you would like to opt out at any time, click <a href="#">here</a> and enter your email.</b> 
        <br /> you can always opt back in using the form below.</p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles['input-group']}>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" />
        </div>
        <div className={styles['input-group']}>
          <label htmlFor="email">Work Email</label>
          <input type="email" id="email" name="email" />
        </div>
        <div className={styles['input-group']}>
          <label htmlFor="location">Location</label>
          <input type="text" id="location" name="location" />
        </div>
        <div className={styles['input-group']}>
          <label htmlFor="pillar">Pillar</label>
          <select name="pillar" id="pillar">
            <option disabled defaultValue value></option>
            <option value="atlas">Atlas</option>
            <option value="something">Something</option>
            <option value="travel">Travel</option>
          </select>
        </div>
        <div className={styles['input-group']}>
          <label htmlFor="job">Job Title</label>
          <input type="text" id="job" name="job" />
        </div>
        <div className={styles['input-group']}>
          <label htmlFor="joy">What brings you joy?</label>
          <textarea name="joy" id="joy" cols="30" rows="10"></textarea>
        </div>
        <div className={styles['input-group']}>
          <label htmlFor="passions">What passions do you have?</label>
          <textarea name="passions" id="passions" cols="30" rows="10"></textarea>
        </div>
        <div className={styles['input-group']}>
          <label htmlFor="secret">What is something most people don't know about you?</label>
          <textarea name="secret" id="secret" cols="30" rows="10"></textarea>
        </div>
        <div className={styles['input-group']}>
          <input type="submit" value="submit" id="submit" />
        </div>
      </form>
    </>
  )
}

export default WelcomeForm