import React from 'react'
import NavbarMain from '../components/NavbarMain'
import HeroMain from '../components/HeroMain'
import Footer from '../components/Footer'
import Specialty from '../components/Specialty'
import TopDoctors from '../components/TopDoctors'
import Poster from '../components/Poster'

const Dashboard = () => {
  return (
    <div>
      <NavbarMain />
      <HeroMain />
      <Specialty />
      <TopDoctors />
      <Poster />
      <Footer />
    </div>
  )
}

export default Dashboard