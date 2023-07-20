import { useState, useEffect, useRef } from 'react'
import useInput from '../../hooks/use-input'


const WelcomeForm = () => {
  const [users, setUsers] = useState([])
  const [isOptingOut, setIsOptingOut] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState(null);

  const DB_URL = 'https://custom-http-hook-5f423-default-rtdb.firebaseio.com/rr-connect-users.json'
  const emailRef = useRef()
  let formIsValid = false

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(DB_URL)
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

  const {
    value: enteredName,
    isValid: enteredNameIsValid,
    hasError: nameInputHasError,
    handleValueChange: handleNameChange,
    handleInputBlur: handleNameBlur,
    handleResetInput: handleNameReset
  } = useInput(value => value.trim() !== '')

  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: emailInputHasError,
    handleValueChange: handleEmailChange,
    handleInputBlur: handleEmailBlur,
    handleResetInput: handleEmailReset
  } = useInput(value => value.includes('@'))

  const {
    value: enteredLocation,
    isValid: enteredLocationIsValid,
    hasError: locationInputHasError,
    handleValueChange: handleLocationChange,
    handleInputBlur: handleLocationBlur,
    handleResetInput: handleLocationReset
  } = useInput(value => value.trim() !== '')

  const {
    value: enteredPillar,
    isValid: enteredPillarIsValid,
    hasError: pillarInputHasError,
    handleValueChange: handlePillarChange,
    handleInputBlur: handlePillarBlur,
    handleResetInput: handlePillarReset
  } = useInput(value => value.trim() !== '')

  const {
    value: enteredJob,
    isValid: enteredJobIsValid,
    hasError: jobInputHasError,
    handleValueChange: handleJobChange,
    handleInputBlur: handleJobBlur,
    handleResetInput: handleJobReset
  } = useInput(value => value.trim() !== '')

  const {
    value: enteredJoy,
    isValid: enteredJoyIsValid,
    hasError: joyInputHasError,
    handleValueChange: handleJoyChange,
    handleInputBlur: handleJoyBlur,
    handleResetInput: handleJoyReset
  } = useInput(value => value.trim() !== '')

  const {
    value: enteredPassion,
    isValid: enteredPassionIsValid,
    hasError: passionInputHasError,
    handleValueChange: handlePassionChange,
    handleInputBlur: handlePassionBlur,
    handleResetInput: handlePassionReset
  } = useInput(value => value.trim() !== '')

  const {
    value: enteredSecret,
    isValid: enteredSecretIsValid,
    hasError: secretInputHasError,
    handleValueChange: handleSecretChange,
    handleInputBlur: handleSecretBlur,
    handleResetInput: handleSecretReset
  } = useInput(value => value.trim() !== '')

  if( 
    enteredNameIsValid &&
    enteredEmailIsValid &&
    enteredLocationIsValid &&
    enteredPillarIsValid &&
    enteredJobIsValid &&
    enteredJoyIsValid &&
    enteredPassionIsValid &&
    enteredSecretIsValid 
  ) { formIsValid = true }


  const handleSubmitNewUser = async (e) => {
    e.preventDefault()

    if(
      !enteredNameIsValid ||
      !enteredEmailIsValid ||
      !enteredLocationIsValid ||
      !enteredPillarIsValid ||
      !enteredJobIsValid ||
      !enteredJoyIsValid ||
      !enteredPassionIsValid ||
      !enteredSecretIsValid 
    ) { return }

    const userExists = users.some(user => user.email === enteredEmail.trim().toLowerCase())

    if(userExists) {
      alert('this email is already in the db')
      handleEmailReset()
      emailRef.current.focus()
      return
    } 

    try {
      const response = await fetch(
        DB_URL,
        {
          method: 'POST',
          body: JSON.stringify({
            email: enteredEmail.trim().toLowerCase(),
            name: enteredName.trim(),
            location: enteredLocation.trim(),
            pillar: enteredPillar,
            job: enteredJob.trim(),
            joy: enteredJoy.trim(),
            passion: enteredPassion.trim(),
            secret: enteredSecret.trim(),
            optedIn: true
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Sorry, something went wrong..')
      }

      const data = await response.json();

    } catch (err) {
      setError(err.message || 'Sorry, something went wrong..');
      return
    }

    setShowSuccess(true)
  }

  const nameInputClasses = nameInputHasError
    ? 'form-control invalid'
    : 'form-control'

  const emailInputClasses = emailInputHasError
    ? 'form-control invalid'
    : 'form-control'

  const locationInputClasses = locationInputHasError
    ? 'form-control invalid'
    : 'form-control'

    const pillarInputClasses = pillarInputHasError
    ? 'form-control invalid'
    : 'form-control'

    const jobInputClasses = jobInputHasError
    ? 'form-control invalid'
    : 'form-control'

    const joyInputClasses = joyInputHasError
    ? 'form-control invalid'
    : 'form-control'

    const passionInputClasses = passionInputHasError
    ? 'form-control invalid'
    : 'form-control'

    const secretInputClasses = secretInputHasError
    ? 'form-control invalid'
    : 'form-control'

  return ( 
    <> 
      <header className='header'>
        <p>Thank you for opting-in to RRconnect.</p>
        <p>(I don't think we should thank them yet, they might think they are already opt in when reading this paragraph and not fill out the form below. Maybe we should say 'fill in the form below to opt in'..)</p>
        <p>Twice a month you will receive an email that randomly assigns you to another R&R employee. You can meet via teams and chat.</p>
        <p>Once the program beings, you will receive $15 of Recognize points to use in the revamped Recognize Rewards store.</p>
        <p>Answering these questions is completely voluntary, but we highly encourage you to share your interests, hobbies, and experiences to foster meaningful connections and strengthen bonds.</p>
        <p><b>If you would like to opt out at any time, click <a href="#">here</a> and enter your email.</b> 
        <br /> you can always opt back in using the form below.</p>
      </header>

      <form className='form' onSubmit={handleSubmitNewUser}>
        {!showSuccess && (<>
          <div className='input-group'>
            <label htmlFor="name">Name*</label>
            <input
              type="text" 
              id="name" 
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              value={enteredName} 
              className={nameInputClasses} 
            />
            {nameInputHasError && (
              <p className='error-text'>Please enter a valid name</p>
            )}
          </div>

          <div className='input-group'>
            <label htmlFor="email">Work Email*</label>
            <input 
              type="email" 
              id="email"
              ref={emailRef}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              value={enteredEmail}
              className={emailInputClasses} 
            />
            {emailInputHasError && (
              <p className='error-text'>Please enter a valid email</p>
            )}
          </div>

          <div className='input-group'>
            <label htmlFor="location">Location</label>
            <input
              type="text" 
              id="location" 
              onChange={handleLocationChange}
              onBlur={handleLocationBlur}
              value={enteredLocation} 
              className={locationInputClasses} 
            />
            {locationInputHasError && (
              <p className='error-text'>Please enter a valid location</p>
            )}
          </div>

          <div className='input-group'>
            <label htmlFor="pillar">Pillar</label>
            <select  
              id="pillar" 
              onChange={handlePillarChange}
              onBlur={handlePillarBlur}
              defaultValue="none"
              className={pillarInputClasses} 
            >
              <option disabled hidden value="none"></option>
              <option value="atlas">Atlas</option>
              <option value="wanderlust">Wanderlust</option>
              <option value="travel">Travel & tourism</option>
              <option value="travel">Technovation</option>
              <option value="travel">Travel & tourism</option>
            </select>
            {pillarInputHasError && (
              <p className='error-text'>Please select a pillar</p>
            )}
          </div>

          <div className='input-group'>
            <label htmlFor="job">Job Title</label>
            <input
              type="text" 
              id="job" 
              onChange={handleJobChange}
              onBlur={handleJobBlur}
              value={enteredJob} 
              className={jobInputClasses} 
            />
            {jobInputHasError && (
              <p className='error-text'>Please enter a valid job</p>
            )}
          </div>

          <div className='input-group'>
            <label htmlFor="joy">What brings you joy?</label>
            <textarea 
              id="joy" 
              cols="30" 
              rows="10"
              onChange={handleJoyChange}
              onBlur={handleJoyBlur}
              value={enteredJoy} 
              className={joyInputClasses} 
            ></textarea>
            {joyInputHasError && (
              <p className='error-text'>Please enter a joy</p>
            )}
          </div>

          <div className='input-group'>
            <label htmlFor="passion">What passions do you have?</label>
            <textarea
            id="passion" 
            onChange={handlePassionChange}
            onBlur={handlePassionBlur}
            value={enteredPassion} 
            className={passionInputClasses} 
            ></textarea>
          {passionInputHasError && (
            <p className='error-text'>Please enter a valid passion</p>
          )}
          </div>

          <div className='input-group'>
            <label htmlFor="secret">What is something most people don't know about you?</label>
            <textarea
            id="secret" 
            cols="30" 
            rows="10"
            onChange={handleSecretChange}
            onBlur={handleSecretBlur}
            value={enteredSecret} 
            className={secretInputClasses} 
            ></textarea>
            {secretInputHasError && (
              <p className='error-text'>Please enter a valid Secret</p>
            )}
          </div>

          <div className='input-group'>
            {error && (
              <p className='error-text'>{error}</p>
            )}
            <input type="submit" value="submit" id="submit" />
          </div>
        </>)}

        {showSuccess && (<>
          <p className='success-text'>
            Thank you for opting-in to RRconnect.
          </p>
          <p className='success-text'>
            Twice a month you will receive an email that randomly assigns you to another R&R employee. You can meet via teams and chat.
          </p>
          <p className='success-text'>
            Once the program beings, you will receive $15 of Recognize points to use in the revamped Recognize Rewards store.
          </p>
        </>)}
      </form>
    </>
  )
}

export default WelcomeForm 