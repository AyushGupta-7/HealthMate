import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import API from '../services/api'
import './MyAppointments.css'

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCancelConfirm, setShowCancelConfirm] = useState(null)
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(null)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await API.get('/appointments')
      if (response.data.success) {
        setAppointments(response.data.data || [])
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
      setMessage({ type: 'error', text: 'Failed to load appointments' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } finally {
      setLoading(false)
    }
  }

  const handlePayClick = (appointment) => {
    setShowPaymentConfirm(appointment)
  }

  const handleConfirmPayment = async (appointment) => {
    try {
      setShowPaymentConfirm(null)
      setMessage({ type: 'info', text: 'Processing payment...' })
      
      const response = await API.put(`/appointments/${appointment._id}/pay`)
      
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Payment successful!' })
        fetchAppointments() // Refresh the list
      }
    } catch (error) {
      console.error('Payment error:', error)
      setMessage({ type: 'error', text: error.response?.data?.message || 'Payment failed' })
    } finally {
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }
  }

  const handleCancelPayment = () => {
    setShowPaymentConfirm(null)
  }

  const handleCancelClick = (appointmentId) => {
    setShowCancelConfirm(appointmentId)
  }

  const handleConfirmCancel = async (appointmentId) => {
    try {
      const response = await API.put(`/appointments/${appointmentId}/cancel`)
      
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Appointment cancelled successfully' })
        fetchAppointments()
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to cancel appointment' })
    } finally {
      setShowCancelConfirm(null)
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }
  }

  const handleCancelCancel = () => {
    setShowCancelConfirm(null)
  }

  const getStatusButton = (appointment) => {
    if (appointment.status === 'cancelled') {
      return <span className="status-cancelled">Cancelled</span>
    }
    if (appointment.status === 'paid') {
      return <span className="status-paid">Paid</span>
    }
    if (appointment.status === 'completed') {
      return <span className="status-completed">Completed</span>
    }
    return (
      <>
        <button className="btn-pay" onClick={() => handlePayClick(appointment)}>
          Pay Online
        </button>
        <button className="btn-cancel" onClick={() => handleCancelClick(appointment._id)}>
          Cancel appointment
        </button>
      </>
    )
  }

  if (loading) {
    return (
      <Layout>
        <div className="my-appointments-page">
          <div className="appointments-container">
            <div className="loading-spinner">Loading appointments...</div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="my-appointments-page">
        <div className="appointments-container">
          <h1 className="page-title">My appointments</h1>

          {message.text && (
            <div className={`message-alert ${message.type}`}>
              {message.type === 'success' ? '✓' : message.type === 'error' ? '⚠️' : 'ℹ️'} {message.text}
            </div>
          )}

          {appointments.length === 0 ? (
            <div className="no-appointments">
              <p>No appointments booked yet.</p>
              <button onClick={() => window.location.href = '/doctors'}>
                Book an Appointment
              </button>
            </div>
          ) : (
            <div className="appointments-list">
              {appointments.map((appointment) => (
                <div className="appointment-card" key={appointment._id}>
                  <div className="appointment-image">
                    <img 
                      src={appointment.doctorImage || '/default-doctor.png'} 
                      alt={appointment.doctorName}
                      onError={(e) => { e.target.src = '/default-doctor.png' }}
                    />
                  </div>
                  <div className="appointment-details">
                    <h3>{appointment.doctorName}</h3>
                    <p className="specialty">{appointment.doctorSpecialty}</p>
                    <p className="address">Address: {appointment.doctorAddress}</p>
                    <p className="datetime">Date & Time: {appointment.date} | {appointment.time}</p>
                    <p className="fee">Fee: ₹{appointment.fee}</p>
                  </div>
                  <div className="appointment-actions">
                    {getStatusButton(appointment)}
                  </div>

                  {/* Cancel Confirmation Modal */}
                  {showCancelConfirm === appointment._id && (
                    <div className="confirm-overlay" onClick={handleCancelCancel}>
                      <div className="confirm-modal" onClick={e => e.stopPropagation()}>
                        <div className="confirm-icon">⚠️</div>
                        <h3>Cancel Appointment</h3>
                        <p>Are you sure you want to cancel this appointment?</p>
                        <p className="confirm-warning">This action cannot be undone.</p>
                        <div className="confirm-buttons">
                          <button className="confirm-no" onClick={handleCancelCancel}>No, Go Back</button>
                          <button className="confirm-yes" onClick={() => handleConfirmCancel(appointment._id)}>Yes, Cancel</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Confirmation Modal */}
                  {showPaymentConfirm === appointment && (
                    <div className="confirm-overlay" onClick={handleCancelPayment}>
                      <div className="confirm-modal" onClick={e => e.stopPropagation()}>
                        <div className="confirm-icon">💰</div>
                        <h3>Confirm Payment</h3>
                        <p>Do you want to make a payment of <strong>₹{appointment.fee}</strong> for</p>
                        <p className="payment-details">{appointment.doctorName} on {appointment.date} at {appointment.time}?</p>
                        <div className="confirm-buttons">
                          <button className="confirm-no" onClick={handleCancelPayment}>No</button>
                          <button className="confirm-yes" onClick={() => handleConfirmPayment(appointment)}>Yes, Pay Now</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default MyAppointments