import useInput from '../../hooks/use-input'

const LoginForm = ({onGrantPermission}) => {
  let formIsValid = false

  /*=====================================================
    INPUT STATE
  =====================================================*/
  const {
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    hasError: passwordInputHasError,
    handleValueChange: handlePasswordChange,
    handleInputBlur: handlePasswordBlur,
    handleResetInput: handlePasswordReset
  } = useInput(value => value.trim() !== '')

  if(enteredPasswordIsValid) { formIsValid = true }

  /*=====================================================
    INSECURE PASSWORD FOR ILLUSION OF SECURITY
  =====================================================*/
  const handleLogIn = (e) => {
    e.preventDefault()
    
    if (enteredPassword.trim().toLowerCase() === 'root') {
      onGrantPermission()
    }
  }

  /*=====================================================
    TOGGLE VALID INPUT CLASSNAMES
  =====================================================*/
  const passwordInputClasses = passwordInputHasError
    ? 'form-control invalid'
    : 'form-control'

  return (
    <form className='form' onSubmit={handleLogIn}>
      <div className='input-group full'>
        <label className='label required' htmlFor="password">Password</label>
        <input
          type="password" 
          id="password" 
          placeholder='Password'
          onChange={handlePasswordChange}
          onBlur={handlePasswordBlur}
          value={enteredPassword} 
          className={passwordInputClasses}
        />
        {passwordInputHasError && (
          <p className='error-text'>Please enter a valid password</p>
        )}
      </div>
      <div className='input-group full'>
        <input type="submit" value="submit" id="submit" />
      </div>
    </form>
  )
}

export default LoginForm