"use client"

import type React from "react"
import { useState } from "react"

interface ServicesSectionProps {
  onChange: (values: { [key: string]: any }) => void
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ onChange }) => {
  const [services, setServices] = useState({
    photography: false,
    videography: false,
    mixing: false,
    mastering: false,
    production: false,
    songwriting: false,
  })

  const handleServiceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target
    const updatedServices = { ...services, [name]: checked }
    setServices(updatedServices)
    onChange(updatedServices)
  }

  return (
    <div>
      <h3>Services Offered</h3>
      <label>
        <input type="checkbox" name="photography" checked={services.photography} onChange={handleServiceChange} />
        Photography
      </label>
      <br />
      <label>
        <input type="checkbox" name="videography" checked={services.videography} onChange={handleServiceChange} />
        Videography
      </label>
      <br />
      <label>
        <input type="checkbox" name="mixing" checked={services.mixing} onChange={handleServiceChange} />
        Mixing
      </label>
      <br />
      <label>
        <input type="checkbox" name="mastering" checked={services.mastering} onChange={handleServiceChange} />
        Mastering
      </label>
      <br />
      <label>
        <input type="checkbox" name="production" checked={services.production} onChange={handleServiceChange} />
        Production
      </label>
      <br />
      <label>
        <input type="checkbox" name="songwriting" checked={services.songwriting} onChange={handleServiceChange} />
        Songwriting
      </label>
      <br />
    </div>
  )
}

export default ServicesSection
export { ServicesSection }
