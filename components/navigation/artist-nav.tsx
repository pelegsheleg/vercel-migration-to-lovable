"use client"

import type React from "react"

import { useRouter, usePathname } from "next/navigation"
import { LayoutDashboard, User, Upload, Calendar, MessageSquare, Users, Settings, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ARTIST_ROUTES, isActiveRoute } from "@/lib/routes"

interface NavItem {
  label: string
  route: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

interface ArtistNavProps {
  unreadMessages?: number
  pendingBookings?: number
}

export function ArtistNav({ unreadMessages = 0, pendingBookings = 0 }: ArtistNavProps) {
  const router = useRouter()
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      route: ARTIST_ROUTES.DASHBOARD,
      icon: LayoutDashboard,
    },
    {
      label: "Profile",
      route: ARTIST_ROUTES.PROFILE_MANAGEMENT,
      icon: User,
    },
    {
      label: "Portfolio",
      route: ARTIST_ROUTES.PORTFOLIO,
      icon: Upload,
    },
    {
      label: "Bookings",
      route: ARTIST_ROUTES.BOOKINGS,
      icon: Calendar,
      badge: pendingBookings,
    },
    {
      label: "Messages",
      route: ARTIST_ROUTES.MESSAGES,
      icon: MessageSquare,
      badge: unreadMessages,
    },
    {
      label: "Matches",
      route: ARTIST_ROUTES.MATCHES,
      icon: Users,
    },
    {
      label: "Analytics",
      route: ARTIST_ROUTES.ANALYTICS,
      icon: BarChart3,
    },
    {
      label: "Settings",
      route: ARTIST_ROUTES.SETTINGS,
      icon: Settings,
    },
  ]

  const handleNavigation = (route: string) => {
    router.push(route)
  }

  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = isActiveRoute(pathname, item.route)

        return (
          <Button
            key={item.route}
            variant={isActive ? "default" : "ghost"}
            className={`w-full justify-start relative ${
              isActive ? "bg-purple-700 hover:bg-purple-600" : "hover:bg-purple-950/50 text-purple-300 hover:text-white"
            }`}
            onClick={() => handleNavigation(item.route)}
          >
            <Icon className="mr-2 h-4 w-4" />
            {item.label}
            {item.badge && item.badge > 0 && (
              <span className="ml-auto bg-purple-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </Button>
        )
      })}
    </nav>
  )
}
