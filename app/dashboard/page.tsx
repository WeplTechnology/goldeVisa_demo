'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { StatCard } from '@/components/ui/stat-card'
import { GoldenVisaTimeline } from '@/components/ui/golden-visa-timeline'
import { InvestmentPieChart } from '@/components/ui/charts/investment-pie'
import { ReturnsChart } from '@/components/ui/charts/returns-chart'
import { 
  Loader2, 
  TrendingUp, 
  Building2, 
  CheckCircle, 
  Clock,
  FileText,
  Bell,
  ArrowRight,
  Calendar,
  MapPin
} from 'lucide-react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        router.push('/login')
      }
    }, 3000)
    return () => clearTimeout(timeout)
  }, [loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stag-light to-white">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-stag-navy to-stag-navy-light flex items-center justify-center shadow-premium-lg">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-stag-blue/20 blur-xl animate-pulse" />
          </div>
          <p className="text-sm text-gray-500 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Investor'

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle={`Welcome back, ${userName}`}
    >
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="animate-fade-in-up stagger-1">
          <StatCard
            title="Total Investment"
            value="€250,000"
            subtitle="Fully invested"
            icon={TrendingUp}
            variant="primary"
            trend={{ value: '4.2% ROI', positive: true }}
          />
        </div>
        
        <div className="animate-fade-in-up stagger-2">
          <StatCard
            title="Properties"
            value="2"
            subtitle="Units in Milano"
            icon={Building2}
            variant="default"
          />
        </div>
        
        <div className="animate-fade-in-up stagger-3">
          <StatCard
            title="Visa Status"
            value="Active"
            subtitle="Year 1 of 5"
            icon={CheckCircle}
            variant="success"
          />
        </div>
        
        <div className="animate-fade-in-up stagger-4">
          <StatCard
            title="Next Milestone"
            value="15 days"
            subtitle="Document review"
            icon={Clock}
            variant="warning"
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Investment Distribution */}
        <Card className="card-premium animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-stag-navy">
                  Investment Distribution
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Portfolio allocation breakdown
                </p>
              </div>
              <div className="icon-container-primary">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <InvestmentPieChart />
          </CardContent>
        </Card>

        {/* Cumulative Returns */}
        <Card className="card-premium animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-stag-navy">
                  Cumulative Returns
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Rental income over time
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-stag-blue" />
                  <span className="text-gray-600">Actual</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border-2 border-stag-navy border-dashed" />
                  <span className="text-gray-600">Projected</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ReturnsChart />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Golden Visa Timeline - Takes 2 columns */}
        <Card className="lg:col-span-2 card-premium animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-stag-navy">
                  Golden Visa Progress
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Your journey to Italian residency
                </p>
              </div>
              <Link 
                href="/golden-visa"
                className="flex items-center gap-1 text-sm font-medium text-stag-blue hover:text-stag-navy transition-colors"
              >
                View details
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <GoldenVisaTimeline />
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Properties Quick View */}
          <Card className="card-premium animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-stag-navy">
                  Your Properties
                </CardTitle>
                <Link 
                  href="/properties"
                  className="text-sm font-medium text-stag-blue hover:text-stag-navy transition-colors"
                >
                  View all
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Property 1 */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-stag-light/50 to-transparent border border-gray-100 hover:border-stag-blue/30 transition-colors cursor-pointer group">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-stag-light flex items-center justify-center group-hover:bg-stag-blue/20 transition-colors">
                      <Building2 className="w-5 h-5 text-stag-blue" />
                    </div>
                    <div>
                      <p className="font-semibold text-stag-navy text-sm">Unit 4B</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        Via Garibaldi 23, Milano
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-[10px] font-semibold rounded-full bg-emerald-100 text-emerald-700">
                    RENTED
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-sm">
                  <span className="text-gray-500">Monthly rent</span>
                  <span className="font-bold text-stag-navy">€850</span>
                </div>
              </div>

              {/* Property 2 */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-stag-light/50 to-transparent border border-gray-100 hover:border-stag-blue/30 transition-colors cursor-pointer group">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-stag-light flex items-center justify-center group-hover:bg-stag-blue/20 transition-colors">
                      <Building2 className="w-5 h-5 text-stag-blue" />
                    </div>
                    <div>
                      <p className="font-semibold text-stag-navy text-sm">Unit 4C</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        Via Garibaldi 23, Milano
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-[10px] font-semibold rounded-full bg-emerald-100 text-emerald-700">
                    RENTED
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-sm">
                  <span className="text-gray-500">Monthly rent</span>
                  <span className="font-bold text-stag-navy">€870</span>
                </div>
              </div>

              {/* Total */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-stag-navy to-stag-navy-light text-white">
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">Total monthly income</span>
                  <span className="font-bold text-xl">€1,720</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="card-premium animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-stag-navy">
                Upcoming
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-stag-light/50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-stag-navy text-sm">Document review deadline</p>
                  <p className="text-xs text-gray-500 mt-0.5">December 9, 2024</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-stag-light/50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-stag-light flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-stag-blue" />
                </div>
                <div>
                  <p className="font-medium text-stag-navy text-sm">Q4 Report available</p>
                  <p className="text-xs text-gray-500 mt-0.5">January 15, 2025</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-stag-light/50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Bell className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-stag-navy text-sm">Rental payment due</p>
                  <p className="text-xs text-gray-500 mt-0.5">December 20, 2024</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
