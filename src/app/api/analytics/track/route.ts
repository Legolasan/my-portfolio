import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { UAParser } from 'ua-parser-js'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pagePath, referrer, sessionId } = body

    // Get user agent info
    const userAgent = request.headers.get('user-agent') || ''
    const parser = new UAParser(userAgent)
    const result = parser.getResult()

    // Get IP-based location (basic - you can enhance with a geolocation service)
    const forwardedFor = request.headers.get('x-forwarded-for')
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown'

    await prisma.pageView.create({
      data: {
        pagePath: pagePath || '/',
        referrer: referrer || null,
        userAgent: userAgent,
        device: result.device.type || 'desktop',
        browser: result.browser.name || 'unknown',
        os: result.os.name || 'unknown',
        sessionId: sessionId || null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics tracking error:', error)
    // Don't fail the request - analytics shouldn't block the user
    return NextResponse.json({ success: false })
  }
}

// Prevent static generation
export const dynamic = 'force-dynamic'

