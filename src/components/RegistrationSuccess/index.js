import {Link} from 'react-router-dom'
import {FaCheckCircle} from 'react-icons/fa'
import './index.css'

const RegistrationSuccess = () => {
  return (
    <div className="success-page-container">
      <div className="success-card">
        <FaCheckCircle className="success-icon" />
        <h1 className="success-heading">Registration Successful!</h1>
        <p className="success-message">
          Your account has been created successfully. You can now log in.
        </p>

        <Link to="/login">
          <button className="login-button">Go to Login</button>
        </Link>
      </div>
    </div>
  )
}

export default RegistrationSuccess