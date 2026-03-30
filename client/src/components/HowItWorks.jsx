import React from 'react'
import './HowItWorks.css'
import howItWorksBg from '../assets/images/HowItWorks.png'

const HowItWorks = () => {
  return (
    <section className="how-it-works" id="how-it-works">
      <div className="how-it-works-bg" style={{ backgroundImage: `url(${howItWorksBg})` }}>
        <div className="bg-overlay-light"></div>
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          {/* <div className="steps-content-direct">
            <div className="step-direct">
              <div className="step-number-direct">Step 1</div>
              <div className="step-title-direct">Upload Medical Report</div>
            </div>
            <div className="step-direct">
              <div className="step-number-direct">Step 2</div>
              <div className="step-title-direct">AI Analyzes Data</div>
            </div>
            <div className="step-direct">
              <div className="step-number-direct">Step 3</div>
              <div className="step-title-direct">Get Simple Health Summary</div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks