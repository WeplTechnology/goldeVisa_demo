'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Loader2,
  TrendingUp,
  Download,
  Users,
  Building2,
  DollarSign,
  FileText,
  Shield,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { getAdminStats, getAllInvestors, getAllProperties, getAllInvestments } from '@/lib/actions/admin-actions'

export default function AdminReportsPage() {
  const { user, loading } = useAuth()
  const [dataLoading, setDataLoading] = useState(true)
  const [stats, setStats] = useState({
    totalInvestors: 0,
    totalInvestments: 0,
    totalCapital: 0,
    activeVisaApplications: 0,
    pendingDocuments: 0
  })
  const [investors, setInvestors] = useState<any[]>([])
  const [properties, setProperties] = useState<any[]>([])
  const [investments, setInvestments] = useState<any[]>([])

  useEffect(() => {
    async function loadData() {
      if (!user) return

      try {
        setDataLoading(true)
        const [statsData, investorsData, propertiesData, investmentsData] = await Promise.all([
          getAdminStats(),
          getAllInvestors(),
          getAllProperties(),
          getAllInvestments()
        ])

        setStats(statsData)
        setInvestors(investorsData)
        setProperties(propertiesData)
        setInvestments(investmentsData)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setDataLoading(false)
      }
    }

    loadData()
  }, [user])

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
          <p className="text-sm text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  const totalPropertiesValue = properties.reduce((sum, prop) => sum + prop.price, 0)
  const averageInvestment = stats.totalInvestments > 0 ? stats.totalCapital / stats.totalInvestments : 0

  return (
    <DashboardLayout
      title="Platform Reports"
      subtitle="Comprehensive analytics and insights"
      isAdmin={true}
    >
      {/* Main Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="card-premium animate-fade-in-up">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="icon-container-primary">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                <ArrowUpRight className="w-4 h-4" />
                <span>12%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Investors</p>
              <p className="text-3xl font-bold text-stag-navy">
                {dataLoading ? <Loader2 className="h-8 w-8 animate-spin text-stag-blue" /> : stats.totalInvestors}
              </p>
              <p className="text-xs text-gray-500 mt-1">Active platform users</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium animate-fade-in-up stagger-1">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="icon-container-default bg-stag-light">
                <DollarSign className="w-6 h-6 text-stag-blue" />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                <ArrowUpRight className="w-4 h-4" />
                <span>24%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Capital</p>
              <p className="text-3xl font-bold text-stag-navy">
                {dataLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-stag-blue" />
                ) : (
                  `€${(stats.totalCapital / 1000000).toFixed(2)}M`
                )}
              </p>
              <p className="text-xs text-gray-500 mt-1">Assets under management</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium animate-fade-in-up stagger-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="icon-container-default bg-purple-100">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                <ArrowUpRight className="w-4 h-4" />
                <span>8%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Properties</p>
              <p className="text-3xl font-bold text-stag-navy">
                {dataLoading ? <Loader2 className="h-8 w-8 animate-spin text-stag-blue" /> : properties.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Investment properties</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium animate-fade-in-up stagger-3">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="icon-container-default bg-blue-100">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex items-center gap-1 text-amber-600 text-sm font-medium">
                <ArrowUpRight className="w-4 h-4" />
                <span>15%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Visa Applications</p>
              <p className="text-3xl font-bold text-stag-navy">
                {dataLoading ? <Loader2 className="h-8 w-8 animate-spin text-stag-blue" /> : stats.activeVisaApplications}
              </p>
              <p className="text-xs text-gray-500 mt-1">Active Golden Visa apps</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="card-premium animate-fade-in-up stagger-4">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Average Investment</p>
                <p className="text-xl font-bold text-stag-navy">
                  {dataLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-stag-blue" />
                  ) : (
                    `€${averageInvestment.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium animate-fade-in-up stagger-5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Property Value</p>
                <p className="text-xl font-bold text-stag-navy">
                  {dataLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-stag-blue" />
                  ) : (
                    `€${(totalPropertiesValue / 1000000).toFixed(1)}M`
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium animate-fade-in-up stagger-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Pending Documents</p>
                <p className="text-xl font-bold text-stag-navy">
                  {dataLoading ? <Loader2 className="h-5 w-5 animate-spin text-stag-blue" /> : stats.pendingDocuments}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Cards */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Recent Investments */}
        <Card className="card-premium animate-fade-in-up stagger-7">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-stag-navy">Recent Investments</CardTitle>
              <Button variant="ghost" size="sm" className="text-stag-blue hover:text-stag-navy">
                View All
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {dataLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-stag-blue" />
              </div>
            ) : investments.slice(0, 5).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No investments yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {investments.slice(0, 5).map((investment) => (
                  <div
                    key={investment.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-stag-light/30 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{investment.investor?.full_name || 'Unknown'}</p>
                      <p className="text-sm text-gray-500">{investment.fund?.name || 'Fund'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-stag-navy">€{investment.amount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(investment.investment_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Investors */}
        <Card className="card-premium animate-fade-in-up stagger-8">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-stag-navy">Top Investors</CardTitle>
              <Button variant="ghost" size="sm" className="text-stag-blue hover:text-stag-navy">
                View All
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {dataLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-stag-blue" />
              </div>
            ) : investors.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No investors yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {investors
                  .sort((a, b) => {
                    const aTotal = a.investments?.reduce((sum: number, inv: any) => sum + inv.amount, 0) || 0
                    const bTotal = b.investments?.reduce((sum: number, inv: any) => sum + inv.amount, 0) || 0
                    return bTotal - aTotal
                  })
                  .slice(0, 5)
                  .map((investor, index) => {
                    const totalInvested = investor.investments?.reduce((sum: number, inv: any) => sum + inv.amount, 0) || 0
                    return (
                      <div
                        key={investor.id}
                        className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-stag-light/30 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-stag-blue to-stag-navy flex items-center justify-center text-white font-bold shadow-premium-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{investor.full_name}</p>
                          <p className="text-sm text-gray-500">{investor.investments?.length || 0} investments</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-stag-navy">€{totalInvested.toLocaleString()}</p>
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Export Options */}
      <Card className="card-premium animate-fade-in-up stagger-9">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-stag-navy">Export Reports</CardTitle>
          <p className="text-sm text-gray-500 mt-1">Download platform data for external analysis</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="justify-start h-auto py-4 hover:bg-stag-light hover:border-stag-blue">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Download className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-stag-navy">Investor Report</p>
                  <p className="text-xs text-gray-500">Complete investor list</p>
                </div>
              </div>
            </Button>

            <Button variant="outline" className="justify-start h-auto py-4 hover:bg-stag-light hover:border-stag-blue">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Download className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-stag-navy">Investment Report</p>
                  <p className="text-xs text-gray-500">All transactions</p>
                </div>
              </div>
            </Button>

            <Button variant="outline" className="justify-start h-auto py-4 hover:bg-stag-light hover:border-stag-blue">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Download className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-stag-navy">Property Report</p>
                  <p className="text-xs text-gray-500">Portfolio summary</p>
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
