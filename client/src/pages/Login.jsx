import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../services/api'
import './Login.css'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

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

    if (message.text) {
      setMessage({ type: '', text: '' })
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
      setMessage({ type: '', text: '' })
      setErrors({})
      
      // Admin login check - should redirect to /admin/dashboard, NOT /admin/login
if (formData.email === ADMIN_EMAIL && formData.password === ADMIN_PASSWORD) {
  localStorage.setItem('token', 'admin-token');
  localStorage.setItem('userRole', 'admin');
  localStorage.setItem('userName', 'Admin User');
  localStorage.setItem('userEmail', formData.email);
  
  setMessage({ type: 'success', text: 'Admin login successful! Redirecting...' });
  
  setTimeout(() => {
    navigate('/admin/dashboard');  // Make sure this is /admin/dashboard
  }, 1500);
  setLoading(false);
  return;
}
      
      // Regular user login - try API
      try {
        const response = await API.post('/auth/login', {
          email: formData.email,
          password: formData.password
        })
        
        const { token, data } = response.data
        
        // Store token and user data
        localStorage.setItem('token', token)
        localStorage.setItem('userName', data.name)
        localStorage.setItem('userEmail', data.email)
        localStorage.setItem('userId', data._id)
        localStorage.setItem('userRole', data.role || 'user')
        
        // Handle remember me
        if (rememberMe) {
          localStorage.setItem('savedEmail', formData.email)
        } else {
          localStorage.removeItem('savedEmail')
        }
        
        setMessage({ type: 'success', text: 'Login successful! Redirecting...' })
        
        // Redirect based on role
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
        
        // Show specific error messages
        if (errorMessage.toLowerCase().includes('user not found') || 
            errorMessage.toLowerCase().includes('no account found')) {
          setErrors({ email: 'Email does not exist' })
          setMessage({ 
            type: 'error', 
            text: 'Email does not exist. Please check your email or sign up.' 
          })
        } else if (errorMessage.toLowerCase().includes('incorrect password') || 
                   errorMessage.toLowerCase().includes('wrong password')) {
          setErrors({ password: 'Invalid password' })
          setMessage({ 
            type: 'error', 
            text: 'Invalid password. Please try again.' 
          })
        } else {
          setMessage({ 
            type: 'error', 
            text: errorMessage
          })
        }
        
        // Clear error messages after 2 seconds
        setTimeout(() => {
          setMessage({ type: '', text: '' })
          setErrors({})
        }, 2000)
      } finally {
        setLoading(false)
      }
    } else {
      setErrors(newErrors)
      setMessage({ type: 'error', text: 'Please fix the errors above' })
      setTimeout(() => {
        setMessage({ type: '', text: '' })
        setErrors({})
      }, 2000)
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

          {message.text && (
            <div className={`message-alert ${message.type}`}>
              {message.type === 'success' ? '✓' : '⚠️'} {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
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
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
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
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
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