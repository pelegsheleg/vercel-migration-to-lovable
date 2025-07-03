"use client"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Home, MapPin, LogOut, Wand2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "./contexts/AuthContext"

export default function HomePage() {
  const { logout } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-purple-950 text-white pb-20">
      <div className="sticky top-0 z-10 bg-black/40 backdrop-blur-sm border-b border-purple-500/20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div className="relative w-8 h-8" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dog%20face%20image%20background-80tC7pNknHSwIU4KYQODUQRYlZl8t1.png"
                  alt="Tattit Logo"
                  fill
                  className="object-contain"
                />
              </motion.div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
                Tattit
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="Profile" />
                <AvatarFallback>TT</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="icon" className="text-purple-400" onClick={logout}>
                <LogOut className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-8 max-w-4xl mx-auto">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
        >
          <div>
            <h2 className="text-3xl font-bold mb-2">Find Your Perfect Tattoo Artist</h2>
            <p className="text-purple-300">Upload your design and get matched with the best artists for your style</p>
          </div>

          <Link
            href="/matches"
            className="inline-block bg-purple-700 hover:bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            <Wand2 className="w-6 h-6 mr-2 inline" />
            Start Matching
          </Link>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-purple-900/20 rounded-lg p-6 border border-purple-500/30"
        >
          <h3 className="text-xl font-semibold mb-4">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold">1</span>
              </div>
              <h4 className="font-medium mb-2">Upload Your Design</h4>
              <p className="text-sm text-purple-300">Share your tattoo idea or reference image</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold">2</span>
              </div>
              <h4 className="font-medium mb-2">Set Preferences</h4>
              <p className="text-sm text-purple-300">Choose your style, budget, and location</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold">3</span>
              </div>
              <h4 className="font-medium mb-2">Get Matched</h4>
              <p className="text-sm text-purple-300">Discover artists perfect for your vision</p>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-950/80 backdrop-blur-sm text-gray-400 flex justify-around py-2 border-t border-purple-500/20">
        <Link href="/" className="flex flex-col items-center text-purple-400">
          <Home className="w-6 h-6" />
          <span className="text-xs">Home</span>
        </Link>
        <Link href="/matches" className="flex flex-col items-center">
          <MapPin className="w-6 h-6" />
          <span className="text-xs">Find Artists</span>
        </Link>
      </nav>
    </div>
  )
}
