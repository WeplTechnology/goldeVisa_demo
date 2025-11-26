'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Loader2,
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  Building2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Target,
  Shield,
  DollarSign,
  BarChart3,
  Home
} from 'lucide-react'

interface Investor {
  id: string
  full_name: string
  email: string
  phone: string | null
  nationality: string | null
  investment_amount: number
  status: string
  kyc_status: string
  golden_visa_status: string
  created_at: string
  date_of_birth: string | null
  passport_number: string | null
  address: string | null
  real_estate_amount: number
  rd_amount: number
}

interface PropertyMatch {
  id: string
  name: string
  city: string
  current_value: number
  total_units: number
  status: string
  matchScore: number
  matchReasons: string[]
  images?: string[]
}

interface AIRiskProfile {
  riskLevel: 'conservative' | 'moderate' | 'aggressive'
  score: number
  factors: {
    name: string
    value: string
    impact: 'positive' | 'neutral' | 'negative'
  }[]
  recommendation: string
}

export default function InvestorDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [investor, setInvestor] = useState<Investor | null>(null)
  const [propertyMatches, setPropertyMatches] = useState<PropertyMatch[]>([])
  const [riskProfile, setRiskProfile] = useState<AIRiskProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadInvestorData() {
      if (!user || !params.id) return

      try {
        setLoading(true)

        // TODO: Replace with actual API call
        // For now, using mock data
        const mockInvestor: Investor = {
          id: params.id as string,
          full_name: 'João Silva',
          email: 'joao.silva@email.com',
          phone: '+351 912 345 678',
          nationality: 'Portugal',
          investment_amount: 500000,
          real_estate_amount: 425000,
          rd_amount: 75000,
          status: 'active',
          kyc_status: 'approved',
          golden_visa_status: 'in_progress',
          created_at: '2024-10-15T10:00:00Z',
          date_of_birth: '1985-03-15',
          passport_number: 'PT1234567',
          address: 'Rua Augusta 123, Lisboa, Portugal'
        }

        setInvestor(mockInvestor)

        // Generate AI property matches
        const matches = generatePropertyMatches(mockInvestor)
        setPropertyMatches(matches)

        // Generate AI risk profile
        const profile = generateRiskProfile(mockInvestor)
        setRiskProfile(profile)

      } catch (error) {
        console.error('Error loading investor:', error)
      } finally {
        setLoading(false)
      }
    }

    loadInvestorData()
  }, [user, params.id])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stag-light to-white">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-stag-navy to-stag-navy-light flex items-center justify-center shadow-premium-lg">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-stag-blue/20 blur-xl animate-pulse" />
          </div>
          <p className="text-sm text-gray-500 font-medium">Loading investor details...</p>
        </div>
      </div>
    )
  }

  if (!investor) {
    return (
      <DashboardLayout title="Investor Not Found" subtitle="" isAdmin={true}>
        <Card className="p-8 text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Investor Not Found</h2>
          <p className="text-gray-500 mb-6">The investor you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/admin/investors')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Investors
          </Button>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title={investor.full_name}
      subtitle="Complete investor profile with AI-powered insights"
      isAdmin={true}
    >
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.push('/admin/investors')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Investors
        </Button>
      </div>

      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {/* Total Investment */}
        <Card className="card-premium">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Investment</p>
                <p className="text-2xl font-bold text-stag-navy mt-1">
                  €{investor.investment_amount.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card className="card-premium">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <Badge className="mt-2 bg-emerald-100 text-emerald-700 border-emerald-200">
                  {investor.status.toUpperCase()}
                </Badge>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-stag-blue to-stag-blue-light flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KYC Status */}
        <Card className="card-premium">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">KYC Status</p>
                <Badge className="mt-2 bg-blue-100 text-blue-700 border-blue-200">
                  {investor.kyc_status.toUpperCase()}
                </Badge>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Golden Visa */}
        <Card className="card-premium">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Golden Visa</p>
                <Badge className="mt-2 bg-amber-100 text-amber-700 border-amber-200">
                  {investor.golden_visa_status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-stag-gold to-amber-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white border border-gray-200 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ai-matching">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Property Matching
          </TabsTrigger>
          <TabsTrigger value="risk-profile">
            <Target className="w-4 h-4 mr-2" />
            Risk Profile
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card className="card-premium">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-lg font-bold text-stag-navy flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-stag-navy">{investor.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-stag-navy">{investor.phone || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Nationality</p>
                      <p className="font-medium text-stag-navy">{investor.nationality || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="font-medium text-stag-navy">
                        {investor.date_of_birth ? new Date(investor.date_of_birth).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  {investor.passport_number && (
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Passport Number</p>
                        <p className="font-medium text-stag-navy">{investor.passport_number}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Investment Breakdown */}
            <Card className="card-premium">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-lg font-bold text-stag-navy flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Investment Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-stag-blue" />
                        <span className="text-sm font-medium text-gray-700">Real Estate</span>
                      </div>
                      <span className="font-bold text-stag-navy">
                        €{investor.real_estate_amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-stag-blue to-stag-blue-light rounded-full"
                        style={{ width: `${(investor.real_estate_amount / investor.investment_amount) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {((investor.real_estate_amount / investor.investment_amount) * 100).toFixed(0)}% of total
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-medium text-gray-700">R&D / Innovation</span>
                      </div>
                      <span className="font-bold text-stag-navy">
                        €{investor.rd_amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                        style={{ width: `${(investor.rd_amount / investor.investment_amount) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {((investor.rd_amount / investor.investment_amount) * 100).toFixed(0)}% of total
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">Total Investment</span>
                      <span className="text-xl font-bold text-stag-navy">
                        €{investor.investment_amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Property Matching Tab */}
        <TabsContent value="ai-matching" className="space-y-6">
          <Card className="card-premium border-2 border-stag-blue/20">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-stag-blue/5 to-transparent">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-stag-navy flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-stag-blue" />
                    AI-Powered Property Recommendations
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    Based on investor profile, risk tolerance, and investment goals
                  </p>
                </div>
                <Badge className="bg-stag-blue/10 text-stag-blue border-stag-blue/20">
                  {propertyMatches.length} Matches
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {propertyMatches.map((property, index) => (
                  <PropertyMatchCard key={property.id} property={property} rank={index + 1} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk Profile Tab */}
        <TabsContent value="risk-profile" className="space-y-6">
          {riskProfile && <RiskProfileCard profile={riskProfile} />}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}

// Property Match Card Component
function PropertyMatchCard({ property, rank }: { property: PropertyMatch; rank: number }) {
  const getMatchColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-200'
    if (score >= 70) return 'text-blue-600 bg-blue-50 border-blue-200'
    return 'text-amber-600 bg-amber-50 border-amber-200'
  }

  const getMatchLabel = (score: number) => {
    if (score >= 85) return 'Excellent Match'
    if (score >= 70) return 'Good Match'
    return 'Fair Match'
  }

  return (
    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-white">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          {/* Rank Badge */}
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-stag-navy to-stag-blue flex items-center justify-center">
            <span className="text-white font-bold text-sm">#{rank}</span>
          </div>

          {/* Property Image */}
          {property.images && property.images[0] && (
            <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={property.images[0]}
                alt={property.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Property Info */}
          <div className="flex-1">
            <h3 className="font-bold text-stag-navy text-lg mb-1">{property.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <MapPin className="w-4 h-4" />
              <span>{property.city}</span>
              <span className="text-gray-300">|</span>
              <Building2 className="w-4 h-4" />
              <span>{property.total_units} units</span>
            </div>
            <p className="text-xl font-bold text-stag-navy">
              €{property.current_value.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Match Score */}
        <div className="text-right ml-4">
          <div className={`px-4 py-2 rounded-lg border-2 ${getMatchColor(property.matchScore)}`}>
            <p className="text-3xl font-bold">{property.matchScore}</p>
            <p className="text-xs font-semibold mt-1">{getMatchLabel(property.matchScore)}</p>
          </div>
        </div>
      </div>

      {/* Match Reasons */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-stag-blue" />
          Why this property matches:
        </p>
        <ul className="space-y-1.5">
          {property.matchReasons.map((reason, idx) => (
            <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <Button
          variant="outline"
          className="w-full border-stag-blue text-stag-blue hover:bg-stag-blue hover:text-white"
          onClick={() => window.open(`/admin/properties?highlight=${property.id}`, '_blank')}
        >
          View Property Details
          <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
        </Button>
      </div>
    </div>
  )
}

// Risk Profile Card Component
function RiskProfileCard({ profile }: { profile: AIRiskProfile }) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'conservative':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'moderate':
        return 'text-amber-600 bg-amber-50 border-amber-200'
      case 'aggressive':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      case 'negative':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-300" />
    }
  }

  return (
    <Card className="card-premium border-2 border-stag-gold/20">
      <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-stag-gold/5 to-transparent">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-stag-navy flex items-center gap-2">
              <Target className="w-5 h-5 text-stag-gold" />
              AI Risk Profile Analysis
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Comprehensive assessment based on investment behavior and preferences
            </p>
          </div>
          <div className={`px-4 py-2 rounded-lg border-2 ${getRiskColor(profile.riskLevel)}`}>
            <p className="text-sm font-bold uppercase">{profile.riskLevel}</p>
            <p className="text-xs mt-1">Score: {profile.score}/100</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Risk Factors */}
          <div>
            <h4 className="font-semibold text-stag-navy mb-4">Risk Factors Analysis</h4>
            <div className="space-y-3">
              {profile.factors.map((factor, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    {getImpactIcon(factor.impact)}
                    <div>
                      <p className="font-medium text-gray-900">{factor.name}</p>
                      <p className="text-sm text-gray-600">{factor.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendation */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-stag-blue/5 to-stag-gold/5 border border-stag-blue/20">
            <h4 className="font-semibold text-stag-navy mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-stag-blue" />
              AI Recommendation
            </h4>
            <p className="text-gray-700 leading-relaxed">{profile.recommendation}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Mock data generators
function generatePropertyMatches(investor: Investor): PropertyMatch[] {
  // Mock properties with different match scores
  const mockProperties: PropertyMatch[] = [
    {
      id: '1',
      name: 'Via Garibaldi Residential Complex',
      city: 'Milano',
      current_value: 3500000,
      total_units: 12,
      status: 'available',
      matchScore: 92,
      matchReasons: [
        'Investment amount aligns perfectly with property value',
        'High rental yield potential matches conservative-moderate profile',
        'Milano location aligns with preferred European markets',
        'Multi-unit structure provides good risk diversification',
        'Strong historical appreciation (4.5% annually)'
      ],
      images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&h=800&fit=crop']
    },
    {
      id: '2',
      name: 'Corso Buenos Aires Apartments',
      city: 'Milano',
      current_value: 2800000,
      total_units: 10,
      status: 'available',
      matchScore: 88,
      matchReasons: [
        'Slightly below budget allows capital reserves',
        'Central location near metro and shopping areas',
        'Golden Visa eligible investment',
        'Projected ROI of 22.3% over 5 years',
        'Low vacancy risk in high-demand area'
      ],
      images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop']
    },
    {
      id: '3',
      name: 'Piazza Duomo Heritage Building',
      city: 'Milano',
      current_value: 4200000,
      total_units: 8,
      status: 'available',
      matchScore: 78,
      matchReasons: [
        'Premium historic location with tourism appeal',
        'Requires additional capital but offers prestige',
        'Heritage building with tax incentives',
        'Suitable for luxury short-term rental market'
      ],
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop']
    }
  ]

  return mockProperties
}

function generateRiskProfile(investor: Investor): AIRiskProfile {
  // Generate AI risk profile based on investor data
  const investmentRatio = investor.real_estate_amount / investor.investment_amount

  return {
    riskLevel: investmentRatio > 0.8 ? 'conservative' : 'moderate',
    score: 72,
    factors: [
      {
        name: 'Investment Allocation',
        value: `${(investmentRatio * 100).toFixed(0)}% Real Estate, ${((1 - investmentRatio) * 100).toFixed(0)}% R&D`,
        impact: investmentRatio > 0.7 ? 'positive' : 'neutral'
      },
      {
        name: 'Portfolio Diversification',
        value: 'Real estate focused with innovation exposure',
        impact: 'positive'
      },
      {
        name: 'Geographic Preference',
        value: investor.nationality || 'European markets preferred',
        impact: 'positive'
      },
      {
        name: 'Investment Timeline',
        value: 'Long-term (5+ years) for Golden Visa',
        impact: 'positive'
      },
      {
        name: 'Capital Reserves',
        value: 'Adequate for property maintenance and fees',
        impact: 'positive'
      }
    ],
    recommendation: `Based on the AI analysis, ${investor.full_name} demonstrates a ${investmentRatio > 0.8 ? 'conservative' : 'moderate'} investment profile with strong focus on real estate (${(investmentRatio * 100).toFixed(0)}%). Recommended strategy: Focus on multi-unit residential properties in established markets like Milano with proven rental demand. The investor's Golden Visa timeline aligns well with medium-term property appreciation strategies. Consider properties in the €2.5M-€4M range that offer both capital preservation and steady rental income.`
  }
}
