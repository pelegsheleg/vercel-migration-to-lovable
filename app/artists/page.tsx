"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

export default function ArtistsPage() {
  const artists = ["NeoInk", "CyberSkin", "QuantumTat", "BioMech", "PixelPunk", "NeonNeedle", "SynthSkin", "GlitchArt"]

  // helper to build image src or fallback
  const getSrc = (name: string) => `/images/tattoo-${name.toLowerCase()}.png`

  return (
    <main className="min-h-screen bg-gray-950 text-white p-4">
      <Link href="/search" className="inline-flex items-center text-blue-400 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
      </Link>

      <h1 className="text-3xl font-bold mb-6">Top&nbsp;Artists</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {artists.map((artist) => (
          <ArtistCard key={artist} name={artist} src={getSrc(artist)} />
        ))}
      </div>
    </main>
  )
}

/**
 * Renders one artist avatar + name.
 * Falls back to a placeholder image if the main src fails to load.
 */
function ArtistCard({ name, src }: { name: string; src: string }) {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative w-full aspect-square rounded-full overflow-hidden border-2 border-blue-400/40">
        <Image
          src={imgSrc || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover bg-gradient-to-br from-blue-900 to-cyan-900"
          onError={() => setImgSrc(`/placeholder.svg?height=300&width=300&query=${name.charAt(0)}`)}
        />
      </div>
      <span className="text-sm font-medium text-center">{name}</span>
    </div>
  )
}
