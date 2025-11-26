'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Loader2,
  Upload,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Eye,
  Trash2,
  Search,
  Filter,
  File,
  Image as ImageIcon,
  FileSpreadsheet
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  getInvestorDocuments,
  getDocumentStats,
  getRequiredDocumentsChecklist,
  deleteDocument,
  getDocumentDownloadUrl,
} from '@/lib/actions/document-actions'
import { transformDocumentData, type TransformedDocument as Document } from '@/lib/utils/document-utils'

export default function DocumentsPage() {
  const { user, loading } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [documents, setDocuments] = useState<Document[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 })
  const [checklist, setChecklist] = useState<any[]>([])
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Load documents data
  useEffect(() => {
    async function loadData() {
      if (!user) return

      try {
        setDataLoading(true)
        const [docsData, statsData, checklistData] = await Promise.all([
          getInvestorDocuments(),
          getDocumentStats(),
          getRequiredDocumentsChecklist()
        ])

        // Transform DocumentData to Document format
        setDocuments(transformDocumentData(docsData))
        setStats(statsData)
        setChecklist(checklistData)
      } catch (error) {
        console.error('Error loading documents:', error)
      } finally {
        setDataLoading(false)
      }
    }

    loadData()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-stag-blue" />
      </div>
    )
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleUpload = () => {
    setIsUploading(true)
    // Simular upload
    setTimeout(() => {
      setIsUploading(false)
      alert('Upload functionality will be implemented with Supabase Storage')
    }, 1000)
  }

  const handleDownload = async (documentId: string) => {
    try {
      const result = await getDocumentDownloadUrl(documentId)
      if (result.success && result.url) {
        // Open download URL in new tab
        window.open(result.url, '_blank')
      } else {
        alert(result.error || 'Failed to download document')
      }
    } catch (error) {
      console.error('Error downloading document:', error)
      alert('Failed to download document')
    }
  }

  const handleDelete = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return
    }

    try {
      setDeletingId(documentId)
      const result = await deleteDocument(documentId)

      if (result.success) {
        // Reload documents and stats
        const [docsData, statsData] = await Promise.all([
          getInvestorDocuments(),
          getDocumentStats()
        ])
        setDocuments(transformDocumentData(docsData))
        setStats(statsData)
      } else {
        alert(result.error || 'Failed to delete document')
      }
    } catch (error) {
      console.error('Error deleting document:', error)
      alert('Failed to delete document')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <DashboardLayout
      title="Documents"
      subtitle="Manage your Golden Visa documents"
    >
      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card className="card-premium animate-fade-in-up">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold text-stag-navy mt-1">
                  {dataLoading ? <Loader2 className="h-6 w-6 animate-spin text-stag-blue" /> : stats.total}
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
                  {dataLoading ? <Loader2 className="h-6 w-6 animate-spin text-emerald-600" /> : stats.approved}
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
                  {dataLoading ? <Loader2 className="h-6 w-6 animate-spin text-amber-600" /> : stats.pending}
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
                  {dataLoading ? <Loader2 className="h-6 w-6 animate-spin text-red-600" /> : stats.rejected}
                </p>
              </div>
              <div className="icon-container-default bg-red-100">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Section */}
      <Card className="card-premium mb-8 animate-fade-in-up stagger-4">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-stag-light flex items-center justify-center">
                <Upload className="w-6 h-6 text-stag-blue" />
              </div>
              <div>
                <h3 className="font-bold text-stag-navy">Upload New Document</h3>
                <p className="text-sm text-gray-500">
                  Supported formats: PDF, JPG, PNG • Max size: 10MB
                </p>
              </div>
            </div>
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              className="bg-gradient-to-r from-stag-navy to-stag-blue hover:from-stag-blue hover:to-stag-navy"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card className="card-premium animate-fade-in-up stagger-5">
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-lg font-bold text-stag-navy">
              Document Library
            </CardTitle>

            {/* Category Filters */}
            <div className="flex items-center gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className={selectedCategory === 'all' ? 'bg-stag-blue' : ''}
              >
                All
              </Button>
              <Button
                variant={selectedCategory === 'identity' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('identity')}
                className={selectedCategory === 'identity' ? 'bg-stag-blue' : ''}
              >
                Identity
              </Button>
              <Button
                variant={selectedCategory === 'financial' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('financial')}
                className={selectedCategory === 'financial' ? 'bg-stag-blue' : ''}
              >
                Financial
              </Button>
              <Button
                variant={selectedCategory === 'property' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('property')}
                className={selectedCategory === 'property' ? 'bg-stag-blue' : ''}
              >
                Property
              </Button>
              <Button
                variant={selectedCategory === 'legal' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('legal')}
                className={selectedCategory === 'legal' ? 'bg-stag-blue' : ''}
              >
                Legal
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {dataLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-stag-blue" />
            </div>
          ) : (
            <DocumentsList
              documents={filteredDocuments}
              onDownload={handleDownload}
              onDelete={handleDelete}
              deletingId={deletingId}
            />
          )}
        </CardContent>
      </Card>

      {/* Required Documents Checklist */}
      <Card className="mt-8 card-premium animate-fade-in-up stagger-6">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-stag-navy">
            Required Documents Checklist
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Documents needed for your Golden Visa application
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dataLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-stag-blue" />
              </div>
            ) : checklist.length > 0 ? (
              checklist.map((item, index) => (
                <ChecklistItem key={index} title={item.title} status={item.status} />
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No checklist items found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}

// Helper Components
interface DocumentsListProps {
  documents: Document[]
  onDownload: (id: string) => void
  onDelete: (id: string) => void
  deletingId: string | null
}

function DocumentsList({ documents, onDownload, onDelete, deletingId }: DocumentsListProps) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No documents found</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <DocumentItem
          key={doc.id}
          document={doc}
          onDownload={onDownload}
          onDelete={onDelete}
          deletingId={deletingId}
        />
      ))}
    </div>
  )
}

