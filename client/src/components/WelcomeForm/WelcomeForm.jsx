import { useState, useEffect, useRef } from 'react'
import useInput from '../../hooks/use-input'
import Hero from '../UI/Hero/Hero'


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
  const [showPillarPlaceholder, setShowPillarPlaceholder] = useState(true)
  const handlePillarPlaceholder = () => {
    setShowPillarPlaceholder(false)
  }

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
  } = useInput(value => value.includes('@rrpartners.com'))

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
    value: enteredAboutYou,
    isValid: enteredAboutYouIsValid,
    hasError: aboutYouInputHasError,
    handleValueChange: handleAboutYouChange,
    handleInputBlur: handleAboutYouBlur,
    handleResetInput: handleAboutYouReset
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
    enteredAboutYouIsValid &&
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
      !enteredAboutYouIsValid ||
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
            aboutYou: enteredAboutYou.trim(),
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
    const pillarStyle = showPillarPlaceholder
    ? {color:'#757575'}
    : {}

    const jobInputClasses = jobInputHasError
    ? 'form-control invalid'
    : 'form-control'

    // const aboutYouInputClasses = aboutYouInputHasError
    // ? 'form-control invalid'
    // : 'form-control'

    // const funFactInputClasses = funFactInputHasError
    // ? 'form-control invalid'
    // : 'form-control'

    
  return (
    <form className='form' onSubmit={handleSubmitNewUser}>
      {!showSuccess && (<>
        <div className='form-hero'>
          <h1>
            Thank you for opting-in to RRconnect.
          </h1>
          <p>
            Twice a month you will receive an email that randomly assigns you to another R&R employee. You can meet via teams and chat. Once the program begins, you will receive $15 of Recognize points to use in the revamped Recognize Rewards store.
          </p>
        </div>

        <div className="form-row">
          <div className='input-group'>
            <label className='label required' htmlFor="name">Name</label>
            <input
              type="text" 
              id="name" 
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              value={enteredName} 
              className={nameInputClasses}
              placeholder='First name Last name'
            />
            {nameInputHasError && (
              <p className='error-text'>Please enter a valid name</p>
            )}
          </div>

          <div className='input-group'>
            <label className='label required' htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email"
              ref={emailRef}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              value={enteredEmail}
              className={emailInputClasses} 
              placeholder='R&R Email'
            />
            {emailInputHasError && (
              <p className='error-text'>Must be a valid R&R Partners email</p>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className='input-group'>
            <label className='label required' htmlFor="job">Job Title</label>
            <input
              type="text" 
              id="job" 
              onChange={handleJobChange}
              onBlur={handleJobBlur}
              value={enteredJob} 
              className={jobInputClasses} 
              placeholder="What's on your card"
            />
            {jobInputHasError && (
              <p className='error-text'>Please enter a valid job title</p>
            )}
          </div>

          <div className='input-group'>
            <label className='label required' htmlFor="pillar">Pillar</label>
            <select  
              id="pillar" 
              onClick={handlePillarPlaceholder}
              onChange={handlePillarChange}
              onBlur={handlePillarBlur}
              defaultValue="none"
              className={pillarInputClasses} 
              style={pillarStyle}
            >
              <option disabled hidden value="none">Select Pillar</option>
              <option value="atlas">Atlas</option>
              <option value="wanderlust">Travel, Tourism & Hospitality</option>
              <option value="technovation">Technovation</option>
              <option value="purpose">Purpose</option>
            </select>
            {pillarInputHasError && (
              <p className='error-text'>Please select a pillar</p>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className='input-group'>
            <label className='label required' htmlFor="location">Location</label>
            <input
              type="text" 
              id="location" 
              onChange={handleLocationChange}
              onBlur={handleLocationBlur}
              value={enteredLocation} 
              className={locationInputClasses} 
              placeholder='LV, NV'
            />
            {locationInputHasError && (
              <p className='error-text'>Please enter a valid location</p>
            )}
          </div>

          <div className='input-group'>
            <p className='label'>existing users can opt out & in here</p>

            <div className="button-group">
              <button
                type='button'
                className='btn'
                onClick={props.onShowOptOutForm}>
                  Opt Out
              </button>
              <button 
                type='button'
                className='btn'
                onClick={props.onShowOptInForm}>
                  Opt In
                </button>
            </div>
          </div>
        </div>
        
        <p className='mid-form-text'>
          Answering these questions is completely voluntary, but we highly encourage you to share your interests, hobbies, and experiences to foster meaningful connections and strengthen bonds.
        </p>
        <p className='field-description'>
          What is something most people don't know about you? Each one of us has a unique story to tell, take this opportunity to share something surprising or intriguing about yourself that most people at R&R may not know. It could be a talent, an unusual experience, or a fascinating fact about your background.
        </p>

        <div className='input-group'>
          <label className='label' htmlFor="aboutYou">about you</label>
          <textarea
          id="aboutYou" 
          onChange={handleAboutYouChange}
          onBlur={handleAboutYouBlur}
          value={enteredAboutYou} 
          className='form-control' 
          placeholder='Tell us here'
          // className={aboutYouInputClasses} 
          ></textarea>
          {/* {aboutYouInputHasError && (
            <p className='error-text'>Please enter some valid passions</p>
          )} */}
        </div>

        <p className='field-description'>
          What hobbies or passions do you have? Beyond your work at R&R, we want to know more about the things that make you tick outside the office. Whether it's painting, playing a musical instrument, hiking, cooking, or any other hobby or passion, feel free to share what you love to do when you're not at work.
        </p>

        <div className='input-group'>
          <label className='label' htmlFor="funFact">fun fact</label>
          <textarea
          id="funFact" 
          onChange={handleFunFactChange}
          onBlur={handleFunFactBlur}
          value={enteredFunFact} 
          className='form-control' 
          placeholder='Tell us here'
          // className={funFactInputClasses}
          ></textarea>
          {/* {funFactInputHasError && (
            <p className='error-text'>Please enter a valid Fun Fact</p>
          )} */}
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
  )
}

export default WelcomeForm 