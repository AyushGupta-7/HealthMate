import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import API from '../services/api';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    gender: 'Not Selected',
    dob: '',
    image: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editData, setEditData] = useState({});
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await API.get('/users/profile');
      const userData = response.data.data;
      
      let addressString = '';
      if (typeof userData.address === 'object') {
        const parts = [];
        if (userData.address.line1) parts.push(userData.address.line1);
        if (userData.address.line2) parts.push(userData.address.line2);
        if (userData.address.city) parts.push(userData.address.city);
        if (userData.address.state) parts.push(userData.address.state);
        if (userData.address.pincode) parts.push(userData.address.pincode);
        addressString = parts.join(', ');
      } else {
        addressString = userData.address || '';
      }
      
      setProfile({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: addressString,
        gender: userData.gender || 'Not Selected',
        dob: userData.dob || '',
        image: userData.image || ''
      });
      
      // Set image preview
      if (userData.image) {
        setImagePreview(userData.image.startsWith('http') ? userData.image : `http://localhost:5000${userData.image}`);
      }
      
      setEditData({
        name: userData.name || '',
        phone: userData.phone || '',
        address: addressString,
        gender: userData.gender || 'Not Selected',
        dob: userData.dob || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      name: profile.name,
      phone: profile.phone,
      address: profile.address,
      gender: profile.gender,
      dob: profile.dob
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: profile.name,
      phone: profile.phone,
      address: profile.address,
      gender: profile.gender,
      dob: profile.dob
    });
  };

  const handleSave = async () => {
    try {
      setUpdating(true);
      const response = await API.put('/users/profile', editData);
      if (response.data.success) {
        setProfile(prev => ({
          ...prev,
          name: editData.name,
          phone: editData.phone,
          address: editData.address,
          gender: editData.gender,
          dob: editData.dob
        }));
        setIsEditing(false);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } finally {
      setUpdating(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please upload an image file' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size must be less than 5MB' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      setUpdating(true);
      const response = await API.put('/users/profile/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.success) {
        const imageUrl = `http://localhost:5000${response.data.data.imageUrl}`;
        setImagePreview(imageUrl);
        setProfile(prev => ({ ...prev, image: response.data.data.imageUrl }));
        setMessage({ type: 'success', text: 'Profile photo updated!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to upload image' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      setUpdating(true);
      const response = await API.delete('/users/profile/image');
      
      if (response.data.success) {
        setImagePreview('');
        setProfile(prev => ({ ...prev, image: '' }));
        setMessage({ type: 'success', text: 'Profile photo removed!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to remove image' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } finally {
      setUpdating(false);
    }
  };

  
  const clearField = (fieldName) => {
    setEditData(prev => ({ ...prev, [fieldName]: '' }));
  };

  if (loading) {
    return (
      <Layout>
        <div className="profile-page">
          <div className="profile-container">
            <div className="loading-spinner">Loading profile...</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-header">
            <h1>My Profile</h1>
          </div>

          {message.text && (
            <div className={`profile-message ${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="profile-content">
            <div className="profile-photo-section">
              <div className="photo-container" onClick={() => fileInputRef.current?.click()}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile" className="profile-photo" />
                ) : (
                  <div className="photo-placeholder">
                    <span className="camera-icon">📷</span>
                    <p>Click to upload</p>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </div>
              {imagePreview && (
                <button className="remove-photo-btn" onClick={handleRemoveImage} disabled={updating}>
                  Remove Photo
                </button>
              )}
              <h2 className="profile-name">{profile.name}</h2>
            </div>

            <div className="profile-info-section">
              <div className="info-card">
                <div className="card-header">
                  <h3>Contact Information</h3>
                  {!isEditing && (
                    <button className="edit-btn" onClick={handleEdit}>Edit</button>
                  )}
                </div>
                
                <div className="info-content">
                  <div className="info-row">
                    <label>Full Name:</label>
                    {isEditing ? (
                      <div className="input-with-clear">
                        <input
                          type="text"
                          value={editData.name || ''}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          placeholder="Enter your name"
                        />
                        {editData.name && (
                          <button type="button" className="clear-btn" onClick={() => clearField('name')}>×</button>
                        )}
                      </div>
                    ) : (
                      <span>{profile.name || 'Not added'}</span>
                    )}
                  </div>

                  <div className="info-row">
                    <label>Email:</label>
                    <span>{profile.email}</span>
                    <small className="email-note">Email cannot be changed</small>
                  </div>

                  <div className="info-row">
                    <label>Phone:</label>
                    {isEditing ? (
                      <div className="input-with-clear">
                        <input
                          type="tel"
                          value={editData.phone || ''}
                          onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                          placeholder="Enter 10-digit phone number"
                        />
                        {editData.phone && (
                          <button type="button" className="clear-btn" onClick={() => clearField('phone')}>×</button>
                        )}
                      </div>
                    ) : (
                      <span>{profile.phone || 'Not added'}</span>
                    )}
                  </div>

                  <div className="info-row">
                    <label>Address:</label>
                    {isEditing ? (
                      <div className="textarea-with-clear">
                        <textarea
                          value={editData.address || ''}
                          onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                          rows="3"
                          placeholder="Enter your address"
                        />
                        {editData.address && (
                          <button type="button" className="clear-btn" onClick={() => clearField('address')}>×</button>
                        )}
                      </div>
                    ) : (
                      <span>{profile.address || 'Not added'}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="info-card">
                <div className="card-header">
                  <h3>Basic Information</h3>
                </div>
                
                <div className="info-content">
                  <div className="info-row">
                    <label>Gender:</label>
                    {isEditing ? (
                      <select
                        value={editData.gender || 'Not Selected'}
                        onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                      >
                        <option value="Not Selected">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    ) : (
                      <span>{profile.gender}</span>
                    )}
                  </div>

                  <div className="info-row">
                    <label>Date of Birth:</label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editData.dob || ''}
                        onChange={(e) => setEditData({ ...editData, dob: e.target.value })}
                      />
                    ) : (
                      <span>{profile.dob || 'Not added'}</span>
                    )}
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="action-buttons">
                  <button className="save-btn" onClick={handleSave} disabled={updating}>
                    {updating ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button className="cancel-btn" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;