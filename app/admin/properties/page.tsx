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
  Building2,
  Search,
  MapPin,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Eye
} from 'lucide-react'
import { getAllProperties } from '@/lib/actions/admin-actions'
import { PropertyAIAnalysisModal } from '@/components/admin/PropertyAIAnalysisModal'

interface Property {
  id: string
  name: string
  address: string
  city: string
  country: string
  acquisition_price: number
  current_value: number
  total_size_sqm: number | null
  total_units: number
  status: string
  created_at: string
  images?: string[]
  investments: Array<{
    id: string
    amount: number
    investor: {
      full_name: string
      email: string
    }
  }>
}

export default function AdminPropertiesPage() {
  const { user, loading } = useAuth()
  const [properties, setProperties] = useState<Property[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [showAIModal, setShowAIModal] = useState(false)

  useEffect(() => {
    if (!user?.id) return

    let mounted = true

    async function loadProperties() {
      try {
        setDataLoading(true)
        const data = await getAllProperties()
        if (mounted) {
          setProperties(data as Property[])
        }
      } catch (error) {
        console.error('Error loading properties:', error)
      } finally {
        if (mounted) {
          setDataLoading(false)
        }
      }
    }

    loadProperties()

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

  const filteredProperties = properties.filter(property => {
    const matchesSearch =
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase())

    if (selectedStatus === 'all') return matchesSearch

    return matchesSearch && property.status === selectedStatus
  })

  const totalProperties = properties.length
  const totalValue = properties.reduce((sum, prop) => sum + (prop.current_value || prop.acquisition_price || 0), 0)
  const totalInvestors = properties.reduce((sum, prop) => sum + (prop.investments?.length || 0), 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
      case 'reserved':
        return 'bg-amber-100 text-amber-700 hover:bg-amber-100'
      case 'sold':
        return 'bg-gray-100 text-gray-600 hover:bg-gray-100'
      default:
        return 'bg-blue-100 text-blue-700 hover:bg-blue-100'
    }
  }

  return (
    <DashboardLayout
      title="Properties Management"
      subtitle="View and manage all investment properties"
      isAdmin={true}
    >
      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="card-premium animate-fade-in-up">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                <p className="text-2xl font-bold text-stag-navy mt-1">
                  {dataLoading ? <Loader2 className="h-6 w-6 animate-spin text-stag-blue" /> : totalProperties}
                </p>
              </div>
              <div className="icon-container-primary">
                <Building2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium animate-fade-in-up stagger-1">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-stag-blue mt-1">
                  {dataLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-stag-blue" />
                  ) : (
                    `€${(totalValue / 1000000).toFixed(1)}M`
                  )}
                </p>
              </div>
              <div className="icon-container-default bg-stag-light">
                <DollarSign className="w-6 h-6 text-stag-blue" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium animate-fade-in-up stagger-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Investors</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  {dataLoading ? <Loader2 className="h-6 w-6 animate-spin text-emerald-600" /> : totalInvestors}
                </p>
              </div>
              <div className="icon-container-success">
                <Users className="w-6 h-6 text-white" />
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
                placeholder="Search by name or location..."
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
                variant={selectedStatus === 'available' ? 'default' : 'outline'}
                onClick={() => setSelectedStatus('available')}
                className={selectedStatus === 'available' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
              >
                Available
              </Button>
              <Button
                variant={selectedStatus === 'reserved' ? 'default' : 'outline'}
                onClick={() => setSelectedStatus('reserved')}
                className={selectedStatus === 'reserved' ? 'bg-amber-600 hover:bg-amber-700' : ''}
              >
                Reserved
              </Button>
              <Button
                variant={selectedStatus === 'sold' ? 'default' : 'outline'}
                onClick={() => setSelectedStatus('sold')}
                className={selectedStatus === 'sold' ? 'bg-gray-600 hover:bg-gray-700' : ''}
              >
                Sold
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Properties Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dataLoading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-stag-blue" />
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No properties found</p>
          </div>
        ) : (
          filteredProperties.map((property, index) => {
            const totalInvested = property.investments?.reduce((sum, inv) => sum + inv.amount, 0) || 0
            const propertyValue = property.current_value || property.acquisition_price || 0
            const investmentProgress = propertyValue ? (totalInvested / propertyValue) * 100 : 0

            return (
              <Card
                key={property.id}
                className="card-premium animate-fade-in-up hover:shadow-premium-md transition-all duration-300 group overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Property Image */}
                <div className="relative h-48 bg-gradient-to-br from-stag-navy to-stag-blue overflow-hidden">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-white/30" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge className={getStatusColor(property.status)}>
                      {property.status.toUpperCase()}
                    </Badge>
                  </div>
                  {/* Image count badge */}
                  {property.images && property.images.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {property.images.length}
                    </div>
                  )}
                </div>

                <CardContent className="pt-6 space-y-4">
                  {/* Property Info */}
                  <div>
                    <h3 className="font-bold text-lg text-stag-navy mb-2 line-clamp-1">{property.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">{property.city}, {property.country}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Units:</span>
                      <span className="font-medium text-gray-700">{property.total_units} units</span>
                    </div>
                    {property.total_size_sqm && (
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-gray-500">Size:</span>
                        <span className="font-medium text-gray-700">{property.total_size_sqm} m²</span>
                      </div>
                    )}
                  </div>

                  {/* Investment Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Investment Progress</span>
                      <span className="text-sm font-bold text-stag-navy">{investmentProgress.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-stag-blue to-stag-blue-light transition-all duration-1000"
                        style={{ width: `${Math.min(investmentProgress, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-2 text-xs">
                      <span className="text-gray-500">€{totalInvested.toLocaleString()}</span>
                      <span className="text-gray-500">€{propertyValue.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Price</p>
                      <p className="text-sm font-bold text-stag-navy">€{(propertyValue / 1000).toFixed(0)}K</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Investors</p>
                      <p className="text-sm font-bold text-gray-700">{property.investments?.length || 0}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <Button
                    variant="outline"
                    className="w-full hover:bg-stag-light hover:border-stag-blue"
                    size="sm"
                    onClick={() => {
                      setSelectedProperty(property)
                      setShowAIModal(true)
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    AI Analysis
                  </Button>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* AI Analysis Modal */}
      {selectedProperty && (
        <PropertyAIAnalysisModal
          property={selectedProperty}
          isOpen={showAIModal}
          onClose={() => {
            setShowAIModal(false)
            setSelectedProperty(null)
          }}
        />
      )}
    </DashboardLayout>
  )
}
