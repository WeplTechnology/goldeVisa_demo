'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Loader2,
  Building2,
  MapPin,
  Euro,
  TrendingUp,
  Users,
  Calendar,
  Maximize,
  Bed,
  Bath,
  ExternalLink,
  Mail,
  Phone,
  Download,
  Image as ImageIcon
} from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  getInvestorPropertyUnits,
  getPortfolioSummary,
  type PropertyUnit
} from '@/lib/actions/investor-actions'

export default function PropertiesPage() {
  const { user, loading } = useAuth()
  const [propertyUnits, setPropertyUnits] = useState<PropertyUnit[]>([])
  const [portfolioData, setPortfolioData] = useState<any>(null)
  const [dataLoading, setDataLoading] = useState(true)

  // Load property data
  useEffect(() => {
    if (!user?.id) return

    let mounted = true

    async function loadData() {
      try {
        setDataLoading(true)
        const [units, portfolio] = await Promise.all([
          getInvestorPropertyUnits(),
          getPortfolioSummary()
        ])

        if (mounted) {
          setPropertyUnits(units)
          setPortfolioData(portfolio)
        }
      } catch (error) {
        console.error('Error loading properties data:', error)
      } finally {
        if (mounted) {
          setDataLoading(false)
        }
      }
    }

    loadData()

    return () => {
      mounted = false
    }
  }, [user?.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-stag-blue" />
      </div>
    )
  }

  return (
    <DashboardLayout
      title="Your Properties"
      subtitle="Manage your real estate portfolio"
    >
      {/* Overview Stats */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card className="card-premium animate-fade-in-up">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Units</p>
                <p className="text-2xl font-bold text-stag-navy mt-1">
                  {dataLoading ? '...' : propertyUnits.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {dataLoading ? '...' : `${propertyUnits.reduce((sum, u) => sum + (u.size_sqm || 0), 0)} m² total`}
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
                <p className="text-sm font-medium text-gray-600">Monthly Income</p>
                <p className="text-2xl font-bold text-stag-navy mt-1">
                  {dataLoading ? '...' : `€${portfolioData?.monthlyRent?.toLocaleString() || '0'}`}
                </p>
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {dataLoading ? '...' : `${propertyUnits.filter(u => u.rental_status === 'rented').length} rented`}
                </p>
              </div>
              <div className="icon-container-success">
                <Euro className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium animate-fade-in-up stagger-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Annual Yield</p>
                <p className="text-2xl font-bold text-stag-navy mt-1">
                  {dataLoading ? '...' : `${portfolioData?.annualYield?.toFixed(1) || '0'}%`}
                </p>
                <p className="text-xs text-gray-500 mt-1">On investment</p>
              </div>
              <div className="icon-container-default">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium animate-fade-in-up stagger-3">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Occupancy</p>
                <p className="text-2xl font-bold text-stag-navy mt-1">
                  {dataLoading ? '...' : propertyUnits.length > 0 ? `${Math.round((propertyUnits.filter(u => u.rental_status === 'rented').length / propertyUnits.length) * 100)}%` : '0%'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {dataLoading ? '...' : `${propertyUnits.filter(u => u.rental_status === 'rented').length} active leases`}
                </p>
              </div>
              <div className="icon-container-success">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="card-premium animate-fade-in-up stagger-4">
        <Tabs defaultValue="units" className="w-full">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-stag-navy">
                  Portfolio Details
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Via Garibaldi 23, 20121 Milano, Italy
                </p>
              </div>
              <TabsList className="bg-stag-light">
                <TabsTrigger value="units">Units</TabsTrigger>
                <TabsTrigger value="tenants">Tenants</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {/* Units Tab */}
            <TabsContent value="units" className="mt-0 space-y-6">
              {dataLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-stag-blue" />
                </div>
              ) : propertyUnits.length > 0 ? (
                propertyUnits.map((unit) => (
                  <PropertyUnitCard
                    key={unit.id}
                    unitNumber={unit.unit_number}
                    floor={unit.floor}
                    size={unit.size_sqm}
                    bedrooms={unit.bedrooms}
                    bathrooms={unit.bathrooms}
                    monthlyRent={unit.monthly_rent}
                    status={unit.rental_status as 'rented' | 'available' | 'maintenance'}
                    tenant={unit.current_tenant_name ? {
                      name: unit.current_tenant_name,
                      email: unit.current_tenant_email || '',
                      phone: '',
                      leaseStart: unit.lease_start_date ? new Date(unit.lease_start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
                      leaseEnd: unit.lease_end_date ? new Date(unit.lease_end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''
                    } : undefined}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No properties assigned yet</p>
                </div>
              )}
            </TabsContent>

            {/* Tenants Tab */}
            <TabsContent value="tenants" className="mt-0 space-y-4">
              {dataLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-stag-blue" />
                </div>
              ) : propertyUnits.filter(u => u.current_tenant_name).length > 0 ? (
                propertyUnits
                  .filter(u => u.current_tenant_name)
                  .map((unit) => (
                    <TenantCard
                      key={unit.id}
                      name={unit.current_tenant_name || ''}
                      email={unit.current_tenant_email || ''}
                      phone=""
                      unit={unit.unit_number}
                      monthlyRent={unit.monthly_rent}
                      leaseStart={unit.lease_start_date ? new Date(unit.lease_start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                      leaseEnd={unit.lease_end_date ? new Date(unit.lease_end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                      paymentStatus="paid"
                    />
                  ))
              ) : (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No active tenants</p>
                </div>
              )}
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="mt-0">
              <div className="space-y-3">
                <DocumentItem
                  title="Property Title - Unit 4B"
                  date="Nov 15, 2024"
                  size="2.4 MB"
                  type="PDF"
                />
                <DocumentItem
                  title="Property Title - Unit 4C"
                  date="Nov 15, 2024"
                  size="2.3 MB"
                  type="PDF"
                />
                <DocumentItem
                  title="Lease Agreement - Marco Rossi"
                  date="Dec 20, 2024"
                  size="1.8 MB"
                  type="PDF"
                />
                <DocumentItem
                  title="Lease Agreement - Sofia Bianchi"
                  date="Dec 20, 2024"
                  size="1.9 MB"
                  type="PDF"
                />
                <DocumentItem
                  title="Building Insurance Policy"
                  date="Jan 1, 2024"
                  size="3.2 MB"
                  type="PDF"
                />
                <DocumentItem
                  title="Property Tax Receipt 2024"
                  date="Jan 15, 2024"
                  size="0.5 MB"
                  type="PDF"
                />

                <Separator className="my-4" />

                <div className="flex items-center justify-between bg-stag-light/50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="w-5 h-5 text-stag-blue" />
                    <div>
                      <p className="text-sm font-medium text-stag-navy">Property Photos</p>
                      <p className="text-xs text-gray-500">24 images available</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Gallery
                  </Button>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {/* Property Management Contact */}
      <Card className="mt-8 card-premium bg-gradient-to-br from-stag-navy to-stag-navy-light text-white animate-fade-in-up stagger-5">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Property Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-white/90 mb-4">
                Our property management team handles all aspects of your rental properties, from tenant screening to maintenance.
              </p>
              <div className="space-y-2 text-sm">
                <a
                  href="mailto:properties@stagfund.com"
                  className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  properties@stagfund.com
                </a>
                <a
                  href="tel:+390123456789"
                  className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  +39 012 345 6789
                </a>
              </div>
            </div>

            <div className="space-y-3">
              <Button variant="secondary" className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                Schedule Inspection
              </Button>
              <Button variant="secondary" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download All Documents
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}

// Helper Components
function PropertyUnitCard({
  unitNumber,
  floor,
  size,
  bedrooms,
  bathrooms,
  monthlyRent,
  status,
  tenant
}: {
  unitNumber: string
  floor: number
  size: number
  bedrooms: number
  bathrooms: number
  monthlyRent: number
  status: 'rented' | 'available' | 'maintenance'
  tenant?: {
    name: string
    email: string
    phone: string
    leaseStart: string
    leaseEnd: string
  }
}) {
  return (
    <div className="p-6 rounded-xl border border-gray-100 hover:border-stag-blue/30 transition-colors bg-gradient-to-r from-stag-light/30 to-transparent">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-stag-navy">Unit {unitNumber}</h3>
            <Badge className={
              status === 'rented' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' :
              status === 'available' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' :
              'bg-amber-100 text-amber-700 hover:bg-amber-100'
            }>
              {status === 'rented' ? 'RENTED' : status === 'available' ? 'AVAILABLE' : 'MAINTENANCE'}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Floor {floor} • Via Garibaldi 23, Milano
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-stag-navy">€{monthlyRent}</p>
          <p className="text-xs text-gray-500">per month</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Maximize className="w-4 h-4 text-stag-blue" />
          <div>
            <p className="text-xs text-gray-500">Size</p>
            <p className="text-sm font-semibold text-stag-navy">{size} m²</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Bed className="w-4 h-4 text-stag-blue" />
          <div>
            <p className="text-xs text-gray-500">Bedrooms</p>
            <p className="text-sm font-semibold text-stag-navy">{bedrooms}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Bath className="w-4 h-4 text-stag-blue" />
          <div>
            <p className="text-xs text-gray-500">Bathrooms</p>
            <p className="text-sm font-semibold text-stag-navy">{bathrooms}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <div>
            <p className="text-xs text-gray-500">Yield</p>
            <p className="text-sm font-semibold text-emerald-600">4.2%</p>
          </div>
        </div>
      </div>

      {tenant && (
        <>
          <Separator className="my-4" />
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Current Tenant</p>
              <p className="text-sm font-semibold text-stag-navy">{tenant.name}</p>
              <div className="space-y-1 mt-2">
                <a href={`mailto:${tenant.email}`} className="text-xs text-stag-blue hover:underline flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {tenant.email}
                </a>
                <a href={`tel:${tenant.phone}`} className="text-xs text-stag-blue hover:underline flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {tenant.phone}
                </a>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Lease Period</p>
              <div className="space-y-1">
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Start: {tenant.leaseStart}
                </p>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  End: {tenant.leaseEnd}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function TenantCard({
  name,
  email,
  phone,
  unit,
  monthlyRent,
  leaseStart,
  leaseEnd,
  paymentStatus
}: {
  name: string
  email: string
  phone: string
  unit: string
  monthlyRent: number
  leaseStart: string
  leaseEnd: string
  paymentStatus: 'paid' | 'pending' | 'overdue'
}) {
  return (
    <div className="p-5 rounded-xl border border-gray-100 hover:border-stag-blue/30 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-stag-navy to-stag-blue flex items-center justify-center text-white font-bold text-lg">
            {name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="font-bold text-stag-navy">{name}</h3>
            <p className="text-sm text-gray-500">Unit {unit}</p>
            <div className="space-y-1 mt-2">
              <a href={`mailto:${email}`} className="text-xs text-stag-blue hover:underline flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {email}
              </a>
              <a href={`tel:${phone}`} className="text-xs text-stag-blue hover:underline flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {phone}
              </a>
            </div>
          </div>
        </div>
        <Badge className={
          paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' :
          paymentStatus === 'pending' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' :
          'bg-red-100 text-red-700 hover:bg-red-100'
        }>
          {paymentStatus === 'paid' ? 'PAID' : paymentStatus === 'pending' ? 'PENDING' : 'OVERDUE'}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-500">Monthly Rent</p>
          <p className="text-sm font-bold text-stag-navy">€{monthlyRent}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Lease Start</p>
          <p className="text-sm font-semibold text-stag-navy">{leaseStart}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Lease End</p>
          <p className="text-sm font-semibold text-stag-navy">{leaseEnd}</p>
        </div>
      </div>
    </div>
  )
}

function DocumentItem({
  title,
  date,
  size,
  type
}: {
  title: string
  date: string
  size: string
  type: string
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-stag-light/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-stag-light flex items-center justify-center">
          <span className="text-xs font-bold text-stag-blue">{type}</span>
        </div>
        <div>
          <p className="text-sm font-medium text-stag-navy">{title}</p>
          <p className="text-xs text-gray-500">{date} • {size}</p>
        </div>
      </div>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <Download className="w-4 h-4 text-gray-400" />
      </Button>
    </div>
  )
}
