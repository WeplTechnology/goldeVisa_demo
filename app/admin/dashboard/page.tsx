'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { StatCard } from '@/components/ui/stat-card'
import { 
  Loader2, 
  Users, 
  Building2, 
  FileCheck, 
  TrendingUp,
  ArrowUpRight,
  CheckCircle,
  Clock
} from 'lucide-react'

export default function AdminDashboardPage() {
  const { user, loading } = useAuth()

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
          <p className="text-sm text-gray-500 font-medium">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout
      title="Admin Dashboard"
      subtitle={`Welcome, ${user?.email?.split('@')[0]}`}
      isAdmin={true}
    >
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="animate-fade-in-up stagger-1">
          <StatCard
            title="Total Investors"
            value="1"
            subtitle="Active investors"
            icon={Users}
            variant="primary"
          />
        </div>
        
        <div className="animate-fade-in-up stagger-2">
          <StatCard
            title="Properties"
            value="2"
            subtitle="Total properties"
            icon={Building2}
            variant="default"
          />
        </div>
        
        <div className="animate-fade-in-up stagger-3">
          <StatCard
            title="Capital Raised"
            value="€1.75M"
            subtitle="of €2M target"
            icon={TrendingUp}
            variant="success"
            trend={{ value: '87.5%', positive: true }}
          />
        </div>
        
        <div className="animate-fade-in-up stagger-4">
          <StatCard
            title="Documents"
            value="0"
            subtitle="Pending verification"
            icon={FileCheck}
            variant="warning"
          />
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Investors */}
        <Card className="card-premium animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-stag-navy">Recent Investors</CardTitle>
              <button className="text-sm font-medium text-stag-blue hover:text-stag-navy transition-colors flex items-center gap-1">
                View all
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-stag-light/50 to-transparent border border-gray-100 hover:border-stag-blue/30 transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-stag-blue to-stag-navy flex items-center justify-center text-white font-bold shadow-premium-sm group-hover:shadow-premium-md transition-shadow">
                  ZW
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-stag-navy">Zhang Wei</p>
                  <p className="text-sm text-gray-500">€250,000 invested</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                    Active
                  </span>
                  <span className="text-xs text-gray-400">Joined Nov 2024</span>
                </div>
              </div>

              {/* Empty state placeholder */}
              <div className="text-center py-8 text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">More investors will appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Overview */}
        <Card className="card-premium animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-bold text-stag-navy">System Overview</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Active Investments */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Active Investments</span>
                  </div>
                  <span className="text-sm font-bold text-stag-navy">100%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              {/* KYC Completed */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">KYC Completed</span>
                  </div>
                  <span className="text-sm font-bold text-stag-navy">100%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              {/* Golden Visa Progress */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-stag-light flex items-center justify-center">
                      <Clock className="w-4 h-4 text-stag-blue" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Golden Visa Progress</span>
                  </div>
                  <span className="text-sm font-bold text-stag-navy">60%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-stag-blue to-stag-blue-light rounded-full transition-all duration-1000"
                    style={{ width: '60%' }}
                  />
                </div>
              </div>

              {/* Summary Card */}
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-stag-navy to-stag-navy-light text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Total AUM</p>
                    <p className="text-2xl font-bold">€250,000</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
