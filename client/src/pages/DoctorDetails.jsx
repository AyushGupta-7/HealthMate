import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import './DoctorDetails.css'

import doc1 from '../assets/images/doc1.png'
import doc2 from '../assets/images/doc2.png'
import doc3 from '../assets/images/doc3.png'
import doc4 from '../assets/images/doc4.png'
import doc5 from '../assets/images/doc5.png'
import doc6 from '../assets/images/doc6.png'
import doc7 from '../assets/images/doc7.png'
import doc8 from '../assets/images/doc8.png'
import doc9 from '../assets/images/doc9.png'
import doc10 from '../assets/images/doc10.png'
import doc11 from '../assets/images/doc11.png'
import doc12 from '../assets/images/doc12.png'
import doc13 from '../assets/images/doc13.png'
import doc14 from '../assets/images/doc14.png'
import doc15 from '../assets/images/doc15.png'
import doc16 from '../assets/images/doc16.png'
import doc17 from '../assets/images/doc17.png'
import doc18 from '../assets/images/doc18.png'
import doc19 from '../assets/images/doc19.png'
import doc20 from '../assets/images/doc20.png'
import doc21 from '../assets/images/doc21.png'
import doc22 from '../assets/images/doc22.png'
import doc23 from '../assets/images/doc23.png'
import doc24 from '../assets/images/doc24.png'
import doc25 from '../assets/images/doc25.png'

const DoctorDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const doctorsData = {
    1: {
      id: 1,
      name: "Dr. Princy Singh",
      qualification: "MBBS",
      specialization: "Neurologist",
      experience: "5 Year",
      about: "Dr. Princy Singh is a renowned neurologist with over 5 years of experience in treating complex neurological disorders. She specializes in headache management, epilepsy, and stroke rehabilitation. She has successfully treated over 2000+ patients with excellent outcomes.",
      fee: 500,
      image: doc1,
      address: "Sarvoday Nagar, Dewas(455001), Madhya Pradesh"
    },
    2: {
      id: 2,
      name: "Dr. Ramit Sambhoyal",
      qualification: "MBBS",
      specialization: "General physician",
      experience: "8 Year",
      about: "Dr. Ramit Sambhoyal is an experienced general physician providing comprehensive primary care services. He specializes in preventive healthcare, chronic disease management, and geriatric care.",
      fee: 400,
      image: doc2,
      address: "81/A, Shalimar township, Dewas Naka, Indore"
    },
    3: {
      id: 3,
      name: "Dr. Sanjay Barude",
      qualification: "MBBS",
      specialization: "Gastroenterologist",
      experience: "10 Year",
      about: "Dr. Sanjay Barude is a specialist in digestive system disorders and advanced endoscopic procedures. He has performed over 5000+ successful endoscopies and colonoscopies.",
      fee: 600,
      image: doc3,
      address: "Apollo Hospitals, 5/2, Residency Area, Gopur Square, Indore, Madhya Pradesh - 452001"
    },
    4: {
      id: 4,
      name: "Dr. Shushmita Mukharjee",
      qualification: "MBBS",
      specialization: "Gynecologist",
      experience: "7 Year",
      about: "Dr. Shushmita Mukharjee is a compassionate gynecologist specializing in women's health, pregnancy care, and reproductive medicine. She has handled over 1000+ successful deliveries.",
      fee: 550,
      image: doc4,
      address: "Women's Care Clinic, Indore"
    },
    5: {
      id: 5,
      name: "Dr. Shubindu Mahindru",
      qualification: "MBBS",
      specialization: "Dermatologist",
      experience: "6 Year",
      about: "Dr. Shubindu Mahindru is a leading dermatologist specializing in skin care, hair disorders, and cosmetic dermatology. He has treated over 3000+ patients.",
      fee: 500,
      image: doc5,
      address: "Skin Care Clinic, Indore"
    },
    6: {
      id: 6,
      name: "Dr. Neelesh Jain",
      qualification: "MBBS",
      specialization: "Neurologist",
      experience: "4 Year",
      about: "Dr. Neelesh Jain is a skilled neurologist focusing on stroke management, epilepsy, and movement disorders.",
      fee: 520,
      image: doc6,
      address: "Neuro Care Center, Indore"
    },
    7: {
      id: 7,
      name: "Dr. Manoj Bansal",
      qualification: "MBBS",
      specialization: "Gastroenterologist",
      experience: "9 Year",
      about: "Dr. Manoj Bansal is an expert in liver diseases, pancreatic disorders, and advanced therapeutic endoscopy.",
      fee: 620,
      image: doc7,
      address: "Digestive Health Institute, Indore"
    },
    8: {
      id: 8,
      name: "Dr. K L Prajapati",
      qualification: "MBBS",
      specialization: "Gastroenterologist",
      experience: "12 Year",
      about: "Dr. K L Prajapati is a senior gastroenterologist specializing in inflammatory bowel disease and gastrointestinal cancers.",
      fee: 650,
      image: doc8,
      address: "GI Super Specialty Hospital, Indore"
    },
    9: {
      id: 9,
      name: "Dr. Indu Bhawna",
      qualification: "MBBS",
      specialization: "Neurologist",
      experience: "5 Year",
      about: "Dr. Indu Bhawna specializes in pediatric neurology, headache disorders, and neuro-rehabilitation.",
      fee: 510,
      image: doc9,
      address: "Brain & Spine Clinic, Indore"
    },
    10: {
      id: 10,
      name: "Dr. Abhay Bhagwat",
      qualification: "MBBS",
      specialization: "Neurologist",
      experience: "6 Year",
      about: "Dr. Abhay Bhagwat is an expert in stroke management, epilepsy surgery, and neuro-critical care.",
      fee: 540,
      image: doc10,
      address: "Advanced Neurology Center, Indore"
    },
    11: {
      id: 11,
      name: "Dr. Nipun Puranik",
      qualification: "MBBS",
      specialization: "Neurologist",
      experience: "3 Year",
      about: "Dr. Nipun Puranik specializes in movement disorders, multiple sclerosis, and neuro-immunology.",
      fee: 480,
      image: doc11,
      address: "Neuro Wellness Clinic, Indore"
    },
    12: {
      id: 12,
      name: "Dr. Aveg Bhandari",
      qualification: "MBBS",
      specialization: "Neurologist",
      experience: "4 Year",
      about: "Dr. Aveg Bhandari focuses on cognitive neurology, dementia, and neuro-ophthalmology.",
      fee: 490,
      image: doc12,
      address: "Memory & Brain Clinic, Indore"
    },
    13: {
      id: 13,
      name: "Dr. Alok Mandliya",
      qualification: "MBBS",
      specialization: "Neurologist",
      experience: "7 Year",
      about: "Dr. Alok Mandliya specializes in peripheral nerve disorders, neuromuscular diseases, and electrodiagnostic medicine.",
      fee: 530,
      image: doc13,
      address: "Neuromuscular Center, Indore"
    },
    14: {
      id: 14,
      name: "Dr. Saloni Dashore",
      qualification: "MBBS",
      specialization: "General physician",
      experience: "5 Year",
      about: "Dr. Saloni Dashore is a dedicated general physician providing comprehensive primary care, preventive health checkups, and chronic disease management.",
      fee: 380,
      image: doc14,
      address: "Family Health Clinic, Indore"
    },
    15: {
      id: 15,
      name: "Dr. Rajesh karanjiya",
      qualification: "MBBS",
      specialization: "General physician",
      experience: "9 Year",
      about: "Dr. Rajesh Karanjiya is an experienced physician specializing in diabetes management, hypertension, and geriatric care.",
      fee: 420,
      image: doc15,
      address: "Care Plus Clinic, Indore"
    },
    16: {
      id: 16,
      name: "Dr. Himanshu Kelkar",
      qualification: "MBBS",
      specialization: "Pediatricians",
      experience: "6 Year",
      about: "Dr. Himanshu Kelkar is a compassionate pediatrician specializing in child development, vaccination, and adolescent health care.",
      fee: 450,
      image: doc16,
      address: "Child Care Center, Indore"
    },
    17: {
      id: 17,
      name: "Dr. Kawita Bapat",
      qualification: "MBBS",
      specialization: "Gynecologist",
      experience: "8 Year",
      about: "Dr. Kawita Bapat specializes in high-risk pregnancy, infertility treatment, and laparoscopic gynecological surgery.",
      fee: 580,
      image: doc17,
      address: "Mother & Child Hospital, Indore"
    },
    18: {
      id: 18,
      name: "Dr. Diksha Chachria",
      qualification: "MBBS",
      specialization: "Gynecologist",
      experience: "4 Year",
      about: "Dr. Diksha Chachria focuses on adolescent gynecology, menstrual disorders, and family planning services.",
      fee: 480,
      image: doc18,
      address: "Women's Wellness Clinic, Indore"
    },
    19: {
      id: 19,
      name: "Dr. Manju Patidar",
      qualification: "MBBS",
      specialization: "Gynecologist",
      experience: "10 Year",
      about: "Dr. Manju Patidar is an expert in menopause management, urogynecology, and minimally invasive gynecological surgeries.",
      fee: 600,
      image: doc19,
      address: "Advanced Women's Care, Indore"
    },
    20: {
      id: 20,
      name: "Dr. Shaheen Kapoor",
      qualification: "MBBS",
      specialization: "Dermatologist",
      experience: "7 Year",
      about: "Dr. Shaheen Kapoor specializes in acne treatment, psoriasis management, and cosmetic dermatology including laser treatments.",
      fee: 520,
      image: doc20,
      address: "Skin & Laser Clinic, Indore"
    },
    21: {
      id: 21,
      name: "Dr. Shraddha Pitalia",
      qualification: "MBBS",
      specialization: "Dermatologist",
      experience: "5 Year",
      about: "Dr. Shraddha Pitalia focuses on pediatric dermatology, vitiligo treatment, and aesthetic procedures.",
      fee: 490,
      image: doc21,
      address: "Dermatology & Aesthetics Center, Indore"
    },
    22: {
      id: 22,
      name: "Dr. Dilip Hemnani",
      qualification: "MBBS",
      specialization: "Dermatologist",
      experience: "11 Year",
      about: "Dr. Dilip Hemnani is an expert in hair transplantation, scar revision, and advanced dermatological surgery.",
      fee: 650,
      image: doc22,
      address: "Hair & Skin Institute, Indore"
    },
    23: {
      id: 23,
      name: "Dr. Harshita Kothari",
      qualification: "MBBS",
      specialization: "Dermatologist",
      experience: "3 Year",
      about: "Dr. Harshita Kothari specializes in cosmetic dermatology, laser hair removal, and anti-aging treatments.",
      fee: 460,
      image: doc23,
      address: "Glow Skin Clinic, Indore"
    },
    24: {
      id: 24,
      name: "Dr. Ashish Jaiswal",
      qualification: "MBBS",
      specialization: "Pediatricians",
      experience: "8 Year",
      about: "Dr. Ashish Jaiswal specializes in neonatal care, pediatric intensive care, and childhood respiratory disorders.",
      fee: 550,
      image: doc24,
      address: "Little Stars Children's Hospital, Indore"
    },
    25: {
      id: 25,
      name: "Dr. Mahendra Rathod",
      qualification: "MBBS",
      specialization: "Pediatricians",
      experience: "6 Year",
      about: "Dr. Mahendra Rathod focuses on pediatric gastroenterology, nutrition, and child development disorders.",
      fee: 500,
      image: doc25,
      address: "Child Health Clinic, Indore"
    }
  }

  const doctor = doctorsData[id]

  // Generate next 7 days
  const generateDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase(),
        date: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        fullDate: date,
        formattedDate: `${date.toLocaleDateString('en-US', { weekday: 'short' })} ${date.getDate()}`
      })
    }
    return dates
  }

  const timeSlots = [
    "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", 
    "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", 
    "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"
  ]

  const dates = generateDates()

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setSelectedTime(null)
    setErrorMessage('')
  }

  const handleTimeSelect = (time) => {
    if (!selectedDate) {
      setErrorMessage('Please select a date first')
      return
    }
    setSelectedTime(time)
    setErrorMessage('')
  }

  const handleBookAppointment = () => {
    if (!selectedDate) {
      setErrorMessage('Please select a date')
      return
    }
    if (!selectedTime) {
      setErrorMessage('Please select a time slot')
      return
    }

    const appointment = {
      id: Date.now(),
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorQualification: doctor.qualification,
      doctorSpecialty: doctor.specialization,
      doctorExperience: doctor.experience,
      doctorImage: doctor.image,
      doctorAddress: doctor.address,
      date: selectedDate.formattedDate,
      time: selectedTime,
      fee: doctor.fee,
      status: 'pending'
    }

    const existingAppointments = JSON.parse(localStorage.getItem('appointments') || '[]')
    existingAppointments.push(appointment)
    localStorage.setItem('appointments', JSON.stringify(existingAppointments))

    // Show success message
    setErrorMessage('success')
    setTimeout(() => {
      navigate('/my-appointments')
    }, 1500)
  }

  if (!doctor) {
    return (
      <Layout>
        <div className="doctor-not-found">
          <h2>Doctor not found</h2>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="doctor-details-page">
        <div className="doctor-details-container">
          <div className="doctor-info-card">
            <div className="doctor-info2">
              <div className='imageBg'>
                <img src={doctor.image} alt={doctor.name} />
              </div>
              <div className="doctor-content">
                <h1>{doctor.name}</h1>
                <p className="doctor-specialization">
                  {doctor.qualification} - {doctor.specialization} {doctor.experience}
                </p>
                <div className="about-section">
                  <h3>About</h3>
                  <p>{doctor.about}</p>
                </div>
                <p className="appointment-fee">
                  <strong>Appointment fee:</strong> ₹ {doctor.fee}
                </p>
              </div>
            </div>
          </div>

          <div className="booking-slots-card">
            <h2>Booking slots</h2>
            
            {errorMessage && errorMessage !== 'success' && (
              <div className="error-message">
                ⚠️ {errorMessage}
              </div>
            )}
            {errorMessage === 'success' && (
              <div className="success-message">
                ✓ Appointment booked successfully! Redirecting...
              </div>
            )}
            
            <div className="dates-scroll-container">
              <div className="dates-wrapper">
                {dates.map((date, index) => (
                  <div 
                    key={index} 
                    className={`date-card ${selectedDate?.date === date.date ? 'selected' : ''}`}
                    onClick={() => handleDateSelect(date)}
                  >
                    <div className="date-day">{date.day}</div>
                    <div className="date-number">{date.date}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="times-scroll-container">
              <div className="times-wrapper">
                {timeSlots.map((time, index) => (
                  <button
                    key={index}
                    className={`time-slot-btn ${selectedTime === time ? 'selected' : ''}`}
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {selectedDate && selectedTime && (
              <div className="selected-slot-info">
                <p>Selected: <strong>{selectedDate.formattedDate}</strong> at <strong>{selectedTime}</strong></p>
              </div>
            )}

            <button className="book-appointment-btn2" onClick={handleBookAppointment}>
              Book an appointment
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default DoctorDetails