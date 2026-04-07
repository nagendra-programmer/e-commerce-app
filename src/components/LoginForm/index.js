import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
    usernameErrMsg: '',
    passwordErrMsg: '',
    isLoading: false,
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  useDemoCredentials = () => {
    this.setState({
      username: 'guru',
      password: '123456789',
      usernameErrMsg: '',
      passwordErrMsg: '',
    })
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg, isLoading: false})
  }

  validate = (username, password) => {
    if (username.trim() === '' && password.trim() === '') {
      this.setState({
        usernameErrMsg: 'Invalid username',
        passwordErrMsg: 'Invalid password',
      })
      return false
    } else if (username.trim() === '') {
      this.setState({usernameErrMsg: 'Invalid username'})
      return false
    } else if (password.trim() === '') {
      this.setState({passwordErrMsg: 'Invalid password'})
      return false
    }
    return true
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const isValid = this.validate(username, password)

    if (isValid) {
      this.setState({
        usernameErrMsg: '',
        passwordErrMsg: '',
        isLoading: true,
      })

      const userDetails = {username, password}

      const url =
        'https://careerconnect-backend-gx9j.onrender.com/auth/login'

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(userDetails),
        })

        const data = await response.json()

        if (response.ok) {
          this.onSubmitSuccess(data.jwt_token)
        } else {
          this.onSubmitFailure(data.err_msg)
        }
      } catch (error) {
        this.setState({
          showSubmitError: true,
          errorMsg: 'Server is starting... please try again',
          isLoading: false,
        })
      }
    }
  }

  onRegister = () => {
    const {history} = this.props
    history.push('/register')
  }

  render() {
    const {
      username,
      password,
      showSubmitError,
      errorMsg,
      isLoading,
    } = this.state

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-form-container">

        <div className="demo-credentials-card">
          <h3>Demo Credentials</h3>
          <p>Username: guru</p>
          <p>Password: 123456789</p>
          <button
            type="button"
            className="demo-btn"
            onClick={this.useDemoCredentials}
          >
            Use Demo Login
          </button>
        </div>

        {/* LOGIN FORM */}
        <form className="form-container" onSubmit={this.submitForm}>
          <label className="input-label">USERNAME</label>
          <input
            type="text"
            value={username}
            onChange={this.onChangeUsername}
            className="username-input-field"
          />

          <label className="input-label">PASSWORD</label>
          <input
            type="password"
            value={password}
            onChange={this.onChangePassword}
            className="password-input-field"
          />

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Login'}
          </button>

          <button
            type="button"
            className="login-button"
            onClick={this.onRegister}
          >
            Register
          </button>

          {showSubmitError && (
            <p className="error-message">*{errorMsg}</p>
          )}
        </form>
      </div>
    )
  }
}

export default LoginForm