"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, Plus, X, MapPin, Star, Award } from "lucide-react"

interface ProfileOverviewProps {
  onChange?: () => void
}

export function ProfileOverview({ onChange }: ProfileOverviewProps) {
  const [profileData, setProfileData] = useState({
    displayName: "Alex Rivera",
    bio: "Passionate tattoo artist specializing in neo-traditional and watercolor styles. 8+ years of experience creating unique, personalized artwork.",
    specialties: ["Neo-Traditional", "Watercolor", "Fine Line", "Portraits"],
    experience: "8",
    location: "Los Angeles, CA",
    languages: ["English", "Spanish"],
    profileImage: "/placeholder.svg?height=120&width=120",
  })

  const [newSpecialty, setNewSpecialty] = useState("")
  const [newLanguage, setNewLanguage] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
    onChange?.()
  }

  const addSpecialty = () => {
    if (newSpecialty.trim() && !profileData.specialties.includes(newSpecialty.trim())) {
      setProfileData((prev) => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()],
      }))
      setNewSpecialty("")
      onChange?.()
    }
  }

  const removeSpecialty = (specialty: string) => {
    setProfileData((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((s) => s !== specialty),
    }))
    onChange?.()
  }

  const addLanguage = () => {
    if (newLanguage.trim() && !profileData.languages.includes(newLanguage.trim())) {
      setProfileData((prev) => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()],
      }))
      setNewLanguage("")
      onChange?.()
    }
  }

  const removeLanguage = (language: string) => {
    setProfileData((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l !== language),
    }))
    onChange?.()
  }

  return (
    <div className="space-y-6">
      {/* Profile Image & Basic Info */}
      <Card className="bg-black/40 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Profile Image & Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Profile Image */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32 border-4 border-purple-500/30">
                <AvatarImage src={profileData.profileImage || "/placeholder.svg"} alt="Profile" />
                <AvatarFallback className="bg-purple-900 text-white text-2xl">
                  {profileData.displayName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" className="bg-purple-950/30 border-purple-500/30">
                <Camera className="h-4 w-4 mr-2" />
                Change Photo
              </Button>
            </div>

            {/* Basic Info */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="displayName" className="text-purple-300">
                    Display Name
                  </Label>
                  <Input
                    id="displayName"
                    value={profileData.displayName}
                    onChange={(e) => handleInputChange("displayName", e.target.value)}
                    className="bg-black/50 border-purple-500/30 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="experience" className="text-purple-300">
                    Years of Experience
                  </Label>
                  <Select
                    value={profileData.experience}
                    onValueChange={(value) => handleInputChange("experience", value)}
                  >
                    <SelectTrigger className="bg-black/50 border-purple-500/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 20 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1} {i === 0 ? "Year" : "Years"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="location" className="text-purple-300">
                  Location
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="bg-black/50 border-purple-500/30 text-white pl-10"
                    placeholder="City, State/Country"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bio Section */}
      <Card className="bg-black/40 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">Professional Bio</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="bio" className="text-purple-300">
              Tell clients about yourself and your artistic journey
            </Label>
            <Textarea
              id="bio"
              value={profileData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              className="bg-black/50 border-purple-500/30 text-white mt-2 min-h-[120px]"
              placeholder="Share your story, artistic philosophy, and what makes your work unique..."
            />
            <p className="text-xs text-purple-400 mt-2">{profileData.bio.length}/500 characters</p>
          </div>
        </CardContent>
      </Card>

      {/* Specialties */}
      <Card className="bg-black/40 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Star className="h-5 w-5" />
            Tattoo Specialties
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {profileData.specialties.map((specialty) => (
              <Badge
                key={specialty}
                variant="secondary"
                className="bg-purple-900/50 text-purple-200 hover:bg-purple-800/50"
              >
                {specialty}
                <button onClick={() => removeSpecialty(specialty)} className="ml-2 hover:text-red-400">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={newSpecialty}
              onChange={(e) => setNewSpecialty(e.target.value)}
              placeholder="Add a specialty (e.g., Traditional, Realism, Geometric)"
              className="bg-black/50 border-purple-500/30 text-white"
              onKeyPress={(e) => e.key === "Enter" && addSpecialty()}
            />
            <Button onClick={addSpecialty} size="sm" className="bg-purple-700 hover:bg-purple-600">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Languages */}
      <Card className="bg-black/40 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">Languages Spoken</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {profileData.languages.map((language) => (
              <Badge
                key={language}
                variant="secondary"
                className="bg-purple-900/50 text-purple-200 hover:bg-purple-800/50"
              >
                {language}
                <button onClick={() => removeLanguage(language)} className="ml-2 hover:text-red-400">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              placeholder="Add a language"
              className="bg-black/50 border-purple-500/30 text-white"
              onKeyPress={(e) => e.key === "Enter" && addLanguage()}
            />
            <Button onClick={addLanguage} size="sm" className="bg-purple-700 hover:bg-purple-600">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Stats */}
      <Card className="bg-black/40 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Award className="h-5 w-5" />
            Profile Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">127</div>
              <div className="text-sm text-purple-300">Completed Tattoos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">4.9</div>
              <div className="text-sm text-purple-300">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">89</div>
              <div className="text-sm text-purple-300">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">8</div>
              <div className="text-sm text-purple-300">Years Experience</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
