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
// import AdminDashboard from './pages/admin/AdminDashboard'
// import AdminDoctors from './pages/admin/AdminDoctors'
// import AdminUsers from './pages/admin/AdminUsers'
// import AdminAppointments from './pages/admin/AdminAppointments'
// import AdminLogin from './pages/admin/AdminLogin';
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

          {/* Admin Routes (Protected)
          <Route path="/admin/dashboard" element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/doctors" element={
            <ProtectedRoute adminOnly={true}>
              <AdminDoctors />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute adminOnly={true}>
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="/admin/appointments" element={
            <ProtectedRoute adminOnly={true}>
              <AdminAppointments />
            </ProtectedRoute>
          } /> */}

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