import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'

interface JwtPayload {
  id: string
  role: 'ADMIN' | 'OPERADOR'
  email: string
}


export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  //  const isDashboard = req.nextUrl.pathname.startsWith('/dashboard')
  const isAdminPage = req.nextUrl.pathname.startsWith('/dashboard/users')

  if (!token) return NextResponse.redirect(new URL('/login', req.url))

  try {
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET não definido')
    const decoded = verify(token, process.env.JWT_SECRET) as JwtPayload


    if (isAdminPage && decoded.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard/maintenance', req.url))
    }

    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/home']
}