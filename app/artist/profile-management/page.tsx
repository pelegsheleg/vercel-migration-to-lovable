"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

import { ProfileOverview } from "@/components/artist/profile/profile-overview"

export default function ArtistProfileManagementPage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // -- minimal stub for now, hook into your real save logic here
    await new Promise((r) => setTimeout(r, 1000))

    toast({
      title: "Profile saved",
      description: "Your profile changes have been saved.",
    })
    setIsSaving(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-purple-950 p-4 text-white">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card className="bg-black/40 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Basic profile editor (name, bio, specialties, etc.) */}
            <ProfileOverview
              onChange={() => {
                /* track dirty state if needed */
              }}
            />
            <div className="mt-6 flex justify-end">
              <Button onClick={handleSave} disabled={isSaving} className="bg-purple-700 hover:bg-purple-600">
                {isSaving ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
