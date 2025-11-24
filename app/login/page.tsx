'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { verifyInvestor } from '@/lib/actions/auth'
import { isAdminEmail } from '@/lib/utils/auth-helpers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Loader2, Shield, Building2, TrendingUp } from 'lucide-react'
import Image from 'next/image'

export default function LoginPage() {
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

      if (isAdminEmail(data.user.email)) {
        setError('Admin accounts should use the admin login portal')
        await supabase.auth.signOut()
        return
      }

      const result = await verifyInvestor(data.user.id)

      if (!result.success) {
        console.error('Investor verification failed:', result.error)
        setError('This account is not registered as an investor. Please contact support.')
        await supabase.auth.signOut()
        return
      }

      await new Promise(resolve => setTimeout(resolve, 100))
      window.location.href = '/dashboard'
    } catch (error: any) {
      console.error('Login error:', error)
      setError(error.message || 'An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background with gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #1B365D 0%, #2d4a7c 50%, #1B365D 100%)',
          }}
        />
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-stag-blue/10 rounded-full -ml-40 -mb-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-stag-blue/5 rounded-full blur-3xl" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <div className="relative w-[280px] h-[56px]">
            <Image
              src="/images/stag-logo.svg"
              alt="STAG Logo"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
          
          {/* Main content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold leading-tight">
                Your Gateway to<br />
                <span className="text-stag-blue">Italian Residency</span>
              </h2>
              <p className="text-white/70 mt-4 text-lg max-w-md">
                Monitor your Golden Visa investment, track your residency progress, and manage your Italian property portfolio.
              </p>
            </div>
            
            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-white/80">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <span>Track your Golden Visa progress in real-time</span>
              </div>
              <div className="flex items-center gap-4 text-white/80">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <span>Monitor your property investments</span>
              </div>
              <div className="flex items-center gap-4 text-white/80">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span>View rental income and returns</span>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <p className="text-white/40 text-sm">
            © 2024 STAG Fund Management. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <div className="relative w-[200px] h-[40px]">
              <Image
                src="/images/stag-logo.svg"
                alt="STAG Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <Card className="border-0 shadow-premium-lg">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold text-stag-navy text-center">
                Investor Portal
              </CardTitle>
              <CardDescription className="text-center text-gray-500">
                Sign in to access your Golden Visa dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-5">
                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="h-12 rounded-xl border-gray-200 focus:border-stag-blue focus:ring-stag-blue/20"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <a href="#" className="text-sm text-stag-blue hover:text-stag-navy transition-colors">
                      Forgot password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="h-12 rounded-xl border-gray-200 focus:border-stag-blue focus:ring-stag-blue/20"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-stag-navy to-stag-navy-light hover:from-stag-navy-light hover:to-stag-navy text-white font-semibold shadow-premium-sm hover:shadow-premium-md transition-all duration-300"
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
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-center text-sm text-gray-500 mb-3">
                    Demo credentials
                  </p>
                  <div className="p-3 rounded-xl bg-stag-light/50 border border-stag-blue/20">
                    <p className="text-sm text-center">
                      <span className="text-gray-600">Email:</span>{' '}
                      <code className="text-stag-navy font-medium">zhang.wei@email.com</code>
                    </p>
                    <p className="text-sm text-center mt-1">
                      <span className="text-gray-600">Password:</span>{' '}
                      <code className="text-stag-navy font-medium">Demo2024!</code>
                    </p>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-gray-500 mt-6">
            Need help?{' '}
            <a href="mailto:support@stagfund.com" className="text-stag-blue hover:text-stag-navy transition-colors font-medium">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
