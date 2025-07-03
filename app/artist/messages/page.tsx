"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EnhancedCommunicationSystem } from "@/components/communication/enhanced-communication-system"

// Mock data for conversations
const mockConversations = [
  {
    id: "c1",
    client: {
      name: "Alex Chen",
      avatar: "/placeholder.svg?text=AC",
      online: true,
      lastSeen: null,
    },
    lastMessage: {
      text: "I'm really excited about the cyberpunk design! When can we schedule the session?",
      time: "10:32 AM",
      isRead: false,
      sender: "client",
    },
    unreadCount: 2,
    design: {
      name: "Cyberpunk Arm",
      image: "/images/tattoo-cyberpunk.png",
    },
  },
  {
    id: "c2",
    client: {
      name: "Jordan Smith",
      avatar: "/placeholder.svg?text=JS",
      online: false,
      lastSeen: "2 hours ago",
    },
    lastMessage: {
      text: "The koi design looks amazing! I have a few questions about the colors.",
      time: "Yesterday",
      isRead: true,
      sender: "client",
    },
    unreadCount: 0,
    design: {
      name: "Japanese Koi",
      image: "/images/tattoo-japanese.png",
    },
  },
  {
    id: "c3",
    client: {
      name: "Riley Thompson",
      avatar: "/placeholder.svg?text=RT",
      online: false,
      lastSeen: "1 day ago",
    },
    lastMessage: {
      text: "I've attached some reference images for the consultation.",
      time: "Yesterday",
      isRead: true,
      sender: "client",
    },
    unreadCount: 0,
    design: {
      name: "Custom Design",
      image: "/placeholder.svg?text=Consultation",
    },
  },
  {
    id: "c4",
    client: {
      name: "Taylor Kim",
      avatar: "/placeholder.svg?text=TK",
      online: true,
      lastSeen: null,
    },
    lastMessage: {
      text: "Looking forward to our session tomorrow for the mandala piece!",
      time: "2 days ago",
      isRead: true,
      sender: "client",
    },
    unreadCount: 0,
    design: {
      name: "Geometric Mandala",
      image: "/images/tattoo-blackwork.png",
    },
  },
  {
    id: "c5",
    client: {
      name: "Morgan Lee",
      avatar: "/placeholder.svg?text=ML",
      online: false,
      lastSeen: "3 days ago",
    },
    lastMessage: {
      text: "I'll need to reschedule our appointment due to a personal emergency.",
      time: "3 days ago",
      isRead: true,
      sender: "client",
    },
    unreadCount: 0,
    design: {
      name: "Watercolor Abstract",
      image: "/images/tattoo-watercolor.png",
    },
  },
]

