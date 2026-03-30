import React from 'react'
import NavbarMain from './NavbarMain'
import Footer from '../components/Footer'


const Layout = ({ children }) => {
  return (
    <div>
      <NavbarMain />
      <main style={{ paddingTop: '80px' }}>
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout