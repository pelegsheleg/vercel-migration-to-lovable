// Artist Dashboard Routes Configuration
export const ARTIST_ROUTES = {
  // Main Dashboard
  DASHBOARD: "/artist/dashboard",

  // Profile Management
  PROFILE: "/artist/profile",
  PROFILE_MANAGEMENT: "/artist/profile-management",
  PROFILE_SETUP: "/artist/profile-setup",

  // Portfolio Management
  PORTFOLIO: "/artist/portfolio",
  PORTFOLIO_UPLOAD: "/artist/portfolio/upload",

  // Booking Management
  BOOKINGS: "/artist/bookings",
  BOOKING_DETAIL: (id: string) => `/artist/bookings/${id}`,

  // Communication
  MESSAGES: "/artist/messages",
  MESSAGE_THREAD: (clientId: string) => `/artist/messages?client=${clientId}`,

  // Client Matches
  MATCHES: "/artist/matches",
  MATCH_DETAIL: (id: string) => `/artist/matches/${id}`,

  // Settings & Configuration
  SETTINGS: "/artist/settings",
  AVAILABILITY: "/artist/availability",

  // Analytics
  ANALYTICS: "/artist/analytics",
} as const

// Client Routes Configuration
export const CLIENT_ROUTES = {
  // Main Pages
  HOME: "/",
  BROWSE_ARTISTS: "/artists",
  BROWSE_STYLES: "/styles",
  BROWSE_STUDIOS: "/studios",

  // Artist Discovery
  ARTIST_PROFILE: (id: string) => `/artists/${id}`,
  STYLE_CATEGORY: (slug: string) => `/category/${slug}`,

  // User Features
  MATCHES: "/matches",
  LIBRARY: "/library",
  AI_DESIGN: "/ai-design",
  AR_PREVIEW: "/ar-preview",

  // Authentication
  AUTH: "/auth",
  SIGN_IN: "/auth/sign-in",
  SIGN_UP: "/auth/sign-up",
  ROLE_SELECTION: "/auth/role-selection",
} as const

// Navigation Helper Functions
export const navigateToRoute = (route: string) => {
  if (typeof window !== "undefined") {
    window.location.href = route
  }
}

export const isActiveRoute = (currentPath: string, targetRoute: string): boolean => {
  return currentPath === targetRoute || currentPath.startsWith(targetRoute + "/")
}

// Route Validation
export const validateRoute = (route: string): boolean => {
  const allRoutes = [...Object.values(ARTIST_ROUTES), ...Object.values(CLIENT_ROUTES)]
  return allRoutes.some((r) => (typeof r === "string" ? r === route : false))
}
