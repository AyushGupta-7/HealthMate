import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import API from '../../services/api';
import './AdminContacts.css';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await API.get('/contact/all');
      if (response.data.success) {
        setContacts(response.data.contacts);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setError('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await API.put(`/contact/${id}/status`, { status });
      if (response.data.success) {
        fetchContacts(); // Refresh list
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const addAdminNote = async (id, notes) => {
    try {
      const response = await API.post(`/contact/${id}/notes`, { notes });
      if (response.data.success) {
        alert('Note added successfully!');
        setAdminNote('');
        fetchContacts();
      }
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Failed to add note');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'pending': return 'status-pending';
      case 'read': return 'status-read';
      case 'replied': return 'status-replied';
      case 'archived': return 'status-archived';
      default: return 'status-pending';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return '⏳';
      case 'read': return '👁️';
      case 'replied': return '✅';
      case 'archived': return '📦';
      default: return '📧';
    }
  };

  const filteredContacts = contacts.filter(contact => {
    if (filter !== 'all' && contact.status !== filter) return false;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return contact.name.toLowerCase().includes(search) ||
             contact.email.toLowerCase().includes(search) ||
             contact.subject.toLowerCase().includes(search) ||
             contact.message.toLowerCase().includes(search);
    }
    return true;
  });

  const getStatusCount = (status) => {
    if (status === 'all') return contacts.length;
    return contacts.filter(c => c.status === status).length;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-contacts-container">
          <div className="loading-spinner">Loading contacts...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-contacts-container">
        <div className="contacts-header">
          <h1 className="contacts-title">📬 Contact Inquiries</h1>
          <p className="contacts-subtitle">Manage and respond to customer messages</p>
        </div>

        {/* Stats Overview */}
        <div className="contacts-stats">
          <div className="stat-item" onClick={() => setFilter('all')}>
            <span className="stat-icon">📧</span>
            <div className="stat-info">
              <span className="stat-count">{getStatusCount('all')}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
          <div className="stat-item" onClick={() => setFilter('pending')}>
            <span className="stat-icon">⏳</span>
            <div className="stat-info">
              <span className="stat-count">{getStatusCount('pending')}</span>
              <span className="stat-label">Pending</span>
            </div>
          </div>
          <div className="stat-item" onClick={() => setFilter('read')}>
            <span className="stat-icon">👁️</span>
            <div className="stat-info">
              <span className="stat-count">{getStatusCount('read')}</span>
              <span className="stat-label">Read</span>
            </div>
          </div>
          <div className="stat-item" onClick={() => setFilter('replied')}>
            <span className="stat-icon">✅</span>
            <div className="stat-info">
              <span className="stat-count">{getStatusCount('replied')}</span>
              <span className="stat-label">Replied</span>
            </div>
          </div>
          <div className="stat-item" onClick={() => setFilter('archived')}>
            <span className="stat-icon">📦</span>
            <div className="stat-info">
              <span className="stat-count">{getStatusCount('archived')}</span>
              <span className="stat-label">Archived</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="contacts-search">
          <input
            type="text"
            placeholder="🔍 Search by name, email, subject, or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {filter !== 'all' && (
            <button className="clear-filter" onClick={() => setFilter('all')}>
              Clear Filter: {filter}
            </button>
          )}
        </div>

        {/* Contacts Table */}
        <div className="contacts-table-container">
          {error ? (
            <div className="error-message">{error}</div>
          ) : filteredContacts.length === 0 ? (
            <div className="no-contacts">No contact inquiries found</div>
          ) : (
            <table className="contacts-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map(contact => (
                  <tr key={contact._id} className={`contact-row status-${contact.status}`}>
                    <td className="contact-date">
                      {new Date(contact.createdAt).toLocaleDateString()}
                      <small>{new Date(contact.createdAt).toLocaleTimeString()}</small>
                    </td>
                    <td className="contact-name">{contact.name}</td>
                    <td className="contact-email">{contact.email}</td>
                    <td className="contact-subject">{contact.subject}</td>
                    <td className="contact-status">
                      <span className={`status-badge ${getStatusBadgeClass(contact.status)}`}>
                        {getStatusIcon(contact.status)} {contact.status}
                      </span>
                    </td>
                    <td className="contact-actions">
                      <button 
                        className="btn-view" 
                        onClick={() => setSelectedContact(contact)}
                        title="View Details"
                      >
                        👁️ View
                      </button>
                      {contact.status === 'pending' && (
                        <button 
                          className="btn-read" 
                          onClick={() => updateStatus(contact._id, 'read')}
                          title="Mark as Read"
                        >
                          ✓ Mark Read
                        </button>
                      )}
                      {contact.status === 'read' && (
                        <button 
                          className="btn-reply" 
                          onClick={() => updateStatus(contact._id, 'replied')}
                          title="Mark as Replied"
                        >
                          💬 Mark Replied
                        </button>
                      )}
                      {contact.status !== 'archived' && (
                        <button 
                          className="btn-archive" 
                          onClick={() => updateStatus(contact._id, 'archived')}
                          title="Archive"
                        >
                          📦 Archive
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Contact Details Modal */}
        {selectedContact && (
          <div className="modal-overlay" onClick={() => setSelectedContact(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Inquiry Details</h2>
                <button className="modal-close" onClick={() => setSelectedContact(null)}>✕</button>
              </div>
              <div className="modal-body">
                <div className="detail-section">
                  <h3>Contact Information</h3>
                  <div className="detail-row">
                    <strong>Name:</strong> {selectedContact.name}
                  </div>
                  <div className="detail-row">
                    <strong>Email:</strong> <a href={`mailto:${selectedContact.email}`}>{selectedContact.email}</a>
                  </div>
                  <div className="detail-row">
                    <strong>Subject:</strong> {selectedContact.subject}
                  </div>
                  <div className="detail-row">
                    <strong>Status:</strong>
                    <span className={`status-badge ${getStatusBadgeClass(selectedContact.status)}`}>
                      {selectedContact.status}
                    </span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Message</h3>
                  <div className="message-box">
                    {selectedContact.message}
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Metadata</h3>
                  <div className="detail-row">
                    <strong>Inquiry ID:</strong> {selectedContact._id}
                  </div>
                  <div className="detail-row">
                    <strong>Submitted:</strong> {new Date(selectedContact.createdAt).toLocaleString()}
                  </div>
                  {selectedContact.ipAddress && (
                    <div className="detail-row">
                      <strong>IP Address:</strong> {selectedContact.ipAddress}
                    </div>
                  )}
                  {selectedContact.userAgent && (
                    <div className="detail-row">
                      <strong>User Agent:</strong> {selectedContact.userAgent.substring(0, 100)}...
                    </div>
                  )}
                </div>

                <div className="detail-section">
                  <h3>Admin Notes</h3>
                  {selectedContact.adminNotes && (
                    <div className="existing-note">
                      <strong>Previous Note:</strong>
                      <p>{selectedContact.adminNotes}</p>
                    </div>
                  )}
                  <textarea
                    className="admin-note-input"
                    placeholder="Add a private note about this inquiry..."
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    rows="3"
                  />
                  <button 
                    className="btn-add-note"
                    onClick={() => addAdminNote(selectedContact._id, adminNote)}
                  >
                    Add Note
                  </button>
                </div>

                <div className="modal-actions">
                  <button 
                    className="btn-reply-email"
                    onClick={() => window.location.href = `mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                  >
                    ✉️ Reply via Email
                  </button>
                  <button className="btn-close" onClick={() => setSelectedContact(null)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminContacts;