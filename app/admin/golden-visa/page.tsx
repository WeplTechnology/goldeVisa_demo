'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { GoldenVisaTimeline } from '@/components/ui/golden-visa-timeline'
import {
  Loader2,
  Shield,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Calendar,
  User
} from 'lucide-react'
import { getAllGoldenVisaApplications, updateVisaApplicationStatus } from '@/lib/actions/admin-actions'

interface VisaApplication {
  id: string
  status: string
  application_date: string
  approval_date: string | null
  current_step: number
  notes: string | null
  investor: {
    id: string
    full_name: string
    email: string
    nationality: string | null
  }
}

export default function AdminGoldenVisaPage() {
  const { user, loading } = useAuth()
  const [applications, setApplications] = useState<VisaApplication[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.id) return

    let mounted = true

    async function loadApplications() {
      try {
        setDataLoading(true)
        const data = await getAllGoldenVisaApplications()

        if (mounted) {
          setApplications(data as VisaApplication[])
        }
      } catch (error) {
        console.error('Error loading applications:', error)
      } finally {
        if (mounted) {
          setDataLoading(false)
        }
      }
    }

    loadApplications()

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

  const filteredApplications = applications.filter(app => {
    const matchesSearch =
      app.investor.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.investor.email.toLowerCase().includes(searchQuery.toLowerCase())

    if (selectedStatus === 'all') return matchesSearch

    return matchesSearch && app.status === selectedStatus
  })

  const totalApplications = applications.length
  const approvedCount = applications.filter(app => app.status === 'approved').length
  const pendingCount = applications.filter(app => app.status === 'in_review' || app.status === 'submitted').length
  const rejectedCount = applications.filter(app => app.status === 'rejected').length

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          color: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
          icon: CheckCircle2,
          label: 'Approved'
        }
      case 'in_review':
        return {
          color: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
          icon: Clock,
          label: 'In Review'
        }
      case 'submitted':
        return {
          color: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
          icon: FileText,
          label: 'Submitted'
        }
      case 'rejected':
        return {
          color: 'bg-red-100 text-red-700 hover:bg-red-100',
          icon: XCircle,
          label: 'Rejected'
        }
      default:
        return {
          color: 'bg-gray-100 text-gray-700 hover:bg-gray-100',
          icon: FileText,
          label: status
        }
    }
  }

  const handleUpdateStatus = async (applicationId: string, newStatus: string) => {
    if (!confirm(`Are you sure you want to change the status to "${newStatus}"?`)) {
      return
    }

    try {
      setUpdatingId(applicationId)
      const result = await updateVisaApplicationStatus(applicationId, newStatus)

      if (result.success) {
        // Reload applications
        const data = await getAllGoldenVisaApplications()
        setApplications(data as VisaApplication[])
      } else {
        alert(result.error || 'Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <DashboardLayout
      title="Golden Visa Management"
      subtitle="View and manage all visa applications"
      isAdmin={true}
    >
      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card className="card-premium animate-fade-in-up">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-stag-navy mt-1">
                  {dataLoading ? <Loader2 className="h-6 w-6 animate-spin text-stag-blue" /> : totalApplications}
                </p>
              </div>
              <div className="icon-container-primary">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium animate-fade-in-up stagger-1">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  {dataLoading ? <Loader2 className="h-6 w-6 animate-spin text-emerald-600" /> : approvedCount}
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
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">
                  {dataLoading ? <Loader2 className="h-6 w-6 animate-spin text-amber-600" /> : pendingCount}
                </p>
              </div>
              <div className="icon-container-warning">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium animate-fade-in-up stagger-3">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {dataLoading ? <Loader2 className="h-6 w-6 animate-spin text-red-600" /> : rejectedCount}
                </p>
              </div>
              <div className="icon-container-default bg-red-100">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="card-premium mb-6 animate-fade-in-up stagger-4">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by investor name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedStatus('all')}
                className={selectedStatus === 'all' ? 'bg-stag-blue hover:bg-stag-navy' : ''}
              >
                All
              </Button>
              <Button
                variant={selectedStatus === 'submitted' ? 'default' : 'outline'}
                onClick={() => setSelectedStatus('submitted')}
                className={selectedStatus === 'submitted' ? 'bg-amber-600 hover:bg-amber-700' : ''}
              >
                Submitted
              </Button>
              <Button
                variant={selectedStatus === 'in_review' ? 'default' : 'outline'}
                onClick={() => setSelectedStatus('in_review')}
                className={selectedStatus === 'in_review' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                In Review
              </Button>
              <Button
                variant={selectedStatus === 'approved' ? 'default' : 'outline'}
                onClick={() => setSelectedStatus('approved')}
                className={selectedStatus === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
              >
                Approved
              </Button>
              <Button
                variant={selectedStatus === 'rejected' ? 'default' : 'outline'}
                onClick={() => setSelectedStatus('rejected')}
                className={selectedStatus === 'rejected' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                Rejected
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <Card className="card-premium animate-fade-in-up stagger-5">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-stag-navy">
            All Applications ({filteredApplications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dataLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-stag-blue" />
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No applications found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application) => {
                const statusConfig = getStatusConfig(application.status)
                const StatusIcon = statusConfig.icon

                return (
                  <div
                    key={application.id}
                    className="p-6 rounded-xl border border-gray-100 hover:border-stag-blue/30 transition-all duration-200 hover:shadow-premium-sm group bg-white"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      {/* Investor Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-stag-blue to-stag-navy flex items-center justify-center text-white font-bold shadow-premium-sm">
                            {application.investor.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-bold text-stag-navy">{application.investor.full_name}</h3>
                            <p className="text-sm text-gray-500">{application.investor.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center gap-3">
                        <Badge className={statusConfig.color}>
                          <StatusIcon className="w-3.5 h-3.5 mr-1" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                    </div>

                    {/* Application Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pl-[60px]">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Application Date</p>
                        <p className="text-sm font-medium text-gray-700">
                          {new Date(application.application_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      {application.approval_date && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Approval Date</p>
                          <p className="text-sm font-medium text-gray-700">
                            {new Date(application.approval_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Current Step</p>
                        <p className="text-sm font-medium text-gray-700">Step {application.current_step} of 5</p>
                      </div>
                      {application.investor.nationality && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Nationality</p>
                          <p className="text-sm font-medium text-gray-700">{application.investor.nationality}</p>
                        </div>
                      )}
                    </div>

                    {/* Timeline */}
                    <div className="mb-4 pl-[60px]">
                      <GoldenVisaTimeline />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pl-[60px]">
                      {application.status !== 'approved' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                          onClick={() => handleUpdateStatus(application.id, 'approved')}
                          disabled={updatingId === application.id}
                        >
                          {updatingId === application.id ? (
                            <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          )}
                          Approve
                        </Button>
                      )}
                      {application.status !== 'in_review' && application.status !== 'approved' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                          onClick={() => handleUpdateStatus(application.id, 'in_review')}
                          disabled={updatingId === application.id}
                        >
                          {updatingId === application.id ? (
                            <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 mr-1" />
                          )}
                          Review
                        </Button>
                      )}
                      {application.status !== 'rejected' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                          onClick={() => handleUpdateStatus(application.id, 'rejected')}
                          disabled={updatingId === application.id}
                        >
                          {updatingId === application.id ? (
                            <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 mr-1" />
                          )}
                          Reject
                        </Button>
                      )}
                    </div>

                    {application.notes && (
                      <div className="mt-4 pl-[60px] p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Notes:</p>
                        <p className="text-sm text-gray-700">{application.notes}</p>
                      </div>
                    )}
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
