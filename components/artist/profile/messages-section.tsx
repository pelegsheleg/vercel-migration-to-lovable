"use client"

import type React from "react"

interface MessagesSectionProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

const MessagesSection: React.FC<MessagesSectionProps> = ({ onChange }) => {
  return (
    <div>
      <h2>Messages</h2>
      <form>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" onChange={onChange} />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" onChange={onChange} />
        </div>
        <div>
          <label htmlFor="message">Message:</label>
          <textarea id="message" name="message" onChange={onChange}></textarea>
        </div>
      </form>
    </div>
  )
}

export default MessagesSection
export { MessagesSection }
