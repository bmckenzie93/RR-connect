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
      <form className='form' onSubmit={handleOptUser}>
      {!showSuccess && (<>
        <div className='form-hero'>
          {isOptingOut && (<>
            <h1>
              Existing users can opt-out here.
            </h1>
            <p>
              We are sorry to see you go. You can always opt-in again whenever you are ready, we would love to have you back!
            </p>
          </>)}
          {!isOptingOut && (<>
            <h1>
              Existing users can opt back in here.
            </h1>
            <p>
              Welcome back!
            </p>
          </>)}
        </div>

        <div className='input-group'>
          <label className='label' htmlFor="email">
            {optOut 
              ? 'Enter your email to opt-out'
              : 'Enter your email to opt-in'
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
          ? <p className='success-text'>You have been opt-out of RR Connect</p>
          : <p className='success-text'>You have been opt-in to RR Connect</p>
          }
        </>)}
        <div className="input-group">
          <button type='button' className='success-text' onClick={onShowWelcomeForm}>back</button>
        </div>
      </form>
    </>
  )
}

export default OptForm 