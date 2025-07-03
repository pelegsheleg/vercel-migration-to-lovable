"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, User, Check, ChevronLeft, ChevronRight, X, Plus, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"

interface TimeSlot {
  time: string
  available: boolean
  booked?: boolean
  clientName?: string
  service?: string
}

interface DaySchedule {
  date: string
  dayName: string
  isToday: boolean
  isPast: boolean
  timeSlots: TimeSlot[]
}

interface BookingRequest {
  id: string
  clientName: string
  clientEmail: string
  clientPhone: string
  clientAvatar?: string
  service: string
  preferredDate: string
  preferredTime: string
  alternativeDate?: string
  alternativeTime?: string
  description: string
  estimatedDuration: number
  estimatedPrice: number
  deposit: number
  status: "pending" | "confirmed" | "cancelled" | "completed"
  createdAt: string
  tattooReference?: string
}

const mockBookingRequests: BookingRequest[] = [
  {
    id: "1",
    clientName: "Alex Chen",
    clientEmail: "alex@example.com",
    clientPhone: "+1 (555) 123-4567",
    clientAvatar: "/placeholder.svg?text=AC",
    service: "Full Sleeve Design",
    preferredDate: "2025-01-25",
    preferredTime: "14:00",
    alternativeDate: "2025-01-26",
    alternativeTime: "10:00",
    description: "Looking for a cyberpunk-themed full sleeve with neon elements and circuit patterns.",
    estimatedDuration: 180,
    estimatedPrice: 800,
    deposit: 150,
    status: "pending",
    createdAt: "2025-01-20",
    tattooReference: "/images/tattoo-cyberpunk.png",
  },
  {
    id: "2",
    clientName: "Jordan Smith",
    clientEmail: "jordan@example.com",
    clientPhone: "+1 (555) 987-6543",
    clientAvatar: "/placeholder.svg?text=JS",
    service: "Japanese Koi Half Sleeve",
    preferredDate: "2025-01-27",
    preferredTime: "11:00",
    description: "Traditional Japanese koi design with water elements in red and blue colors.",
    estimatedDuration: 120,
    estimatedPrice: 600,
    deposit: 100,
    status: "confirmed",
    createdAt: "2025-01-18",
    tattooReference: "/images/tattoo-japanese.png",
  },
]

const generateCalendarData = (): DaySchedule[] => {
  const days: DaySchedule[] = []
  const today = new Date()

  for (let i = 0; i < 14; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)

    const timeSlots: TimeSlot[] = []
    const workingHours = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"]

    workingHours.forEach((time) => {
      const isBooked = Math.random() > 0.7 // 30% chance of being booked
      timeSlots.push({
        time,
        available: !isBooked,
        booked: isBooked,
        clientName: isBooked ? "Existing Client" : undefined,
        service: isBooked ? "Tattoo Session" : undefined,
      })
    })

    days.push({
      date: date.toISOString().split("T")[0],
      dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
      isToday: i === 0,
      isPast: false,
      timeSlots,
    })
  }

  return days
}

