"use client"

import type React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import {
  Upload,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Star,
  DollarSign,
  Crosshair,
  Phone,
  Eye,
  X,
  Map,
  Heart,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"
import { FixedSizeList as List } from "react-window"
import { motion, AnimatePresence } from "framer-motion"

// A1: Dynamic import with Suspense
const GoogleMapView = dynamic(() => import("./components/GoogleMapView"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-800 rounded-lg flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
    </div>
  ),
})

// A6: Debounced hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// B2: Haptic feedback utility
const triggerHaptic = () => {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(8)
  }
  // Soft click sound could be added here with Web Audio API
}

interface MatchPreferences {
  image: string | null
  style: string
  price: number[]
  location: string
  radius: number
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
  phone: string
  lat: number
  lng: number
  signaturePiece: string
  isSaved?: boolean
  yearsExperience: number
  completedTattoos: number
  isVerified: boolean
  responseTime: string
  availability: string
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

// Comprehensive mock artist data for testing
const mockArtists: Artist[] = [
  {
    id: 1,
    name: "Neo Ink",
    avatar: "/placeholder.svg?text=NI&width=100&height=100",
    specialization: "Traditional",
    rating: 4.8,
    distance: 2.3,
    hourlyRate: 150,
    portfolio: [
      "/images/tattoo-mythological.png",
      "/images/tattoo-illuminati-hand.png",
      "/images/tattoo-symbolic-patchwork.png",
    ],
    bio: "Specializing in vibrant traditional designs with a modern twist. Over 8 years of experience creating bold, colorful pieces that stand the test of time.",
    phone: "+1 (555) 123-4567",
    lat: 40.7128,
    lng: -74.006,
    signaturePiece: "/images/tattoo-mythological.png",
    isSaved: false,
    yearsExperience: 8,
    completedTattoos: 450,
    isVerified: true,
    responseTime: "Usually responds within 2 hours",
    availability: "Available this week",
  },
  {
    id: 2,
    name: "Blackwork Beast",
    avatar: "/placeholder.svg?text=BB&width=100&height=100",
    specialization: "Blackwork",
    rating: 4.6,
    distance: 3.1,
    hourlyRate: 130,
    portfolio: [
      "/images/tattoo-fineline-bird.jpeg",
      "/images/tattoo-graphic-style.jpeg",
      "/images/tattoo-blackwork.png",
    ],
    bio: "Bold, intricate blackwork designs that make a statement. Master of geometric patterns and fine line work.",
    phone: "+1 (555) 234-5678",
    lat: 40.7282,
    lng: -73.9942,
    signaturePiece: "/images/tattoo-blackwork.png",
    isSaved: false,
    yearsExperience: 6,
    completedTattoos: 320,
    isVerified: true,
    responseTime: "Usually responds within 4 hours",
    availability: "Booking 2 weeks out",
  },
  {
    id: 3,
    name: "Watercolor Wonder",
    avatar: "/placeholder.svg?text=WW&width=100&height=100",
    specialization: "Watercolor",
    rating: 4.9,
    distance: 1.8,
    hourlyRate: 180,
    portfolio: ["/images/tattoo-watercolor.png", "/images/tattoo-cyberpunk.png", "/images/tattoo-geometric.png"],
    bio: "Bringing your ideas to life with vibrant watercolor techniques. Award-winning artist with gallery exhibitions.",
    phone: "+1 (555) 345-6789",
    lat: 40.7589,
    lng: -73.9851,
    signaturePiece: "/images/tattoo-watercolor.png",
    isSaved: true,
    yearsExperience: 12,
    completedTattoos: 680,
    isVerified: true,
    responseTime: "Usually responds within 1 hour",
    availability: "Available this week",
  },
  {
    id: 4,
    name: "Geometric Grace",
    avatar: "/placeholder.svg?text=GG&width=100&height=100",
    specialization: "Geometric",
    rating: 4.7,
    distance: 4.2,
    hourlyRate: 160,
    portfolio: ["/images/tattoo-geometric.png", "/images/tattoo-mandala-sleeves.png", "/images/tattoo-dotwork.png"],
    bio: "Precision geometric designs and sacred geometry. Mathematics meets art in every piece I create.",
    phone: "+1 (555) 456-7890",
    lat: 40.7505,
    lng: -73.9934,
    signaturePiece: "/images/tattoo-geometric.png",
    isSaved: false,
    yearsExperience: 7,
    completedTattoos: 380,
    isVerified: true,
    responseTime: "Usually responds within 3 hours",
    availability: "Booking 1 week out",
  },
  {
    id: 5,
    name: "Minimal Mike",
    avatar: "/placeholder.svg?text=MM&width=100&height=100",
    specialization: "Minimalist",
    rating: 4.5,
    distance: 5.7,
    hourlyRate: 120,
    portfolio: ["/images/tattoo-fineline.png", "/images/tattoo-fineline-bird.jpeg", "/images/tattoo-dotwork.png"],
    bio: "Less is more. Clean, simple designs that speak volumes. Specializing in fine line and minimalist aesthetics.",
    phone: "+1 (555) 567-8901",
    lat: 40.7614,
    lng: -73.9776,
    signaturePiece: "/images/tattoo-fineline.png",
    isSaved: false,
    yearsExperience: 5,
    completedTattoos: 280,
    isVerified: false,
    responseTime: "Usually responds within 6 hours",
    availability: "Available this week",
  },
  {
    id: 6,
    name: "Realism Rex",
    avatar: "/placeholder.svg?text=RR&width=100&height=100",
    specialization: "Realism",
    rating: 4.9,
    distance: 6.3,
    hourlyRate: 220,
    portfolio: ["/images/tattoo-portrait.png", "/images/tattoo-sleeve.png", "/images/tattoo-cyberpunk.png"],
    bio: "Photorealistic portraits and detailed realism work. Every tattoo is a masterpiece that captures life itself.",
    phone: "+1 (555) 678-9012",
    lat: 40.7831,
    lng: -73.9712,
    signaturePiece: "/images/tattoo-portrait.png",
    isSaved: false,
    yearsExperience: 15,
    completedTattoos: 920,
    isVerified: true,
    responseTime: "Usually responds within 1 hour",
    availability: "Booking 3 weeks out",
  },
  {
    id: 7,
    name: "Japanese Jade",
    avatar: "/placeholder.svg?text=JJ&width=100&height=100",
    specialization: "Japanese",
    rating: 4.8,
    distance: 7.1,
    hourlyRate: 190,
    portfolio: ["/images/tattoo-japanese.png", "/images/tattoo-sleeve.png", "/images/tattoo-mythological.png"],
    bio: "Traditional Japanese tattooing with authentic techniques. Trained in Tokyo, bringing centuries-old art to modern skin.",
    phone: "+1 (555) 789-0123",
    lat: 40.7489,
    lng: -73.968,
    signaturePiece: "/images/tattoo-japanese.png",
    isSaved: true,
    yearsExperience: 10,
    completedTattoos: 540,
    isVerified: true,
    responseTime: "Usually responds within 2 hours",
    availability: "Booking 2 weeks out",
  },
  {
    id: 8,
    name: "Tribal Tom",
    avatar: "/placeholder.svg?text=TT&width=100&height=100",
    specialization: "Tribal",
    rating: 4.4,
    distance: 8.9,
    hourlyRate: 140,
    portfolio: ["/images/tattoo-symbolic-patchwork.png", "/images/tattoo-blackwork.png", "/images/tattoo-dotwork.png"],
    bio: "Bold tribal designs rooted in Polynesian and Celtic traditions. Each piece tells a story of heritage and strength.",
    phone: "+1 (555) 890-1234",
    lat: 40.7282,
    lng: -73.9776,
    signaturePiece: "/images/tattoo-symbolic-patchwork.png",
    isSaved: false,
    yearsExperience: 9,
    completedTattoos: 410,
    isVerified: true,
    responseTime: "Usually responds within 4 hours",
    availability: "Available this week",
  },
  {
    id: 9,
    name: "Neo Traditional Nina",
    avatar: "/placeholder.svg?text=NN&width=100&height=100",
    specialization: "Traditional",
    rating: 4.7,
    distance: 9.5,
    hourlyRate: 170,
    portfolio: [
      "/images/tattoo-neotraditional.png",
      "/images/tattoo-watercolor.png",
      "/images/tattoo-mythological.png",
    ],
    bio: "Neo-traditional style with vibrant colors and modern techniques. Bridging classic and contemporary tattoo art.",
    phone: "+1 (555) 901-2345",
    lat: 40.7505,
    lng: -73.9857,
    signaturePiece: "/images/tattoo-neotraditional.png",
    isSaved: false,
    yearsExperience: 6,
    completedTattoos: 340,
    isVerified: true,
    responseTime: "Usually responds within 3 hours",
    availability: "Booking 1 week out",
  },
  {
    id: 10,
    name: "Dotwork Dave",
    avatar: "/placeholder.svg?text=DD&width=100&height=100",
    specialization: "Geometric",
    rating: 4.6,
    distance: 12.3,
    hourlyRate: 145,
    portfolio: ["/images/tattoo-dotwork.png", "/images/tattoo-mandala-sleeves.png", "/images/tattoo-geometric.png"],
    bio: "Intricate dotwork and stippling techniques. Creating texture and depth through thousands of carefully placed dots.",
    phone: "+1 (555) 012-3456",
    lat: 40.7831,
    lng: -73.9442,
    signaturePiece: "/images/tattoo-dotwork.png",
    isSaved: false,
    yearsExperience: 4,
    completedTattoos: 190,
    isVerified: false,
    responseTime: "Usually responds within 8 hours",
    availability: "Available this week",
  },
  {
    id: 11,
    name: "Cyberpunk Chloe",
    avatar: "/placeholder.svg?text=CC&width=100&height=100",
    specialization: "Realism",
    rating: 4.8,
    distance: 15.2,
    hourlyRate: 200,
    portfolio: ["/images/tattoo-cyberpunk.png", "/images/tattoo-graphic-style.jpeg", "/images/tattoo-portrait.png"],
    bio: "Futuristic and cyberpunk-inspired designs. Blending technology themes with photorealistic execution.",
    phone: "+1 (555) 123-4567",
    lat: 40.7614,
    lng: -73.9442,
    signaturePiece: "/images/tattoo-cyberpunk.png",
    isSaved: true,
    yearsExperience: 7,
    completedTattoos: 360,
    isVerified: true,
    responseTime: "Usually responds within 2 hours",
    availability: "Booking 2 weeks out",
  },
  {
    id: 12,
    name: "Fine Line Felix",
    avatar: "/placeholder.svg?text=FF&width=100&height=100",
    specialization: "Minimalist",
    rating: 4.5,
    distance: 18.7,
    hourlyRate: 110,
    portfolio: ["/images/tattoo-fineline.png", "/images/tattoo-fineline-bird.jpeg", "/images/tattoo-minimalist.png"],
    bio: "Delicate fine line work and micro tattoos. Specializing in small, meaningful pieces with incredible detail.",
    phone: "+1 (555) 234-5678",
    lat: 40.7489,
    lng: -73.9357,
    signaturePiece: "/images/tattoo-fineline-bird.jpeg",
    isSaved: false,
    yearsExperience: 3,
    completedTattoos: 150,
    isVerified: false,
    responseTime: "Usually responds within 12 hours",
    availability: "Available this week",
  },
  {
    id: 13,
    name: "Mandala Maya",
    avatar: "/placeholder.svg?text=MM&width=100&height=100",
    specialization: "Geometric",
    rating: 4.9,
    distance: 22.1,
    hourlyRate: 175,
    portfolio: ["/images/tattoo-mandala-sleeves.png", "/images/tattoo-geometric.png", "/images/tattoo-dotwork.png"],
    bio: "Sacred geometry and mandala designs. Each piece is a meditation on balance, harmony, and spiritual connection.",
    phone: "+1 (555) 345-6789",
    lat: 40.7282,
    lng: -73.9357,
    signaturePiece: "/images/tattoo-mandala-sleeves.png",
    isSaved: false,
    yearsExperience: 11,
    completedTattoos: 620,
    isVerified: true,
    responseTime: "Usually responds within 1 hour",
    availability: "Booking 3 weeks out",
  },
  {
    id: 14,
    name: "Sleeve Specialist Sam",
    avatar: "/placeholder.svg?text=SS&width=100&height=100",
    specialization: "Traditional",
    rating: 4.7,
    distance: 25.8,
    hourlyRate: 165,
    portfolio: ["/images/tattoo-sleeve.png", "/images/tattoo-japanese.png", "/images/tattoo-traditional.png"],
    bio: "Full sleeve and large-scale tattoo specialist. Creating cohesive, flowing designs that tell complete stories.",
    phone: "+1 (555) 456-7890",
    lat: 40.7831,
    lng: -73.9273,
    signaturePiece: "/images/tattoo-sleeve.png",
    isSaved: false,
    yearsExperience: 13,
    completedTattoos: 780,
    isVerified: true,
    responseTime: "Usually responds within 3 hours",
    availability: "Booking 4 weeks out",
  },
  {
    id: 15,
    name: "Portrait Pro Paul",
    avatar: "/placeholder.svg?text=PP&width=100&height=100",
    specialization: "Realism",
    rating: 4.9,
    distance: 28.3,
    hourlyRate: 250,
    portfolio: ["/images/tattoo-portrait.png", "/images/tattoo-realism.png", "/images/tattoo-memorial.png"],
    bio: "Master of photorealistic portraits and memorial tattoos. Capturing memories and emotions in permanent art.",
    phone: "+1 (555) 567-8901",
    lat: 40.7505,
    lng: -73.9189,
    signaturePiece: "/images/tattoo-portrait.png",
    isSaved: true,
    yearsExperience: 18,
    completedTattoos: 1100,
    isVerified: true,
    responseTime: "Usually responds within 30 minutes",
    availability: "Booking 6 weeks out",
  },
  {
    id: 16,
    name: "Abstract Alex",
    avatar: "/placeholder.svg?text=AA&width=100&height=100",
    specialization: "Watercolor",
    rating: 4.6,
    distance: 31.5,
    hourlyRate: 155,
    portfolio: ["/images/tattoo-watercolor.png", "/images/tattoo-abstract.png", "/images/tattoo-splash.png"],
    bio: "Abstract and experimental tattoo designs. Pushing the boundaries of what's possible with ink and skin.",
    phone: "+1 (555) 678-9012",
    lat: 40.7614,
    lng: -73.9105,
    signaturePiece: "/images/tattoo-watercolor.png",
    isSaved: false,
    yearsExperience: 8,
    completedTattoos: 420,
    isVerified: true,
    responseTime: "Usually responds within 4 hours",
    availability: "Available this week",
  },
  {
    id: 17,
    name: "Script Specialist Sarah",
    avatar: "/placeholder.svg?text=SS&width=100&height=100",
    specialization: "Minimalist",
    rating: 4.4,
    distance: 35.2,
    hourlyRate: 125,
    portfolio: ["/images/tattoo-script.png", "/images/tattoo-lettering.png", "/images/tattoo-quote.png"],
    bio: "Beautiful script and lettering work. Transforming meaningful words into elegant, flowing tattoo art.",
    phone: "+1 (555) 789-0123",
    lat: 40.7489,
    lng: -73.9021,
    signaturePiece: "/images/tattoo-script.png",
    isSaved: false,
    yearsExperience: 6,
    completedTattoos: 310,
    isVerified: false,
    responseTime: "Usually responds within 6 hours",
    availability: "Booking 1 week out",
  },
  {
    id: 18,
    name: "Color Master Carlos",
    avatar: "/placeholder.svg?text=CM&width=100&height=100",
    specialization: "Traditional",
    rating: 4.8,
    distance: 38.9,
    hourlyRate: 185,
    portfolio: ["/images/tattoo-colorful.png", "/images/tattoo-vibrant.png", "/images/tattoo-rainbow.png"],
    bio: "Vibrant color work and bold traditional designs. Making tattoos that pop with life and energy.",
    phone: "+1 (555) 890-1234",
    lat: 40.7282,
    lng: -73.8937,
    signaturePiece: "/images/tattoo-colorful.png",
    isSaved: false,
    yearsExperience: 14,
    completedTattoos: 850,
    isVerified: true,
    responseTime: "Usually responds within 2 hours",
    availability: "Booking 3 weeks out",
  },
  {
    id: 19,
    name: "Biomech Betty",
    avatar: "/placeholder.svg?text=BB&width=100&height=100",
    specialization: "Realism",
    rating: 4.7,
    distance: 42.6,
    hourlyRate: 210,
    portfolio: ["/images/tattoo-biomech.png", "/images/tattoo-mechanical.png", "/images/tattoo-cyborg.png"],
    bio: "Biomechanical and mechanical tattoo designs. Creating the illusion of machinery beneath the skin.",
    phone: "+1 (555) 901-2345",
    lat: 40.7831,
    lng: -73.8853,
    signaturePiece: "/images/tattoo-biomech.png",
    isSaved: false,
    yearsExperience: 9,
    completedTattoos: 480,
    isVerified: true,
    responseTime: "Usually responds within 3 hours",
    availability: "Booking 2 weeks out",
  },
  {
    id: 20,
    name: "Flash Master Frank",
    avatar: "/placeholder.svg?text=FM&width=100&height=100",
    specialization: "Traditional",
    rating: 4.5,
    distance: 46.3,
    hourlyRate: 135,
    portfolio: ["/images/tattoo-flash.png", "/images/tattoo-classic.png", "/images/tattoo-sailor.png"],
    bio: "Classic American traditional flash work. Old school designs with timeless appeal and solid execution.",
    phone: "+1 (555) 012-3456",
    lat: 40.7505,
    lng: -73.8769,
    signaturePiece: "/images/tattoo-flash.png",
    isSaved: false,
    yearsExperience: 12,
    completedTattoos: 720,
    isVerified: true,
    responseTime: "Usually responds within 5 hours",
    availability: "Available this week",
  },
]

// A2: Virtualized Artist Card Component
const ArtistCard: React.FC<{
  index: number
  style: React.CSSProperties
  data: {
    artists: Artist[]
    hoveredArtist: number | null
    setHoveredArtist: (id: number | null) => void
    setSelectedArtistForDialog: (artist: Artist) => void
    setShowEarlyAccessForm: (show: boolean) => void
    toggleSaved: (id: number) => void
  }
}> = ({ index, style, data }) => {
  const { artists, hoveredArtist, setHoveredArtist, setSelectedArtistForDialog, setShowEarlyAccessForm, toggleSaved } =
    data
  const artist = artists[index]

  if (!artist) return null

  return (
    <div style={style} className="px-4 pb-4">
      <motion.div
        className={`bg-purple-900/20 rounded-lg border border-purple-500/30 overflow-hidden transition-all cursor-pointer ${
          hoveredArtist === artist.id ? "border-purple-400 bg-purple-900/30" : ""
        }`}
        onMouseEnter={() => setHoveredArtist(artist.id)}
        onMouseLeave={() => setHoveredArtist(null)}
        onClick={() => setSelectedArtistForDialog(artist)}
        // A5: Hardware-accelerated animations
        whileHover={{
          scale: 1.02,
          transition: { duration: 0.2, ease: "easeOut" },
        }}
        whileTap={{ scale: 0.98 }}
        style={{ willChange: "transform" }}
      >
        <div className="p-4">
          <div className="flex items-start gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16 ring-2 ring-purple-500">
                <AvatarImage src={artist.avatar || "/placeholder.svg"} alt={artist.name} />
                <AvatarFallback className="text-lg">{artist.name[0]}</AvatarFallback>
              </Avatar>
              {artist.isVerified && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white truncate">{artist.name}</h3>
                  <p className="text-purple-300 text-sm">{artist.specialization}</p>
                  <p className="text-gray-400 text-xs">
                    {artist.yearsExperience} years • {artist.completedTattoos} tattoos
                  </p>
                </div>
                <div className="text-right flex items-start gap-2">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium text-white">{artist.rating}</span>
                    </div>
                    <div className="text-sm text-purple-300">${artist.hourlyRate}/hr</div>
                  </div>
                  {/* B4: Saved state badge with animation */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleSaved(artist.id)
                      triggerHaptic()
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1"
                  >
                    <motion.div
                      animate={{
                        scale: artist.isSaved ? [1, 1.3, 1] : 1,
                        rotate: artist.isSaved ? [0, 15, -15, 0] : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          artist.isSaved ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-400"
                        }`}
                      />
                    </motion.div>
                  </motion.button>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                <span>{artist.distance} miles away</span>
                <Badge className="bg-green-600 text-white text-xs">Perfect Match</Badge>
                <span className="text-purple-300">{artist.availability}</span>
              </div>

              <div className="mt-2 text-xs text-gray-400">{artist.responseTime}</div>
            </div>

            {/* A3: Optimized image with blur placeholder */}
            <div className="relative w-20 h-20 rounded-lg overflow-hidden">
              <Image
                src={artist.signaturePiece || "/placeholder.svg"}
                alt={`${artist.name} signature work`}
                fill
                className="object-cover"
                sizes="80px"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-sm"
              onClick={(e) => {
                e.stopPropagation()
                setShowEarlyAccessForm(true)
                triggerHaptic()
              }}
            >
              <Phone className="mr-2 h-3 w-3" />
              Request Access
            </Button>
            <Button
              variant="outline"
              className="bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50 text-sm"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedArtistForDialog(artist)
              }}
            >
              <Eye className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function MatchesPage() {
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(33)
  const [preferences, setPreferences] = useState<MatchPreferences>({
    image: null,
    style: "",
    price: [200],
    location: "",
    radius: 10,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [matchedArtists, setMatchedArtists] = useState<Artist[]>([])
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([])
  const [showMobileMap, setShowMobileMap] = useState(false)
  const [locationMethod, setLocationMethod] = useState<"manual" | "current">("manual")
  const [selectedArtistForDialog, setSelectedArtistForDialog] = useState<Artist | null>(null)
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.006 })
  const [hoveredArtist, setHoveredArtist] = useState<number | null>(null)

  // Live filter states
  const [liveFilters, setLiveFilters] = useState({
    style: "",
    maxPrice: 300,
    radius: 25,
  })

  // A6: Debounced filters
  const debouncedFilters = useDebounce(liveFilters, 250)

  const [showEarlyAccessForm, setShowEarlyAccessForm] = useState(false)
  const [earlyAccessData, setEarlyAccessData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmittingAccess, setIsSubmittingAccess] = useState(false)

  const { toast } = useToast()

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
    setProgress((prev) => Math.min(100, prev + 33))
  }

  const prevStep = () => {
    setStep((prev) => prev - 1)
    setProgress((prev) => Math.max(0, prev - 33))
  }

  const findMatches = useCallback(async () => {
    setIsLoading(true)
    try {
      // Simulate API call with realistic delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate different results based on location
      let artistsToShow = mockArtists
      if (preferences.location.toLowerCase().includes("los angeles")) {
        // Adjust coordinates for LA area
        artistsToShow = mockArtists.map((artist) => ({
          ...artist,
          lat: artist.lat - 6.4, // Rough LA coordinates
          lng: artist.lng - 44.2,
          distance: artist.distance * 0.8, // Closer in LA
        }))
      } else if (preferences.location.toLowerCase().includes("chicago")) {
        // Adjust coordinates for Chicago area
        artistsToShow = mockArtists.map((artist) => ({
          ...artist,
          lat: artist.lat + 1.0,
          lng: artist.lng + 13.2,
          distance: artist.distance * 1.2,
        }))
      }

      setMatchedArtists(artistsToShow)
      setFilteredArtists(artistsToShow)

      // Initialize live filters from preferences
      setLiveFilters({
        style: preferences.style,
        maxPrice: preferences.price[0],
        radius: preferences.radius,
      })

      // Set map center based on location
      if (preferences.location.toLowerCase().includes("new york")) {
        setMapCenter({ lat: 40.7128, lng: -74.006 })
      } else if (preferences.location.toLowerCase().includes("los angeles")) {
        setMapCenter({ lat: 34.0522, lng: -118.2437 })
      } else if (preferences.location.toLowerCase().includes("chicago")) {
        setMapCenter({ lat: 41.8781, lng: -87.6298 })
      }
    } catch (error) {
      console.error("Error finding matches:", error)
    } finally {
      setIsLoading(false)
    }
  }, [preferences])

  // Apply live filters with debouncing
  useEffect(() => {
    if (matchedArtists.length === 0) return

    const filtered = matchedArtists.filter((artist) => {
      const matchesStyle =
        !debouncedFilters.style || debouncedFilters.style === "all" || artist.specialization === debouncedFilters.style
      const matchesPrice = artist.hourlyRate <= debouncedFilters.maxPrice
      const matchesRadius = artist.distance <= debouncedFilters.radius

      return matchesStyle && matchesPrice && matchesRadius
    })

    setFilteredArtists(filtered)

    // B1: Micro-copy feedback
    if (step === 3 && matchedArtists.length > 0) {
      toast({
        title: "Updated",
        description: `${filtered.length} artists match your filters`,
        duration: 2000,
      })
    }
  }, [debouncedFilters, matchedArtists, step, toast])

  const handleLocationMethod = (method: "manual" | "current") => {
    setLocationMethod(method)
    if (method === "current") {
      // Simulating geolocation API
      navigator.geolocation?.getCurrentPosition(
        (position) => {
          setPreferences((prev) => ({ ...prev, location: "Current Location" }))
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        () => {
          setPreferences((prev) => ({ ...prev, location: "New York, NY" }))
        },
      )
    }
  }

  const handleEarlyAccessSubmit = async (artistId: number) => {
    setIsSubmittingAccess(true)
    try {
      // Simulate API call to request access
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Reset form and close dialog
      setEarlyAccessData({ name: "", email: "", phone: "", message: "" })
      setShowEarlyAccessForm(false)

      toast({
        title: "Request Submitted!",
        description: "The artist will be notified of your interest.",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error submitting early access request:", error)
    } finally {
      setIsSubmittingAccess(false)
    }
  }

  const toggleSaved = (artistId: number) => {
    setMatchedArtists((prev) =>
      prev.map((artist) => (artist.id === artistId ? { ...artist, isSaved: !artist.isSaved } : artist)),
    )
    setFilteredArtists((prev) =>
      prev.map((artist) => (artist.id === artistId ? { ...artist, isSaved: !artist.isSaved } : artist)),
    )
  }

  // A2: Memoized list data for virtualization
  const listData = useMemo(
    () => ({
      artists: filteredArtists,
      hoveredArtist,
      setHoveredArtist,
      setSelectedArtistForDialog,
      setShowEarlyAccessForm,
      toggleSaved,
    }),
    [filteredArtists, hoveredArtist],
  )

  useEffect(() => {
    if (step === 3) {
      findMatches()
    }
  }, [step, findMatches])

  // B6: Accessibility - respect reduced motion
  const prefersReducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-purple-950 text-white">
      {/* Header - only show on steps 1-2 */}
      {step < 3 && (
        <div className="sticky top-0 z-10 bg-black/40 backdrop-blur-sm border-b border-purple-500/20">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="relative w-8 h-8 hover:scale-110 transition-transform">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dog%20face%20image%20background-80tC7pNknHSwIU4KYQODUQRYlZl8t1.png"
                    alt="Tattit Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
                  Find Your Artist
                </h1>
              </Link>
            </div>
            <Progress value={progress} className="h-1 bg-purple-950" />
          </div>
        </div>
      )}

      {/* Mobile-first: Vertical stack on small screens, split-pane on large */}
      {step === 3 ? (
        <div className="h-screen flex flex-col">
          {/* Sticky Filter Header */}
          <div className="sticky top-0 z-20 bg-black/90 backdrop-blur-sm border-b border-purple-500/20">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between mb-3">
                <Link href="/" className="flex items-center gap-2">
                  <div className="relative w-6 h-6">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dog%20face%20image%20background-80tC7pNknHSwIU4KYQODUQRYlZl8t1.png"
                      alt="Tattit Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
                    Find Your Artist
                  </h1>
                </Link>
                {/* B6: ARIA live region for screen readers */}
                <div className="text-sm text-purple-300" aria-live="polite" aria-atomic="true">
                  {filteredArtists.length} artists
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <div className="flex items-center gap-1 bg-purple-950/50 rounded-full px-3 py-1 border border-purple-500/30 whitespace-nowrap">
                  <MapPin className="h-3 w-3 text-purple-400" />
                  <span className="text-xs text-purple-300">{preferences.location}</span>
                </div>

                <Select
                  value={liveFilters.style}
                  onValueChange={(value) => {
                    setLiveFilters((prev) => ({ ...prev, style: value }))
                    triggerHaptic()
                  }}
                >
                  <SelectTrigger className="w-auto h-7 bg-purple-950/50 border-purple-500/30 text-xs focus:ring-2 focus:ring-purple-400">
                    <SelectValue placeholder="Style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Styles</SelectItem>
                    {styles.map((style) => (
                      <SelectItem key={style.name} value={style.name}>
                        {style.icon} {style.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2 bg-purple-950/50 rounded-full px-3 py-1 border border-purple-500/30">
                  <DollarSign className="h-3 w-3 text-purple-400" />
                  <span className="text-xs text-purple-300">Up to ${liveFilters.maxPrice}</span>
                  <Slider
                    min={50}
                    max={500}
                    step={10}
                    value={[liveFilters.maxPrice]}
                    onValueChange={(value) => {
                      setLiveFilters((prev) => ({ ...prev, maxPrice: value[0] }))
                      triggerHaptic()
                    }}
                    className="w-16"
                  />
                </div>

                <div className="flex items-center gap-2 bg-purple-950/50 rounded-full px-3 py-1 border border-purple-500/30">
                  <MapPin className="h-3 w-3 text-purple-400" />
                  <span className="text-xs text-purple-300">{liveFilters.radius}mi</span>
                  <Slider
                    min={1}
                    max={50}
                    step={1}
                    value={[liveFilters.radius]}
                    onValueChange={(value) => {
                      setLiveFilters((prev) => ({ ...prev, radius: value[0] }))
                      triggerHaptic()
                    }}
                    className="w-16"
                  />
                </div>

                {/* Mobile Map Toggle */}
                <Button
                  onClick={() => {
                    setShowMobileMap(!showMobileMap)
                    triggerHaptic()
                  }}
                  variant="outline"
                  size="sm"
                  className="lg:hidden bg-purple-950/50 border-purple-500/30 hover:bg-purple-800/50 h-7 focus:ring-2 focus:ring-purple-400"
                >
                  <Map className="h-3 w-3 mr-1" />
                  Map
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile: Vertical Stack, Desktop: Split Pane */}
          <div className="flex-1 flex flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_420px] gap-0">
            {/* Artist Cards */}
            <div className={`flex-1 ${showMobileMap ? "hidden lg:block" : "block"} relative`}>
              {/* B3: Edge scroll shadow */}
              <div
                className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-gray-950 to-transparent z-10 pointer-events-none"
                style={{
                  maskImage: "linear-gradient(to bottom, black, transparent)",
                }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-gray-950 to-transparent z-10 pointer-events-none"
                style={{
                  maskImage: "linear-gradient(to top, black, transparent)",
                }}
              />

              {isLoading ? (
                <div className="flex justify-center items-center h-64" aria-live="polite">
                  <Loader2 className="h-32 w-32 animate-spin text-purple-500" />
                </div>
              ) : (
                <div className="h-full">
                  {/* A2: List virtualization */}
                  <List
                    height={typeof window !== "undefined" ? window.innerHeight - 120 : 600}
                    itemCount={filteredArtists.length}
                    itemSize={220}
                    itemData={listData}
                    overscanCount={2}
                  >
                    {ArtistCard}
                  </List>

                  {filteredArtists.length === 0 && !isLoading && (
                    <div className="text-center py-12">
                      <div className="text-purple-400 mb-2">No artists match your current filters</div>
                      <Button
                        onClick={() => {
                          setLiveFilters({ style: "all", maxPrice: 500, radius: 50 })
                          triggerHaptic()
                        }}
                        variant="outline"
                        className="bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50 focus:ring-2 focus:ring-purple-400"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Map Section */}
            <AnimatePresence>
              {(showMobileMap || typeof window === "undefined" || window.innerWidth >= 1024) && (
                <motion.div
                  className={`${showMobileMap ? "flex-1" : "hidden lg:block"} lg:sticky lg:top-[120px] lg:h-[calc(100vh-120px)]`}
                  initial={showMobileMap ? { y: "100%" } : false}
                  animate={showMobileMap ? { y: 0 } : {}}
                  exit={showMobileMap ? { y: "100%" } : {}}
                  transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 200,
                  }}
                  // B5: Sheet velocity swipe (simplified)
                  drag={showMobileMap ? "y" : false}
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    if (info.offset.y > 100) {
                      setShowMobileMap(false)
                    }
                  }}
                >
                  <div className="h-full bg-gray-900 border-l border-purple-500/20 lg:border-l-0">
                    <GoogleMapView
                      artists={filteredArtists}
                      center={mapCenter}
                      onMarkerClick={setSelectedArtistForDialog}
                      hoveredArtist={hoveredArtist}
                      onMarkerHover={setHoveredArtist}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        /* Original wizard steps 1-2 */
        <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
          <div className="transition-all duration-500 ease-in-out">
            {step === 1 && (
              <div className="space-y-6 opacity-100 translate-y-0">
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
                        sizes="(max-width: 768px) 100vw, 50vw"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      />
                    </div>
                  ) : (
                    <div className="aspect-square rounded-lg bg-purple-900/20 flex items-center justify-center">
                      <p className="text-purple-300">Preview will appear here</p>
                    </div>
                  )}
                </div>

                <div className="pb-4">
                  <Button
                    onClick={nextStep}
                    className="w-full bg-purple-700 hover:bg-purple-600 focus:ring-2 focus:ring-purple-400"
                    disabled={!preferences.image}
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 opacity-100 translate-y-0">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold">Set Your Preferences</h2>
                  <p className="text-purple-300">Tell us about your style and location preferences</p>
                </div>

                <div className="grid gap-6 p-6 bg-purple-950/20 rounded-lg border border-purple-500/30">
                  {/* Style Selection */}
                  <div className="space-y-4">
                    <Label className="text-lg font-medium text-purple-300">Choose Your Style</Label>
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
                            className="flex flex-col items-center justify-center p-4 border-2 border-purple-500/30 rounded-lg cursor-pointer transition-all hover:bg-purple-900/20 peer-checked:bg-purple-900/40 peer-checked:border-purple-500 focus-within:ring-2 focus-within:ring-purple-400"
                          >
                            <span className="text-2xl mb-2">{style.icon}</span>
                            <span className="font-medium text-sm">{style.name}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Budget Range */}
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

                  {/* Location */}
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
                        className="bg-purple-950/30 border-purple-500/30 flex-grow focus:ring-2 focus:ring-purple-400"
                        disabled={locationMethod === "current"}
                      />
                      <Button
                        variant="outline"
                        className="bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50 focus:ring-2 focus:ring-purple-400"
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

                  {/* Search Radius */}
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
                    <div className="text-center text-lg font-semibold text-purple-300">{preferences.radius} miles</div>
                  </div>
                </div>

                <div className="flex gap-4 pb-4">
                  <Button
                    onClick={prevStep}
                    variant="outline"
                    className="flex-1 bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50 focus:ring-2 focus:ring-purple-400"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button
                    onClick={nextStep}
                    className="flex-1 bg-purple-700 hover:bg-purple-600 focus:ring-2 focus:ring-purple-400"
                    disabled={!preferences.location || !preferences.style}
                  >
                    Find Matches <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Artist Profile Dialog */}
      <AnimatePresence>
        {selectedArtistForDialog && (
          <Dialog open={!!selectedArtistForDialog} onOpenChange={() => setSelectedArtistForDialog(null)}>
            <DialogContent className="bg-gray-950 text-white border border-purple-500 max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span className="text-2xl">{selectedArtistForDialog.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedArtistForDialog(null)}
                    className="focus:ring-2 focus:ring-purple-400"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </DialogTitle>
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
                      <h3 className="text-xl font-bold">{selectedArtistForDialog.name}</h3>
                      <p className="text-purple-300">{selectedArtistForDialog.specialization}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span>{selectedArtistForDialog.rating}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-purple-300">${selectedArtistForDialog.hourlyRate}/hr</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-purple-300">About</h4>
                    <p className="text-gray-300">{selectedArtistForDialog.bio}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-purple-300">Experience:</span>
                      <br />
                      {selectedArtistForDialog.yearsExperience} years
                    </div>
                    <div>
                      <span className="text-purple-300">Completed:</span>
                      <br />
                      {selectedArtistForDialog.completedTattoos} tattoos
                    </div>
                    <div>
                      <span className="text-purple-300">Distance:</span>
                      <br />
                      {selectedArtistForDialog.distance} miles
                    </div>
                    <div>
                      <span className="text-purple-300">Response:</span>
                      <br />
                      {selectedArtistForDialog.responseTime}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:ring-2 focus:ring-purple-400"
                      onClick={() => {
                        setShowEarlyAccessForm(true)
                        triggerHaptic()
                      }}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Request Access
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50 focus:ring-2 focus:ring-purple-400"
                      onClick={() => {
                        toggleSaved(selectedArtistForDialog.id)
                        triggerHaptic()
                      }}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          selectedArtistForDialog.isSaved ? "fill-red-500 text-red-500" : "text-gray-400"
                        }`}
                      />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-purple-300">Portfolio</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedArtistForDialog.portfolio.map((image, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Portfolio piece ${index + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform"
                          sizes="(max-width: 768px) 50vw, 25vw"
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Early Access Form Dialog */}
      <AnimatePresence>
        {showEarlyAccessForm && (
          <Dialog open={showEarlyAccessForm} onOpenChange={setShowEarlyAccessForm}>
            <DialogContent className="bg-gray-950 text-white border border-purple-500 max-w-md">
              <DialogHeader>
                <DialogTitle>Request Early Access</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={earlyAccessData.name}
                    onChange={(e) => setEarlyAccessData((prev) => ({ ...prev, name: e.target.value }))}
                    className="bg-purple-950/30 border-purple-500/30 focus:ring-2 focus:ring-purple-400"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={earlyAccessData.email}
                    onChange={(e) => setEarlyAccessData((prev) => ({ ...prev, email: e.target.value }))}
                    className="bg-purple-950/30 border-purple-500/30 focus:ring-2 focus:ring-purple-400"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={earlyAccessData.phone}
                    onChange={(e) => setEarlyAccessData((prev) => ({ ...prev, phone: e.target.value }))}
                    className="bg-purple-950/30 border-purple-500/30 focus:ring-2 focus:ring-purple-400"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message (Optional)</Label>
                  <textarea
                    id="message"
                    value={earlyAccessData.message}
                    onChange={(e) => setEarlyAccessData((prev) => ({ ...prev, message: e.target.value }))}
                    className="w-full p-2 bg-purple-950/30 border border-purple-500/30 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400"
                    placeholder="Tell the artist about your tattoo idea..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50 focus:ring-2 focus:ring-purple-400"
                    onClick={() => setShowEarlyAccessForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:ring-2 focus:ring-purple-400"
                    onClick={() => handleEarlyAccessSubmit(selectedArtistForDialog?.id || 0)}
                    disabled={isSubmittingAccess || !earlyAccessData.name || !earlyAccessData.email}
                  >
                    {isSubmittingAccess ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Request"
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  )
}
