"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Settings, Upload, Calendar, Eye, MessageSquare, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/app/contexts/AuthContext"
import { signOut } from "@/app/actions/auth-actions"
import { UpcomingBookings } from "@/components/upcoming-bookings"
import { RecentMessages } from "@/components/recent-messages"
import { PortfolioPreview } from "@/components/portfolio-preview"

export default function ArtistDashboard() {
  const router = useRouter()
  const { logout } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)

  // Mock data for profile completion
  const profileCompletion = {
    overall: 65,
    profile: 80,
    portfolio: 40,
    availability: 70,
  }

  // Mock data for dashboard stats
  const dashboardStats = {
    totalBookings: 24,
    pendingRequests: 3,
    unreadMessages: 5,
    portfolioViews: 1247,
    monthlyEarnings: 3250,
    completedSessions: 18,
  }

  // Mock data for recent matches
  const recentMatches = [
    {
      id: 1,
      name: "Alex Chen",
      style: "Traditional",
      budget: "$200-300",
      date: "Today",
      image: "/placeholder.svg?text=AC",
      status: "new",
    },
    {
      id: 2,
      name: "Jordan Smith",
      style: "Blackwork",
      budget: "$150-250",
      date: "Yesterday",
      image: "/placeholder.svg?text=JS",
      status: "viewed",
    },
    {
      id: 3,
      name: "Taylor Kim",
      style: "Watercolor",
      budget: "$300-400",
      date: "2 days ago",
      image: "/placeholder.svg?text=TK",
      status: "contacted",
    },
  ]

  const handleSignOut = async () => {
    setIsSigningOut(true)

    try {
      const result = await signOut()

      if (!result.success) {
        throw new Error(result.error || "Server-side sign out failed")
      }

      await logout()

      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      })

      setTimeout(() => {
        router.push("/auth")
      }, 100)
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Sign out failed",
        description: "There was an error signing out. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSigningOut(false)
    }
  }

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-950 to-purple-950 text-white">
      <header className="border-b border-purple-900 bg-black/50 backdrop-blur-sm p-4 sticky top-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Artist Dashboard</h1>
            <p className="text-sm text-purple-300">Welcome back, Ink Alchemist</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
              onClick={() => handleNavigation("/artist/profile")}
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview Profile
            </Button>
            <Button
              variant="outline"
              className="border-purple-700 bg-transparent text-white hover:bg-purple-900"
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {isSigningOut ? "Signing out..." : "Sign Out"}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Profile Completion Card */}
          <Card className="bg-black/40 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-white">Profile Completion</h3>
                    <span className="text-sm font-medium text-purple-300">{profileCompletion.overall}%</span>
                  </div>
                  <Progress value={profileCompletion.overall} className="h-2 bg-purple-950/70" />
                  <p className="text-xs text-purple-400">
                    Complete your profile to increase visibility and attract more clients
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                  onClick={() => handleNavigation("/artist/profile-management")}
                >
                  Complete Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-black/40 border-purple-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-300">Total Bookings</p>
                    <p className="text-2xl font-bold text-white">{dashboardStats.totalBookings}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-purple-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-300">Pending Requests</p>
                    <p className="text-2xl font-bold text-white">{dashboardStats.pendingRequests}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-purple-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-300">Unread Messages</p>
                    <p className="text-2xl font-bold text-white">{dashboardStats.unreadMessages}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-purple-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-300">Portfolio Views</p>
                    <p className="text-2xl font-bold text-white">{dashboardStats.portfolioViews}</p>
                  </div>
                  <Eye className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            <Card
              className="bg-black/40 border-purple-500/30 text-white hover:bg-black/50 transition-colors cursor-pointer"
              onClick={() => handleNavigation("/artist/profile-management")}
            >
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Settings className="mb-2 h-8 w-8 text-purple-500" />
                <CardTitle className="mb-1 text-center">Profile Setup</CardTitle>
                <CardDescription className="text-center text-purple-300">Complete your artist profile</CardDescription>
                <div className="mt-2">
                  <Badge variant="secondary" className="bg-purple-900/50">
                    {profileCompletion.profile}% Complete
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card
              className="bg-black/40 border-purple-500/30 text-white hover:bg-black/50 transition-colors cursor-pointer"
              onClick={() => handleNavigation("/artist/portfolio")}
            >
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Upload className="mb-2 h-8 w-8 text-purple-500" />
                <CardTitle className="mb-1 text-center">Portfolio</CardTitle>
                <CardDescription className="text-center text-purple-300">Manage your portfolio</CardDescription>
                <div className="mt-2">
                  <Badge variant="secondary" className="bg-purple-900/50">
                    {profileCompletion.portfolio}% Complete
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card
              className="bg-black/40 border-purple-500/30 text-white hover:bg-black/50 transition-colors cursor-pointer relative"
              onClick={() => handleNavigation("/artist/bookings")}
            >
              {dashboardStats.pendingRequests > 0 && (
                <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                  {dashboardStats.pendingRequests}
                </span>
              )}
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Calendar className="mb-2 h-8 w-8 text-purple-500" />
                <CardTitle className="mb-1 text-center">Bookings</CardTitle>
                <CardDescription className="text-center text-purple-300">Manage appointments</CardDescription>
              </CardContent>
            </Card>

            <Card
              className="bg-black/40 border-purple-500/30 text-white hover:bg-black/50 transition-colors cursor-pointer relative"
              onClick={() => handleNavigation("/artist/messages")}
            >
              {dashboardStats.unreadMessages > 0 && (
                <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                  {dashboardStats.unreadMessages}
                </span>
              )}
              <CardContent className="flex flex-col items-center justify-center p-6">
                <MessageSquare className="mb-2 h-8 w-8 text-purple-500" />
                <CardTitle className="mb-1 text-center">Messages</CardTitle>
                <CardDescription className="text-center text-purple-300">Client communication</CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Client Matches */}
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle>Recent Client Matches</CardTitle>
                <CardDescription className="text-purple-300">
                  Clients looking for your style and expertise
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMatches.map((match) => (
                    <div
                      key={match.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-purple-950/50 border border-purple-500/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-800 rounded-full flex items-center justify-center text-white font-bold">
                          {match.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{match.name}</h4>
                          <p className="text-sm text-purple-300">
                            {match.style} • {match.budget}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-purple-300">{match.date}</p>
                        <Button
                          size="sm"
                          className="mt-1 bg-purple-700 hover:bg-purple-600"
                          onClick={() => handleNavigation(`/artist/matches/${match.id}`)}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                  onClick={() => handleNavigation("/artist/matches")}
                >
                  View All Matches
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Bookings */}
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle>Upcoming Bookings</CardTitle>
                <CardDescription className="text-purple-300">Your next appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <UpcomingBookings />
              </CardContent>
            </Card>

            {/* Recent Messages */}
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle>Recent Messages</CardTitle>
                <CardDescription className="text-purple-300">Latest client communications</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentMessages />
              </CardContent>
            </Card>
          </div>

          {/* Portfolio Preview */}
          <Card className="bg-black/40 border-purple-500/30">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Portfolio Preview</CardTitle>
                  <CardDescription className="text-purple-300">Your latest work showcase</CardDescription>
                </div>
                <Button
                  variant="outline"
                  className="bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                  onClick={() => handleNavigation("/artist/portfolio")}
                >
                  Manage Portfolio
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <PortfolioPreview />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
