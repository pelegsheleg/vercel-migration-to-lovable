"use client"

import type React from "react"

interface DosAndDontsProps {
  dos: string
  donts: string
  onChange: (dos: string, donts: string) => void
}

const DosAndDonts: React.FC<DosAndDontsProps> = ({ dos, donts, onChange }) => {
  const handleDosChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value, donts)
  }

  const handleDontsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(dos, e.target.value)
  }

  return (
    <div>
      <div>
        <label htmlFor="dos">Dos:</label>
        <textarea id="dos" value={dos} onChange={handleDosChange} />
      </div>
      <div>
        <label htmlFor="donts">Dont's:</label>
        <textarea id="donts" value={donts} onChange={handleDontsChange} />
      </div>
    </div>
  )
}

export default DosAndDonts
export { DosAndDonts }
