import { useState, useEffect, useRef } from 'react'
import useInput from '../../hooks/use-input'


const OptForm = ({ optOut, onShowWelcomeForm }) => {
  const [users, setUsers] = useState([])
  const [isOptingOut, setIsOptingOut] = useState(optOut)
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
    INPUT STATE
  =====================================================*/
  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: emailInputHasError,
    handleValueChange: handleEmailChange,
    handleInputBlur: handleEmailBlur,
    handleResetInput: handleEmailReset
  } = useInput(value => value.includes('@rrpartners.com'))

  if(enteredEmailIsValid) { formIsValid = true }

  /*=====================================================
    OPT IN/OUT EXISTING USER
  =====================================================*/
  const handleOptUser = async (e) => {
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
      
      let userKeyToOpt
      for(const key in users) {
        if(users[key].email === enteredEmail.trim().toLowerCase()) {
          userKeyToOpt = key
          break
        }
      }
      
      const newOptHistory = [ ...users[userKeyToOpt].optHistory,`
        ${optOut
          ? `opt out: ${dateString}` 
          : `opt in: ${dateString}`
        }`
      ]
      
      if(userKeyToOpt) {
        const optURL = `${DB_URL}/${userKeyToOpt}.json`
        const optResponse = await fetch(
          optURL,
          {
            method: 'PATCH',
            body: JSON.stringify({
              optIn: !optOut,
              updatedAt: dateString,
              optHistory: newOptHistory
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )

      if (!optResponse.ok) {
        throw new Error('Sorry, something went wrong..')
      }

      setShowSuccess(true)
    }

    } catch (err) {
      setError(err.message || 'Sorry, something went wrong..');
    }
  }

  /*=====================================================
    TOGGLE VALID INPUT CLASSNAME
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


      <form className='form' onSubmit={handleOptUser}>
      {!showSuccess && (<>
        <div className='input-group'>
          <label className='label' htmlFor="email">
            {optOut 
              ? 'Enter your email here to OPT OUT of RRconnect'
              : 'Enter your email here to OPT IN to RRconnect'
            }
            
          </label>
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
            <p className='error-text'>Please enter a valid R&R Partners email address</p>
          )}
        </div>
        <div className="input-group">
          <input 
            type="submit" 
            value={optOut
              ? 'opt out'
              : 'opt in'
            } 
            id="submit" />
        </div>
      </>)}

      {showSuccess && (<>
        {optOut 
          ? <p className='success-text'>You have been opt out of RR Connect</p>
          : <>
              <p className='success-text'>
                You have been opt into RR Connect
              </p>
              <p className='success-text'>
                Come back any time and fill out the form to opt back in!</p>
            </>
          }
        </>)}
        <button type='button' className='success-text' onClick={onShowWelcomeForm}>&lt; back</button>
      </form>
    </>
  )
}

export default OptForm 