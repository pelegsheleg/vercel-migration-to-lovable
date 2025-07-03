"use client"

import type React from "react"

interface CredentialsSectionProps {
  onChange: (field: string, value: any) => void
}

const CredentialsSection: React.FC<CredentialsSectionProps> = ({ onChange }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    onChange(name, value)
  }

  return (
    <div>
      <h3>Credentials</h3>
      <div>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" onChange={handleInputChange} />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" onChange={handleInputChange} />
      </div>
      <div>
        <label htmlFor="bio">Bio:</label>
        <textarea id="bio" name="bio" onChange={handleInputChange} />
      </div>
    </div>
  )
}

export default CredentialsSection
export { CredentialsSection }
