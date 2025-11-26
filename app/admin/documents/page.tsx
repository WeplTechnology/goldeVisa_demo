'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Loader2,
  FileText,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Eye,
  User,
  Calendar
} from 'lucide-react'
import { getAllDocuments, updateDocumentStatus } from '@/lib/actions/admin-actions'
import { formatFileSize, getFileTypeLabel } from '@/lib/utils/file-utils'

interface Document {
  id: string
  name: string
  category: string
  status: string
  file_name: string
  file_path: string
  file_size: number
  file_type: string
  uploaded_at: string
  verified_by: string | null
  verified_at: string | null
  verification_notes: string | null
  investor: {
    id: string
    full_name: string
    email: string
  }
}

export default function AdminDocumentsPage() {
  const { user, loading } = useAuth()
  const [documents, setDocuments] = useState<Document[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.id) return

    let mounted = true

    async function loadDocuments() {
      try {
        setDataLoading(true)
        const data = await getAllDocuments()
        if (mounted) {
          setDocuments(data as Document[])
        }
      } catch (error) {
        console.error('Error loading documents:', error)
      } finally {
        if (mounted) {
          setDataLoading(false)
        }
      }
    }

    loadDocuments()

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

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.investor.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.investor.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory

    return matchesSearch && matchesStatus && matchesCategory
  })

  const totalDocuments = documents.length
  const approvedCount = documents.filter(doc => doc.status === 'approved').length
  const pendingCount = documents.filter(doc => doc.status === 'pending').length
  const rejectedCount = documents.filter(doc => doc.status === 'rejected').length

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          color: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
          icon: CheckCircle2
        }
      case 'pending':
        return {
          color: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
          icon: Clock
        }
      case 'rejected':
        return {
          color: 'bg-red-100 text-red-700 hover:bg-red-100',
          icon: XCircle
        }
      default:
        return {
          color: 'bg-gray-100 text-gray-700 hover:bg-gray-100',
          icon: FileText
        }
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'identity':
        return 'bg-blue-100 text-blue-700'
      case 'financial':
        return 'bg-purple-100 text-purple-700'
      case 'property':
        return 'bg-green-100 text-green-700'
      case 'legal':
        return 'bg-orange-100 text-orange-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const handleUpdateStatus = async (documentId: string, newStatus: 'approved' | 'rejected') => {
    const notes = prompt(`Add notes for this ${newStatus} decision (optional):`)

    try {
      setUpdatingId(documentId)
      const result = await updateDocumentStatus(documentId, newStatus, notes || undefined)

      if (result.success) {
        // Reload documents
        const data = await getAllDocuments()
        setDocuments(data as Document[])
      } else {
        alert(result.error || 'Failed to update document status')
      }
    } catch (error) {
      console.error('Error updating document status:', error)
      alert('Failed to update document status')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <DashboardLayout
      title="Documents Management"
      subtitle="Review and verify investor documents"
      isAdmin={true}
    >
      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card className="card-premium animate-fade-in-up">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold text-stag-navy mt-1">
                  {dataLoading ? <Loader2 className="h-6 w-6 animate-spin text-stag-blue" /> : totalDocuments}
                </p>
              </div>
              <div className="icon-container-primary">
                <FileText className="w-6 h-6 text-white" />
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
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by document name, investor name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex gap-2">
                <span className="text-sm font-medium text-gray-600 self-center">Status:</span>
                <Button
                  size="sm"
                  variant={selectedStatus === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedStatus('all')}
                  className={selectedStatus === 'all' ? 'bg-stag-blue hover:bg-stag-navy' : ''}
                >
                  All
                </Button>
                <Button
                  size="sm"
                  variant={selectedStatus === 'pending' ? 'default' : 'outline'}
                  onClick={() => setSelectedStatus('pending')}
                  className={selectedStatus === 'pending' ? 'bg-amber-600 hover:bg-amber-700' : ''}
                >
                  Pending
                </Button>
                <Button
                  size="sm"
                  variant={selectedStatus === 'approved' ? 'default' : 'outline'}
                  onClick={() => setSelectedStatus('approved')}
                  className={selectedStatus === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                >
                  Approved
                </Button>
                <Button
                  size="sm"
                  variant={selectedStatus === 'rejected' ? 'default' : 'outline'}
                  onClick={() => setSelectedStatus('rejected')}
                  className={selectedStatus === 'rejected' ? 'bg-red-600 hover:bg-red-700' : ''}
                >
                  Rejected
                </Button>
              </div>
              <div className="border-l border-gray-300 mx-2" />
              <div className="flex gap-2">
                <span className="text-sm font-medium text-gray-600 self-center">Category:</span>
                <Button
                  size="sm"
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('all')}
                  className={selectedCategory === 'all' ? 'bg-stag-blue hover:bg-stag-navy' : ''}
                >
                  All
                </Button>
                <Button
                  size="sm"
                  variant={selectedCategory === 'identity' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('identity')}
                >
                  Identity
                </Button>
                <Button
                  size="sm"
                  variant={selectedCategory === 'financial' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('financial')}
                >
                  Financial
                </Button>
                <Button
                  size="sm"
                  variant={selectedCategory === 'property' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('property')}
                >
                  Property
                </Button>
                <Button
                  size="sm"
                  variant={selectedCategory === 'legal' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('legal')}
                >
                  Legal
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card className="card-premium animate-fade-in-up stagger-5">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-stag-navy">
            All Documents ({filteredDocuments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dataLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-stag-blue" />
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No documents found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDocuments.map((document) => {
                const statusConfig = getStatusConfig(document.status)
                const StatusIcon = statusConfig.icon

                return (
                  <div
                    key={document.id}
                    className="p-5 rounded-xl border border-gray-100 hover:border-stag-blue/30 transition-all duration-200 hover:shadow-premium-sm bg-white"
                  >
                    <div className="flex items-start gap-4">
                      {/* Document Icon */}
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-stag-blue/10 to-stag-navy/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-stag-blue" />
                      </div>

                      {/* Document Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-stag-navy mb-1 truncate">{document.name}</h3>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <Badge className={getCategoryColor(document.category)}>
                                {document.category.toUpperCase()}
                              </Badge>
                              <Badge className={statusConfig.color}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {document.status.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                              <User className="w-3.5 h-3.5" />
                              <span className="font-medium">{document.investor.full_name}</span>
                              <span className="text-gray-400">•</span>
                              <span>{document.investor.email}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                              <span>{getFileTypeLabel(document.file_type)}</span>
                              <span>{formatFileSize(document.file_size)}</span>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(document.uploaded_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-9 w-9 p-0 hover:bg-stag-light"
                              title="Preview"
                            >
                              <Eye className="w-4 h-4 text-gray-400" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-9 w-9 p-0 hover:bg-stag-light"
                              title="Download"
                            >
                              <Download className="w-4 h-4 text-gray-400" />
                            </Button>
                          </div>
                        </div>

                        {/* Verification Info */}
                        {document.verified_by && document.verified_at && (
                          <div className="text-xs text-gray-500 mb-2">
                            Verified by {document.verified_by} on{' '}
                            {new Date(document.verified_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        )}

                        {/* Verification Notes */}
                        {document.verification_notes && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">Notes:</p>
                            <p className="text-sm text-gray-700">{document.verification_notes}</p>
                          </div>
                        )}

                        {/* Admin Actions */}
                        {document.status === 'pending' && (
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700"
                              onClick={() => handleUpdateStatus(document.id, 'approved')}
                              disabled={updatingId === document.id}
                            >
                              {updatingId === document.id ? (
                                <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                              )}
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-200 text-red-700 hover:bg-red-50"
                              onClick={() => handleUpdateStatus(document.id, 'rejected')}
                              disabled={updatingId === document.id}
                            >
                              {updatingId === document.id ? (
                                <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5 mr-1" />
                              )}
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
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
