import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

interface JwtPayload {
  id: string
  role: 'ADMIN' | 'OPERADOR'
  email: string
  name: string
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  const isAdminPage = req.nextUrl.pathname.startsWith('/dashboard/users')

  console.log('Middleware - Path:', req.nextUrl.pathname)
  console.log('Middleware - Token exists:', !!token)
  console.log('Middleware - JWT_SECRET exists:', !!process.env.JWT_SECRET)

  if (!token) {
    console.log('Middleware - No token, redirecting to login')
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET não definido')

    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)

    const decoded = payload as unknown as JwtPayload

    if (!decoded.id || !decoded.email || !decoded.role || !decoded.name) {
      console.log('Middleware - Token missing required fields, redirecting')
      return NextResponse.redirect(new URL('/login', req.url))
    }

    console.log('Middleware - Token decoded successfully:', decoded)

    if (isAdminPage && decoded.role !== 'ADMIN') {
      console.log('Middleware - Admin page but not admin role, redirecting')
      return NextResponse.redirect(new URL('/dashboard/maintenance', req.url))
    }

    console.log('Middleware - Allowing request to continue')
    return NextResponse.next()
  } catch (error) {
    console.log('Middleware - Token verification failed:', error)
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/home']
}
