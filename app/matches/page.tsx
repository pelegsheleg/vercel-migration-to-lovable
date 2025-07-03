"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import {
  CalendarIcon,
  Upload,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Star,
  DollarSign,
  Home,
  Clock,
  Crosshair,
  Info,
  Zap,
  Eye,
  GitCompare,
  X,
  TrendingUp,
  CalendarPlus2Icon as CalendarIcon2,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api"

interface MatchPreferences {
  image: string | null
  style: string
  price: number[]
  date: Date | undefined
  startTime: string
  endTime: string
  location: string
  radius: number
  experience: string
}

interface TimeSlot {
  start: string
  end: string
  type: "booked" | "busy" | "unavailable"
  client?: string
  description?: string
}

interface DayAvailability {
  status: "available" | "busy" | "booked" | "unavailable"
  timeSlots?: TimeSlot[]
  availableSlots?: string[]
}

interface ArtistMetrics {
  matchBreakdown: {
    overall: number
    factors: {
      style: { score: number; weight: number; explanation: string }
      complexity: { score: number; weight: number; explanation: string }
      colorVibrancy: { score: number; weight: number; explanation: string }
      artistRating: { score: number; weight: number; explanation: string }
      distance: { score: number; weight: number; explanation: string }
      priceAlignment: { score: number; weight: number; explanation: string }
    }
  }
  radarData: {
    technical: number
    creativity: number
    speed: number
    communication: number
    reliability: number
  }
  portfolioQuality: {
    score: number
    clarity: number
    contrast: number
    linePrecision: number
    callout: string
  }
  consistencyScore: number
  speedComplexity: {
    avgTimeSmall: string
    avgTimeMedium: string
    avgTimeLarge: string
    expertise: string[]
  }
  pricing: {
    basedOnSessions: number
    avgFinalCost: string
    explanation: string
    estimatedRange: {
      min: number
      max: number
      currency: string
      confidence: number
      confidenceInterval: number
    }
  }
  availability: {
    [key: string]: DayAvailability
  }
}

interface Artist {
  id: number
  name: string
  avatar: string
  specialization: string
  rating: number
  distance: number
  hourlyRate: number
  portfolio: string[]
  bio: string
  lat: number
  lng: number
  metrics: ArtistMetrics
}

const styles = [
  { name: "Traditional", icon: "🌹" },
  { name: "Blackwork", icon: "⚫" },
  { name: "Watercolor", icon: "🎨" },
  { name: "Geometric", icon: "🔷" },
  { name: "Minimalist", icon: "➖" },
  { name: "Realism", icon: "📷" },
  { name: "Japanese", icon: "🌸" },
  { name: "Tribal", icon: "🔺" },
]

// Generate detailed availability data for the next 30 days
const generateDetailedAvailabilityData = () => {
  const availability: { [key: string]: DayAvailability } = {}
  const today = new Date()

  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const dateKey = date.toISOString().split("T")[0]

    // Random availability status
    const statuses: ("available" | "busy" | "booked" | "unavailable")[] = ["available", "busy", "booked", "unavailable"]
    const weights = [0.4, 0.3, 0.2, 0.1] // Higher chance of being available
    const random = Math.random()
    let cumulativeWeight = 0
    let selectedStatus = "available"

    for (let j = 0; j < statuses.length; j++) {
      cumulativeWeight += weights[j]
      if (random <= cumulativeWeight) {
        selectedStatus = statuses[j]
        break
      }
    }

    // Generate time slots for non-available days
    let timeSlots: TimeSlot[] = []
    let availableSlots: string[] = []

    if (selectedStatus === "available") {
      availableSlots = ["9:00 AM - 12:00 PM", "1:00 PM - 5:00 PM", "6:00 PM - 8:00 PM"]
    } else {
      // Generate random booked/busy slots
      const possibleSlots = [
        { start: "9:00 AM", end: "11:00 AM" },
        { start: "11:30 AM", end: "1:30 PM" },
        { start: "2:00 PM", end: "4:00 PM" },
        { start: "4:30 PM", end: "6:30 PM" },
        { start: "7:00 PM", end: "9:00 PM" },
      ]

      const numSlots = Math.floor(Math.random() * 3) + 1 // 1-3 slots
      const selectedSlots = possibleSlots.sort(() => 0.5 - Math.random()).slice(0, numSlots)

      timeSlots = selectedSlots.map((slot, index) => ({
        start: slot.start,
        end: slot.end,
        type: selectedStatus === "booked" ? "booked" : selectedStatus === "busy" ? "busy" : "unavailable",
        client: selectedStatus === "booked" ? `Client ${String.fromCharCode(65 + index)}` : undefined,
        description:
          selectedStatus === "busy"
            ? "Personal appointment"
            : selectedStatus === "unavailable"
              ? "Studio closed"
              : undefined,
      }))

      // Add some available slots for busy days
      if (selectedStatus === "busy") {
        availableSlots = ["6:00 PM - 8:00 PM"]
      }
    }

    availability[dateKey] = {
      status: selectedStatus,
      timeSlots: timeSlots.length > 0 ? timeSlots : undefined,
      availableSlots: availableSlots.length > 0 ? availableSlots : undefined,
    }
  }

  return availability
}

