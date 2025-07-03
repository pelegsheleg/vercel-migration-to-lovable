"use client"

import type React from "react"

interface PricingSectionProps {
  hourlyRate: number
  onChange: (newRate: number) => void
}

const PricingSection: React.FC<PricingSectionProps> = ({ hourlyRate, onChange }) => {
  const handleRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRate = Number.parseFloat(event.target.value)
    if (!isNaN(newRate)) {
      onChange(newRate)
    }
  }

  return (
    <div>
      <h3>Pricing</h3>
      <label htmlFor="hourlyRate">Hourly Rate:</label>
      <input type="number" id="hourlyRate" value={hourlyRate} onChange={handleRateChange} />
    </div>
  )
}

export default PricingSection
export { PricingSection }