export function ComprehensiveBookingSystem() {
  const [calendarData, setCalendarData] = useState<DaySchedule[]>([])
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>(mockBookingRequests)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [showRequestDetails, setShowRequestDetails] = useState<BookingRequest | null>(null)
  const [currentWeek, setCurrentWeek] = useState(0)
  const [activeTab, setActiveTab] = useState("calendar")

  // New booking form state
  const [newBooking, setNewBooking] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    service: "",
    description: "",
    estimatedDuration: 60,
    estimatedPrice: 0,
    deposit: 0,
  })

  useEffect(() => {
    setCalendarData(generateCalendarData())
  }, [])

  const weekData = calendarData.slice(currentWeek * 7, (currentWeek + 1) * 7)

  const handleTimeSlotClick = (date: string, time: string, slot: TimeSlot) => {
    if (slot.available) {
      setSelectedDate(date)
      setSelectedTime(time)
      setShowBookingForm(true)
    }
  }

  const handleBookingSubmit = () => {
    const newBookingRequest: BookingRequest = {
      id: Date.now().toString(),
      ...newBooking,
      preferredDate: selectedDate,
      preferredTime: selectedTime,
      status: "confirmed",
      createdAt: new Date().toISOString().split("T")[0],
    }

    setBookingRequests((prev) => [...prev, newBookingRequest])

    // Update calendar to mark slot as booked
    setCalendarData((prev) =>
      prev.map((day) =>
        day.date === selectedDate
          ? {
              ...day,
              timeSlots: day.timeSlots.map((slot) =>
                slot.time === selectedTime
                  ? {
                      ...slot,
                      available: false,
                      booked: true,
                      clientName: newBooking.clientName,
                      service: newBooking.service,
                    }
                  : slot,
              ),
            }
          : day,
      ),
    )

    setShowBookingForm(false)
    setNewBooking({
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      service: "",
      description: "",
      estimatedDuration: 60,
      estimatedPrice: 0,
      deposit: 0,
    })

    toast({
      title: "Booking confirmed",
      description: `Appointment scheduled for ${selectedDate} at ${selectedTime}`,
    })
  }

  const handleRequestAction = (requestId: string, action: "confirm" | "cancel") => {
    setBookingRequests((prev) =>
      prev.map((request) =>
        request.id === requestId ? { ...request, status: action === "confirm" ? "confirmed" : "cancelled" } : request,
      ),
    )

    const request = bookingRequests.find((r) => r.id === requestId)
    if (request && action === "confirm") {
      // Update calendar
      setCalendarData((prev) =>
        prev.map((day) =>
          day.date === request.preferredDate
            ? {
                ...day,
                timeSlots: day.timeSlots.map((slot) =>
                  slot.time === request.preferredTime
                    ? {
                        ...slot,
                        available: false,
                        booked: true,
                        clientName: request.clientName,
                        service: request.service,
                      }
                    : slot,
                ),
              }
            : day,
        ),
      )
    }

    toast({
      title: action === "confirm" ? "Booking confirmed" : "Booking cancelled",
      description: `Request from ${request?.clientName} has been ${action}ed.`,
    })
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-600">Pending</Badge>
      case "confirmed":
        return <Badge className="bg-green-600">Confirmed</Badge>
      case "cancelled":
        return <Badge className="bg-red-600">Cancelled</Badge>
      case "completed":
        return <Badge className="bg-blue-600">Completed</Badge>
      default:
        return <Badge className="bg-gray-600">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Booking Management</h2>
          <p className="text-purple-300">Manage your appointments and availability</p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => setShowBookingForm(true)} className="bg-purple-700 hover:bg-purple-600">
            <Plus className="mr-2 h-4 w-4" />
            New Booking
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-black/40 border border-purple-500/30 p-1">
          <TabsTrigger value="calendar" className="data-[state=active]:bg-purple-700">
            <Calendar className="mr-2 h-4 w-4" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="requests" className="data-[state=active]:bg-purple-700">
            <User className="mr-2 h-4 w-4" />
            Booking Requests ({bookingRequests.filter((r) => r.status === "pending").length})
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-purple-700">
            <Clock className="mr-2 h-4 w-4" />
            Upcoming Bookings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-6">
          <Card className="bg-black/40 border-purple-500/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Weekly Schedule</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))}
                    disabled={currentWeek === 0}
                    className="bg-black/40 border-purple-500/30"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentWeek(currentWeek + 1)}
                    disabled={currentWeek >= 1}
                    className="bg-black/40 border-purple-500/30"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {weekData.map((day, index) => (
                  <div key={index} className="text-center">
                    <div
                      className={`p-2 rounded-lg ${day.isToday ? "bg-purple-800/30 border border-purple-500/50" : ""}`}
                    >
                      <div className="text-sm font-medium text-white">{day.dayName}</div>
                      <div className="text-xs text-purple-300">{new Date(day.date).getDate()}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {weekData.map((day, dayIndex) => (
                  <div key={dayIndex} className="space-y-1">
                    {day.timeSlots.map((slot, slotIndex) => (
                      <div
                        key={slotIndex}
                        className={`p-2 rounded text-xs cursor-pointer transition-colors ${
                          slot.available
                            ? "bg-green-900/30 border border-green-500/30 hover:bg-green-800/40 text-green-300"
                            : slot.booked
                              ? "bg-red-900/30 border border-red-500/30 text-red-300"
                              : "bg-gray-900/30 border border-gray-500/30 text-gray-400"
                        }`}
                        onClick={() => handleTimeSlotClick(day.date, slot.time, slot)}
                      >
                        <div className="font-medium">{formatTime(slot.time)}</div>
                        {slot.booked && <div className="truncate">{slot.clientName}</div>}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-6 mt-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-900/30 border border-green-500/30 rounded"></div>
                  <span className="text-purple-300">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-900/30 border border-red-500/30 rounded"></div>
                  <span className="text-purple-300">Booked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-900/30 border border-gray-500/30 rounded"></div>
                  <span className="text-purple-300">Unavailable</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="mt-6">
          <div className="space-y-4">
            {bookingRequests
              .filter((request) => request.status === "pending")
              .map((request) => (
                <Card key={request.id} className="bg-black/40 border-purple-500/30">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={request.clientAvatar || "/placeholder.svg"} alt={request.clientName} />
                            <AvatarFallback>{request.clientName[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium text-white">{request.clientName}</h3>
                            <p className="text-sm text-purple-300">{request.clientEmail}</p>
                            <p className="text-sm text-purple-300">{request.clientPhone}</p>
                          </div>
                          {getStatusBadge(request.status)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label className="text-purple-300">Service</Label>
                            <p className="text-white">{request.service}</p>
                          </div>
                          <div>
                            <Label className="text-purple-300">Preferred Date & Time</Label>
                            <p className="text-white">
                              {formatDate(request.preferredDate)} at {formatTime(request.preferredTime)}
                            </p>
                          </div>
                          <div>
                            <Label className="text-purple-300">Duration</Label>
                            <p className="text-white">{request.estimatedDuration} minutes</p>
                          </div>
                          <div>
                            <Label className="text-purple-300">Estimated Price</Label>
                            <p className="text-white">
                              ${request.estimatedPrice} (${request.deposit} deposit)
                            </p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <Label className="text-purple-300">Description</Label>
                          <p className="text-white mt-1">{request.description}</p>
                        </div>

                        {request.alternativeDate && (
                          <div className="mb-4">
                            <Label className="text-purple-300">Alternative Date & Time</Label>
                            <p className="text-white">
                              {formatDate(request.alternativeDate)} at {formatTime(request.alternativeTime!)}
                            </p>
                          </div>
                        )}
                      </div>

                      {request.tattooReference && (
                        <div className="w-full md:w-48">
                          <Label className="text-purple-300">Reference Image</Label>
                          <img
                            src={request.tattooReference || "/placeholder.svg"}
                            alt="Tattoo reference"
                            className="w-full h-48 object-cover rounded-lg mt-2"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-6">
                      <Button
                        onClick={() => handleRequestAction(request.id, "confirm")}
                        className="bg-green-700 hover:bg-green-600"
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Confirm Booking
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleRequestAction(request.id, "cancel")}
                        className="bg-red-900/30 border-red-500/30 hover:bg-red-800/50"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Decline
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowRequestDetails(request)}
                        className="bg-black/40 border-purple-500/30"
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

            {bookingRequests.filter((request) => request.status === "pending").length === 0 && (
              <Card className="bg-black/40 border-purple-500/30">
                <CardContent className="p-6 text-center">
                  <User className="h-12 w-12 mx-auto text-purple-400 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No Pending Requests</h3>
                  <p className="text-purple-300">All booking requests have been processed.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
          <div className="space-y-4">
            {bookingRequests
              .filter((request) => request.status === "confirmed")
              .map((request) => (
                <Card key={request.id} className="bg-black/40 border-purple-500/30">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={request.clientAvatar || "/placeholder.svg"} alt={request.clientName} />
                          <AvatarFallback>{request.clientName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-white">{request.clientName}</h3>
                          <p className="text-sm text-purple-300">{request.service}</p>
                          <p className="text-sm text-purple-300">
                            {formatDate(request.preferredDate)} at {formatTime(request.preferredTime)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {getStatusBadge(request.status)}
                        <Button variant="outline" size="sm" className="bg-black/40 border-purple-500/30">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* New Booking Dialog */}
      <Dialog open={showBookingForm} onOpenChange={setShowBookingForm}>
        <DialogContent className="bg-gray-900 border-purple-500/30 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Booking</DialogTitle>
            <DialogDescription className="text-purple-300">
              {selectedDate &&
                selectedTime &&
                `Schedule appointment for ${formatDate(selectedDate)} at ${formatTime(selectedTime)}`}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label>Client Name</Label>
                <Input
                  value={newBooking.clientName}
                  onChange={(e) => setNewBooking({ ...newBooking, clientName: e.target.value })}
                  placeholder="Enter client name"
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={newBooking.clientEmail}
                  onChange={(e) => setNewBooking({ ...newBooking, clientEmail: e.target.value })}
                  placeholder="client@example.com"
                />
              </div>

              <div>
                <Label>Phone</Label>
                <Input
                  value={newBooking.clientPhone}
                  onChange={(e) => setNewBooking({ ...newBooking, clientPhone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Service</Label>
                <Select
                  value={newBooking.service}
                  onValueChange={(value) => setNewBooking({ ...newBooking, service: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="small-tattoo">Small Tattoo</SelectItem>
                    <SelectItem value="medium-tattoo">Medium Tattoo</SelectItem>
                    <SelectItem value="large-tattoo">Large Tattoo</SelectItem>
                    <SelectItem value="sleeve">Sleeve</SelectItem>
                    <SelectItem value="touch-up">Touch-up</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Duration (minutes)</Label>
                <Input
                  type="number"
                  value={newBooking.estimatedDuration}
                  onChange={(e) => setNewBooking({ ...newBooking, estimatedDuration: Number.parseInt(e.target.value) })}
                  min="30"
                  step="30"
                />
              </div>

              <div>
                <Label>Estimated Price ($)</Label>
                <Input
                  type="number"
                  value={newBooking.estimatedPrice}
                  onChange={(e) => setNewBooking({ ...newBooking, estimatedPrice: Number.parseInt(e.target.value) })}
                  min="0"
                />
              </div>
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={newBooking.description}
              onChange={(e) => setNewBooking({ ...newBooking, description: e.target.value })}
              placeholder="Describe the tattoo design and any special requirements..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBookingForm(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleBookingSubmit}
              className="bg-purple-700 hover:bg-purple-600"
              disabled={!newBooking.clientName || !newBooking.service}
            >
              Create Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Details Dialog */}
      {showRequestDetails && (
        <Dialog open={!!showRequestDetails} onOpenChange={() => setShowRequestDetails(null)}>
          <DialogContent className="bg-gray-900 border-purple-500/30 text-white max-w-3xl">
            <DialogHeader>
              <DialogTitle>Booking Request Details</DialogTitle>
              <DialogDescription className="text-purple-300">
                Complete information for {showRequestDetails.clientName}'s booking request
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={showRequestDetails.clientAvatar || "/placeholder.svg"}
                      alt={showRequestDetails.clientName}
                    />
                    <AvatarFallback>{showRequestDetails.clientName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium text-white">{showRequestDetails.clientName}</h3>
                    <p className="text-purple-300">{showRequestDetails.clientEmail}</p>
                    <p className="text-purple-300">{showRequestDetails.clientPhone}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-purple-300">Service Requested</Label>
                    <p className="text-white">{showRequestDetails.service}</p>
                  </div>

                  <div>
                    <Label className="text-purple-300">Preferred Date & Time</Label>
                    <p className="text-white">
                      {formatDate(showRequestDetails.preferredDate)} at {formatTime(showRequestDetails.preferredTime)}
                    </p>
                  </div>

                  <div>
                    <Label className="text-purple-300">Estimated Duration</Label>
                    <p className="text-white">{showRequestDetails.estimatedDuration} minutes</p>
                  </div>

                  <div>
                    <Label className="text-purple-300">Pricing</Label>
                    <p className="text-white">
                      Total: ${showRequestDetails.estimatedPrice} | Deposit: ${showRequestDetails.deposit}
                    </p>
                  </div>

                  <div>
                    <Label className="text-purple-300">Request Date</Label>
                    <p className="text-white">{formatDate(showRequestDetails.createdAt)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {showRequestDetails.tattooReference && (
                  <div>
                    <Label className="text-purple-300">Reference Image</Label>
                    <img
                      src={showRequestDetails.tattooReference || "/placeholder.svg"}
                      alt="Tattoo reference"
                      className="w-full h-64 object-cover rounded-lg mt-2"
                    />
                  </div>
                )}

                <div>
                  <Label className="text-purple-300">Description</Label>
                  <div className="bg-black/30 p-3 rounded-lg mt-2">
                    <p className="text-white">{showRequestDetails.description}</p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRequestDetails(null)}>
                Close
              </Button>
              {showRequestDetails.status === "pending" && (
                <>
                  <Button
                    onClick={() => {
                      handleRequestAction(showRequestDetails.id, "cancel")
                      setShowRequestDetails(null)
                    }}
                    variant="outline"
                    className="bg-red-900/30 border-red-500/30 hover:bg-red-800/50"
                  >
                    Decline Request
                  </Button>
                  <Button
                    onClick={() => {
                      handleRequestAction(showRequestDetails.id, "confirm")
                      setShowRequestDetails(null)
                    }}
                    className="bg-green-700 hover:bg-green-600"
                  >
                    Confirm Booking
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
