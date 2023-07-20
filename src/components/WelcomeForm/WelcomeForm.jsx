import { useState } from 'react'
import useInput from '../../hooks/use-input'


const WelcomeForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOptingOut, setIsOptingOut] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState(null);
  let formIsValid = false

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

  if(
    enteredNameIsValid &&
    enteredEmailIsValid &&
    enteredLocationIsValid &&
    enteredPillarIsValid 
  ) { formIsValid = true }


  const handleSubmitNewUser = async (e) => {
    e.preventDefault()
    alert('hold your horses, i\'m still building the site!')
    return;

    if(
      !enteredNameIsValid ||
      !enteredEmailIsValid ||
      !enteredLocationIsValid
    ) { return; }


    setIsLoading(true)
    try {
      const response = await fetch(
        'https://custom-http-hook-5f423-default-rtdb.firebaseio.com/rr-connect-users.json',
        {
          method: 'POST',
          body: JSON.stringify(), // user object in here
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Sorry, something went wrong..');
      }

      const data = await response.json();

    } catch (err) {
      setError(err.message || 'Sorry, something went wrong..');
    }

    handleNameReset()
    handleEmailReset()
    setIsLoading(false);
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



  return (
    <>
      <header className='header'>
        <p>Thank you for opting-in to RRconnect.</p>
        <p>Twice a month you will receive an email that randomly assigns you to another R&R employee. You can meet via teams and chat.</p>
        <p>Once the program beings, you will receive $15 of Recognize points to use in the revamped Recognize Rewards store.</p>
        <p>Answering these questions is completely voluntary, but we highly encourage you to share your interests, hobbies, and experiences to foster meaningful connections and strengthen bonds.</p>
        <p><b>If you would like to opt out at any time, click <a href="#">here</a> and enter your email.</b> 
        <br /> you can always opt back in using the form below.</p>
      </header>

      <form className='form' onSubmit={handleSubmitNewUser}>
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
            <option value="travel">Travel</option>
          </select>
          {pillarInputHasError && (
            <p className='error-text'>Please select a pillar</p>
          )}
        </div>

        <div className='input-group'>
          <label htmlFor="job">Job Title</label>
          <input type="text" id="job" name="job" />
        </div>

        <div className='input-group'>
          <label htmlFor="joy">What brings you joy?</label>
          <textarea name="joy" id="joy" cols="30" rows="10"></textarea>
        </div>

        <div className='input-group'>
          <label htmlFor="passion">What passions do you have?</label>
          <textarea name="passion" id="passion" cols="30" rows="10"></textarea>
        </div>
        <div className='input-group'>
          <label htmlFor="secret">What is something most people don't know about you?</label>
          <textarea name="secret" id="secret" cols="30" rows="10"></textarea>
        </div>
        <div className='input-group'>
          <input type="submit" value="submit" id="submit" />
        </div>
      </form>
    </>
  )
}

export default WelcomeForm