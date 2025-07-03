"use client"
import { useRouter } from "next/navigation"
import { ArrowLeft, Edit, MapPin, Phone, Mail, Globe, Instagram, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ArtistProfilePage() {
  const router = useRouter()

  // Mock artist data
  const artistData = {
    name: "Ink Alchemist",
    bio: "Specializing in cyberpunk, geometric, and neo-traditional tattoo styles. 10+ years of experience creating unique, personalized artwork.",
    avatar: "/placeholder.svg?text=IA",
    coverImage: "/images/tattoo-studio-background.png",
    location: "Los Angeles, CA",
    phone: "+1 (555) 123-4567",
    email: "ink.alchemist@tattit.com",
    website: "www.inkalchemist.com",
    instagram: "@inkalchemist",
    rating: 4.9,
    reviewCount: 127,
    completedTattoos: 450,
    yearsExperience: 10,
    specialties: ["Cyberpunk", "Geometric", "Neo-Traditional", "Blackwork", "Fine Line"],
    hourlyRate: 150,
    minBooking: 2,
    availability: {
      monday: "9:00 AM - 6:00 PM",
      tuesday: "9:00 AM - 6:00 PM",
      wednesday: "Closed",
      thursday: "9:00 AM - 6:00 PM",
      friday: "9:00 AM - 8:00 PM",
      saturday: "10:00 AM - 6:00 PM",
      sunday: "Closed",
    },
  }

  const portfolioImages = [
    { id: 1, src: "/images/tattoo-cyberpunk.png", title: "Cyberpunk Sleeve" },
    { id: 2, src: "/images/tattoo-geometric.png", title: "Geometric Wolf" },
    { id: 3, src: "/images/tattoo-mythological.png", title: "Dragon Design" },
    { id: 4, src: "/images/tattoo-blackwork.png", title: "Mandala Back Piece" },
    { id: 5, src: "/images/tattoo-fineline.png", title: "Fine Line Botanical" },
    { id: 6, src: "/images/tattoo-watercolor.png", title: "Watercolor Abstract" },
  ]

  const reviews = [
    {
      id: 1,
      client: "Alex Chen",
      rating: 5,
      comment: "Amazing work on my cyberpunk sleeve! Exceeded all expectations.",
      date: "2 weeks ago",
      avatar: "/placeholder.svg?text=AC",
    },
    {
      id: 2,
      client: "Jordan Smith",
      rating: 5,
      comment: "Professional, clean, and incredibly talented. Will definitely return!",
      date: "1 month ago",
      avatar: "/placeholder.svg?text=JS",
    },
    {
      id: 3,
      client: "Taylor Kim",
      rating: 4,
      comment: "Great attention to detail and very patient with design changes.",
      date: "2 months ago",
      avatar: "/placeholder.svg?text=TK",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-purple-950 text-white">
      {/* Header */}
      <header className="border-b border-purple-900 bg-black/50 backdrop-blur-sm p-4 sticky top-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center">
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Artist Profile</h1>
            <p className="text-sm text-purple-300">Public view of your profile</p>
          </div>
          <div className="ml-auto">
            <Button
              variant="outline"
              className="bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
              onClick={() => router.push("/artist/profile-management")}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>
      </header>

      <main className="p-4">
        <div className="mx-auto max-w-7xl">
          {/* Cover Image & Profile Header */}
          <div className="relative mb-8">
            <div className="h-64 w-full rounded-lg overflow-hidden bg-gradient-to-r from-purple-900 to-pink-900">
              <img
                src={artistData.coverImage || "/placeholder.svg"}
                alt="Studio background"
                className="w-full h-full object-cover opacity-60"
              />
            </div>
            <div className="absolute -bottom-16 left-8">
              <Avatar className="h-32 w-32 border-4 border-purple-500">
                <AvatarImage src={artistData.avatar || "/placeholder.svg"} alt={artistData.name} />
                <AvatarFallback className="text-2xl">{artistData.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Profile Info */}
          <div className="mt-20 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{artistData.name}</h1>
                <div className="flex items-center gap-4 text-purple-300 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{artistData.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>
                      {artistData.rating} ({artistData.reviewCount} reviews)
                    </span>
                  </div>
                </div>
                <p className="text-purple-100 max-w-2xl">{artistData.bio}</p>
              </div>
              <div className="flex gap-2">
                <Button className="bg-purple-700 hover:bg-purple-600">Book Consultation</Button>
                <Button variant="outline" className="bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50">
                  Send Message
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-black/40 border-purple-500/30">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-white">{artistData.completedTattoos}</div>
                <div className="text-sm text-purple-300">Completed Tattoos</div>
              </CardContent>
            </Card>
            <Card className="bg-black/40 border-purple-500/30">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-white">{artistData.yearsExperience}</div>
                <div className="text-sm text-purple-300">Years Experience</div>
              </CardContent>
            </Card>
            <Card className="bg-black/40 border-purple-500/30">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-white">${artistData.hourlyRate}</div>
                <div className="text-sm text-purple-300">Per Hour</div>
              </CardContent>
            </Card>
            <Card className="bg-black/40 border-purple-500/30">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-white">{artistData.minBooking}h</div>
                <div className="text-sm text-purple-300">Min Booking</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="portfolio" className="w-full">
            <TabsList className="bg-black/40 border border-purple-500/30 p-1">
              <TabsTrigger value="portfolio" className="data-[state=active]:bg-purple-700">
                Portfolio
              </TabsTrigger>
              <TabsTrigger value="about" className="data-[state=active]:bg-purple-700">
                About
              </TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-purple-700">
                Reviews
              </TabsTrigger>
              <TabsTrigger value="availability" className="data-[state=active]:bg-purple-700">
                Availability
              </TabsTrigger>
            </TabsList>

            <TabsContent value="portfolio" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolioImages.map((image) => (
                  <Card key={image.id} className="bg-black/40 border-purple-500/30 overflow-hidden group">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={image.src || "/placeholder.svg"}
                        alt={image.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-white">{image.title}</h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="about" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-black/40 border-purple-500/30">
                  <CardHeader>
                    <CardTitle>Specialties</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {artistData.specialties.map((specialty) => (
                        <Badge key={specialty} className="bg-purple-700">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-purple-500/30">
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-purple-400" />
                      <span className="text-white">{artistData.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-purple-400" />
                      <span className="text-white">{artistData.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-purple-400" />
                      <span className="text-white">{artistData.website}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Instagram className="h-4 w-4 text-purple-400" />
                      <span className="text-white">{artistData.instagram}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id} className="bg-black/40 border-purple-500/30">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.client} />
                          <AvatarFallback>{review.client.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-white">{review.client}</h4>
                            <span className="text-sm text-purple-300">{review.date}</span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-purple-100">{review.comment}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="availability" className="mt-6">
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle>Weekly Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(artistData.availability).map(([day, hours]) => (
                      <div key={day} className="flex items-center justify-between py-2 border-b border-purple-500/20">
                        <span className="font-medium text-white capitalize">{day}</span>
                        <span className={`text-sm ${hours === "Closed" ? "text-red-400" : "text-green-400"}`}>
                          {hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
