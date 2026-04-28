import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../services/api'
import './Login.css'

// Import PNG icons
import mailIcon from '../assets/icons/mail.png'
import padlockIcon from '../assets/icons/padlock.png'
import eyeIcon from '../assets/icons/eye.png'
import hideIcon from '../assets/icons/hide.png'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [redirectMsg, setRedirectMsg] = useState('')

  // Get admin credentials from environment variables
  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD

  // Load saved email if remember me was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail')
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }))
      setRememberMe(true)
    }
  }, [])

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
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
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
      
      // Admin login check
      if (formData.email === ADMIN_EMAIL && formData.password === ADMIN_PASSWORD) {
        localStorage.setItem('token', 'admin-token')
        localStorage.setItem('userRole', 'admin')
        localStorage.setItem('userName', 'Admin User')
        localStorage.setItem('userEmail', formData.email)
        
        setRedirectMsg('✓ Admin login successful! Redirecting to admin dashboard...')
        
        setTimeout(() => {
          navigate('/admin/dashboard')
        }, 1500)
        setLoading(false)
        return
      }
      
      // Regular user login - try API
      try {
        const response = await API.post('/auth/login', {
          email: formData.email,
          password: formData.password
        })
        
        const { token, data } = response.data
        
        localStorage.setItem('token', token)
        localStorage.setItem('userName', data.name)
        localStorage.setItem('userEmail', data.email)
        localStorage.setItem('userId', data._id)
        localStorage.setItem('userRole', data.role || 'user')
        
        if (rememberMe) {
          localStorage.setItem('savedEmail', formData.email)
        } else {
          localStorage.removeItem('savedEmail')
        }
        
        setRedirectMsg('✓ Login successful! Redirecting to dashboard...')
        
        setTimeout(() => {
          if (data.role === 'admin') {
            navigate('/admin/dashboard')
          } else {
            navigate('/dashboard')
          }
        }, 1500)
      } catch (error) {
        console.error('Login error:', error)
        
        const errorMessage = error.response?.data?.message || 'Login failed. Please try again.'
        
        if (errorMessage.toLowerCase().includes('user not found') || 
            errorMessage.toLowerCase().includes('no account found')) {
          setErrors({ email: 'Email does not exist' })
        } else if (errorMessage.toLowerCase().includes('incorrect password') || 
                   errorMessage.toLowerCase().includes('wrong password')) {
          setErrors({ password: 'Invalid password' })
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
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <div className="logo-wrapper">
                <h2>HealthMate</h2>
              </div>
            </Link>
            <h3>Welcome Back</h3>
            <p>Login to access your health dashboard</p>
          </div>

          {errors.general && <div className="error-text">{errors.general}</div>}
          {redirectMsg && <div className="redirect-msg">{redirectMsg}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
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
                  placeholder="Enter your password"
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
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <a href="#forgot" className="forgot-link">Forgot Password?</a>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/signup" className="auth-link">Sign up now</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login