const mockArtists: Artist[] = [
  {
    id: 1,
    name: "Neo Ink",
    avatar: "/placeholder.svg?text=NI",
    specialization: "Traditional",
    rating: 4.8,
    distance: 2.3,
    hourlyRate: 150,
    portfolio: [
      "/images/tattoo-mythological.png",
      "/images/tattoo-illuminati-hand.png",
      "/images/tattoo-symbolic-patchwork.png",
    ],
    bio: "Specializing in vibrant traditional designs with a modern twist.",
    lat: 40.7128,
    lng: -74.006,
    metrics: {
      matchBreakdown: {
        overall: 95,
        factors: {
          style: { score: 98, weight: 50, explanation: "Captures the look & feel—your #1 priority" },
          complexity: { score: 85, weight: 20, explanation: "Ensures they can handle your design's intricacy" },
          colorVibrancy: {
            score: 90,
            weight: 10,
            explanation: "Aligns with your desired palette (B&W vs. full color)",
          },
          artistRating: { score: 92, weight: 10, explanation: "Social proof: consistency & quality over time" },
          distance: { score: 70, weight: 5, explanation: "Only a minor factor—so you won't sacrifice style" },
          priceAlignment: {
            score: 80,
            weight: 5,
            explanation: "We show you ranges, but price never overrides style fit",
          },
        },
      },
      radarData: {
        technical: 90,
        creativity: 95,
        speed: 85,
        communication: 92,
        reliability: 88,
      },
      portfolioQuality: {
        score: 92,
        clarity: 95,
        contrast: 88,
        linePrecision: 93,
        callout: "✨ Exceptional line work & color vibrancy",
      },
      consistencyScore: 94,
      speedComplexity: {
        avgTimeSmall: "1.2 hrs",
        avgTimeMedium: "3.5 hrs",
        avgTimeLarge: "8-12 hrs",
        expertise: ["Large-scale color", "Fine detail work"],
      },
      pricing: {
        basedOnSessions: 24,
        avgFinalCost: "$180-$220",
        explanation: "Based on 24 sessions, includes touch-ups and consultation",
        estimatedRange: {
          min: 820,
          max: 950,
          currency: "₪",
          confidence: 87,
          confidenceInterval: 60,
        },
      },
      availability: generateDetailedAvailabilityData(),
    },
  },
  {
    id: 2,
    name: "Blackwork Beast",
    avatar: "/placeholder.svg?text=BB",
    specialization: "Blackwork",
    rating: 4.6,
    distance: 3.1,
    hourlyRate: 130,
    portfolio: [
      "/images/tattoo-fineline-bird.jpeg",
      "/images/tattoo-graphic-style.jpeg",
      "/images/tattoo-blackwork.png",
    ],
    bio: "Bold, intricate blackwork designs that make a statement.",
    lat: 40.7282,
    lng: -73.9942,
    metrics: {
      matchBreakdown: {
        overall: 88,
        factors: {
          style: { score: 92, weight: 50, explanation: "Captures the look & feel—your #1 priority" },
          complexity: { score: 95, weight: 20, explanation: "Ensures they can handle your design's intricacy" },
          colorVibrancy: {
            score: 75,
            weight: 10,
            explanation: "Aligns with your desired palette (B&W vs. full color)",
          },
          artistRating: { score: 88, weight: 10, explanation: "Social proof: consistency & quality over time" },
          distance: { score: 65, weight: 5, explanation: "Only a minor factor—so you won't sacrifice style" },
          priceAlignment: {
            score: 95,
            weight: 5,
            explanation: "We show you ranges, but price never overrides style fit",
          },
        },
      },
      radarData: {
        technical: 95,
        creativity: 88,
        speed: 92,
        communication: 85,
        reliability: 90,
      },
      portfolioQuality: {
        score: 89,
        clarity: 92,
        contrast: 95,
        linePrecision: 88,
        callout: "🖤 Bold contrast & precision",
      },
      consistencyScore: 96,
      speedComplexity: {
        avgTimeSmall: "0.8 hrs",
        avgTimeMedium: "2.5 hrs",
        avgTimeLarge: "6-8 hrs",
        expertise: ["Geometric patterns", "Bold linework"],
      },
      pricing: {
        basedOnSessions: 18,
        avgFinalCost: "$140-$180",
        explanation: "Based on 18 sessions, efficient workflow keeps costs predictable",
        estimatedRange: {
          min: 680,
          max: 780,
          currency: "₪",
          confidence: 92,
          confidenceInterval: 45,
        },
      },
      availability: generateDetailedAvailabilityData(),
    },
  },
  {
    id: 3,
    name: "Watercolor Wonder",
    avatar: "/placeholder.svg?text=WW",
    specialization: "Watercolor",
    rating: 4.9,
    distance: 1.8,
    hourlyRate: 180,
    portfolio: ["/images/tattoo-watercolor.png", "/images/tattoo-cyberpunk.png", "/images/tattoo-geometric.png"],
    bio: "Bringing your ideas to life with vibrant watercolor techniques.",
    lat: 40.7589,
    lng: -73.9851,
    metrics: {
      matchBreakdown: {
        overall: 92,
        factors: {
          style: { score: 89, weight: 50, explanation: "Captures the look & feel—your #1 priority" },
          complexity: { score: 78, weight: 20, explanation: "Ensures they can handle your design's intricacy" },
          colorVibrancy: {
            score: 98,
            weight: 10,
            explanation: "Aligns with your desired palette (B&W vs. full color)",
          },
          artistRating: { score: 95, weight: 10, explanation: "Social proof: consistency & quality over time" },
          distance: { score: 85, weight: 5, explanation: "Only a minor factor—so you won't sacrifice style" },
          priceAlignment: {
            score: 70,
            weight: 5,
            explanation: "We show you ranges, but price never overrides style fit",
          },
        },
      },
      radarData: {
        technical: 88,
        creativity: 98,
        speed: 78,
        communication: 95,
        reliability: 92,
      },
      portfolioQuality: {
        score: 95,
        clarity: 90,
        contrast: 98,
        linePrecision: 85,
        callout: "🌈 Stunning color blends & artistry",
      },
      consistencyScore: 87,
      speedComplexity: {
        avgTimeSmall: "1.8 hrs",
        avgTimeMedium: "4.2 hrs",
        avgTimeLarge: "10-15 hrs",
        expertise: ["Color blending", "Abstract concepts"],
      },
      pricing: {
        basedOnSessions: 15,
        avgFinalCost: "$220-$280",
        explanation: "Based on 15 sessions, premium pricing for specialized technique",
        estimatedRange: {
          min: 1120,
          max: 1350,
          currency: "₪",
          confidence: 79,
          confidenceInterval: 85,
        },
      },
      availability: generateDetailedAvailabilityData(),
    },
  },
]

