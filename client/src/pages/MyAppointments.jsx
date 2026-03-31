import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import './MyAppointments.css'

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const [showCancelConfirm, setShowCancelConfirm] = useState(null)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    const savedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]')
    // Sort by date (newest first) and keep only last 7
    const sortedAppointments = savedAppointments.sort((a, b) => b.id - a.id)
    const last7Appointments = sortedAppointments.slice(0, 7)
    setAppointments(last7Appointments)
    // Update localStorage with only last 7
    localStorage.setItem('appointments', JSON.stringify(last7Appointments))
  }, [])

  const handlePayOnline = (appointmentId) => {
    setMessage({ type: 'success', text: 'Payment gateway will be integrated here' })
    const updatedAppointments = appointments.map(apt =>
      apt.id === appointmentId ? { ...apt, status: 'paid' } : apt
    )
    setAppointments(updatedAppointments)
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments))
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  const handleCancelClick = (appointmentId) => {
    setShowCancelConfirm(appointmentId)
  }

  const handleConfirmCancel = (appointmentId) => {
    const updatedAppointments = appointments.map(apt =>
      apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
    )
    setAppointments(updatedAppointments)
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments))
    setMessage({ type: 'warning', text: 'Appointment cancelled successfully' })
    setShowCancelConfirm(null)
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
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
        <button className="btn-pay" onClick={() => handlePayOnline(appointment.id)}>
          Pay Online
        </button>
        <button className="btn-cancel" onClick={() => handleCancelClick(appointment.id)}>
          Cancel appointment
        </button>
      </>
    )
  }

  return (
    <Layout>
      <div className="my-appointments-page">
        <div className="appointments-container">
          <h1 className="page-title">My appointments</h1>

          {/* Message Alert */}
          {message.text && (
            <div className={`message-alert ${message.type}`}>
              {message.type === 'success' ? '✓' : '⚠️'} {message.text}
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
                <div className="appointment-card" key={appointment.id}>
                  <div className="appointment-image">
                    <img src={appointment.doctorImage} alt={appointment.doctorName} />
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
                  {showCancelConfirm === appointment.id && (
                    <div className="cancel-confirm-overlay">
                      <div className="cancel-confirm-modal">
                        <p>Are you sure you want to cancel this appointment?</p>
                        <div className="cancel-confirm-buttons">
                          <button 
                            className="confirm-yes" 
                            onClick={() => handleConfirmCancel(appointment.id)}
                          >
                            Yes, Cancel
                          </button>
                          <button 
                            className="confirm-no" 
                            onClick={handleCancelCancel}
                          >
                            No, Go Back
                          </button>
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