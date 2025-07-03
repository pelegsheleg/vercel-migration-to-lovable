"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Plus, X, Car, Home, Building } from "lucide-react"

interface LocationSectionProps {
  onChange?: () => void
}

export function LocationSection({ onChange }: LocationSectionProps) {
  const [locationData, setLocationData] = useState({
    primaryStudio: {
      name: "Ink & Soul Studio",
      address: "123 Art Street, Los Angeles, CA 90210",
      phone: "(555) 123-4567",
      type: "studio",
    },
    additionalLocations: [
      {
        id: "1",
        name: "Pop-up Location",
        address: "456 Creative Ave, Hollywood, CA 90028",
        type: "popup",
      },
    ],
    travelOptions: {
      willingToTravel: true,
      maxDistance: "50",
      travelFee: "100",
      homeVisits: false,
      eventTattoos: true,
    },
  })

  const [newLocation, setNewLocation] = useState({
    name: "",
    address: "",
    type: "studio",
  })

  const handlePrimaryStudioChange = (field: string, value: string) => {
    setLocationData((prev) => ({
      ...prev,
      primaryStudio: { ...prev.primaryStudio, [field]: value },
    }))
    onChange?.()
  }

  const handleTravelOptionChange = (field: string, value: string | boolean) => {
    setLocationData((prev) => ({
      ...prev,
      travelOptions: { ...prev.travelOptions, [field]: value },
    }))
    onChange?.()
  }

  const addLocation = () => {
    if (newLocation.name.trim() && newLocation.address.trim()) {
      const location = {
        ...newLocation,
        id: Date.now().toString(),
      }
      setLocationData((prev) => ({
        ...prev,
        additionalLocations: [...prev.additionalLocations, location],
      }))
      setNewLocation({ name: "", address: "", type: "studio" })
      onChange?.()
    }
  }

  const removeLocation = (id: string) => {
    setLocationData((prev) => ({
      ...prev,
      additionalLocations: prev.additionalLocations.filter((loc) => loc.id !== id),
    }))
    onChange?.()
  }

  const getLocationIcon = (type: string) => {
    switch (type) {
      case "studio":
        return <Building className="h-4 w-4" />
      case "home":
        return <Home className="h-4 w-4" />
      case "popup":
        return <MapPin className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  const getLocationTypeLabel = (type: string) => {
    switch (type) {
      case "studio":
        return "Studio"
      case "home":
        return "Home Studio"
      case "popup":
        return "Pop-up Location"
      default:
        return "Other"
    }
  }

  return (
    <div className="space-y-6">
      {/* Primary Studio */}
      <Card className="bg-black/40 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Building className="h-5 w-5" />
            Primary Studio Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="studioName" className="text-purple-300">
                Studio Name
              </Label>
              <Input
                id="studioName"
                value={locationData.primaryStudio.name}
                onChange={(e) => handlePrimaryStudioChange("name", e.target.value)}
                className="bg-black/50 border-purple-500/30 text-white"
                placeholder="Your studio name"
              />
            </div>
            <div>
              <Label htmlFor="studioPhone" className="text-purple-300">
                Phone Number
              </Label>
              <Input
                id="studioPhone"
                value={locationData.primaryStudio.phone}
                onChange={(e) => handlePrimaryStudioChange("phone", e.target.value)}
                className="bg-black/50 border-purple-500/30 text-white"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="studioAddress" className="text-purple-300">
              Full Address
            </Label>
            <Input
              id="studioAddress"
              value={locationData.primaryStudio.address}
              onChange={(e) => handlePrimaryStudioChange("address", e.target.value)}
              className="bg-black/50 border-purple-500/30 text-white"
              placeholder="123 Street Name, City, State, ZIP"
            />
          </div>

          <div>
            <Label htmlFor="studioType" className="text-purple-300">
              Location Type
            </Label>
            <Select
              value={locationData.primaryStudio.type}
              onValueChange={(value) => handlePrimaryStudioChange("type", value)}
            >
              <SelectTrigger className="bg-black/50 border-purple-500/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="studio">Professional Studio</SelectItem>
                <SelectItem value="home">Home Studio</SelectItem>
                <SelectItem value="shared">Shared Studio Space</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Additional Locations */}
      <Card className="bg-black/40 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Additional Locations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing Locations */}
          {locationData.additionalLocations.length > 0 && (
            <div className="space-y-3">
              {locationData.additionalLocations.map((location) => (
                <div
                  key={location.id}
                  className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-purple-500/20"
                >
                  <div className="flex items-center gap-3">
                    {getLocationIcon(location.type)}
                    <div>
                      <div className="text-white font-medium">{location.name}</div>
                      <div className="text-purple-300 text-sm">{location.address}</div>
                      <Badge variant="secondary" className="bg-purple-900/50 text-purple-200 text-xs mt-1">
                        {getLocationTypeLabel(location.type)}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLocation(location.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Location */}
          <div className="space-y-3 p-4 bg-black/20 rounded-lg border border-purple-500/20">
            <h4 className="text-white font-medium">Add New Location</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                value={newLocation.name}
                onChange={(e) => setNewLocation((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Location name"
                className="bg-black/50 border-purple-500/30 text-white"
              />
              <Input
                value={newLocation.address}
                onChange={(e) => setNewLocation((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Address"
                className="bg-black/50 border-purple-500/30 text-white"
              />
              <Select
                value={newLocation.type}
                onValueChange={(value) => setNewLocation((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger className="bg-black/50 border-purple-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="home">Home Studio</SelectItem>
                  <SelectItem value="popup">Pop-up Location</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={addLocation} size="sm" className="bg-purple-700 hover:bg-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Travel Options */}
      <Card className="bg-black/40 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Car className="h-5 w-5" />
            Travel & Mobile Services
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Willing to Travel</Label>
              <p className="text-sm text-purple-300">Offer services at client locations</p>
            </div>
            <Switch
              checked={locationData.travelOptions.willingToTravel}
              onCheckedChange={(checked) => handleTravelOptionChange("willingToTravel", checked)}
            />
          </div>

          {locationData.travelOptions.willingToTravel && (
            <div className="space-y-4 pl-4 border-l-2 border-purple-500/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxDistance" className="text-purple-300">
                    Maximum Travel Distance (miles)
                  </Label>
                  <Select
                    value={locationData.travelOptions.maxDistance}
                    onValueChange={(value) => handleTravelOptionChange("maxDistance", value)}
                  >
                    <SelectTrigger className="bg-black/50 border-purple-500/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 miles</SelectItem>
                      <SelectItem value="25">25 miles</SelectItem>
                      <SelectItem value="50">50 miles</SelectItem>
                      <SelectItem value="100">100 miles</SelectItem>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="travelFee" className="text-purple-300">
                    Travel Fee ($)
                  </Label>
                  <Input
                    id="travelFee"
                    value={locationData.travelOptions.travelFee}
                    onChange={(e) => handleTravelOptionChange("travelFee", e.target.value)}
                    className="bg-black/50 border-purple-500/30 text-white"
                    placeholder="100"
                    type="number"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Home Visits</Label>
                    <p className="text-sm text-purple-300">Tattoo at client's home</p>
                  </div>
                  <Switch
                    checked={locationData.travelOptions.homeVisits}
                    onCheckedChange={(checked) => handleTravelOptionChange("homeVisits", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Event Tattoos</Label>
                    <p className="text-sm text-purple-300">Parties, conventions, special events</p>
                  </div>
                  <Switch
                    checked={locationData.travelOptions.eventTattoos}
                    onCheckedChange={(checked) => handleTravelOptionChange("eventTattoos", checked)}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