// Enhanced Match Breakdown Tooltip Component with Weighting System
const MatchBreakdownTooltip: React.FC<{ metrics: ArtistMetrics["matchBreakdown"] }> = ({ metrics }) => {
  const factors = Object.entries(metrics.factors)

  return (
    <div className="space-y-4 p-3 max-w-sm">
      <div className="text-center border-b border-purple-500/30 pb-2">
        <div className="text-lg font-bold text-green-400">{metrics.overall}% Match</div>
        <div className="text-xs text-purple-300">AI-Driven Weighted Analysis</div>
      </div>

      <div className="space-y-3">
        {factors.map(([key, factor]) => {
          const displayName =
            key === "colorVibrancy"
              ? "Color Vibrancy"
              : key === "artistRating"
                ? "Artist Rating"
                : key === "priceAlignment"
                  ? "Price Alignment"
                  : key.charAt(0).toUpperCase() + key.slice(1)

          return (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-300 font-medium">{displayName}:</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">{factor.score}%</span>
                  <span className="text-xs text-purple-400">({factor.weight}% Weight)</span>
                </div>
              </div>

              <div className="w-full bg-purple-950 rounded-full h-1.5 mb-1">
                <div
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    factor.weight >= 50
                      ? "bg-green-400"
                      : factor.weight >= 20
                        ? "bg-blue-400"
                        : factor.weight >= 10
                          ? "bg-yellow-400"
                          : "bg-purple-400",
                  )}
                  style={{ width: `${factor.score}%` }}
                />
              </div>

              <p className="text-xs text-gray-300 italic leading-tight">{factor.explanation}</p>
            </div>
          )
        })}
      </div>

      <div className="text-xs text-purple-300 pt-2 border-t border-purple-500/30">
        <div className="font-medium mb-1">Weight Priority:</div>
        <div className="space-y-0.5">
          <div>🎯 Style (50%) - Primary match factor</div>
          <div>🔧 Complexity (20%) - Technical capability</div>
          <div>🎨 Color/Rating (10% each) - Quality indicators</div>
          <div>📍 Distance/Price (5% each) - Minor factors</div>
        </div>
      </div>
    </div>
  )
}

// Dynamic Price Estimator Component
const DynamicPriceEstimator: React.FC<{
  pricing: ArtistMetrics["pricing"]
  onHover?: () => void
  onLeave?: () => void
}> = ({ pricing, onHover, onLeave }) => {
  const [currentEstimate, setCurrentEstimate] = useState(pricing.estimatedRange.min)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (isHovered) {
      const interval = setInterval(() => {
        setCurrentEstimate((prev) => {
          const variation = Math.random() * 40 - 20 // ±20 variation
          const newEstimate = pricing.estimatedRange.min + variation
          return Math.max(pricing.estimatedRange.min - 50, Math.min(pricing.estimatedRange.max + 50, newEstimate))
        })
      }, 500)

      return () => clearInterval(interval)
    }
  }, [isHovered, pricing.estimatedRange])

  return (
    <div
      className="space-y-1"
      onMouseEnter={() => {
        setIsHovered(true)
        onHover?.()
      }}
      onMouseLeave={() => {
        setIsHovered(false)
        onLeave?.()
      }}
    >
      <div className="flex items-center gap-2">
        <TrendingUp className="h-3 w-3 text-green-400" />
        <span className="text-sm font-medium text-white">
          {pricing.estimatedRange.currency}
          {Math.round(currentEstimate)}+
        </span>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-xs text-green-400"
          >
            Live estimate
          </motion.div>
        )}
      </div>

      <div className="text-xs text-purple-300">
        ±{pricing.estimatedRange.currency}
        {pricing.estimatedRange.confidenceInterval}
        <span className="text-green-400 ml-1">({pricing.estimatedRange.confidence}% confidence)</span>
      </div>
    </div>
  )
}

