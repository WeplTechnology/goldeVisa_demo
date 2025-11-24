'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { verifyAdmin } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Shield, Loader2, Lock, Users, BarChart3 } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      const result = await verifyAdmin(data.user.email!)

      if (!result.success) {
        setError('Access denied. Admin accounts only.')
        await supabase.auth.signOut()
        return
      }

      router.push('/admin/dashboard')
      router.refresh()
    } catch (error: any) {
      console.error('Admin login error:', error)
      setError(error.message || 'An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #0f1729 0%, #1B365D 50%, #0f1729 100%)',
          }}
        />
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-stag-blue/10 rounded-full -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-stag-blue/5 rounded-full -ml-40 -mb-40" />
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(107, 155, 209, 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(107, 155, 209, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-stag-blue to-stag-blue-light flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight">STAG</h1>
              <p className="text-xs text-white/60 font-medium tracking-wide">ADMIN PORTAL</p>
            </div>
          </div>
          
          {/* Main content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold leading-tight">
                Fund<br />
                <span className="text-stag-blue">Management</span>
              </h2>
              <p className="text-white/70 mt-4 text-lg max-w-md">
                Manage investors, properties, documents, and monitor the Golden Visa program progress.
              </p>
            </div>
            
            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-white/80">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <span>Manage investor portfolios</span>
              </div>
              <div className="flex items-center gap-4 text-white/80">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <span>Track fund performance</span>
              </div>
              <div className="flex items-center gap-4 text-white/80">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <span>Secure document management</span>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <p className="text-white/40 text-sm">
            Authorized personnel only
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-stag-blue to-stag-blue-light flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-white tracking-tight">STAG</h1>
              <p className="text-xs text-gray-400 font-medium tracking-wide">ADMIN PORTAL</p>
            </div>
          </div>

          <Card className="border-0 shadow-2xl bg-white/5 backdrop-blur-xl border border-white/10">
            <CardHeader className="space-y-1 pb-6">
              <div className="flex justify-center mb-4">
                <Lock className="w-12 h-12 text-stag-blue" />
              </div>
              <CardTitle className="text-2xl font-bold text-white text-center">
                Admin Portal
              </CardTitle>
              <CardDescription className="text-center text-gray-400">
                Sign in to access fund management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-5">
                {error && (
                  <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-300">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-300">
                    Email address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@stagfund.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-stag-blue focus:ring-stag-blue/20"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-stag-blue focus:ring-stag-blue/20"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-stag-blue to-stag-blue-light hover:from-stag-blue-light hover:to-stag-blue text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </Button>

                {/* Demo credentials */}
                <div className="pt-4 border-t border-white/10">
                  <p className="text-center text-sm text-gray-500 mb-3">
                    Demo credentials
                  </p>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-sm text-center">
                      <span className="text-gray-500">Email:</span>{' '}
                      <code className="text-gray-300 font-medium">admin@goldenvisa.com</code>
                    </p>
                    <p className="text-sm text-center mt-1">
                      <span className="text-gray-500">Password:</span>{' '}
                      <code className="text-gray-300 font-medium">Admin2025!</code>
                    </p>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
