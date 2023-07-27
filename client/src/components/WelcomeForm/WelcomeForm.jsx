import { useState, useEffect, useRef } from 'react'
import useInput from '../../hooks/use-input'


const WelcomeForm = (props) => {
  const [users, setUsers] = useState([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState(null);

  const DB_URL = import.meta.env.VITE_DB_URL
  const emailRef = useRef()
  let formIsValid = false

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
    INPUT STATES
  =====================================================*/
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
    value: enteredHobbies,
    isValid: enteredHobbiesIsValid,
    hasError: hobbiesInputHasError,
    handleValueChange: handleHobbiesChange,
    handleInputBlur: handleHobbiesBlur,
    handleResetInput: handleHobbiesReset
  } = useInput(value => value.trim() !== '')

  const {
    value: enteredPassions,
    isValid: enteredPassionsIsValid,
    hasError: passionsInputHasError,
    handleValueChange: handlePassionsChange,
    handleInputBlur: handlePassionsBlur,
    handleResetInput: handlePassionsReset
  } = useInput(value => value.trim() !== '')

  const {
    value: enteredFunFact,
    isValid: enteredFunFactIsValid,
    hasError: funFactInputHasError,
    handleValueChange: handleFunFactChange,
    handleInputBlur: handleFunFactBlur,
    handleResetInput: handleFunFactReset
  } = useInput(value => value.trim() !== '')

  if( 
    enteredNameIsValid &&
    enteredEmailIsValid &&
    enteredLocationIsValid &&
    enteredPillarIsValid &&
    enteredJobIsValid &&
    enteredHobbiesIsValid &&
    enteredPassionsIsValid &&
    enteredFunFactIsValid 
  ) { formIsValid = true }

  /*=====================================================
    SUBMIT NEW USER
  =====================================================*/
  const handleSubmitNewUser = async (e) => {
    e.preventDefault()
    
    if(
      !enteredNameIsValid ||
      !enteredEmailIsValid ||
      !enteredLocationIsValid ||
      !enteredPillarIsValid ||
      !enteredJobIsValid ||
      !enteredHobbiesIsValid ||
      !enteredPassionsIsValid ||
      !enteredFunFactIsValid 
    ) { return }

    const userExists = users.some(user => user.email === enteredEmail.trim().toLowerCase())

    if(userExists) {
      alert('this email is already in the db')
      handleEmailReset()
      emailRef.current.focus()
      return
    } 

    const date = new Date()
    const dateString = date.toLocaleString('en-US', { timeZone: 'UTC' })

    try {
      const response = await fetch(
        `${DB_URL}.json`,
        {
          method: 'POST',
          body: JSON.stringify({
            email: enteredEmail.trim().toLowerCase(),
            name: enteredName.trim(),
            location: enteredLocation.trim(),
            pillar: enteredPillar,
            job: enteredJob.trim(),
            hobbies: enteredHobbies.trim(),
            passions: enteredPassions.trim(),
            funFact: enteredFunFact.trim(),
            optIn: true,
            previousConnections: [enteredEmail.trim().toLowerCase()],
            createdAt: dateString,
            updatedAt: dateString,
            optHistory: [`opt in: ${dateString}`]
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

  /*=====================================================
    TOGGLE VALID INPUT CLASSNAMES
  =====================================================*/
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

    const hobbiesInputClasses = hobbiesInputHasError
    ? 'form-control invalid'
    : 'form-control'

    const passionsInputClasses = passionsInputHasError
    ? 'form-control invalid'
    : 'form-control'

    const funFactInputClasses = funFactInputHasError
    ? 'form-control invalid'
    : 'form-control'


    
  return ( 
    <> 
      <header className='header'>
        <p>Thank you for opting-in to RRconnect.</p>
        <p>(I dont think we should thank them yet, they might think they are already opt in when reading this paragraph and not fill out the form below. Maybe we should say 'fill in the form below to opt in'..)</p>
        <p>Twice a month you will receive an email that randomly assigns you to another R&R employee. You can meet via teams and chat.</p>
        <p>Once the program beings, you will receive $15 of Recognize points to use in the revamped Recognize Rewards store.</p>
        <p>Answering these questions is completely voluntary, but we highly encourage you to share your interests, hobbies, and experiences to foster meaningful connections and strengthen bonds.</p>
      </header>

      <form className='form' onSubmit={handleSubmitNewUser}>
        {!showSuccess && (<>
        <div className="form-row">
          <div className='input-group'>
            <label className='label' htmlFor="name">Name*</label>
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
            <label className='label' htmlFor="email">Work Email*</label>
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
        </div>

        <div className="form-row">
          <div className='input-group'>
            <label className='label' htmlFor="job">Job Title*</label>
            <input
              type="text" 
              id="job" 
              onChange={handleJobChange}
              onBlur={handleJobBlur}
              value={enteredJob} 
              className={jobInputClasses} 
            />
            {jobInputHasError && (
              <p className='error-text'>Please enter a valid job title</p>
            )}
          </div>

          <div className='input-group'>
            <label className='label' htmlFor="pillar">Pillar*</label>
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
        </div>

        <div className="form-row">
          <div className='input-group'>
            <label className='label' htmlFor="location">Location</label>
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
            <p className='label'>EXISTING USERS can opt out and in here:</p>

            <div className="radio-group">
              <button
                type='button'
                className='radio-badge'
                onClick={props.onShowOptOutForm}>
                  Opt Out
              </button>
              <button 
                type='button'
                className='radio-badge'
                onClick={props.onShowOptInForm}>
                  Opt In
                </button>
            </div>
          </div>
        </div>

          <div className='input-group'>
            <label className='label' htmlFor="hobbies">What are some of your hobbies?</label>
            <textarea 
              id="hobbies" 
              cols="30" 
              rows="10"
              onChange={handleHobbiesChange}
              onBlur={handleHobbiesBlur}
              value={enteredHobbies} 
              className={hobbiesInputClasses} 
            ></textarea>
            {hobbiesInputHasError && (
              <p className='error-text'>Please enter some hobbies</p>
            )}
          </div>

          <div className='input-group'>
            <label className='label' htmlFor="passions">What passions do you have?</label>
            <textarea
            id="passions" 
            onChange={handlePassionsChange}
            onBlur={handlePassionsBlur}
            value={enteredPassions} 
            className={passionsInputClasses} 
            ></textarea>
          {passionsInputHasError && (
            <p className='error-text'>Please enter some valid passions</p>
          )}
          </div>

          <div className='input-group'>
            <label className='label' htmlFor="funFact">What is something most people don't know about you?</label>
            <textarea
            id="funFact" 
            cols="30" 
            rows="10"
            onChange={handleFunFactChange}
            onBlur={handleFunFactBlur}
            value={enteredFunFact} 
            className={funFactInputClasses} 
            ></textarea>
            {funFactInputHasError && (
              <p className='error-text'>Please enter a valid Fun Fact</p>
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