"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Star, MapPin, Calendar, MessageSquare, Phone, Mail, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

// Mock data for individual match
const mockMatchData = {
  m1: {
    id: "m1",
    client: {
      name: "Alex Chen",
      avatar: "/placeholder.svg?text=AC",
      location: "Los Angeles, CA",
      rating: 4.8,
      completedTattoos: 3,
      memberSince: "2023",
      email: "alex.chen@email.com",
      phone: "+1 (555) 123-4567",
      bio: "Tattoo enthusiast with a passion for cyberpunk and futuristic designs. I appreciate detailed work and creative interpretations.",
    },
    project: {
      title: "Cyberpunk Sleeve Design",
      description:
        "I'm looking for a full sleeve tattoo with cyberpunk elements. I want to incorporate circuit board patterns, neon accents, and futuristic elements. I'm open to the artist's creative input and would love to see their interpretation of cyberpunk aesthetics. The design should flow well around the arm and have good contrast between light and dark elements.",
      style: "Cyberpunk",
      placement: "Full Arm (Right)",
      budget: "$800-1200",
      timeline: "Within 2 months",
      size: "Large",
      sessionEstimate: "3-4 sessions",
      references: ["/images/tattoo-cyberpunk.png", "/images/tattoo-geometric.png", "/images/tattoo-blackwork.png"],
      additionalNotes:
        "I work in tech, so the cyberpunk theme really resonates with me. I'm flexible with scheduling and can accommodate multiple sessions. I've done my research on aftercare and am committed to following all instructions.",
    },
    matchScore: 95,
    status: "new",
    postedDate: "2 hours ago",
    responses: 3,
    previousWork: [
      {
        id: 1,
        image: "/images/tattoo-fineline.png",
        artist: "Luna Ink Studio",
        style: "Fine Line",
        year: "2023",
      },
      {
        id: 2,
        image: "/images/tattoo-watercolor.png",
        artist: "Mystic Tattoo Co",
        style: "Watercolor",
        year: "2022",
      },
    ],
  },
}

export default function MatchDetailPage() {
  const router = useRouter()
  const params = useParams()
  const matchId = params.id as string

  const [match, setMatch] = useState(mockMatchData[matchId as keyof typeof mockMatchData])
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Please enter a message before sending.",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)

    // Simulate sending message
    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: `Your message has been sent to ${match?.client.name}.`,
      })
      setMessage("")
      setIsSending(false)

      // Navigate to messages
      router.push(`/artist/messages?client=${match?.client.name}`)
    }, 1500)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-purple-950 text-white">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
        </div>
      </div>
    )
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-purple-950 text-white">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Match not found</h1>
            <Button onClick={() => router.push("/artist/matches")}>Back to Matches</Button>
          </div>
        </div>
      </div>
    )
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400"
    if (score >= 80) return "text-yellow-400"
    return "text-orange-400"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-purple-950 text-white">
      <header className="border-b border-purple-900 bg-black/50 backdrop-blur-sm p-4 sticky top-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center">
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.push("/artist/matches")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Match Details</h1>
            <p className="text-sm text-purple-300">Review client project and send proposal</p>
          </div>
        </div>
      </header>

      <main className="p-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Project Details */}
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{match.project.title}</CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-purple-300">
                        <span>Posted {match.postedDate}</span>
                        <span>•</span>
                        <span>{match.responses} responses</span>
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${getMatchScoreColor(match.matchScore)}`}>
                      {match.matchScore}% match
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium text-white mb-2">Project Description</h4>
                    <p className="text-purple-100 leading-relaxed">{match.project.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <span className="text-purple-300 text-sm">Style:</span>
                        <p className="text-white">{match.project.style}</p>
                      </div>
                      <div>
                        <span className="text-purple-300 text-sm">Placement:</span>
                        <p className="text-white">{match.project.placement}</p>
                      </div>
                      <div>
                        <span className="text-purple-300 text-sm">Size:</span>
                        <p className="text-white">{match.project.size}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-purple-300 text-sm">Budget:</span>
                        <p className="text-white">{match.project.budget}</p>
                      </div>
                      <div>
                        <span className="text-purple-300 text-sm">Timeline:</span>
                        <p className="text-white">{match.project.timeline}</p>
                      </div>
                      <div>
                        <span className="text-purple-300 text-sm">Estimated Sessions:</span>
                        <p className="text-white">{match.project.sessionEstimate}</p>
                      </div>
                    </div>
                  </div>

                  {match.project.additionalNotes && (
                    <div>
                      <h4 className="font-medium text-white mb-2">Additional Notes</h4>
                      <p className="text-purple-100 leading-relaxed">{match.project.additionalNotes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Reference Images */}
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle>Reference Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {match.project.references.map((ref, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden bg-purple-900/20">
                        <img
                          src={ref || "/placeholder.svg"}
                          alt={`Reference ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Client's Previous Work */}
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle>Client's Previous Tattoos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {match.previousWork.map((work) => (
                      <div key={work.id} className="bg-purple-950/30 rounded-lg p-4">
                        <div className="aspect-square rounded-md overflow-hidden mb-3">
                          <img
                            src={work.image || "/placeholder.svg"}
                            alt={`Previous work ${work.id}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <p className="text-white font-medium">{work.style}</p>
                          <p className="text-purple-300 text-sm">by {work.artist}</p>
                          <p className="text-purple-400 text-sm">{work.year}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Client Info */}
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle>Client Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={match.client.avatar || "/placeholder.svg"} alt={match.client.name} />
                      <AvatarFallback className="text-lg">{match.client.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-white text-lg">{match.client.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-purple-300">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{match.client.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-purple-400" />
                      <span className="text-white">{match.client.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-purple-400" />
                      <span className="text-white">Member since {match.client.memberSince}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-purple-300">Completed Tattoos: </span>
                      <span className="text-white">{match.client.completedTattoos}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-white mb-2">About</h4>
                    <p className="text-purple-100 text-sm leading-relaxed">{match.client.bio}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-purple-400" />
                      <span className="text-white">{match.client.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-purple-400" />
                      <span className="text-white">{match.client.phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Form */}
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle>Send Proposal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-purple-300 mb-2 block">Your Message</label>
                    <Textarea
                      placeholder="Introduce yourself and explain why you're the perfect artist for this project..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-[120px] bg-black/40 border-purple-500/30 text-white placeholder:text-purple-400"
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={isSending || !message.trim()}
                    className="w-full bg-purple-700 hover:bg-purple-600"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {isSending ? "Sending..." : "Send Proposal"}
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                    onClick={() => router.push(`/artist/messages?client=${match.client.name}`)}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    View Messages
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                    onClick={() => router.push(`/artist/bookings?client=${match.client.name}`)}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Consultation
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                    onClick={() => router.push(`/artist/profile?preview=client&id=${match.id}`)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Preview My Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
