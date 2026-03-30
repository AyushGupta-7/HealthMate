import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import Features from '../components/Features'
import TrustedSection from '../components/TrustedSection'
import Footer from '../components/Footer'
import Specialty from '../components/Specialty'
import TopDoctors from '../components/TopDoctors'
import Poster from '../components/Poster'

const Landing = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      {/* <Features /> */}
      <Specialty />      
      <TopDoctors />
      <Poster />
      <Footer />
    </div>
  )
}

export default Landing