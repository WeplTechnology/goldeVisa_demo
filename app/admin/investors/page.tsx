'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Loader2,
  Users,
  Search,
  TrendingUp,
  Building2,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Clock,
  DollarSign
} from 'lucide-react'
import { getAllInvestors } from '@/lib/actions/admin-actions'

interface Investor {
  id: string
  full_name: string
  email: string
  phone: string | null
  nationality: string | null
  address: string | null
  date_of_birth: string | null
  created_at: string
  investments: Array<{
    id: string
    amount: number
    investment_date: string
    status: string
  }>
}

export default function AdminInvestorsPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [investors, setInvestors] = useState<Investor[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  useEffect(() => {
    if (!user?.id) return

    let mounted = true

    async function loadInvestors() {
      try {
        setDataLoading(true)
        const data = await getAllInvestors()
        if (mounted) {
          setInvestors(data as Investor[])
        }
      } catch (error) {
        console.error('Error loading investors:', error)
      } finally {
        if (mounted) {
          setDataLoading(false)
        }
      }
    }

    loadInvestors()

    return () => {
      mounted = false
    }
  }, [user?.id])

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

  const filteredInvestors = investors.filter(investor => {
    const matchesSearch =
      investor.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.email.toLowerCase().includes(searchQuery.toLowerCase())

    if (selectedStatus === 'all') return matchesSearch

    // Filter by investment status
    const hasActiveInvestment = investor.investments?.some(inv => inv.status === 'active')
    if (selectedStatus === 'active') return matchesSearch && hasActiveInvestment
    if (selectedStatus === 'inactive') return matchesSearch && !hasActiveInvestment

    return matchesSearch
  })

  const totalInvestors = investors.length
  const totalCapital = investors.reduce((sum, inv) => {
    const investorTotal = inv.investments?.reduce((s, i) => s + i.amount, 0) || 0
    return sum + investorTotal
  }, 0)
  const activeInvestors = investors.filter(inv =>
    inv.investments?.some(i => i.status === 'active')
  ).length

  return (
    <DashboardLayout
      title="Investors Management"
      subtitle="View and manage all platform investors"
      isAdmin={true}
    >
      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="card-premium animate-fade-in-up">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Investors</p>
                <p className="text-2xl font-bold text-stag-navy mt-1">
                  {dataLoading ? <Loader2 className="h-6 w-6 animate-spin text-stag-blue" /> : totalInvestors}
                </p>
              </div>
              <div className="icon-container-primary">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium animate-fade-in-up stagger-1">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Investors</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  {dataLoading ? <Loader2 className="h-6 w-6 animate-spin text-emerald-600" /> : activeInvestors}
                </p>
              </div>
              <div className="icon-container-success">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium animate-fade-in-up stagger-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Capital</p>
                <p className="text-2xl font-bold text-stag-blue mt-1">
                  {dataLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-stag-blue" />
                  ) : (
                    `€${totalCapital.toLocaleString()}`
                  )}
                </p>
              </div>
              <div className="icon-container-default bg-stag-light">
                <DollarSign className="w-6 h-6 text-stag-blue" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="card-premium mb-6 animate-fade-in-up stagger-3">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedStatus('all')}
                className={selectedStatus === 'all' ? 'bg-stag-blue hover:bg-stag-navy' : ''}
              >
                All
              </Button>
              <Button
                variant={selectedStatus === 'active' ? 'default' : 'outline'}
                onClick={() => setSelectedStatus('active')}
                className={selectedStatus === 'active' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
              >
                Active
              </Button>
              <Button
                variant={selectedStatus === 'inactive' ? 'default' : 'outline'}
                onClick={() => setSelectedStatus('inactive')}
                className={selectedStatus === 'inactive' ? 'bg-gray-600 hover:bg-gray-700' : ''}
              >
                Inactive
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investors List */}
      <Card className="card-premium animate-fade-in-up stagger-4">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-stag-navy">
            All Investors ({filteredInvestors.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dataLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-stag-blue" />
            </div>
          ) : filteredInvestors.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No investors found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredInvestors.map((investor) => {
                const totalInvested = investor.investments?.reduce((sum, inv) => sum + inv.amount, 0) || 0
                const hasActiveInvestment = investor.investments?.some(inv => inv.status === 'active')

                return (
                  <div
                    key={investor.id}
                    className="p-6 rounded-xl border border-gray-100 hover:border-stag-blue/30 transition-all duration-200 hover:shadow-premium-sm group bg-white"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Investor Info */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-stag-blue to-stag-navy flex items-center justify-center text-white font-bold shadow-premium-sm">
                            {investor.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-stag-navy">{investor.full_name}</h3>
                              <Badge
                                className={hasActiveInvestment
                                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-100'
                                }
                              >
                                {hasActiveInvestment ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Mail className="w-3.5 h-3.5" />
                                <span>{investor.email}</span>
                              </div>
                              {investor.phone && (
                                <div className="flex items-center gap-1">
                                  <Phone className="w-3.5 h-3.5" />
                                  <span>{investor.phone}</span>
                                </div>
                              )}
                              {investor.nationality && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5" />
                                  <span>{investor.nationality}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Investment Summary */}
                        <div className="flex flex-wrap gap-6 pl-[60px]">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Total Invested</p>
                            <p className="text-lg font-bold text-stag-navy">€{totalInvested.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Investments</p>
                            <p className="text-lg font-bold text-gray-700">{investor.investments?.length || 0}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Member Since</p>
                            <p className="text-sm font-medium text-gray-700">
                              {new Date(investor.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-stag-light hover:border-stag-blue"
                        onClick={() => router.push(`/admin/investors/${investor.id}`)}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
