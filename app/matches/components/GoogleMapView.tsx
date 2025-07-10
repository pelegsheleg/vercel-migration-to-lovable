"use client"

import { useEffect, useState } from "react"
import { MapPin } from "lucide-react"

interface Artist {
  id: number
  name: string
  hourlyRate: number
  lat: number
  lng: number
}

interface GoogleMapViewProps {
  artists: Artist[]
  center: { lat: number; lng: number }
  onMarkerClick: (artist: Artist) => void
  hoveredArtist: number | null
  onMarkerHover: (artistId: number | null) => void
}

export default function GoogleMapView({
  artists,
  center,
  onMarkerClick,
  hoveredArtist,
  onMarkerHover,
}: GoogleMapViewProps) {
  const [map, setMap] = useState<any | null>(null)
  const [markers, setMarkers] = useState<any[]>([])

  useEffect(() => {
    const initMap = async () => {
      if (typeof window !== "undefined" && window.google) {
        const mapElement = document.getElementById("google-map")
        if (mapElement) {
          const newMap = new window.google.maps.Map(mapElement, {
            center: center,
            zoom: 12,
            // A4: Dark-mode vector tiles
            styles: [
              {
                featureType: "all",
                elementType: "geometry",
                stylers: [{ color: "#1a1a2e" }],
              },
              {
                featureType: "all",
                elementType: "labels.text.fill",
                stylers: [{ color: "#ffffff" }],
              },
              {
                featureType: "all",
                elementType: "labels.text.stroke",
                stylers: [{ color: "#000000" }, { lightness: 13 }],
              },
              {
                featureType: "road",
                elementType: "geometry.fill",
                stylers: [{ color: "#2a2a3e" }],
              },
              {
                featureType: "road",
                elementType: "geometry.stroke",
                stylers: [{ color: "#7c3aed" }],
              },
              {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#17263c" }],
              },
              {
                featureType: "poi",
                elementType: "all",
                stylers: [{ visibility: "off" }],
              },
            ],
          })
          setMap(newMap)

          // Clear existing markers
          markers.forEach((marker) => marker.setMap(null))

          // A4: Pin clustering would go here with supercluster
          // For now, we'll use enhanced markers with price bubbles
          const newMarkers = artists.map((artist) => {
            const isHovered = hoveredArtist === artist.id
            const marker = new window.google.maps.Marker({
              position: { lat: artist.lat, lng: artist.lng },
              map: newMap,
              title: `${artist.name} - $${artist.hourlyRate}/hr`,
              icon: {
                url:
                  "data:image/svg+xml;charset=UTF-8," +
                  encodeURIComponent(`
                  <svg width="${isHovered ? "60" : "50"}" height="${isHovered ? "60" : "50"}" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.3"/>
                      </filter>
                    </defs>
                    <circle cx="25" cy="25" r="20" fill="${isHovered ? "#ec4899" : "#7c3aed"}" stroke="#ffffff" strokeWidth="2" filter="url(#shadow)"/>
                    <text x="25" y="20" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">
                      $${artist.hourlyRate}
                    </text>
                    <text x="25" y="30" textAnchor="middle" fill="white" fontSize="6">
                      ${artist.name.split(" ")[0]}
                    </text>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(isHovered ? 60 : 50, isHovered ? 60 : 50),
                anchor: new window.google.maps.Point(isHovered ? 30 : 25, isHovered ? 30 : 25),
              },
              animation: isHovered ? window.google.maps.Animation.BOUNCE : null,
            })

            marker.addListener("click", () => {
              onMarkerClick(artist)
            })

            marker.addListener("mouseover", () => {
              onMarkerHover(artist.id)
            })

            marker.addListener("mouseout", () => {
              onMarkerHover(null)
            })

            return marker
          })

          setMarkers(newMarkers)
        }
      }
    }

    // Load Google Maps API if not already loaded
    if (!window.google) {
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = initMap
      document.head.appendChild(script)
    } else {
      initMap()
    }

    return () => {
      markers.forEach((marker) => marker.setMap(null))
    }
  }, [artists, center, onMarkerClick, hoveredArtist, onMarkerHover])

  return (
    <div className="h-full w-full relative">
      <div id="google-map" className="h-full w-full rounded-lg overflow-hidden" />
      {/* Fallback for when Google Maps fails to load */}
      {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
        <div className="absolute inset-0 bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Artist Locations</h3>
            <p className="text-purple-300">Map view unavailable</p>
          </div>
        </div>
      )}
    </div>
  )
}
