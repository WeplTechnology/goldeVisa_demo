'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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

interface Document {
  id: string
  name: string
  category: 'identity' | 'financial' | 'property' | 'legal' | 'other'
  status: 'pending' | 'approved' | 'rejected'
  uploadDate: string
  size: string
  type: string
  verifiedBy?: string
  verifiedDate?: string
  notes?: string
}

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Passport - Zhang Wei',
    category: 'identity',
    status: 'approved',
    uploadDate: 'Nov 15, 2024',
    size: '2.4 MB',
    type: 'PDF',
    verifiedBy: 'admin@stagfund.com',
    verifiedDate: 'Nov 16, 2024'
  },
  {
    id: '2',
    name: 'Bank Statement Q4 2024',
    category: 'financial',
    status: 'approved',
    uploadDate: 'Nov 15, 2024',
    size: '1.8 MB',
    type: 'PDF',
    verifiedBy: 'admin@stagfund.com',
    verifiedDate: 'Nov 17, 2024'
  },
  {
    id: '3',
    name: 'Investment Certificate',
    category: 'financial',
    status: 'approved',
    uploadDate: 'Nov 15, 2024',
    size: '0.9 MB',
    type: 'PDF',
    verifiedBy: 'admin@stagfund.com',
    verifiedDate: 'Nov 16, 2024'
  },
  {
    id: '4',
    name: 'Property Title - Unit 4B',
    category: 'property',
    status: 'approved',
    uploadDate: 'Dec 1, 2024',
    size: '3.2 MB',
    type: 'PDF',
    verifiedBy: 'admin@stagfund.com',
    verifiedDate: 'Dec 2, 2024'
  },
  {
    id: '5',
    name: 'Utility Bill - December',
    category: 'other',
    status: 'pending',
    uploadDate: 'Dec 5, 2024',
    size: '0.4 MB',
    type: 'PDF'
  },
  {
    id: '6',
    name: 'Proof of Residence',
    category: 'legal',
    status: 'pending',
    uploadDate: 'Dec 5, 2024',
    size: '1.1 MB',
    type: 'PDF'
  }
]

export default function DocumentsPage() {
  const { user, loading } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [documents] = useState<Document[]>(mockDocuments)
  const [isUploading, setIsUploading] = useState(false)

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

  const stats = {
    total: documents.length,
    approved: documents.filter(d => d.status === 'approved').length,
    pending: documents.filter(d => d.status === 'pending').length,
    rejected: documents.filter(d => d.status === 'rejected').length
  }

  const handleUpload = () => {
    setIsUploading(true)
    // Simular upload
    setTimeout(() => {
      setIsUploading(false)
      alert('Upload functionality will be implemented with Supabase Storage')
    }, 1000)
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
                <p className="text-2xl font-bold text-stag-navy mt-1">{stats.total}</p>
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
                <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.approved}</p>
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
                <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pending}</p>
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
                <p className="text-2xl font-bold text-red-600 mt-1">{stats.rejected}</p>
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
        <Tabs defaultValue="all" className="w-full">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-lg font-bold text-stag-navy">
                Document Library
              </CardTitle>
              <TabsList className="bg-stag-light">
                <TabsTrigger value="all" onClick={() => setSelectedCategory('all')}>
                  All
                </TabsTrigger>
                <TabsTrigger value="identity" onClick={() => setSelectedCategory('identity')}>
                  Identity
                </TabsTrigger>
                <TabsTrigger value="financial" onClick={() => setSelectedCategory('financial')}>
                  Financial
                </TabsTrigger>
                <TabsTrigger value="property" onClick={() => setSelectedCategory('property')}>
                  Property
                </TabsTrigger>
                <TabsTrigger value="legal" onClick={() => setSelectedCategory('legal')}>
                  Legal
                </TabsTrigger>
              </TabsList>
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
            <TabsContent value="all" className="mt-0">
              <DocumentsList documents={filteredDocuments} />
            </TabsContent>
            <TabsContent value="identity" className="mt-0">
              <DocumentsList documents={filteredDocuments} />
            </TabsContent>
            <TabsContent value="financial" className="mt-0">
              <DocumentsList documents={filteredDocuments} />
            </TabsContent>
            <TabsContent value="property" className="mt-0">
              <DocumentsList documents={filteredDocuments} />
            </TabsContent>
            <TabsContent value="legal" className="mt-0">
              <DocumentsList documents={filteredDocuments} />
            </TabsContent>
          </CardContent>
        </Tabs>
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
            <ChecklistItem title="Valid Passport" status="completed" />
            <ChecklistItem title="Proof of Investment (€250,000)" status="completed" />
            <ChecklistItem title="Criminal Record Certificate" status="completed" />
            <ChecklistItem title="Property Title Documents" status="completed" />
            <ChecklistItem title="Proof of Residence" status="pending" />
            <ChecklistItem title="Utility Bill (Recent)" status="pending" />
            <ChecklistItem title="Health Insurance Certificate" status="missing" />
            <ChecklistItem title="Birth Certificate" status="missing" />
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}

// Helper Components
function DocumentsList({ documents }: { documents: Document[] }) {
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
        <DocumentItem key={doc.id} document={doc} />
      ))}
    </div>
  )
}

function DocumentItem({ document }: { document: Document }) {
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
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
            <Eye className="w-4 h-4 text-gray-400" />
          </Button>
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
            <Download className="w-4 h-4 text-gray-400" />
          </Button>
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
            <Trash2 className="w-4 h-4 text-gray-400" />
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
