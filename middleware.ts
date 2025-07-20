import { NextRequest, NextResponse } from 'next/server'
const COOLDOWN_MS = 30_000
export async function middleware(req: NextRequest) {
  // Allow access to notallowed page and logout for suspended users
  if (req.nextUrl.pathname === '/notallowed' || 
      req.nextUrl.pathname === '/api/auth/logout') {
    return NextResponse.next()
  }

  const token = req.cookies.get('token')?.value
  const refreshToken = req.cookies.get('refreshToken')?.value
  const tokenExpires = req.cookies.get('tokenExpires')?.value
  const lastCheck = req.cookies.get('lastRefreshCheck')?.value
  const userStatus = req.cookies.get('userStatus')?.value

  // Check if user is suspended
  if (userStatus === 'suspended') {
    return NextResponse.redirect(new URL('/notallowed', req.url))
  }

  if (!token || !refreshToken || !tokenExpires) {
    return NextResponse.redirect(new URL('/auth', req.url))
  }

  // Check if user is suspended (from cookie)
  if (userStatus === 'suspended') {
    return NextResponse.redirect(new URL('/notallowed', req.url))
  }

  const now = Date.now()
  if (lastCheck && now - parseInt(lastCheck) < COOLDOWN_MS) {
    return NextResponse.next()
  }

  const tokenExp = parseInt(tokenExpires)
  const iat = getIatFromJWT(token)
  
  if (!iat || isNaN(tokenExp)) {
    return NextResponse.redirect(new URL('/auth', req.url))
  }
  const lifetime = tokenExp - iat * 1000
  const remaining = tokenExp - now
  const threshold = lifetime * 0.1
  const res = NextResponse.next()
  res.cookies.set('lastRefreshCheck', now.toString(), {
    httpOnly: true,
    path: '/',
  })
  if (remaining < threshold) {
    try {
      const refresh = await fetch('http://localhost:8080/restaurateur/api/auth/refresh', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          Accept: '*/*',
        },
      })
      if (!refresh.ok) {
        return NextResponse.redirect(new URL('/auth', req.url))
      }
      const { token: newToken, tokenExpires: newExp } = await refresh.json()
      res.cookies.set('token', newToken, { httpOnly: true, path: '/' })
      res.cookies.set('tokenExpires', newExp.toString(), { httpOnly: true, path: '/' })
      
      // Check user status with the new token
      try {
        const statusCheck = await fetch('http://localhost:8080/restaurateur/api/auth/status', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${newToken}`,
            Accept: '*/*',
          },
        });

        if (statusCheck.status === 401) {
          const statusData = await statusCheck.json();
          if (statusData.message && statusData.message.includes("suspendu")) {
            res.cookies.set('userStatus', 'suspended', { httpOnly: true, path: '/' })
            return NextResponse.redirect(new URL('/notallowed', req.url))
          }
        } else if (statusCheck.ok) {
          res.cookies.set('userStatus', 'active', { httpOnly: true, path: '/' })
        }
      } catch (statusError) {
        // If status check fails, continue without status update
      }
    } catch (e) {
      return NextResponse.redirect(new URL('/auth', req.url))
    }
  }
  return res
}
function getIatFromJWT(token: string): number {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.iat
  } catch {
    return 0
  }
}
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|auth$|notallowed$|$).*)',
  ],
}