// Mock data for messages in a conversation
const mockMessages = {
  c1: [
    {
      id: "m1",
      text: "Hi there! I saw your portfolio and I'm interested in getting a cyberpunk-themed tattoo.",
      time: "Yesterday, 2:15 PM",
      sender: "client",
      isRead: true,
    },
    {
      id: "m2",
      text: "Hello Alex! Thanks for reaching out. I'd be happy to work on a cyberpunk design for you. Do you have any specific ideas or references?",
      time: "Yesterday, 2:30 PM",
      sender: "artist",
      isRead: true,
    },
    {
      id: "m3",
      text: "Yes, I'm thinking of a sleeve with circuit patterns and some neon elements. I've attached a few reference images.",
      time: "Yesterday, 2:45 PM",
      sender: "client",
      isRead: true,
      attachments: [
        {
          type: "image",
          url: "/images/tattoo-cyberpunk.png",
        },
      ],
    },
    {
      id: "m4",
      text: "These look great! I can definitely work with these references. I've created a preliminary design based on your ideas. What do you think?",
      time: "Yesterday, 3:30 PM",
      sender: "artist",
      isRead: true,
      attachments: [
        {
          type: "image",
          url: "/images/tattoo-cyberpunk.png",
        },
      ],
    },
    {
      id: "m5",
      text: "Wow, that's exactly what I had in mind! I love the neon accents and the circuit patterns.",
      time: "Yesterday, 4:15 PM",
      sender: "client",
      isRead: true,
    },
    {
      id: "m6",
      text: "Great! I'm glad you like it. For a design like this, we'd need about 3 hours for the session. My rate is $150 per hour, with a $150 deposit to secure your appointment.",
      time: "Yesterday, 4:30 PM",
      sender: "artist",
      isRead: true,
    },
    {
      id: "m7",
      text: "That sounds reasonable. I'm ready to book the appointment and pay the deposit.",
      time: "Yesterday, 5:00 PM",
      sender: "client",
      isRead: true,
    },
    {
      id: "m8",
      text: "Perfect! I've sent you a booking link. Once you complete the deposit payment, your appointment will be confirmed.",
      time: "Yesterday, 5:15 PM",
      sender: "artist",
      isRead: true,
    },
    {
      id: "m9",
      text: "I've just completed the payment. I'm really excited about the cyberpunk design! When can we schedule the session?",
      time: "Today, 10:32 AM",
      sender: "client",
      isRead: false,
    },
    {
      id: "m10",
      text: "I have an opening next Tuesday at 2 PM. Would that work for you?",
      time: "Today, 10:45 AM",
      sender: "client",
      isRead: false,
    },
  ],
  c2: [
    {
      id: "m1",
      text: "Hi, I'm interested in getting a Japanese-style tattoo with a koi fish.",
      time: "3 days ago, 11:20 AM",
      sender: "client",
      isRead: true,
    },
    {
      id: "m2",
      text: "Hello Jordan! Japanese koi designs are one of my specialties. Do you have any specific colors or elements in mind?",
      time: "3 days ago, 11:45 AM",
      sender: "artist",
      isRead: true,
    },
    {
      id: "m3",
      text: "I was thinking of traditional colors - red and blue with some water elements.",
      time: "3 days ago, 12:30 PM",
      sender: "client",
      isRead: true,
    },
    {
      id: "m4",
      text: "That sounds perfect. I've created a design that might interest you. Let me know what you think!",
      time: "2 days ago, 10:15 AM",
      sender: "artist",
      isRead: true,
      attachments: [
        {
          type: "image",
          url: "/images/tattoo-japanese.png",
        },
      ],
    },
    {
      id: "m5",
      text: "The koi design looks amazing! I have a few questions about the colors.",
      time: "Yesterday, 3:45 PM",
      sender: "client",
      isRead: true,
    },
  ],
}

export default function MessagesPage() {
  const router = useRouter()
  const [conversations, setConversations] = useState(mockConversations)
  const [activeConversation, setActiveConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Filter conversations based on search query
    if (searchQuery) {
      const filtered = mockConversations.filter((conv) =>
        conv.client.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setConversations(filtered)
    } else {
      setConversations(mockConversations)
    }
  }, [searchQuery])

  useEffect(() => {
    // Load messages for active conversation
    if (activeConversation) {
      setMessages(mockMessages[activeConversation.id] || [])

      // Mark messages as read
      if (activeConversation.unreadCount > 0) {
        const updatedConversations = conversations.map((conv) =>
          conv.id === activeConversation.id ? { ...conv, unreadCount: 0 } : conv,
        )
        setConversations(updatedConversations)
      }
    }
  }, [activeConversation])

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()

    if (!newMessage.trim() || !activeConversation) return

    const newMsg = {
      id: `new-${Date.now()}`,
      text: newMessage,
      time: "Just now",
      sender: "artist",
      isRead: false,
    }

    // Add message to conversation
    setMessages([...messages, newMsg])

    // Update last message in conversation list
    const updatedConversations = conversations.map((conv) =>
      conv.id === activeConversation.id
        ? {
            ...conv,
            lastMessage: {
              text: newMessage,
              time: "Just now",
              isRead: false,
              sender: "artist",
            },
          }
        : conv,
    )
    setConversations(updatedConversations)

    // Clear input
    setNewMessage("")
  }

  const formatMessageTime = (time) => {
    if (time === "Just now") return time
    return time
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-950 to-purple-950 text-white">
      <header className="border-b border-purple-900 bg-black/50 backdrop-blur-sm p-4 sticky top-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center">
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.push("/artist/dashboard")}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Messages</h1>
            <p className="text-sm text-purple-300">Communicate with your clients</p>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-7xl p-4">
          <EnhancedCommunicationSystem />
        </div>
      </main>
    </div>
  )
}
