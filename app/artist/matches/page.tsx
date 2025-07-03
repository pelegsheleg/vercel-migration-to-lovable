"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, Star, MapPin, Eye, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

// Mock data for client matches
const mockMatches = [
  {
    id: "m1",
    client: {
      name: "Alex Chen",
      avatar: "/placeholder.svg?text=AC",
      location: "Los Angeles, CA",
      rating: 4.8,
      completedTattoos: 3,
    },
    project: {
      title: "Cyberpunk Sleeve Design",
      description:
        "Looking for a full sleeve with cyberpunk elements, circuit patterns, and neon accents. I have reference images and am flexible with the design.",
      style: "Cyberpunk",
      placement: "Full Arm",
      budget: "$800-1200",
      timeline: "Within 2 months",
      size: "Large",
      references: ["/images/tattoo-cyberpunk.png"],
    },
    matchScore: 95,
    status: "new",
    postedDate: "2 hours ago",
    responses: 3,
  },
  {
    id: "m2",
    client: {
      name: "Jordan Smith",
      avatar: "/placeholder.svg?text=JS",
      location: "Beverly Hills, CA",
      rating: 4.9,
      completedTattoos: 5,
    },
    project: {
      title: "Geometric Wolf Design",
      description:
        "Interested in a geometric wolf design for my forearm. Looking for clean lines and modern aesthetic.",
      style: "Geometric",
      placement: "Forearm",
      budget: "$400-600",
      timeline: "Next month",
      size: "Medium",
      references: ["/images/tattoo-geometric.png"],
    },
    matchScore: 88,
    status: "viewed",
    postedDate: "1 day ago",
    responses: 7,
  },
  {
    id: "m3",
    client: {
      name: "Taylor Kim",
      avatar: "/placeholder.svg?text=TK",
      location: "Santa Monica, CA",
      rating: 4.7,
      completedTattoos: 2,
    },
    project: {
      title: "Neo-Traditional Back Piece",
      description:
        "Planning a large back piece with neo-traditional style. Open to artist's creative input on the design.",
      style: "Neo-Traditional",
      placement: "Back",
      budget: "$1500-2000",
      timeline: "Flexible",
      size: "Large",
      references: ["/images/tattoo-neotraditional.png"],
    },
    matchScore: 92,
    status: "contacted",
    postedDate: "3 days ago",
    responses: 12,
  },
  {
    id: "m4",
    client: {
      name: "Riley Thompson",
      avatar: "/placeholder.svg?text=RT",
      location: "Hollywood, CA",
      rating: 4.6,
      completedTattoos: 1,
    },
    project: {
      title: "Fine Line Botanical",
      description: "Looking for delicate fine line botanical tattoo on my wrist. Minimalist style preferred.",
      style: "Fine Line",
      placement: "Wrist",
      budget: "$200-300",
      timeline: "ASAP",
      size: "Small",
      references: ["/images/tattoo-fineline.png"],
    },
    matchScore: 85,
    status: "new",
    postedDate: "5 days ago",
    responses: 15,
  },
]

