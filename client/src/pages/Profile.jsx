import React, { useState, useRef } from 'react'
import Layout from '../components/Layout'
import './Profile.css'

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    fullName: "Ayush Gupta",
    email: "ayufer9@gmail.com",
    phone: "0000000000",
    address: "",
    gender: "Not Selected",
    birthday: "Not Selected"
  })
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const fileInputRef = useRef(null)

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleSaveClick = () => {
    setIsEditing(false)
    // Here you would save the data to backend
    console.log('Saved profile data:', profileData)
  }

  const handleCancelClick = () => {
    setIsEditing(false)
    // Reset to original data if needed
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfilePhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemovePhoto = () => {
    setProfilePhoto(null)
    setPhotoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handlePhotoClick = () => {
    fileInputRef.current.click()
  }

  return (
    <Layout>
      <div className="profile-page">
        <div className="profile-container">
          {/* Profile Header */}
          <div className="profile-header">
            <h1>My Profile</h1>
          </div>

          <div className="profile-content">
            {/* Left Column - Photo */}
            <div className="profile-photo-section">
              <div className="photo-container" onClick={handlePhotoClick}>
                {photoPreview ? (
                  <img src={photoPreview} alt="Profile" className="profile-photo" />
                ) : (
                  <div className="photo-placeholder">
                    <span className="camera-icon">📷</span>
                    <p>Click to upload photo</p>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </div>
              
              {/* Remove Photo Button */}
              {photoPreview && (
                <button className="remove-photo-btn" onClick={handleRemovePhoto}>
                  Remove Photo
                </button>
              )}
              
              <h2 className="profile-name">{profileData.fullName}</h2>
            </div>

            {/* Right Column - Information */}
            <div className="profile-info-section">
              {/* Contact Information */}
              <div className="info-card">
                <div className="card-header">
                  <h3>CONTACT INFORMATION</h3>
                  {!isEditing && (
                    <button className="edit-btn" onClick={handleEditClick}>
                      Edit
                    </button>
                  )}
                </div>
                
                <div className="info-content">
                  <div className="info-row">
                    <label>Full Name:</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="fullName"
                        value={profileData.fullName}
                        onChange={handleInputChange}
                        className="edit-input"
                      />
                    ) : (
                      <span>{profileData.fullName}</span>
                    )}
                  </div>

                  <div className="info-row">
                    <label>Email id:</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        className="edit-input"
                      />
                    ) : (
                      <span>{profileData.email}</span>
                    )}
                  </div>

                  <div className="info-row">
                    <label>Phone:</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        className="edit-input"
                      />
                    ) : (
                      <span>{profileData.phone}</span>
                    )}
                  </div>

                  <div className="info-row">
                    <label>Address:</label>
                    {isEditing ? (
                      <textarea
                        name="address"
                        value={profileData.address}
                        onChange={handleInputChange}
                        className="edit-textarea"
                        rows="3"
                        placeholder="Enter your address"
                      />
                    ) : (
                      <span>{profileData.address || "Not Added"}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="info-card">
                <div className="card-header">
                  <h3>BASIC INFORMATION</h3>
                </div>
                
                <div className="info-content">
                  <div className="info-row">
                    <label>Gender:</label>
                    {isEditing ? (
                      <select
                        name="gender"
                        value={profileData.gender}
                        onChange={handleInputChange}
                        className="edit-select"
                      >
                        <option value="Not Selected">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    ) : (
                      <span>{profileData.gender}</span>
                    )}
                  </div>

                  <div className="info-row">
                    <label>Birthday:</label>
                    {isEditing ? (
                      <input
                        type="date"
                        name="birthday"
                        value={profileData.birthday === "Not Selected" ? "" : profileData.birthday}
                        onChange={handleInputChange}
                        className="edit-input"
                      />
                    ) : (
                      <span>{profileData.birthday}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Edit/Save Buttons */}
              {isEditing && (
                <div className="action-buttons">
                  <button className="save-btn" onClick={handleSaveClick}>
                    Save Changes
                  </button>
                  <button className="cancel-btn" onClick={handleCancelClick}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Profile