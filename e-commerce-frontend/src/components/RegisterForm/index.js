import {Component} from 'react'
import './index.css'

class RegisterForm extends Component {
  state = {
    firstName:'',
    lastName:'',
    username: '',
    newPassword: '',
    confirmPassword:'',
    showSubmitError: false,
    errorMsg: '',
    firstNameErrMsg:'',
    lastNameErrMsg:'',
    usernameErrMsg:'',
    newPasswordErrMsg:'',
    confirmPasswordErrMsg:'',
    passwordMatchErrMsg:''

  }

 onChangeFirstName = event => {
  this.setState({firstName: event.target.value})
}

onChangeLastName = event => {
  this.setState({lastName: event.target.value})
}

onChangeUsername = event => {
  this.setState({username: event.target.value})
}

onChangeNewPassword = event => {
  this.setState({newPassword: event.target.value})
}

onChangeConfirmPassword = event => {
  this.setState({confirmPassword: event.target.value})
}

validate=()=>{
  const {firstName,lastName,username,newPassword,confirmPassword}=this.state 
  if(firstName.trim()===''){
    this.setState({firstNameErrMsg:'Invalid first name'});
  }
  else{
    this.setState({firstNameErrMsg:''})
  }
  if(lastName.trim()===''){
    this.setState({lastNameErrMsg:'Invalid last name'});
  }
  else{
    this.setState({lastNameErrMsg:''})
  }
  if(username.trim()===''){
    this.setState({usernameErrMsg:'Invalid username'})
  }
  else{
    this.setState({usernameErrMsg:''})
  }
  if(newPassword.trim()===''){
    this.setState({newPasswordErrMsg:'Inavalid new password'});
  }
  else{
    this.setState({newPasswordErrMsg:''})
  }
  if(confirmPassword.trim()===''){
    this.setState({confirmPasswordErrMsg:'Invalid confirm password'})
  }
  else{
    this.setState({confirmPasswordErrMsg:''})
  }
  
  if(firstName.trim()==='' || lastName.trim()==='' || username.trim()==='' || newPassword.trim()==='' || confirmPassword.trim()===''){
    return false; 
  }
  else{
    if(newPassword===confirmPassword){
      this.setState({passwordMatchErrMsg:''})
      return true; 
    }
    else{
      this.setState({passwordMatchErrMsg:'New Password and Confirm Password must match'})
      return false; 
    }
  }
  

}

initialState=()=>{
  this.setState({
    firstName:'',
    lastName:'',
    username: '',
    newPassword: '',
    confirmPassword:'',
    showSubmitError: false,
    errorMsg: '',
    firstNameErrMsg:'',
    lastNameErrMsg:'',
    usernameErrMsg:'',
    newPasswordErrMsg:'',
    confirmPasswordErrMsg:'',
    passwordMatchErrMsg:''
  })
}

onFormSubmit=async (event)=>{
  event.preventDefault();
  const isValid=this.validate();
  const {firstName,lastName,username,newPassword}=this.state 
  if(isValid){
    const userDetails={firstName,lastName,username,password:newPassword}
    // const URL='http://localhost:5000/auth/register'; 
    const URL='https://e-commerce-app-production-df04.up.railway.app/auth/register'
    const options={
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Accept':'application/json',
      },
      body:JSON.stringify(userDetails) 
    }
    const response=await fetch(URL,options); 
    const data=await response.json(); 
    if(response.ok===true){
      this.initialState();
      const {history}=this.props; 
      history.push('/registration-success')
    }
    else{
      this.initialState();
      this.setState({errorMsg:data.error_msg,showSubmitError:true}); 
    }
    
  } 
}



   renderFirstNameField=()=>{
    const {firstName,firstNameErrMsg}=this.state; 

     return (
      <>
        <label className="input-label" htmlFor="firstName">
          FIRST NAME
        </label>
        <input
          type="text"
          id="firstName"
          className="password-input-field"
          value={firstName}
          onChange={this.onChangeFirstName}
          placeholder="Enter First Name"
        />
        {firstNameErrMsg && <p className="error-message">{firstNameErrMsg}</p>}
      </>
    )

  }
  
  renderLastNameField=()=>{
    const {lastName,lastNameErrMsg}=this.state; 

     return (
      <>
        <label className="input-label" htmlFor="lastName">
          LAST NAME
        </label>
        <input
          type="text"
          id="lastName"
          className="password-input-field"
          value={lastName}
          onChange={this.onChangeLastName}
          placeholder="Enter Last Name"
        />
        {lastNameErrMsg && <p className="error-message">{lastNameErrMsg}</p>}
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

  renderNewPasswordField = () => {
    const {newPassword,newPasswordErrMsg} = this.state

    return (
      <>
        <label className="input-label" htmlFor="newPassword">
          PASSWORD
        </label>
        <input
          type="password"
          id="newPassword"
          className="password-input-field"
          value={newPassword}
          onChange={this.onChangeNewPassword}
          placeholder="Enter New Password"
        />
        {newPasswordErrMsg && <p className="error-message">{newPasswordErrMsg}</p>}
      </>
    )
  }

  renderConfirmPasswordField = () => {
    const {confirmPassword,confirmPasswordErrMsg} = this.state

    return (
      <>
        <label className="input-label" htmlFor="confirmPassword">
          CONFIRM PASSWORD
        </label>
        <input
          type="password"
          id="confirmPassword"
          className="password-input-field"
          value={confirmPassword}
          onChange={this.onChangeConfirmPassword}
          placeholder="Enter Confirm Password"
        />
        {confirmPasswordErrMsg && <p className="error-message">{confirmPasswordErrMsg}</p>}
      </>
    )
  }

  render() {
    const {errorMsg,showSubmitError,passwordMatchErrMsg}=this.state 
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
        <form className="form-container" onSubmit={this.onFormSubmit} >
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
            className="login-website-logo-desktop-img"
            alt="website logo"
          />
          <div className="input-container">{this.renderFirstNameField()}</div>
          <div className="input-container">{this.renderLastNameField()}</div>
          <div className="input-container">{this.renderUsernameField()}</div>
          <div className="input-container">{this.renderNewPasswordField()}</div>
          <div className="input-container">{this.renderConfirmPasswordField()}</div>
          {passwordMatchErrMsg && <p className="error-message">{passwordMatchErrMsg}</p>}
          <button type="submit" className="login-button">
            Register
          </button>
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}
export default RegisterForm; 
