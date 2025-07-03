"use client"

import type React from "react"
import { useState } from "react"

interface AvailabilitySectionProps {
  onChange: (availability: Availability) => void
}

interface Availability {
  monday: boolean
  tuesday: boolean
  wednesday: boolean
  thursday: boolean
  friday: boolean
  saturday: boolean
  sunday: boolean
}

const AvailabilitySection: React.FC<AvailabilitySectionProps> = ({ onChange }) => {
  const [availability, setAvailability] = useState<Availability>({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  })

  const handleCheckboxChange = (day: keyof Availability) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAvailability = {
      ...availability,
      [day]: event.target.checked,
    }
    setAvailability(newAvailability)
    onChange(newAvailability)
  }

  return (
    <div>
      <h3>Availability</h3>
      <div>
        <label>
          Monday:
          <input type="checkbox" checked={availability.monday} onChange={handleCheckboxChange("monday")} />
        </label>
      </div>
      <div>
        <label>
          Tuesday:
          <input type="checkbox" checked={availability.tuesday} onChange={handleCheckboxChange("tuesday")} />
        </label>
      </div>
      <div>
        <label>
          Wednesday:
          <input type="checkbox" checked={availability.wednesday} onChange={handleCheckboxChange("wednesday")} />
        </label>
      </div>
      <div>
        <label>
          Thursday:
          <input type="checkbox" checked={availability.thursday} onChange={handleCheckboxChange("thursday")} />
        </label>
      </div>
      <div>
        <label>
          Friday:
          <input type="checkbox" checked={availability.friday} onChange={handleCheckboxChange("friday")} />
        </label>
      </div>
      <div>
        <label>
          Saturday:
          <input type="checkbox" checked={availability.saturday} onChange={handleCheckboxChange("saturday")} />
        </label>
      </div>
      <div>
        <label>
          Sunday:
          <input type="checkbox" checked={availability.sunday} onChange={handleCheckboxChange("sunday")} />
        </label>
      </div>
    </div>
  )
}

// Keep the default export for convenience …
export default AvailabilitySection
// …and add the named export expected elsewhere
export { AvailabilitySection }
