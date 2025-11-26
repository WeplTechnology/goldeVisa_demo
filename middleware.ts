import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isAdminEmail } from '@/lib/utils/auth-helpers'

// Rutas protegidas consolidadas
const INVESTOR_ROUTES = ['/dashboard', '/golden-visa', '/properties', '/documents', '/reports', '/messages', '/settings']
const ADMIN_ROUTES = ['/admin']

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Proteger rutas de inversor - consolidado en una sola verificación
  const isInvestorRoute = INVESTOR_ROUTES.some(route => pathname.startsWith(route))
  if (isInvestorRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Proteger rutas de admin
  const isAdminRoute = pathname.startsWith('/admin')
  const isAdminLoginPage = pathname === '/admin/login'

  if (isAdminRoute && !isAdminLoginPage) {
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Verificar que usuarios admin tengan email de dominio autorizado
    if (!isAdminEmail(user.email)) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/golden-visa/:path*',
    '/properties/:path*',
    '/documents/:path*',
    '/reports/:path*',
    '/messages/:path*',
    '/settings/:path*',
  ],
}
