import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Doctors from './pages/Doctors';
import Availability from './pages/Availability';
import Users from './pages/Users';
import Appointments from './pages/Appointments';
import './App.css';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />
          <Route path="/admin/doctors" element={
            <PrivateRoute><Doctors /></PrivateRoute>
          } />
          <Route path="/admin/availability" element={
            <PrivateRoute><Availability /></PrivateRoute>
          } />
          <Route path="/admin/users" element={
            <PrivateRoute><Users /></PrivateRoute>
          } />
          <Route path="/admin/appointments" element={
            <PrivateRoute><Appointments /></PrivateRoute>
          } />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;