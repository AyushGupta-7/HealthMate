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
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:specialtyParam" element={<Doctors />} />
          <Route path="/doctor/:id" element={<DoctorDetails />} />
          <Route path="/my-appointments" element={<MyAppointments />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/report-dashboard" element={<ReportDashboard />} />
          <Route path="/vitals" element={<Vitals />} />
          <Route path="/ai-insights" element={<AIInsights />} />
          <Route path="/previous-reports" element={<PreviousReports />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App