// Enhanced Availability Heat-map Component with Detailed Time Slots
const AvailabilityHeatMap: React.FC<{ availability: ArtistMetrics["availability"] }> = ({ availability }) => {
  const today = new Date()
  const days = []

  for (let i = 0; i < 14; i++) {
    // Show 2 weeks
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    days.push(date)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500"
      case "busy":
        return "bg-yellow-500"
      case "booked":
        return "bg-red-500"
      case "unavailable":
        return "bg-gray-600"
      default:
        return "bg-gray-400"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "available":
        return "Available"
      case "busy":
        return "Busy"
      case "booked":
        return "Booked"
      case "unavailable":
        return "Unavailable"
      default:
        return "Unknown"
    }
  }

  const formatTimeSlots = (dayData: DayAvailability) => {
    if (dayData.status === "available") {
      return (
        <div className="space-y-1">
          <div className="font-medium text-green-400">Available Times:</div>
          {dayData.availableSlots?.map((slot, index) => (
            <div key={index} className="text-xs text-green-300">
              ✓ {slot}
            </div>
          ))}
        </div>
      )
    }

    if (dayData.timeSlots && dayData.timeSlots.length > 0) {
      return (
        <div className="space-y-2">
          <div className="font-medium text-red-400">Booked/Busy Times:</div>
          {dayData.timeSlots.map((slot, index) => (
            <div key={index} className="text-xs space-y-0.5">
              <div
                className={cn(
                  "font-medium",
                  slot.type === "booked" ? "text-red-300" : slot.type === "busy" ? "text-yellow-300" : "text-gray-300",
                )}
              >
                {slot.type === "booked" ? "🔒" : slot.type === "busy" ? "⏰" : "❌"} {slot.start} - {slot.end}
              </div>
              {slot.client && <div className="text-gray-400 ml-4">Client: {slot.client}</div>}
              {slot.description && <div className="text-gray-400 ml-4">{slot.description}</div>}
            </div>
          ))}

          {dayData.availableSlots && dayData.availableSlots.length > 0 && (
            <div className="mt-2 pt-2 border-t border-purple-500/30">
              <div className="font-medium text-green-400 text-xs">Still Available:</div>
              {dayData.availableSlots.map((slot, index) => (
                <div key={index} className="text-xs text-green-300">
                  ✓ {slot}
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }

    return null
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 text-xs text-purple-300">
        <CalendarIcon2 className="h-3 w-3" />
        <span>Next 2 weeks</span>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const dateKey = date.toISOString().split("T")[0]
          const dayData = availability[dateKey] || { status: "unavailable" }

          return (
            <Tooltip key={index}>
              <TooltipTrigger>
                <div
                  className={cn(
                    "w-4 h-4 rounded-sm cursor-help transition-all hover:scale-110 hover:ring-2 hover:ring-purple-400",
                    getStatusColor(dayData.status),
                  )}
                />
              </TooltipTrigger>
              <TooltipContent className="bg-gray-900 border border-purple-500/30 max-w-xs p-3">
                <div className="space-y-2">
                  <div className="border-b border-purple-500/30 pb-1">
                    <div className="font-medium text-white">{format(date, "EEEE, MMM dd")}</div>
                    <div
                      className={cn(
                        "text-sm font-medium",
                        dayData.status === "available"
                          ? "text-green-400"
                          : dayData.status === "busy"
                            ? "text-yellow-400"
                            : dayData.status === "booked"
                              ? "text-red-400"
                              : "text-gray-400",
                      )}
                    >
                      {getStatusLabel(dayData.status)}
                    </div>
                  </div>

                  {formatTimeSlots(dayData)}
                </div>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>

      <div className="flex items-center gap-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-sm" />
          <span className="text-purple-300">Available</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-yellow-500 rounded-sm" />
          <span className="text-purple-300">Busy</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-red-500 rounded-sm" />
          <span className="text-purple-300">Booked</span>
        </div>
      </div>
    </div>
  )
}

// Mini Radar Chart Component
const MiniRadarChart: React.FC<{ data: ArtistMetrics["radarData"]; size?: number }> = ({ data, size = 80 }) => {
  const center = size / 2
  const radius = size / 2 - 10
  const angles = [0, 72, 144, 216, 288] // 5 points, 72 degrees apart

  const points = Object.values(data).map((value, index) => {
    const angle = (angles[index] - 90) * (Math.PI / 180) // Start from top
    const r = (value / 100) * radius
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    }
  })

  const pathData = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ") + " Z"

  return (
    <div className="relative">
      <svg width={size} height={size} className="transform rotate-0">
        {/* Background circles */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale) => (
          <circle
            key={scale}
            cx={center}
            cy={center}
            r={radius * scale}
            fill="none"
            stroke="rgb(147 51 234 / 0.2)"
            strokeWidth="1"
          />
        ))}

        {/* Data area */}
        <path d={pathData} fill="rgb(147 51 234 / 0.3)" stroke="rgb(147 51 234)" strokeWidth="2" />

        {/* Data points */}
        {points.map((point, index) => (
          <circle key={index} cx={point.x} cy={point.y} r="3" fill="rgb(147 51 234)" />
        ))}
      </svg>
    </div>
  )
}

// Artist Comparison Modal
const ArtistComparisonModal: React.FC<{
  artists: Artist[]
  isOpen: boolean
  onClose: () => void
}> = ({ artists, isOpen, onClose }) => {
  if (artists.length !== 2) return null

  const [artist1, artist2] = artists

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-950 text-white border border-purple-500 max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Artist Comparison</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-8">
          {[artist1, artist2].map((artist, index) => (
            <div key={artist.id} className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 ring-2 ring-purple-500">
                  <AvatarImage src={artist.avatar || "/placeholder.svg"} alt={artist.name} />
                  <AvatarFallback>{artist.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{artist.name}</h3>
                  <p className="text-purple-300">{artist.specialization}</p>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span>{artist.rating}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-purple-300">Match Score:</span>
                  <Badge className="bg-purple-700">{artist.metrics.matchBreakdown.overall}%</Badge>
                </div>

                <div className="flex justify-between">
                  <span className="text-purple-300">Portfolio Score:</span>
                  <span className="text-white">{artist.metrics.portfolioQuality.score}/100</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-purple-300">Style Consistency:</span>
                  <span className="text-white">{artist.metrics.consistencyScore}%</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-purple-300">Avg. Small Piece:</span>
                  <span className="text-white">{artist.metrics.speedComplexity.avgTimeSmall}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-purple-300">Hourly Rate:</span>
                  <span className="text-white">${artist.hourlyRate}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-purple-300">Distance:</span>
                  <span className="text-white">{artist.distance} miles</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-purple-300 mb-2">Strengths Radar</h4>
                <div className="flex justify-center">
                  <MiniRadarChart data={artist.metrics.radarData} size={120} />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-purple-300 mb-2">Expertise</h4>
                <div className="flex flex-wrap gap-1">
                  {artist.metrics.speedComplexity.expertise.map((skill, skillIndex) => (
                    <Badge key={skillIndex} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function MatchesPage() {
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(25)
  const [preferences, setPreferences] = useState<MatchPreferences>({
    image: null,
    style: "",
    price: [200],
    date: undefined,
    startTime: "",
    endTime: "",
    location: "",
    radius: 10,
    experience: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [matchedArtists, setMatchedArtists] = useState<Artist[]>([])
  const [showMap, setShowMap] = useState(false)
  const [locationMethod, setLocationMethod] = useState<"manual" | "current">("manual")
  const [compareMode, setCompareMode] = useState(false)
  const [selectedForComparison, setSelectedForComparison] = useState<Artist[]>([])
  const [showComparison, setShowComparison] = useState(false)
  const [selectedArtistForDialog, setSelectedArtistForDialog] = useState<Artist | null>(null)

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreferences((prev) => ({ ...prev, image: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const nextStep = () => {
    setStep((prev) => prev + 1)
    setProgress((prev) => Math.min(100, prev + 25))
  }

  const prevStep = () => {
    setStep((prev) => prev - 1)
    setProgress((prev) => Math.max(0, prev - 25))
  }

  const findMatches = useCallback(async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setMatchedArtists(mockArtists)
    } catch (error) {
      console.error("Error finding matches:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleLocationMethod = (method: "manual" | "current") => {
    setLocationMethod(method)
    if (method === "current") {
      // Simulating geolocation API
      setPreferences((prev) => ({ ...prev, location: "New York, NY" }))
    }
  }

  const toggleCompareSelection = (artist: Artist) => {
    setSelectedForComparison((prev) => {
      const isSelected = prev.find((a) => a.id === artist.id)
      if (isSelected) {
        return prev.filter((a) => a.id !== artist.id)
      } else if (prev.length < 2) {
        return [...prev, artist]
      }
      return prev
    })
  }

  const startComparison = () => {
    if (selectedForComparison.length === 2) {
      setShowComparison(true)
    }
  }

  const exitCompareMode = () => {
    setCompareMode(false)
    setSelectedForComparison([])
  }

  useEffect(() => {
    if (step === 4) {
      findMatches()
    }
  }, [step, findMatches])

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-purple-950 text-white">
        <div className="sticky top-0 z-10 bg-black/40 backdrop-blur-sm border-b border-purple-500/20">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <Link href="/" className="flex items-center gap-2">
                <motion.div className="relative w-8 h-8" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dog%20face%20image%20background-80tC7pNknHSwIU4KYQODUQRYlZl8t1.png"
                    alt="Tattit Logo"
                    fill
                    className="object-contain"
                  />
                </motion.div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
                  Find Your Artist
                </h1>
              </Link>
            </div>
            <Progress value={progress} className="h-1 bg-purple-950" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeIn}
              transition={{ duration: 0.5 }}
            >
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold">Share Your Vision</h2>
                    <p className="text-purple-300">Upload a reference image of your tattoo idea</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-8 text-center transition-all hover:border-purple-500/50">
                        <label className="cursor-pointer block">
                          <Input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                          <Upload className="w-12 h-12 mx-auto text-purple-400 mb-4" />
                          <p className="text-sm text-purple-300">Click to upload your design</p>
                        </label>
                      </div>
                    </div>

                    {preferences.image ? (
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-purple-900/20">
                        <Image
                          src={preferences.image || "/placeholder.svg"}
                          alt="Reference image"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-square rounded-lg bg-purple-900/20 flex items-center justify-center">
                        <p className="text-purple-300">Preview will appear here</p>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={nextStep}
                    className="w-full bg-purple-700 hover:bg-purple-600"
                    disabled={!preferences.image}
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold">Choose Your Style</h2>
                    <p className="text-purple-300">Select the style that matches your vision</p>
                  </div>

                  <RadioGroup
                    value={preferences.style}
                    onValueChange={(value) => setPreferences((prev) => ({ ...prev, style: value }))}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                  >
                    {styles.map((style) => (
                      <div key={style.name}>
                        <RadioGroupItem value={style.name} id={style.name} className="peer sr-only" />
                        <Label
                          htmlFor={style.name}
                          className="flex flex-col items-center justify-center p-4 border-2 border-purple-500/30 rounded-lg cursor-pointer transition-all hover:bg-purple-900/20 peer-checked:bg-purple-900/40 peer-checked:border-purple-500"
                        >
                          <span className="text-2xl mb-2">{style.icon}</span>
                          <span className="font-medium text-sm">{style.name}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>

                  <div className="flex gap-4">
                    <Button
                      onClick={prevStep}
                      variant="outline"
                      className="flex-1 bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                      onClick={nextStep}
                      className="flex-1 bg-purple-700 hover:bg-purple-600"
                      disabled={!preferences.style}
                    >
                      Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold">Set Your Preferences</h2>
                    <p className="text-purple-300">Tell us about your requirements</p>
                  </div>

                  <div className="grid gap-6 p-6 bg-purple-900/20 rounded-lg border border-purple-500/30">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-purple-400" />
                        Budget Range
                      </Label>
                      <div className="relative pt-6">
                        <Slider
                          min={50}
                          max={1000}
                          step={10}
                          value={preferences.price}
                          onValueChange={(value) => setPreferences((prev) => ({ ...prev, price: value }))}
                          className="w-full"
                        />
                        <div className="absolute left-0 right-0 top-0 flex justify-between text-sm text-purple-300">
                          <span>$50</span>
                          <span>$1000</span>
                        </div>
                      </div>
                      <div className="text-center text-lg font-semibold text-purple-300">
                        Up to ${preferences.price[0]}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-purple-400" />
                        Location
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter your location"
                          value={preferences.location}
                          onChange={(e) => setPreferences((prev) => ({ ...prev, location: e.target.value }))}
                          className="bg-purple-950/30 border-purple-500/30 flex-grow"
                          disabled={locationMethod === "current"}
                        />
                        <Button
                          variant="outline"
                          className="bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                          onClick={() => handleLocationMethod(locationMethod === "manual" ? "current" : "manual")}
                        >
                          {locationMethod === "manual" ? (
                            <Crosshair className="h-4 w-4 mr-2" />
                          ) : (
                            <MapPin className="h-4 w-4 mr-2" />
                          )}
                          {locationMethod === "manual" ? "Use Current" : "Enter Manually"}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-purple-400" />
                        Search Radius
                      </Label>
                      <div className="relative pt-6">
                        <Slider
                          min={1}
                          max={100}
                          step={1}
                          value={[preferences.radius]}
                          onValueChange={(value) => setPreferences((prev) => ({ ...prev, radius: value[0] }))}
                          className="w-full"
                        />
                        <div className="absolute left-0 right-0 top-0 flex justify-between text-sm text-purple-300">
                          <span>1 mile</span>
                          <span>100 miles</span>
                        </div>
                      </div>
                      <div className="text-center text-lg font-semibold text-purple-300">
                        {preferences.radius} miles
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-purple-400" />
                        Preferred Date and Time Range
                      </Label>
                      <div className="flex flex-col gap-4">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left bg-purple-950/30 border-purple-500/30",
                                !preferences.date && "text-purple-300",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {preferences.date ? format(preferences.date, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={preferences.date}
                              onSelect={(date) => setPreferences((prev) => ({ ...prev, date }))}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <div className="flex gap-4">
                          <Select
                            value={preferences.startTime}
                            onValueChange={(value) => setPreferences((prev) => ({ ...prev, startTime: value }))}
                          >
                            <SelectTrigger className="w-full bg-purple-950/30 border-purple-500/30">
                              <SelectValue placeholder="Start time" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                                <SelectItem key={hour} value={`${hour.toString().padStart(2, "0")}:00`}>
                                  {`${hour.toString().padStart(2, "0")}:00`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            value={preferences.endTime}
                            onValueChange={(value) => setPreferences((prev) => ({ ...prev, endTime: value }))}
                          >
                            <SelectTrigger className="w-full bg-purple-950/30 border-purple-500/30">
                              <SelectValue placeholder="End time" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                                <SelectItem key={hour} value={`${hour.toString().padStart(2, "0")}:00`}>
                                  {`${hour.toString().padStart(2, "0")}:00`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-purple-400" />
                        Artist Experience
                      </Label>
                      <RadioGroup
                        value={preferences.experience}
                        onValueChange={(value) => setPreferences((prev) => ({ ...prev, experience: value }))}
                        className="grid grid-cols-3 gap-4"
                      >
                        {["Any", "Intermediate", "Expert"].map((level) => (
                          <div key={level}>
                            <RadioGroupItem value={level} id={`experience-${level}`} className="peer sr-only" />
                            <Label
                              htmlFor={`experience-${level}`}
                              className="flex items-center justify-center p-2 border-2 border-purple-500/30 rounded-lg cursor-pointer transition-all hover:bg-purple-900/20 peer-checked:bg-purple-900/40 peer-checked:border-purple-500"
                            >
                              {level}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={prevStep}
                      variant="outline"
                      className="flex-1 bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                      onClick={nextStep}
                      className="flex-1 bg-purple-700 hover:bg-purple-600"
                      disabled={!preferences.location || !preferences.date || !preferences.experience}
                    >
                      Find Matches <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-bold">Your Matches</h2>
                      <p className="text-purple-300">Artists perfect for your style and budget</p>
                    </div>
                    <div className="flex gap-2">
                      <Select defaultValue="relevance">
                        <SelectTrigger className="w-[180px] bg-purple-950/30 border-purple-500/30">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="relevance">Relevance</SelectItem>
                          <SelectItem value="rating">Rating</SelectItem>
                          <SelectItem value="price_low">Price: Low to High</SelectItem>
                          <SelectItem value="price_high">Price: High to Low</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={() => setCompareMode(!compareMode)}
                        variant={compareMode ? "default" : "outline"}
                        className={
                          compareMode ? "bg-purple-700" : "bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                        }
                      >
                        <GitCompare className="mr-2 h-4 w-4" />
                        Compare
                      </Button>
                    </div>
                  </div>

                  {compareMode && (
                    <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GitCompare className="h-5 w-5 text-purple-400" />
                          <span className="text-purple-300">
                            Select 2 artists to compare ({selectedForComparison.length}/2)
                          </span>
                        </div>
                        <div className="flex gap-2">
                          {selectedForComparison.length === 2 && (
                            <Button onClick={startComparison} size="sm" className="bg-purple-700 hover:bg-purple-600">
                              Compare Selected
                            </Button>
                          )}
                          <Button
                            onClick={exitCompareMode}
                            size="sm"
                            variant="outline"
                            className="bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                          >
                            Exit Compare
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-end mb-4">
                        <Button
                          onClick={() => setShowMap(!showMap)}
                          variant="outline"
                          className="bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                        >
                          {showMap ? "Hide Map" : "Show Map"}
                        </Button>
                      </div>

                      {showMap && isLoaded && (
                        <div className="h-96 w-full rounded-lg overflow-hidden mb-6">
                          <GoogleMap
                            mapContainerStyle={{ width: "100%", height: "100%" }}
                            center={{ lat: 40.7128, lng: -74.006 }}
                            zoom={12}
                          >
                            {matchedArtists.map((artist) => (
                              <Marker
                                key={artist.id}
                                position={{ lat: artist.lat, lng: artist.lng }}
                                icon={{
                                  url: "/marker.svg",
                                  scaledSize: new window.google.maps.Size(30, 30),
                                }}
                                onClick={() => setSelectedArtistForDialog(artist)} // Add this line
                              />
                            ))}
                          </GoogleMap>
                        </div>
                      )}

                      <div className="grid gap-4">
                        {matchedArtists.map((artist) => (
                          <motion.div
                            key={artist.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className={cn(
                              "bg-purple-900/20 rounded-lg border border-purple-500/30 overflow-hidden transition-all",
                              compareMode &&
                                selectedForComparison.find((a) => a.id === artist.id) &&
                                "ring-2 ring-purple-500",
                            )}
                          >
                            <div className="p-4">
                              <div className="flex items-start gap-4 mb-4">
                                <div className="relative">
                                  <Avatar className="h-16 w-16 ring-2 ring-purple-500">
                                    <AvatarImage src={artist.avatar || "/placeholder.svg"} alt={artist.name} />
                                    <AvatarFallback>{artist.name[0]}</AvatarFallback>
                                  </Avatar>
                                  {compareMode && (
                                    <Button
                                      size="sm"
                                      variant={
                                        selectedForComparison.find((a) => a.id === artist.id) ? "default" : "outline"
                                      }
                                      className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                                      onClick={() => toggleCompareSelection(artist)}
                                      disabled={
                                        !selectedForComparison.find((a) => a.id === artist.id) &&
                                        selectedForComparison.length >= 2
                                      }
                                    >
                                      {selectedForComparison.find((a) => a.id === artist.id) ? "✓" : "+"}
                                    </Button>
                                  )}
                                </div>

                                <div className="flex-1 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">{artist.name}</h3>
                                    <div className="flex items-center gap-2">
                                      <Tooltip>
                                        <TooltipTrigger>
                                          <Badge className="bg-green-600 hover:bg-green-700 cursor-help">
                                            {artist.metrics.matchBreakdown.overall}% match
                                          </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-gray-900 border border-purple-500/30 p-0">
                                          <MatchBreakdownTooltip metrics={artist.metrics.matchBreakdown} />
                                        </TooltipContent>
                                      </Tooltip>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                      <span className="font-medium">{artist.rating}</span>
                                    </div>
                                    <span className="text-purple-300">{artist.specialization}</span>
                                    <div className="flex items-center gap-1">
                                      <span className="text-purple-300">${artist.hourlyRate}/hr</span>
                                      <Tooltip>
                                        <TooltipTrigger>
                                          <Info className="h-3 w-3 text-purple-400 cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-gray-900 border border-purple-500/30">
                                          <div className="text-sm max-w-xs">{artist.metrics.pricing.explanation}</div>
                                        </TooltipContent>
                                      </Tooltip>
                                    </div>
                                    <span className="text-purple-300">{artist.distance} miles away</span>
                                  </div>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                  <MiniRadarChart data={artist.metrics.radarData} size={60} />
                                  <span className="text-xs text-purple-300">Strengths</span>
                                </div>
                              </div>

                              {/* Enhanced Metrics Row */}
                              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 p-3 bg-black/20 rounded-lg">
                                <div className="text-center">
                                  <div className="text-lg font-bold text-white">
                                    {artist.metrics.portfolioQuality.score}/100
                                  </div>
                                  <div className="text-xs text-purple-300">Portfolio Quality</div>
                                  <div className="text-xs text-green-400 mt-1">
                                    {artist.metrics.portfolioQuality.callout}
                                  </div>
                                </div>

                                <div className="text-center">
                                  <div className="w-full bg-purple-950 rounded-full h-2 mb-1">
                                    <div
                                      className="bg-purple-500 h-2 rounded-full"
                                      style={{ width: `${artist.metrics.consistencyScore}%` }}
                                    ></div>
                                  </div>
                                  <div className="text-sm font-medium text-white">
                                    {artist.metrics.consistencyScore}%
                                  </div>
                                  <div className="text-xs text-purple-300">Style Consistency</div>
                                </div>

                                <div className="text-center">
                                  <div className="flex items-center justify-center gap-1 mb-1">
                                    <Zap className="h-3 w-3 text-yellow-400" />
                                    <span className="text-sm font-medium text-white">
                                      {artist.metrics.speedComplexity.avgTimeSmall}
                                    </span>
                                  </div>
                                  <div className="text-xs text-purple-300">Avg. Small Piece</div>
                                </div>

                                <div className="text-center">
                                  <DynamicPriceEstimator pricing={artist.metrics.pricing} />
                                  <div className="text-xs text-purple-300 mt-1">Est. Price</div>
                                </div>

                                <div className="text-center">
                                  <AvailabilityHeatMap availability={artist.metrics.availability} />
                                </div>
                              </div>

                              {/* Speed & Expertise Badges */}
                              <div className="flex flex-wrap gap-2 mb-4">
                                {artist.metrics.speedComplexity.expertise.map((skill, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs bg-purple-950/50 border-purple-500/30"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              </div>

                              <div className="mb-4">
                                <p className="text-sm text-gray-300 mb-3">{artist.bio}</p>
                                <div className="flex gap-2">
                                  {artist.portfolio.slice(0, 3).map((work, index) => (
                                    <div key={index} className="relative w-16 h-16 rounded-md overflow-hidden">
                                      <Image
                                        src={work || "/placeholder.svg"}
                                        alt={`Work sample ${index + 1}`}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Artist Detailed Profile Dialog Trigger */}
                              <Button
                                className="w-full bg-purple-700 hover:bg-purple-600"
                                onClick={() => setSelectedArtistForDialog(artist)} // Change to open dialog via state
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Full Profile & Contact
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <Button
                        onClick={() => {
                          setStep(1)
                          setProgress(25)
                          setPreferences({
                            image: null,
                            style: "",
                            price: [200],
                            date: undefined,
                            startTime: "",
                            endTime: "",
                            location: "",
                            radius: 10,
                            experience: "",
                          })
                        }}
                        variant="outline"
                        className="w-full bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50 mt-6"
                      >
                        Start New Search
                      </Button>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Artist Comparison Modal */}
        <ArtistComparisonModal
          artists={selectedForComparison}
          isOpen={showComparison}
          onClose={() => setShowComparison(false)}
        />

        <nav className="fixed bottom-0 left-0 right-0 bg-gray-950/80 backdrop-blur-sm text-gray-400 flex justify-around py-2 border-t border-purple-500/20">
          <Link href="/" className="flex flex-col items-center">
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/matches" className="flex flex-col items-center text-purple-400">
            <MapPin className="w-6 h-6" />
            <span className="text-xs">Find Artists</span>
          </Link>
        </nav>
      </div>
      {selectedArtistForDialog && (
        <Dialog open={!!selectedArtistForDialog} onOpenChange={() => setSelectedArtistForDialog(null)}>
          <DialogContent className="bg-gray-950 text-white border border-purple-500 max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedArtistForDialog.name} - Detailed Profile</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20 ring-2 ring-purple-500">
                    <AvatarImage
                      src={selectedArtistForDialog.avatar || "/placeholder.svg"}
                      alt={selectedArtistForDialog.name}
                    />
                    <AvatarFallback>{selectedArtistForDialog.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedArtistForDialog.name}</h2>
                    <p className="text-xl text-purple-300">{selectedArtistForDialog.specialization} Specialist</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span>{selectedArtistForDialog.rating}/5</span>
                      </div>
                      <span>${selectedArtistForDialog.hourlyRate}/hr</span>
                      <span>{selectedArtistForDialog.distance} miles away</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">About</h3>
                  <p className="text-gray-300">{selectedArtistForDialog.bio}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Detailed Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Portfolio Quality:</span>
                      <span className="font-medium">{selectedArtistForDialog.metrics.portfolioQuality.score}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Style Consistency:</span>
                      <span className="font-medium">{selectedArtistForDialog.metrics.consistencyScore}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg. Cost Range:</span>
                      <span className="font-medium">{selectedArtistForDialog.metrics.pricing.avgFinalCost}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Skills Radar</h3>
                  <div className="flex justify-center">
                    <MiniRadarChart data={selectedArtistForDialog.metrics.radarData} size={200} />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Portfolio</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedArtistForDialog.portfolio.map((work, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden">
                        <Image
                          src={work || "/placeholder.svg"}
                          alt={`Work sample ${index + 1}`}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Button className="w-full bg-purple-700 hover:bg-purple-600 mt-6">Contact Artist</Button>
          </DialogContent>
        </Dialog>
      )}
    </TooltipProvider>
  )
}
