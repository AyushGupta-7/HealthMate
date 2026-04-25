import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const sampleUsers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '9876543210', joined: '2024-01-15', appointments: 3 },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '9876543211', joined: '2024-02-20', appointments: 5 },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '9876543212', joined: '2024-03-10', appointments: 2 },
    ];
    setUsers(sampleUsers);
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="admin-users">
        <div className="page-header">
          <div className="header-left">
            <h2>Manage Users</h2>
            <p>View all registered users in the system</p>
          </div>
        </div>

        <div className="search-section">
          <input type="text" placeholder="🔍 Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div className="users-table-wrapper">
          <table className="users-table">
            <thead><tr><th>User</th><th>Email</th><th>Phone</th><th>Joined Date</th><th>Appointments</th></tr></thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td><div className="user-cell"><span className="user-avatar">{user.name.charAt(0)}</span><span>{user.name}</span></div></td>
                  <td>{user.email}</td><td>{user.phone}</td><td>{user.joined}</td><td><span className="appointment-count">{user.appointments}</span></td>
                </tr>
              ))}
              {filteredUsers.length === 0 && <tr><td colSpan="5" className="no-data">No users found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;