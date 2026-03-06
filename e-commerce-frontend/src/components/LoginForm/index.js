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
    usernameErrMsg:'',
    passwordErrMsg:''
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
    })
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  validate=(username,password)=>{
    if(username.trim()==='' && password.trim()===''){
      this.setState({usernameErrMsg:"Invalid username",passwordErrMsg:'Invalid password'})
      return false
    }
    else if (username.trim()===''){
      this.setState({usernameErrMsg:'Invalid username'});
      return false 
    }
    else if (password.trim()===''){
      this.setState({passwordErrMsg:'Invalid password'}); 
      return false
    }
    else{
      return true; 
    }
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const isValid=this.validate(username,password)
    if(isValid){
      this.setState({usernameErrMsg:'',passwordErrMsg:''})
      const userDetails = {username, password}
      //const url = 'https://apis.ccbp.in/login'
      // const url='http://localhost:5000/auth/login'
      const url='https://e-commerce-app-production-df04.up.railway.app/auth/login'
      const options = {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userDetails),
      }
      const response = await fetch(url, options)
      const data = await response.json()

      if (response.ok === true) {
        this.onSubmitSuccess(data.jwt_token)
      } else {
        this.onSubmitFailure(data.error_msg)
      }
    }
    
  }

  renderPasswordField = () => {
    const {password,passwordErrMsg} = this.state

    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="password-input-field"
          value={password}
          onChange={this.onChangePassword}
          placeholder="Password"
        />
        {passwordErrMsg&&<p className="error-message">{passwordErrMsg}</p>}
      </>
    )
  }

  renderUsernameField = () => {
    const {username,usernameErrMsg} = this.state

    return (
      <>
        <label className="input-label" htmlFor="username">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          className="username-input-field"
          value={username}
          onChange={this.onChangeUsername}
          placeholder="Username"
        />
        {usernameErrMsg && <p className="error-message">{usernameErrMsg}</p>}
      </>
    )
  }

  onRegister=()=>{
    const {history}=this.props; 
    history.push('/register'); 
  }

  render() {
    const {showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-form-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
          className="login-website-logo-mobile-img"
          alt="website logo"
        />
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-login-img.png"
          className="login-img"
          alt="website login"
        />
        <form className="form-container" onSubmit={this.submitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
            className="login-website-logo-desktop-img"
            alt="website logo"
          />
          <div className="input-container">{this.renderUsernameField()}</div>
          <div className="input-container">{this.renderPasswordField()}</div>
          <button type="submit" className="login-button">
            Login
          </button>
          <button onClick={this.onRegister} className="login-button">
            Register
          </button>

          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default LoginForm
