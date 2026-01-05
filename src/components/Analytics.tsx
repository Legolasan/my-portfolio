'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Generate a unique session ID
const getSessionId = () => {
  if (typeof window === 'undefined') return null
  
  let sessionId = sessionStorage.getItem('analytics_session')
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('analytics_session', sessionId)
  }
  return sessionId
}

export default function Analytics() {
  const pathname = usePathname()

  useEffect(() => {
    // Don't track admin pages
    if (pathname.startsWith('/blogs/admin')) return

    const trackPageView = async () => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pagePath: pathname,
            referrer: document.referrer || null,
            sessionId: getSessionId(),
          }),
        })
      } catch (error) {
        // Silently fail - analytics shouldn't affect UX
        console.debug('Analytics tracking failed:', error)
      }
    }

    trackPageView()
  }, [pathname])

  return null // This component doesn't render anything
}

