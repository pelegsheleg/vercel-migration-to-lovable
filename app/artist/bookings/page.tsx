"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

// Add this import at the top
import { ComprehensiveBookingSystem } from "@/components/booking/comprehensive-booking-system"

// Mock data for bookings
const mockBookings = [
  {
    id: "b1",
    client: {
      name: "Alex Chen",
      avatar: "/placeholder.svg?text=AC",
      email: "alex@example.com",
      phone: "+1 (555) 123-4567",
    },
    date: "2025-05-20T14:00:00",
    duration: 180, // in minutes
    service: "Full Sleeve Design",
    design: {
      name: "Cyberpunk Arm",
      image: "/images/tattoo-cyberpunk.png",
    },
    status: "confirmed",
    notes: "Client wants to incorporate circuit board patterns and neon elements.",
    deposit: 150,
    totalPrice: 800,
  },
  {
    id: "b2",
    client: {
      name: "Jordan Smith",
      avatar: "/placeholder.svg?text=JS",
      email: "jordan@example.com",
      phone: "+1 (555) 987-6543",
    },
    date: "2025-05-21T10:00:00",
    duration: 120, // in minutes
    service: "Half Sleeve",
    design: {
      name: "Japanese Koi",
      image: "/images/tattoo-japanese.png",
    },
    status: "confirmed",
    notes: "Client is interested in traditional Japanese style with water elements.",
    deposit: 100,
    totalPrice: 600,
  },
  {
    id: "b3",
    client: {
      name: "Riley Thompson",
      avatar: "/placeholder.svg?text=RT",
      email: "riley@example.com",
      phone: "+1 (555) 456-7890",
    },
    date: "2025-05-21T15:30:00",
    duration: 60, // in minutes
    service: "Consultation",
    design: {
      name: "Custom Design",
      image: "/placeholder.svg?text=Consultation",
    },
    status: "pending",
    notes: "Initial consultation for a back piece. Client has reference images to share.",
    deposit: 0,
    totalPrice: 0,
  },
  {
    id: "b4",
    client: {
      name: "Taylor Kim",
      avatar: "/placeholder.svg?text=TK",
      email: "taylor@example.com",
      phone: "+1 (555) 789-0123",
    },
    date: "2025-05-22T13:00:00",
    duration: 240, // in minutes
    service: "Back Piece",
    design: {
      name: "Geometric Mandala",
      image: "/images/tattoo-blackwork.png",
    },
    status: "confirmed",
    notes: "Second session for the back piece. Focus on shading the central elements.",
    deposit: 200,
    totalPrice: 1200,
  },
  {
    id: "b5",
    client: {
      name: "Morgan Lee",
      avatar: "/placeholder.svg?text=ML",
      email: "morgan@example.com",
      phone: "+1 (555) 234-5678",
    },
    date: "2025-05-23T11:00:00",
    duration: 90, // in minutes
    service: "Forearm Piece",
    design: {
      name: "Watercolor Abstract",
      image: "/images/tattoo-watercolor.png",
    },
    status: "cancelled",
    notes: "Client had to cancel due to personal emergency. Deposit refunded.",
    deposit: 0,
    totalPrice: 0,
  },
  {
    id: "b6",
    client: {
      name: "Casey Johnson",
      avatar: "/placeholder.svg?text=CJ",
      email: "casey@example.com",
      phone: "+1 (555) 345-6789",
    },
    date: "2025-05-25T16:00:00",
    duration: 150, // in minutes
    service: "Thigh Piece",
    design: {
      name: "Botanical Lines",
      image: "/images/tattoo-fineline.png",
    },
    status: "confirmed",
    notes: "Client wants fine line botanical design with minimal shading.",
    deposit: 120,
    totalPrice: 550,
  },
]

export default function BookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState(mockBookings)
  const [filteredBookings, setFilteredBookings] = useState(mockBookings)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("upcoming")
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Filter bookings based on search query and filters
    let filtered = [...bookings]

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter)
    }

    // Apply date filter
    const now = new Date()
    if (dateFilter === "upcoming") {
      filtered = filtered.filter((booking) => new Date(booking.date) >= now)
    } else if (dateFilter === "past") {
      filtered = filtered.filter((booking) => new Date(booking.date) < now)
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (booking) =>
          booking.client.name.toLowerCase().includes(query) ||
          booking.service.toLowerCase().includes(query) ||
          booking.design.name.toLowerCase().includes(query),
      )
    }

    // Sort by date
    filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    setFilteredBookings(filtered)
  }, [bookings, searchQuery, statusFilter, dateFilter])

  const handleStatusChange = (bookingId, newStatus) => {
    const updatedBookings = bookings.map((booking) =>
      booking.id === bookingId ? { ...booking, status: newStatus } : booking,
    )
    setBookings(updatedBookings)

    toast({
      title: "Booking updated",
      description: `Booking status changed to ${newStatus}.`,
    })
  }

  const formatDate = (dateString) => {
    const options = { weekday: "short", month: "short", day: "numeric", year: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const formatTime = (dateString) => {
    const options = { hour: "numeric", minute: "numeric", hour12: true }
    return new Date(dateString).toLocaleTimeString(undefined, options)
  }

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours > 0 ? `${hours}h` : ""} ${mins > 0 ? `${mins}m` : ""}`
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-600">Confirmed</Badge>
      case "pending":
        return <Badge className="bg-yellow-600">Pending</Badge>
      case "cancelled":
        return <Badge className="bg-red-600">Cancelled</Badge>
      case "completed":
        return <Badge className="bg-blue-600">Completed</Badge>
      default:
        return <Badge className="bg-gray-600">Unknown</Badge>
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-950 to-purple-950 text-white">
      <header className="border-b border-purple-900 bg-black/50 backdrop-blur-sm p-4 sticky top-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center">
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.push("/artist/dashboard")}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Bookings</h1>
            <p className="text-sm text-purple-300">Manage your appointments and consultations</p>
          </div>
        </div>
      </header>

      {/* Replace the main content section with: */}
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-7xl">
          <ComprehensiveBookingSystem />
        </div>
      </main>
    </div>
  )
}
