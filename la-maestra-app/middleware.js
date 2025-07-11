import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const pathname = req.nextUrl.pathname

  if (!session) {
    // Usuario no autenticado → redirigir a /login
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Obtener perfil desde Supabase
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (!profile) {
    return NextResponse.redirect(new URL('/unauthorize', req.url))
  }

  // Protección por rol
  if (pathname.startsWith('/admin') && profile.role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorize', req.url))
  }

  if (pathname.startsWith('/dashboard') && profile.role !== 'teacher') {
    return NextResponse.redirect(new URL('/unauthorize', req.url))
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
}