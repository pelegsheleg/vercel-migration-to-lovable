"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Save, User, FileText, Settings, AlertCircle, Eye } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"

// Import profile section components
import { ProfileOverview } from "@/components/artist/profile/profile-overview"
import { PortfolioSection } from "@/components/artist/profile/portfolio-section"

// Import styles
import "@/app/styles/profile.css"

export default function ArtistProfileManagement() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Profile completion data
  const profileCompletion = {
    overview: 100,
    portfolio: 80,
    settings: 40,
    overall: 75,
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSave = async () => {
    setIsSaving(true)

    try {
      // Simulate saving data
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Profile updated",
        description: "Your profile changes have been saved successfully.",
      })

      setHasUnsavedChanges(false)
    } catch (error) {
      toast({
        title: "Error saving profile",
        description: "There was a problem saving your changes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleContentChange = () => {
    setHasUnsavedChanges(true)
  }

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "overview":
        return <User className="h-4 w-4" />
      case "portfolio":
        return <FileText className="h-4 w-4" />
      case "settings":
        return <Settings className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-purple-950 text-white">
      <div
        className={`container mx-auto px-4 py-8 transition-opacity duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/artist/dashboard")}
                className="h-8 w-8 rounded-full bg-black/50 hover:bg-black/70"
                aria-label="Back to dashboard"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
                Profile Management
              </h1>
            </div>
            <p className="text-purple-300">Customize your artist profile and settings</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {hasUnsavedChanges && (
              <div className="flex items-center text-yellow-400 text-sm mr-2">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>Unsaved changes</span>
              </div>
            )}
            <Button variant="outline" className="bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50" asChild>
              <Link href="/artist/profile">
                <Eye className="mr-2 h-4 w-4" />
                Preview Profile
              </Link>
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !hasUnsavedChanges}
              className="bg-purple-700 hover:bg-purple-600 transition-all duration-300"
            >
              {isSaving ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Profile Completion Card */}
        <Card className="mb-6 bg-black/40 border-purple-500/30">
          <CardContent className="p-4">
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
                onClick={() => {
                  // Find the tab with the lowest completion percentage that's not 100%
                  const tabs = Object.entries(profileCompletion)
                    .filter(([key]) => key !== "overall")
                    .sort(([, a], [, b]) => a - b)

                  const nextTabToComplete = tabs.find(([, value]) => value < 100)?.[0] || "overview"
                  setActiveTab(nextTabToComplete)
                }}
              >
                Complete Your Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs Navigation */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-purple-500/30 p-1 overflow-x-auto">
            <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-1 bg-transparent h-auto">
              {[
                { id: "overview", label: "Overview" },
                { id: "portfolio", label: "Portfolio" },
                { id: "settings", label: "Settings" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="relative py-2 data-[state=active]:bg-purple-700 data-[state=active]:text-white transition-all duration-300 rounded-md"
                >
                  <div className="flex items-center gap-1.5">
                    {getTabIcon(tab.id)}
                    <span>{tab.label}</span>
                  </div>
                  {profileCompletion[tab.id as keyof typeof profileCompletion] < 100 && (
                    <span
                      className="absolute top-1 right-1 w-2 h-2 bg-yellow-500 rounded-full"
                      aria-hidden="true"
                    ></span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-purple-500/20 p-6">
            <TabsContent value="overview" className="mt-0 animate-slide-in">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-white mb-2">Personal Information</h2>
                <p className="text-purple-300">Manage your basic profile information and specialties</p>
              </div>
              <ProfileOverview onChange={handleContentChange} />
            </TabsContent>

            <TabsContent value="portfolio" className="mt-0 animate-slide-in">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-white mb-2">Portfolio Management</h2>
                <p className="text-purple-300">Showcase your best work to attract clients</p>
              </div>
              <PortfolioSection onChange={handleContentChange} />
            </TabsContent>

            <TabsContent value="settings" className="mt-0 animate-slide-in">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
                <p className="text-purple-300">Manage your account settings</p>
              </div>
              <div>
                {/* Placeholder for settings section */}
                <p>Settings content here</p>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Quick Navigation Footer */}
        <div className="mt-8 flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => router.push("/artist/dashboard")}
            className="text-purple-300 hover:text-white hover:bg-black/30"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="flex gap-2">
            {activeTab !== "overview" && (
              <Button
                variant="outline"
                onClick={() => {
                  const tabs = ["overview", "portfolio", "settings"]
                  const currentIndex = tabs.indexOf(activeTab)
                  if (currentIndex > 0) {
                    setActiveTab(tabs[currentIndex - 1])
                  }
                }}
                className="bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
              >
                Previous
              </Button>
            )}

            {activeTab !== "settings" && (
              <Button
                onClick={() => {
                  const tabs = ["overview", "portfolio", "settings"]
                  const currentIndex = tabs.indexOf(activeTab)
                  if (currentIndex < tabs.length - 1) {
                    setActiveTab(tabs[currentIndex + 1])
                  }
                }}
                className="bg-purple-700 hover:bg-purple-600 transition-all duration-300"
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
