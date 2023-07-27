import { useState, useEffect, useRef } from 'react'
import useInput from '../../hooks/use-input'


const OptForm = ({ optOut }) => {
  /*=====================================================
    COMPONENT STATES
  =====================================================*/
  const [users, setUsers] = useState([])
  const [isOptingOut, setIsOptingOut] = useState(optOut)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState(null);

  /*=====================================================
    VARIABLES
  =====================================================*/
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
    INPUT STATE
  =====================================================*/
  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: emailInputHasError,
    handleValueChange: handleEmailChange,
    handleInputBlur: handleEmailBlur,
    handleResetInput: handleEmailReset
  } = useInput(value => value.includes('@'))

  if(enteredEmailIsValid) { formIsValid = true }

  /*=====================================================
    OPT-OUT EXISTING USER
  =====================================================*/
  const handleOptOutUser = async (e) => {
    e.preventDefault()
    
    if(!enteredEmailIsValid) return 
    
    const userExists = users.some(user => user.email === enteredEmail.trim().toLowerCase())
    
    if(!userExists) {
      alert('That email does not exist in our system')
      handleEmailReset()
      emailRef.current.focus()
      return
    } 
    
    const date = new Date()
    const dateString = date.toLocaleString('en-US', { timeZone: 'UTC' })
    
    try {
      const response = await fetch(`${DB_URL}.json`)
      const users = await response.json()
      
      if (!response.ok) {
        throw new Error('Sorry, something went wrong..')
      }
      
      let userKeyToOptOut
      for(const key in users) {
        if(users[key].email === enteredEmail.trim().toLowerCase()) {
          userKeyToOptOut = key
          break
        }
      }
      
      const newOptHistory = [ ...users[userKeyToOptOut].optHistory,`opt out: ${dateString}` ]

      if(userKeyToOptOut) {
        const optOutURL = `${DB_URL}/${userKeyToOptOut}.json`
        const optOutResponse = await fetch(
          optOutURL,
          {
            method: 'PATCH',
            body: JSON.stringify({
              optIn: false,
              updatedAt: dateString,
              optHistory: newOptHistory
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )

      if (!optOutResponse.ok) {
        throw new Error('Sorry, something went wrong..')
      }

      setShowSuccess(true)
    }

    } catch (err) {
      setError(err.message || 'Sorry, something went wrong..');
    }
  }

  /*=====================================================
    OPT-IN EXISTING USER
  =====================================================*/
  const handleOptInUser = async (e) => {
    e.preventDefault()

    if(!enteredEmailIsValid) return 

    const userExists = users.some(user => user.email === enteredEmail.trim().toLowerCase())
    // TODO: if user is already opt in, stop it

    if(!userExists) {
      alert('That email does not exist in our system')
      handleEmailReset()
      emailRef.current.focus()
      return
    } 

    const date = new Date()
    const dateString = date.toLocaleString('en-US', { timeZone: 'UTC' })

    try {
      const response = await fetch(`${DB_URL}.json`)
      const users = await response.json()

      if (!response.ok) {
        throw new Error('Sorry, something went wrong..')
      }

      let userKeyToOptIn
      for(const key in users) {
        if(users[key].email === enteredEmail.trim().toLowerCase()) {
          userKeyToOptIn = key
          break
        }
      }

      const newOptHistory = [ ...users[userKeyToOptIn].optHistory,`opt in: ${dateString}` ]

      if(userKeyToOptIn) {
        const optOutURL = `${DB_URL}/${userKeyToOptIn}.json`
        const optInResponse = await fetch(
          optOutURL,
          {
            method: 'PATCH',
            body: JSON.stringify({
              optIn: true,
              updatedAt: dateString,
              optHistory: newOptHistory
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )

      if (!optInResponse.ok) {
        throw new Error('Sorry, something went wrong..')
      }

      setShowSuccess(true)
    }

    } catch (err) {
      setError(err.message || 'Sorry, something went wrong..');
    }
  }

  /*=====================================================
    TOGGLE VALID INPUT CLASSNAMES
  =====================================================*/
  const emailInputClasses = emailInputHasError
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

      {isOptingOut && 
        <form className='form' onSubmit={handleOptOutUser}>
        {!showSuccess && (<>
          <div className='input-group'>
            <label className='label' htmlFor="email">Enter your email here to OPT-OUT of RRconnect</label>
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
          <div className="input-group">
            <input type="submit" value="opt out" id="submit" />
          </div>
          <p className='success-text' onClick={() => {setIsOptingOut(false), setIsOptingIn(false), setShowSuccess(false)}}>&lt; back</p>
        </>)}

        {showSuccess && (<>
          <p className='success-text'>
            You have been opt-out from RRconnect.
          </p>
          <p className='success-text'>
            Come back any time and fill out the form to opt back in!
          </p>
          <p className='success-text' onClick={() => {setIsOptingOut(false), setIsOptingIn(false), setShowSuccess(false)}}>&lt; back</p>
        </>)}
      </form>}

      {!isOptingOut && 
        <form className='form' onSubmit={handleOptInUser}>
        {!showSuccess && (<>
          <div className='input-group'>
            <label className='label' htmlFor="email">Enter your email here to Opt back IN to RRconnect</label>
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
          <div className="input-group">
            <input type="submit" value="opt in" id="submit" />
          </div>
          <p className='success-text' onClick={() => {setIsOptingOut(false), setIsOptingIn(false), setShowSuccess(false)}}>&lt; back</p>
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
      </form>}
    </>
  )
}

export default OptForm 