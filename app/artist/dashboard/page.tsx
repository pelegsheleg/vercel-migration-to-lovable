"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Edit, Upload, Bell, User, ImageIcon, X, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/app/contexts/AuthContext"
import { signOut } from "@/app/actions/auth-actions"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface PortfolioImage {
  id: string
  url: string
  name: string
  uploadDate: string
}

export default function ArtistDashboard() {
  const router = useRouter()
  const { logout } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [showPortfolioModal, setShowPortfolioModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState<PortfolioImage | null>(null)
  const [portfolioImages, setPortfolioImages] = useState<PortfolioImage[]>([
    {
      id: "1",
      url: "/images/tattoo-mythological.png",
      name: "mythological-design.jpg",
      uploadDate: "2024-01-15",
    },
    {
      id: "2",
      url: "/images/tattoo-illuminati-hand.png",
      name: "illuminati-hand.jpg",
      uploadDate: "2024-01-14",
    },
    {
      id: "3",
      url: "/images/tattoo-symbolic-patchwork.png",
      name: "symbolic-patchwork.jpg",
      uploadDate: "2024-01-13",
    },
    {
      id: "4",
      url: "/images/tattoo-mandala-sleeves.png",
      name: "mandala-sleeves.jpg",
      uploadDate: "2024-01-12",
    },
    {
      id: "5",
      url: "/images/tattoo-fineline-bird.jpeg",
      name: "fineline-bird.jpg",
      uploadDate: "2024-01-11",
    },
    {
      id: "6",
      url: "/images/tattoo-graphic-style.jpeg",
      name: "graphic-style.jpg",
      uploadDate: "2024-01-10",
    },
  ])

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mock data for notifications
  const notifications = [
    { id: 1, message: "You have 2 new client matches", type: "match", isNew: true },
    { id: 2, message: "Portfolio image approved", type: "portfolio", isNew: true },
    { id: 3, message: "Profile updated successfully", type: "profile", isNew: false },
  ]

  // Mock data for client match requests
  const clientMatches = [
    {
      id: 1,
      clientName: "Alex Chen",
      requestedStyle: "Traditional",
      budget: "$200-300",
      referenceImage: "/images/tattoo-traditional.png",
    },
    {
      id: 2,
      clientName: "Jordan Smith",
      requestedStyle: "Blackwork",
      budget: "$150-250",
      referenceImage: "/images/tattoo-blackwork.png",
    },
    {
      id: 3,
      clientName: "Taylor Kim",
      requestedStyle: "Watercolor",
      budget: "$300-400",
      referenceImage: "/images/tattoo-watercolor.png",
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const newImage: PortfolioImage = {
          id: Date.now().toString() + Math.random(),
          url: URL.createObjectURL(file),
          name: file.name,
          uploadDate: new Date().toISOString().split("T")[0],
        }
        setPortfolioImages((prev) => [newImage, ...prev])
      }
    })

    toast({
      title: "Images uploaded",
      description: `${files.length} image(s) added to your portfolio.`,
    })

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleImageClick = (image: PortfolioImage) => {
    setSelectedImage(image)
  }

  const handleDeleteImage = (imageId: string) => {
    setPortfolioImages((prev) => prev.filter((img) => img.id !== imageId))
    setSelectedImage(null)
    toast({
      title: "Image deleted",
      description: "Image removed from your portfolio.",
    })
  }

  const newNotificationsCount = notifications.filter((n) => n.isNew).length

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
          {/* Notifications Section */}
          <Card className="bg-black/40 border-purple-500/30">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-purple-400" />
                <CardTitle className="text-white">Notifications</CardTitle>
                {newNotificationsCount > 0 && (
                  <Badge className="bg-purple-600 text-white">{newNotificationsCount} new</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border ${
                    notification.isNew ? "bg-purple-950/50 border-purple-500/30" : "bg-gray-950/50 border-gray-500/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-white">{notification.message}</p>
                    {notification.isNew && (
                      <Badge variant="secondary" className="bg-purple-600 text-white text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile & Portfolio Section */}
            <div className="space-y-6">
              {/* Profile Card */}
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-purple-400" />
                      <CardTitle className="text-white">Profile</CardTitle>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                      onClick={() => router.push("/artist/profile-management")}
                    >
                      <Edit className="mr-1 h-4 w-4" />
                      Edit Profile
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-purple-300">Name</p>
                      <p className="text-white font-medium">Ink Alchemist</p>
                    </div>
                    <div>
                      <p className="text-sm text-purple-300">Styles</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <Badge variant="secondary" className="bg-purple-900/50 text-purple-200">
                          Traditional
                        </Badge>
                        <Badge variant="secondary" className="bg-purple-900/50 text-purple-200">
                          Blackwork
                        </Badge>
                        <Badge variant="secondary" className="bg-purple-900/50 text-purple-200">
                          Watercolor
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-purple-300">Location</p>
                      <p className="text-white">Los Angeles, CA</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Portfolio Gallery */}
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-purple-400" />
                      <CardTitle className="text-white">Portfolio Gallery</CardTitle>
                      <Badge variant="secondary" className="bg-purple-900/50 text-purple-200">
                        {portfolioImages.length} images
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="mr-1 h-4 w-4" />
                        Upload
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {portfolioImages.length === 0 ? (
                    <div className="text-center py-8">
                      <ImageIcon className="h-12 w-12 mx-auto text-purple-400 mb-4" />
                      <p className="text-purple-300 mb-4">No images in your portfolio yet</p>
                      <Button
                        variant="outline"
                        className="bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Your First Image
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-3 gap-2">
                        {portfolioImages.slice(0, 6).map((image) => (
                          <div
                            key={image.id}
                            className="aspect-square rounded-md overflow-hidden relative group cursor-pointer"
                            onClick={() => handleImageClick(image)}
                          >
                            <img
                              src={image.url || "/placeholder.svg"}
                              alt={image.name}
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Eye className="h-6 w-6 text-white" />
                            </div>
                          </div>
                        ))}
                      </div>
                      {portfolioImages.length > 6 && (
                        <Button
                          variant="outline"
                          className="w-full mt-4 bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                          onClick={() => setShowPortfolioModal(true)}
                        >
                          View All {portfolioImages.length} Images
                        </Button>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Client Match Requests */}
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Client Match Requests</CardTitle>
                <CardDescription className="text-purple-300">View-only list of new match requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clientMatches.map((match) => (
                    <div key={match.id} className="p-4 rounded-lg bg-purple-950/50 border border-purple-500/20">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={match.referenceImage || "/placeholder.svg"}
                            alt="Reference"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-white">{match.clientName}</h4>
                          <p className="text-sm text-purple-300">Style: {match.requestedStyle}</p>
                          <p className="text-sm text-purple-300">Budget: {match.budget}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
                  onClick={() => router.push("/artist/matches")}
                >
                  View All Matches
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Portfolio Modal for Full Gallery View */}
      <Dialog open={showPortfolioModal} onOpenChange={setShowPortfolioModal}>
        <DialogContent className="bg-gray-900 border-purple-500/30 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Portfolio Gallery</DialogTitle>
            <DialogDescription className="text-purple-300">
              All your uploaded work ({portfolioImages.length} images)
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {portfolioImages.map((image) => (
              <div
                key={image.id}
                className="aspect-square rounded-md overflow-hidden relative group cursor-pointer"
                onClick={() => handleImageClick(image)}
              >
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={image.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Eye className="h-6 w-6 text-white" />
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Detail Modal */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="bg-gray-900 border-purple-500/30 text-white max-w-2xl">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>{selectedImage.name}</DialogTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteImage(selectedImage.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <DialogDescription className="text-purple-300">Uploaded on {selectedImage.uploadDate}</DialogDescription>
            </DialogHeader>
            <div className="flex justify-center">
              <img
                src={selectedImage.url || "/placeholder.svg"}
                alt={selectedImage.name}
                className="max-w-full max-h-96 object-contain rounded-lg"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