export default function ArtistMatchesPage() {
  const router = useRouter()
  const [matches, setMatches] = useState(mockMatches)
  const [filteredMatches, setFilteredMatches] = useState(mockMatches)
  const [searchQuery, setSearchQuery] = useState("")
  const [styleFilter, setStyleFilter] = useState("all")
  const [budgetFilter, setBudgetFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Apply filters
    let filtered = [...matches]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (match) =>
          match.client.name.toLowerCase().includes(query) ||
          match.project.title.toLowerCase().includes(query) ||
          match.project.description.toLowerCase().includes(query),
      )
    }

    if (styleFilter !== "all") {
      filtered = filtered.filter((match) => match.project.style.toLowerCase() === styleFilter.toLowerCase())
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((match) => match.status === statusFilter)
    }

    if (budgetFilter !== "all") {
      // Simple budget filtering logic
      filtered = filtered.filter((match) => {
        const budget = match.project.budget.toLowerCase()
        switch (budgetFilter) {
          case "low":
            return budget.includes("200") || budget.includes("300") || budget.includes("400")
          case "medium":
            return budget.includes("500") || budget.includes("600") || budget.includes("700") || budget.includes("800")
          case "high":
            return (
              budget.includes("1000") || budget.includes("1200") || budget.includes("1500") || budget.includes("2000")
            )
          default:
            return true
        }
      })
    }

    // Sort by match score
    filtered.sort((a, b) => b.matchScore - a.matchScore)

    setFilteredMatches(filtered)
  }, [matches, searchQuery, styleFilter, budgetFilter, statusFilter])

  const handleContactClient = (matchId: string) => {
    const match = matches.find((m) => m.id === matchId)
    if (match) {
      // Update status to contacted
      setMatches(matches.map((m) => (m.id === matchId ? { ...m, status: "contacted" } : m)))

      toast({
        title: "Message sent!",
        description: `Your message has been sent to ${match.client.name}.`,
      })

      // Navigate to messages
      router.push(`/artist/messages?client=${match.client.name}`)
    }
  }

  const handleViewProject = (matchId: string) => {
    router.push(`/artist/matches/${matchId}`)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-green-600">New</Badge>
      case "viewed":
        return <Badge className="bg-blue-600">Viewed</Badge>
      case "contacted":
        return <Badge className="bg-purple-600">Contacted</Badge>
      default:
        return <Badge className="bg-gray-600">Unknown</Badge>
    }
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
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.push("/artist/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Client Matches</h1>
            <p className="text-sm text-purple-300">Discover clients looking for your expertise</p>
          </div>
        </div>
      </header>

      <main className="p-4">
        <div className="mx-auto max-w-7xl">
          {/* Filters */}
          <Card className="mb-6 bg-black/40 border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search matches..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-black/40 border-purple-500/30"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={styleFilter} onValueChange={setStyleFilter}>
                    <SelectTrigger className="w-40 bg-black/40 border-purple-500/30">
                      <SelectValue placeholder="Style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Styles</SelectItem>
                      <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                      <SelectItem value="geometric">Geometric</SelectItem>
                      <SelectItem value="neo-traditional">Neo-Traditional</SelectItem>
                      <SelectItem value="fine line">Fine Line</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={budgetFilter} onValueChange={setBudgetFilter}>
                    <SelectTrigger className="w-40 bg-black/40 border-purple-500/30">
                      <SelectValue placeholder="Budget" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Budgets</SelectItem>
                      <SelectItem value="low">$200-$500</SelectItem>
                      <SelectItem value="medium">$500-$1000</SelectItem>
                      <SelectItem value="high">$1000+</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40 bg-black/40 border-purple-500/30">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="viewed">Viewed</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Matches Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="bg-black/40 border-purple-500/30 animate-pulse">
                  <CardContent className="p-6 h-64"></CardContent>
                </Card>
              ))}
            </div>
          ) : filteredMatches.length === 0 ? (
            <Card className="bg-black/40 border-purple-500/30">
              <CardContent className="p-8 text-center">
                <p className="text-purple-300 mb-4">No matches found with current filters.</p>
                <Button
                  variant="outline"
                  className="bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                  onClick={() => {
                    setSearchQuery("")
                    setStyleFilter("all")
                    setBudgetFilter("all")
                    setStatusFilter("all")
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredMatches.map((match) => (
                <Card key={match.id} className="bg-black/40 border-purple-500/30 hover:bg-black/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={match.client.avatar || "/placeholder.svg"} alt={match.client.name} />
                          <AvatarFallback>{match.client.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-white">{match.client.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-purple-300">
                            <MapPin className="h-3 w-3" />
                            <span>{match.client.location}</span>
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{match.client.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getMatchScoreColor(match.matchScore)}`}>
                          {match.matchScore}% match
                        </div>
                        {getStatusBadge(match.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-white mb-2">{match.project.title}</h4>
                      <p className="text-sm text-purple-100 line-clamp-2">{match.project.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-purple-300">Style:</span>
                        <span className="text-white ml-2">{match.project.style}</span>
                      </div>
                      <div>
                        <span className="text-purple-300">Placement:</span>
                        <span className="text-white ml-2">{match.project.placement}</span>
                      </div>
                      <div>
                        <span className="text-purple-300">Budget:</span>
                        <span className="text-white ml-2">{match.project.budget}</span>
                      </div>
                      <div>
                        <span className="text-purple-300">Timeline:</span>
                        <span className="text-white ml-2">{match.project.timeline}</span>
                      </div>
                    </div>

                    {match.project.references && match.project.references.length > 0 && (
                      <div>
                        <span className="text-sm text-purple-300 mb-2 block">Reference Images:</span>
                        <div className="flex gap-2">
                          {match.project.references.map((ref, index) => (
                            <div key={index} className="w-16 h-16 rounded-md overflow-hidden">
                              <img
                                src={ref || "/placeholder.svg"}
                                alt="Reference"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-purple-500/20">
                      <div className="text-sm text-purple-300">
                        Posted {match.postedDate} • {match.responses} responses
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                          onClick={() => handleViewProject(match.id)}
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          className="bg-purple-700 hover:bg-purple-600"
                          onClick={() => handleContactClient(match.id)}
                          disabled={match.status === "contacted"}
                        >
                          <MessageSquare className="mr-1 h-4 w-4" />
                          {match.status === "contacted" ? "Contacted" : "Contact"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