interface DocumentItemProps {
  document: Document
  onDownload: (id: string) => void
  onDelete: (id: string) => void
  deletingId: string | null
}

function DocumentItem({ document, onDownload, onDelete, deletingId }: DocumentItemProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-100 text-emerald-700'
      case 'pending':
        return 'bg-amber-100 text-amber-700'
      case 'rejected':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
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

  return (
    <div className="p-4 rounded-xl border border-gray-100 hover:border-stag-blue/30 transition-colors bg-gradient-to-r from-stag-light/20 to-transparent">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          {/* Icon */}
          <div className="w-12 h-12 rounded-lg bg-stag-light flex items-center justify-center">
            {document.type === 'PDF' ? (
              <FileText className="w-6 h-6 text-stag-blue" />
            ) : document.type === 'JPG' || document.type === 'PNG' ? (
              <ImageIcon className="w-6 h-6 text-stag-blue" />
            ) : (
              <File className="w-6 h-6 text-stag-blue" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-stag-navy">{document.name}</h4>
              <Badge className={`${getStatusColor(document.status)} hover:${getStatusColor(document.status)}`}>
                {document.status.toUpperCase()}
              </Badge>
              <Badge variant="outline" className={getCategoryColor(document.category)}>
                {document.category}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Uploaded {document.uploadDate}</span>
              <span>•</span>
              <span>{document.size}</span>
              <span>•</span>
              <span>{document.type}</span>
              {document.verifiedBy && (
                <>
                  <span>•</span>
                  <span className="text-emerald-600">Verified {document.verifiedDate}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 hover:bg-stag-light"
            onClick={() => onDownload(document.id)}
            title="Preview"
          >
            <Eye className="w-4 h-4 text-gray-400" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 hover:bg-stag-light"
            onClick={() => onDownload(document.id)}
            title="Download"
          >
            <Download className="w-4 h-4 text-gray-400" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 hover:bg-red-50"
            onClick={() => onDelete(document.id)}
            disabled={deletingId === document.id}
            title="Delete"
          >
            {deletingId === document.id ? (
              <Loader2 className="w-4 h-4 text-red-400 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-600" />
            )}
          </Button>
        </div>
      </div>

      {document.notes && (
        <>
          <Separator className="my-3" />
          <p className="text-sm text-gray-600">
            <strong>Notes:</strong> {document.notes}
          </p>
        </>
      )}
    </div>
  )
}

function ChecklistItem({ title, status }: { title: string; status: 'completed' | 'pending' | 'missing' }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-stag-light/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
          status === 'completed' ? 'bg-emerald-100' :
          status === 'pending' ? 'bg-amber-100' :
          'bg-gray-100'
        }`}>
          {status === 'completed' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : status === 'pending' ? (
            <Clock className="w-4 h-4 text-amber-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-gray-400" />
          )}
        </div>
        <span className={`text-sm font-medium ${
          status === 'completed' ? 'text-stag-navy' :
          status === 'pending' ? 'text-amber-700' :
          'text-gray-500'
        }`}>
          {title}
        </span>
      </div>
      <Badge className={
        status === 'completed' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' :
        status === 'pending' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' :
        'bg-gray-100 text-gray-600 hover:bg-gray-100'
      }>
        {status === 'completed' ? 'UPLOADED' :
         status === 'pending' ? 'PENDING' :
         'REQUIRED'}
      </Badge>
    </div>
  )
}
