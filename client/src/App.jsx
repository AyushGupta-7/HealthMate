import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Doctors from './pages/Doctors'
import Profile from './pages/Profile'
import ReportDashboard from './pages/ReportDashboard'
import Vitals from './pages/Vitals'
import AIInsights from './pages/AIInsights'
import PreviousReports from './pages/PreviousReports'
import DoctorDetails from './pages/DoctorDetails'
import MyAppointments from './pages/MyAppointments'
import About from './pages/About'
import Contact from './pages/Contact'
import ProtectedRoute from './components/ProtectedRoute'
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminDoctors from './pages/admin/AdminDoctors';
import AdminAvailability from './pages/admin/AdminAvailability';

import AdminContacts from './pages/admin/AdminContacts';

import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin Routes  */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/doctors" element={<AdminDoctors />} />
          <Route path="/admin/availability" element={<AdminAvailability />} />
          <Route path="/admin/contacts" element={<AdminContacts />} />


          {/* User Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/doctors" element={
            <ProtectedRoute>
              <Doctors />
            </ProtectedRoute>
          } />
          <Route path="/doctors/:specialtyParam" element={
            <ProtectedRoute>
              <Doctors />
            </ProtectedRoute>
          } />
          <Route path="/doctor/:id" element={
            <ProtectedRoute>
              <DoctorDetails />
            </ProtectedRoute>
          } />
          <Route path="/my-appointments" element={
            <ProtectedRoute>
              <MyAppointments />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/report-dashboard" element={
            <ProtectedRoute>
              <ReportDashboard />
            </ProtectedRoute>
          } />
          <Route path="/vitals" element={
            <ProtectedRoute>
              <Vitals />
            </ProtectedRoute>
          } />
          <Route path="/ai-insights" element={
            <ProtectedRoute>
              <AIInsights />
            </ProtectedRoute>
          } />
          <Route path="/previous-reports" element={
            <ProtectedRoute>
              <PreviousReports />
            </ProtectedRoute>
          } />

        </Routes>
      </div>
    </Router>
  )
}

export default App