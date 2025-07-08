"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
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
import { Upload, ArrowRight, ArrowLeft, MapPin, Star, DollarSign, Home, Crosshair, Phone, Eye, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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
    phone: "+1 (555) 123-4567",
    lat: 40.7128,
    lng: -74.006,
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
    phone: "+1 (555) 234-5678",
    lat: 40.7282,
    lng: -73.9942,
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
    phone: "+1 (555) 345-6789",
    lat: 40.7589,
    lng: -73.9851,
  },
]

// Enhanced Google Maps Component
const GoogleMapView: React.FC<{
  artists: Artist[]
  center: { lat: number; lng: number }
  onMarkerClick: (artist: Artist) => void
}> = ({ artists, center, onMarkerClick }) => {
  const [map, setMap] = useState<any | null>(null)
  const [markers, setMarkers] = useState<any[]>([])

  useEffect(() => {
    const initMap = async () => {
      if (typeof window !== "undefined" && window.google) {
        const mapElement = document.getElementById("google-map")
        if (mapElement) {
          const newMap = new window.google.maps.Map(mapElement, {
            center: center,
            zoom: 12,
            styles: [
              {
                featureType: "all",
                elementType: "geometry",
                stylers: [{ color: "#1a1a2e" }],
              },
              {
                featureType: "all",
                elementType: "labels.text.fill",
                stylers: [{ color: "#ffffff" }],
              },
              {
                featureType: "all",
                elementType: "labels.text.stroke",
                stylers: [{ color: "#000000" }, { lightness: 13 }],
              },
              {
                featureType: "road",
                elementType: "geometry.fill",
                stylers: [{ color: "#000000" }],
              },
              {
                featureType: "road",
                elementType: "geometry.stroke",
                stylers: [{ color: "#e83e8c" }],
              },
              {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#17263c" }],
              },
            ],
          })
          setMap(newMap)

          // Clear existing markers
          markers.forEach((marker) => marker.setMap(null))

          // Add markers for each artist
          const newMarkers = artists.map((artist) => {
            const marker = new window.google.maps.Marker({
              position: { lat: artist.lat, lng: artist.lng },
              map: newMap,
              title: artist.name,
              icon: {
                url:
                  "data:image/svg+xml;charset=UTF-8," +
                  encodeURIComponent(`
                  <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="18" fill="#7c3aed" stroke="#ffffff" strokeWidth="2"/>
                    <text x="20" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                      ${artist.name.charAt(0)}
                    </text>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(40, 40),
              },
            })

            marker.addListener("click", () => {
              onMarkerClick(artist)
            })

            return marker
          })

          setMarkers(newMarkers)
        }
      }
    }

    // Load Google Maps API if not already loaded
    if (!window.google) {
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = initMap
      document.head.appendChild(script)
    } else {
      initMap()
    }

    return () => {
      markers.forEach((marker) => marker.setMap(null))
    }
  }, [artists, center, onMarkerClick])

  return (
    <div
      id="google-map"
      className="h-96 w-full rounded-lg overflow-hidden border border-purple-500/30"
      style={{ minHeight: "400px" }}
    />
  )
}

// Fallback Map Component
const FallbackMapView: React.FC<{ artists: Artist[]; onMarkerClick: (artist: Artist) => void }> = ({
  artists,
  onMarkerClick,
}) => {
  return (
    <div className="h-96 w-full bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden border border-purple-500/30">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20" />
      <div className="text-center z-10">
        <MapPin className="h-12 w-12 text-purple-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Artist Locations</h3>
        <p className="text-purple-300 mb-4">Interactive map view</p>
        <div className="grid grid-cols-1 gap-2 max-w-xs">
          {artists.map((artist) => (
            <Button
              key={artist.id}
              variant="outline"
              size="sm"
              className="bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
              onClick={() => onMarkerClick(artist)}
            >
              <MapPin className="h-3 w-3 mr-2" />
              {artist.name} - {artist.distance}mi
            </Button>
          ))}
        </div>
      </div>
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
  const [showMap, setShowMap] = useState(false)
  const [locationMethod, setLocationMethod] = useState<"manual" | "current">("manual")
  const [selectedArtistForDialog, setSelectedArtistForDialog] = useState<Artist | null>(null)
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.006 })

  const [showEarlyAccessForm, setShowEarlyAccessForm] = useState(false)
  const [earlyAccessData, setEarlyAccessData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmittingAccess, setIsSubmittingAccess] = useState(false)

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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setMatchedArtists(mockArtists)

      // Set map center based on location (simplified geocoding simulation)
      if (preferences.location.toLowerCase().includes("new york")) {
        setMapCenter({ lat: 40.7128, lng: -74.006 })
      } else if (preferences.location.toLowerCase().includes("los angeles")) {
        setMapCenter({ lat: 34.0522, lng: -118.2437 })
      }
    } catch (error) {
      console.error("Error finding matches:", error)
    } finally {
      setIsLoading(false)
    }
  }, [preferences.location])

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

      // Show success message (you could use a toast here)
      alert("Early access request submitted! The artist will be notified of your interest.")
    } catch (error) {
      console.error("Error submitting early access request:", error)
    } finally {
      setIsSubmittingAccess(false)
    }
  }

  useEffect(() => {
    if (step === 3) {
      findMatches()
    }
  }, [step, findMatches])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-purple-950 text-white">
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

      <div className="max-w-4xl mx-auto px-4 py-8">
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
            <div className="space-y-6 opacity-100 translate-y-0">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Set Your Preferences</h2>
                <p className="text-purple-300">Tell us about your style and location preferences</p>
              </div>

              <div className="grid gap-6 p-6 bg-purple-900/20 rounded-lg border border-purple-500/30">
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
                          className="flex flex-col items-center justify-center p-4 border-2 border-purple-500/30 rounded-lg cursor-pointer transition-all hover:bg-purple-900/20 peer-checked:bg-purple-900/40 peer-checked:border-purple-500"
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
                  <div className="text-center text-lg font-semibold text-purple-300">Up to ${preferences.price[0]}</div>
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
                  disabled={!preferences.location || !preferences.style}
                >
                  Find Matches <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 opacity-100 translate-y-0">
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
                    onClick={() => setShowMap(!showMap)}
                    variant="outline"
                    className="bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                  >
                    {showMap ? "Hide Map" : "Show Map"}
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : (
                <>
                  {showMap && (
                    <div className="mb-6">
                      {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
                        <GoogleMapView
                          artists={matchedArtists}
                          center={mapCenter}
                          onMarkerClick={setSelectedArtistForDialog}
                        />
                      ) : (
                        <FallbackMapView artists={matchedArtists} onMarkerClick={setSelectedArtistForDialog} />
                      )}
                    </div>
                  )}

                  <div className="grid gap-6">
                    {matchedArtists.map((artist) => (
                      <div
                        key={artist.id}
                        className="bg-purple-900/20 rounded-lg border border-purple-500/30 overflow-hidden transition-all hover:border-purple-500/50"
                      >
                        <div className="p-6">
                          <div className="flex items-start gap-6 mb-6">
                            <Avatar className="h-20 w-20 ring-2 ring-purple-500">
                              <AvatarImage src={artist.avatar || "/placeholder.svg"} alt={artist.name} />
                              <AvatarFallback className="text-lg">{artist.name[0]}</AvatarFallback>
                            </Avatar>

                            <div className="flex-1 space-y-3">
                              <div>
                                <h3 className="text-2xl font-bold text-white">{artist.name}</h3>
                                <p className="text-purple-300 text-lg">{artist.specialization} Specialist</p>
                              </div>

                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                  <span className="font-medium text-white">{artist.rating}</span>
                                </div>
                                <span className="text-purple-300">${artist.hourlyRate}/hr</span>
                                <span className="text-purple-300">{artist.distance} miles away</span>
                              </div>

                              <p className="text-gray-300">{artist.bio}</p>
                            </div>

                            <div className="text-right space-y-2">
                              <Badge className="bg-green-600 text-white">Perfect Match</Badge>
                              <div className="text-center">
                                <div className="text-sm text-purple-300 mb-1">Premium Access Required</div>
                                <div className="text-xs text-gray-400">Request access to connect</div>
                              </div>
                            </div>
                          </div>

                          {/* Portfolio */}
                          <div className="mb-6">
                            <h4 className="text-lg font-semibold text-white mb-3">Portfolio</h4>
                            <div className="grid grid-cols-3 gap-4">
                              {artist.portfolio.map((work, index) => (
                                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                                  <Image
                                    src={work || "/placeholder.svg"}
                                    alt={`${artist.name} work ${index + 1}`}
                                    fill
                                    className="object-cover hover:scale-105 transition-transform"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Contact Actions */}
                          <div className="flex gap-4">
                            <Button
                              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                              onClick={() => setShowEarlyAccessForm(true)}
                            >
                              <Phone className="mr-2 h-4 w-4" />
                              Request Access
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1 bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                              onClick={() => setSelectedArtistForDialog(artist)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => {
                      setStep(1)
                      setProgress(33)
                      setPreferences({
                        image: null,
                        style: "",
                        price: [200],
                        location: "",
                        radius: 10,
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
        </div>
      </div>

      {/* Artist Profile Dialog */}
      {selectedArtistForDialog && (
        <Dialog open={!!selectedArtistForDialog} onOpenChange={() => setSelectedArtistForDialog(null)}>
          <DialogContent className="bg-gray-950 text-white border border-purple-500 max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span className="text-2xl">{selectedArtistForDialog.name}</span>
                <Button variant="ghost" size="icon" onClick={() => setSelectedArtistForDialog(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 ring-2 ring-purple-500">
                  <AvatarImage
                    src={selectedArtistForDialog.avatar || "/placeholder.svg"}
                    alt={selectedArtistForDialog.name}
                  />
                  <AvatarFallback className="text-xl">{selectedArtistForDialog.name[0]}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold">{selectedArtistForDialog.name}</h2>
                  <p className="text-xl text-purple-300">{selectedArtistForDialog.specialization} Specialist</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      <span className="text-lg">{selectedArtistForDialog.rating}/5</span>
                    </div>
                    <span className="text-lg">${selectedArtistForDialog.hourlyRate}/hr</span>
                    <span className="text-lg">{selectedArtistForDialog.distance} miles away</span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-300">
                    <div className="bg-purple-900/30 px-3 py-1 rounded-full">
                      <span className="text-sm">Premium Access Required</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">About</h3>
                <p className="text-gray-300 text-lg">{selectedArtistForDialog.bio}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Portfolio</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedArtistForDialog.portfolio.map((work, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                      <Image
                        src={work || "/placeholder.svg"}
                        alt={`${selectedArtistForDialog.name} work ${index + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-3"
                  onClick={() => {
                    setSelectedArtistForDialog(null)
                    setShowEarlyAccessForm(true)
                  }}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Request Access to Contact
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Early Access Request Dialog */}
      {showEarlyAccessForm && (
        <Dialog open={showEarlyAccessForm} onOpenChange={setShowEarlyAccessForm}>
          <DialogContent className="bg-gray-950 text-white border border-purple-500 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Request Early Access
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="text-center space-y-2 mb-6">
                <p className="text-purple-300">Get premium access to connect directly with top-rated tattoo artists</p>
                <div className="bg-purple-900/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">What you'll get:</h4>
                  <ul className="text-sm text-purple-300 space-y-1">
                    <li>• Direct contact with verified artists</li>
                    <li>• Priority booking access</li>
                    <li>• Exclusive portfolio previews</li>
                    <li>• Personalized recommendations</li>
                  </ul>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleEarlyAccessSubmit(1)
                }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="access-name" className="text-purple-300">
                    Full Name
                  </Label>
                  <Input
                    id="access-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={earlyAccessData.name}
                    onChange={(e) => setEarlyAccessData((prev) => ({ ...prev, name: e.target.value }))}
                    className="bg-purple-950/30 border-purple-500/30"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="access-email" className="text-purple-300">
                    Email Address
                  </Label>
                  <Input
                    id="access-email"
                    type="email"
                    placeholder="Enter your email"
                    value={earlyAccessData.email}
                    onChange={(e) => setEarlyAccessData((prev) => ({ ...prev, email: e.target.value }))}
                    className="bg-purple-950/30 border-purple-500/30"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="access-phone" className="text-purple-300">
                    Phone Number
                  </Label>
                  <Input
                    id="access-phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={earlyAccessData.phone}
                    onChange={(e) => setEarlyAccessData((prev) => ({ ...prev, phone: e.target.value }))}
                    className="bg-purple-950/30 border-purple-500/30"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="access-message" className="text-purple-300">
                    Message (Optional)
                  </Label>
                  <textarea
                    id="access-message"
                    placeholder="Tell the artist about your tattoo idea..."
                    value={earlyAccessData.message}
                    onChange={(e) => setEarlyAccessData((prev) => ({ ...prev, message: e.target.value }))}
                    className="w-full p-3 bg-purple-950/30 border border-purple-500/30 rounded-md text-white placeholder-purple-400 resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                    onClick={() => setShowEarlyAccessForm(false)}
                    disabled={isSubmittingAccess}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    disabled={isSubmittingAccess}
                  >
                    {isSubmittingAccess ? "Submitting..." : "Request Access"}
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      )}

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
  )
}
