"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, User, MapPin, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"

const tattooStyles = [
  "Traditional",
  "Neo-Traditional",
  "Japanese",
  "Blackwork",
  "Realism",
  "Watercolor",
  "Geometric",
  "Tribal",
  "New School",
  "Minimalist",
  "Dotwork",
  "Biomechanical",
]

export default function ProfileSetup() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    specialties: [],
    experience: "",
    hourlyRate: "",
    location: "",
    phone: "",
    email: "",
    instagram: "",
  })

  const handleSpecialtyChange = (style: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      specialties: checked ? [...prev.specialties, style] : prev.specialties.filter((s) => s !== style),
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      })

      router.push("/artist/dashboard")
    } catch (error) {
      toast({
        title: "Error saving profile",
        description: "There was a problem saving your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-purple-950 text-white">
      <header className="border-b border-purple-900 bg-black/50 backdrop-blur-sm p-4 sticky top-0 z-10">
        <div className="mx-auto flex max-w-4xl items-center">
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.push("/artist/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Profile Setup</h1>
            <p className="text-sm text-purple-300">Complete your artist profile</p>
          </div>
        </div>
      </header>

      <main className="p-4">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Basic Information */}
          <Card className="bg-black/40 border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-purple-400" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, displayName: e.target.value }))}
                    placeholder="Your artist name"
                    className="bg-purple-950/30 border-purple-500/30"
                  />
                </div>
                <div>
                  <Label htmlFor="experience">Experience Level</Label>
                  <Select
                    value={formData.experience}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, experience: value }))}
                  >
                    <SelectTrigger className="bg-purple-950/30 border-purple-500/30">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                      <SelectItem value="experienced">Experienced (5-10 years)</SelectItem>
                      <SelectItem value="expert">Expert (10+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell clients about yourself and your artistic style..."
                  className="bg-purple-950/30 border-purple-500/30 min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Specialties */}
          <Card className="bg-black/40 border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-purple-400" />
                Specialties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {tattooStyles.map((style) => (
                  <div key={style} className="flex items-center space-x-2">
                    <Checkbox
                      id={style}
                      checked={formData.specialties.includes(style)}
                      onCheckedChange={(checked) => handleSpecialtyChange(style, checked)}
                    />
                    <Label htmlFor={style} className="text-sm">
                      {style}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Location & Contact */}
          <Card className="bg-black/40 border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-purple-400" />
                Location & Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="City, State"
                    className="bg-purple-950/30 border-purple-500/30"
                  />
                </div>
                <div>
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, hourlyRate: e.target.value }))}
                    placeholder="150"
                    className="bg-purple-950/30 border-purple-500/30"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="(555) 123-4567"
                    className="bg-purple-950/30 border-purple-500/30"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="artist@example.com"
                    className="bg-purple-950/30 border-purple-500/30"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="instagram">Instagram Handle (optional)</Label>
                <Input
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) => setFormData((prev) => ({ ...prev, instagram: e.target.value }))}
                  placeholder="@yourusername"
                  className="bg-purple-950/30 border-purple-500/30"
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => router.push("/artist/dashboard")}
              className="bg-purple-950/30 border-purple-500/30 hover:bg-purple-800/50"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-purple-700 hover:bg-purple-600">
              {isSaving ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Profile
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
