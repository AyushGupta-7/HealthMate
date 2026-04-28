import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../services/api'
import './Signup.css'

// Import PNG icons
import userIcon from '../assets/icons/user.png'
import mailIcon from '../assets/icons/mail.png'
import padlockIcon from '../assets/icons/padlock.png'
import confirmPassIcon from '../assets/icons/approve.png'
import eyeIcon from '../assets/icons/eye.png'
import hideIcon from '../assets/icons/hide.png'

const Signup = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [redirectMsg, setRedirectMsg] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    if (redirectMsg) {
      setRedirectMsg('')
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name) {
      newErrors.name = 'Full name is required'
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter'
    } else if (!/(?=.*[0-9])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true)
      setErrors({})
      setRedirectMsg('')
      
      try {
        const response = await API.post('/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
        
        const { token, data } = response.data
        
        localStorage.setItem('token', token)
        localStorage.setItem('userName', data.name)
        localStorage.setItem('userEmail', data.email)
        localStorage.setItem('userId', data._id)
        localStorage.setItem('userRole', data.role || 'user')
        
        setRedirectMsg('✓ Account created successfully! Redirecting to dashboard...')
        
        setTimeout(() => {
          navigate('/dashboard')
        }, 1500)
      } catch (error) {
        console.error('Signup error:', error)
        
        const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.'
        
        if (errorMessage.toLowerCase().includes('user already exists')) {
          setErrors({ email: 'Email already registered' })
        } else {
          setErrors({ general: errorMessage })
        }
        
        setTimeout(() => {
          setErrors({})
        }, 5000)
      } finally {
        setLoading(false)
      }
    } else {
      setErrors(newErrors)
      setTimeout(() => setErrors({}), 5000)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container signup-container">
        <div className="auth-card">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <div className="logo-wrapper">
                <h2>HealthMate</h2>
              </div>
            </Link>
            <h3>Create Account</h3>
            <p>Join HealthMate to start your health journey</p>
          </div>

          {errors.general && <div className="error-text">{errors.general}</div>}
          {redirectMsg && <div className="redirect-msg">{redirectMsg}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-wrapper">
                <img src={userIcon} alt="user" className="input-icon" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={errors.name ? 'error' : ''}
                />
              </div>
              {errors.name && <div className="error-text">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <img src={mailIcon} alt="email" className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={errors.email ? 'error' : ''}
                />
              </div>
              {errors.email && <div className="error-text">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <img src={padlockIcon} alt="password" className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className={errors.password ? 'error' : ''}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <img src={showPassword ? eyeIcon : hideIcon} alt="toggle" className="toggle-icon" />
                </button>
              </div>
              {errors.password && <div className="error-text">{errors.password}</div>}
              <div className="password-hint">
                <small>Password must be at least 6 characters with 1 uppercase and 1 number</small>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <img src={confirmPassIcon} alt="confirm" className="input-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={errors.confirmPassword ? 'error' : ''}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <img src={showConfirmPassword ? eyeIcon : hideIcon} alt="toggle" className="toggle-icon" />
                </button>
              </div>
              {errors.confirmPassword && <div className="error-text">{errors.confirmPassword}</div>}
            </div>

            <div className="form-terms">
              <label className="checkbox-label">
                <input type="checkbox" required />
                <span>I agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a></span>
              </label>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login" className="auth-link">Login here</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup