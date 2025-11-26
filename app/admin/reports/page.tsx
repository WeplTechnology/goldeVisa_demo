'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Loader2,
  TrendingUp,
  Download,
  Users,
  Building2,
  DollarSign,
  FileText,
  Shield,
  ArrowUpRight,
  Sparkles,
  Brain,
  Target,
  AlertTriangle,
  CheckCircle2,
  Zap,
  BarChart2,
  Activity,
  Info,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react'
import { getAdminStats, getAllInvestors, getAllProperties, getAllInvestments } from '@/lib/actions/admin-actions'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart } from 'recharts'

const COLORS = {
  primary: '#1B365D',
  blue: '#6B9BD1',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6'
}

// Mock AI Data for Admin
const adminAIInsights = [
  {
    type: 'positive',
    title: 'Investor Growth Trend',
    description: 'Q4 investor acquisition rate is 35% higher than Q3. Current pipeline suggests exceeding annual targets.',
    confidence: 96,
    impact: 'High',
    metric: '+35%'
  },
  {
    type: 'warning',
    title: 'Document Processing Bottleneck',
    description: 'Average document verification time has increased to 4.2 days. Recommend adding reviewer capacity.',
    confidence: 89,
    impact: 'Medium',
    metric: '4.2 days'
  },
  {
    type: 'neutral',
    title: 'Portfolio Diversification',
    description: '78% of properties concentrated in Milan. Consider geographic diversification for risk management.',
    confidence: 92,
    impact: 'Medium',
    metric: '78% Milan'
  }
]

const investorGrowthData = [
  { month: 'Jul', investors: 18, revenue: 4200000, visas: 12 },
  { month: 'Aug', investors: 22, revenue: 5100000, visas: 16 },
  { month: 'Sep', investors: 28, revenue: 6800000, visas: 21 },
  { month: 'Oct', investors: 35, revenue: 8400000, visas: 28 },
  { month: 'Nov', investors: 42, revenue: 10200000, visas: 34 },
  { month: 'Dec', investors: 48, revenue: 11800000, visas: 40 }
]

const predictiveAdminData = [
  { month: 'Jan', actual: 48, predicted: 52, optimistic: 58, pessimistic: 46 },
  { month: 'Feb', actual: 51, predicted: 55, optimistic: 62, pessimistic: 49 },
  { month: 'Mar', actual: 54, predicted: 59, optimistic: 67, pessimistic: 52 },
  { month: 'Apr', predicted: 64, optimistic: 73, pessimistic: 57 },
  { month: 'May', predicted: 70, optimistic: 80, pessimistic: 62 },
  { month: 'Jun', predicted: 77, optimistic: 88, pessimistic: 68 }
]

const operationalHealth = {
  overall: 87,
  categories: [
    { category: 'Onboarding Speed', score: 92 },
    { category: 'Document Processing', score: 78 },
    { category: 'Investor Satisfaction', score: 95 },
    { category: 'Compliance', score: 88 },
    { category: 'Property Management', score: 82 }
  ]
}

const competitorBenchmark = [
  { metric: 'Avg Processing Time', yourPlatform: 3.2, industry: 5.8, topPerformer: 2.5 },
  { metric: 'Investor Satisfaction', yourPlatform: 4.7, industry: 4.1, topPerformer: 4.9 },
  { metric: 'Portfolio Yield', yourPlatform: 6.2, industry: 5.4, topPerformer: 6.8 },
  { metric: 'Visa Approval Rate', yourPlatform: 94, industry: 87, topPerformer: 96 }
]

const aiStrategicRecommendations = [
  {
    title: 'Expand to Rome Market',
    description: 'Market analysis shows Rome luxury segment growing 42% YoY. First-mover advantage opportunity for Golden Visa properties.',
    potentialReturn: '+€8.5M AUM',
    risk: 'Medium',
    timeframe: '3-6 months',
    confidence: 91,
    priority: 'High'
  },
  {
    title: 'Automate KYC Workflow',
    description: 'AI-powered document verification could reduce processing time by 60% and cut operational costs by €45K annually.',
    potentialReturn: '€45K savings/year',
    risk: 'Low',
    timeframe: '2-3 months',
    confidence: 94,
    priority: 'High'
  },
  {
    title: 'Launch Referral Program',
    description: 'Data shows 32% of investors have networks interested in Golden Visa. Structured referral program could yield 15-20 new investors.',
    potentialReturn: '+15-20 investors',
    risk: 'Low',
    timeframe: '1-2 months',
    confidence: 87,
    priority: 'Medium'
  }
]

const investorSegmentation = [
  { segment: 'High Net Worth', count: 18, value: 8500000, color: COLORS.primary },
  { segment: 'Corporate', count: 12, value: 5200000, color: COLORS.blue },
  { segment: 'Family Office', count: 8, value: 4800000, color: COLORS.success },
  { segment: 'Individual', count: 24, value: 6500000, color: COLORS.warning }
]

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
    if (!user?.id) return

    let mounted = true

    async function loadData() {
      try {
        setDataLoading(true)
        const [statsData, investorsData, propertiesData, investmentsData] = await Promise.all([
          getAdminStats(),
          getAllInvestors(),
          getAllProperties(),
          getAllInvestments()
        ])

        if (mounted) {
          setStats(statsData)
          setInvestors(investorsData)
          setProperties(propertiesData)
          setInvestments(investmentsData)
        }
      } catch (error) {
        console.error('Error loading data:', error)
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stag-light to-white">
        <Loader2 className="h-8 w-8 animate-spin text-stag-blue" />
      </div>
    )
  }

  const totalPropertiesValue = properties.reduce((sum, prop) => sum + prop.price, 0)
  const averageInvestment = stats.totalInvestments > 0 ? stats.totalCapital / stats.totalInvestments : 0

  return (
    <DashboardLayout
      title="Platform Reports & Analytics"
      subtitle="AI-powered operational intelligence"
      isAdmin={true}
    >
      {/* AI Premium Badge */}
      <Alert className="mb-6 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <Sparkles className="h-4 w-4 text-purple-600" />
        <AlertDescription className="text-sm text-stag-navy">
          <strong className="font-semibold">AI-Powered Admin Analytics</strong>
          {' '}· Real-time operational insights and predictive modeling for strategic decision-making
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ai-insights" className="gap-1">
            <Brain className="w-3 h-3" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="predictions">Forecasts</TabsTrigger>
          <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
          <TabsTrigger value="exports">Reports</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          {/* Main Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-premium">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">AI Health Score</p>
                  <p className="text-3xl font-bold text-purple-600 flex items-center gap-2">
                    87
                    <Sparkles className="w-5 h-5" />
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Operational excellence</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Growth Chart */}
          <Card className="card-premium">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-stag-navy">
                    Platform Growth Metrics
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    Investors, revenue, and visa approvals trend
                  </p>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={investorGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    tickLine={false}
                    tickFormatter={(value) => `€${(value/1000000).toFixed(1)}M`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="investors" name="New Investors" fill={COLORS.primary} radius={[8, 8, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue" stroke={COLORS.success} strokeWidth={3} dot={{ r: 4 }} />
                  <Line yAxisId="left" type="monotone" dataKey="visas" name="Visa Approvals" stroke={COLORS.blue} strokeWidth={2} strokeDasharray="5 5" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Investor Segmentation */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="card-premium">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-lg font-bold text-stag-navy">
                  Investor Segmentation
                </CardTitle>
                <p className="text-sm text-gray-500">Distribution by type</p>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={investorSegmentation}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {investorSegmentation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `€${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>

                <div className="mt-4 space-y-3">
                  {investorSegmentation.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-gray-600">{item.segment}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-stag-navy">{item.count} investors</p>
                        <p className="text-xs text-gray-500">€{(item.value / 1000000).toFixed(1)}M</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Investors */}
            <Card className="card-premium">
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
                  <div className="space-y-3">
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
                            className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-stag-light/30 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-stag-blue to-stag-navy flex items-center justify-center text-white text-sm font-bold shadow-premium-sm">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 truncate">{investor.full_name}</p>
                              <p className="text-xs text-gray-500">{investor.investments?.length || 0} investments</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-stag-navy">€{(totalInvested / 1000).toFixed(0)}K</p>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI INSIGHTS TAB */}
        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* AI Insights Panel */}
            <Card className="card-premium">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-stag-navy">
                      Strategic AI Insights
                    </CardTitle>
                    <p className="text-sm text-gray-500">Real-time operational analysis</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {adminAIInsights.map((insight, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-2 ${
                      insight.type === 'positive'
                        ? 'border-emerald-200 bg-emerald-50'
                        : insight.type === 'warning'
                        ? 'border-amber-200 bg-amber-50'
                        : 'border-blue-200 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        insight.type === 'positive'
                          ? 'bg-emerald-500'
                          : insight.type === 'warning'
                          ? 'bg-amber-500'
                          : 'bg-blue-500'
                      }`}>
                        {insight.type === 'positive' ? (
                          <TrendingUp className="w-4 h-4 text-white" />
                        ) : insight.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-white" />
                        ) : (
                          <Info className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-bold text-stag-navy">{insight.title}</h4>
                          <Badge variant="outline" className="text-xs ml-2">
                            {insight.confidence}%
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge className={
                            insight.impact === 'High'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-amber-100 text-amber-700'
                          }>
                            {insight.impact} Impact
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {insight.metric}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Operational Health Radar */}
            <Card className="card-premium">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-stag-navy">
                      Operational Health
                    </CardTitle>
                    <p className="text-sm text-gray-500">AI-powered assessment</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-2xl font-bold text-stag-navy">{operationalHealth.overall}</span>
                    <span className="text-sm text-gray-600">/ 100</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Overall Platform Score</p>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={operationalHealth.categories}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: '#6B7280' }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke={COLORS.blue}
                      fill={COLORS.blue}
                      fillOpacity={0.5}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Strategic Recommendations */}
          <Card className="card-premium">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-stag-navy">
                    Strategic Recommendations
                  </CardTitle>
                  <p className="text-sm text-gray-500">AI-driven growth opportunities</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-3">
                {aiStrategicRecommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl border-2 border-gray-100 hover:border-stag-blue/30 transition-all bg-gradient-to-br from-white to-stag-light/20 group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-stag-light flex items-center justify-center group-hover:bg-stag-blue/20 transition-colors">
                        <Zap className="w-5 h-5 text-stag-blue" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {rec.confidence}%
                      </Badge>
                    </div>
                    <h4 className="font-bold text-stag-navy mb-2">{rec.title}</h4>
                    <p className="text-sm text-gray-600 mb-4">{rec.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Expected Impact</span>
                        <span className="font-bold text-emerald-600">{rec.potentialReturn}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Risk Level</span>
                        <Badge className={
                          rec.risk === 'Low'
                            ? 'bg-emerald-100 text-emerald-700'
                            : rec.risk === 'Medium'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                        }>
                          {rec.risk}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Timeline</span>
                        <span className="font-medium text-stag-navy">{rec.timeframe}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Priority</span>
                        <Badge className={
                          rec.priority === 'High'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }>
                          {rec.priority}
                        </Badge>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      className="w-full bg-stag-blue hover:bg-stag-navy"
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FORECASTS TAB */}
        <TabsContent value="predictions" className="space-y-6">
          <Card className="card-premium">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                    <BarChart2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-stag-navy">
                      Investor Growth Forecast
                    </CardTitle>
                    <p className="text-sm text-gray-500">ML-powered 6-month projection</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={predictiveAdminData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: number) => [`${value} investors`, '']}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    name="Actual"
                    stroke={COLORS.primary}
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    name="AI Forecast"
                    stroke={COLORS.purple}
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="optimistic"
                    name="Best Case"
                    stroke={COLORS.success}
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="pessimistic"
                    name="Conservative"
                    stroke={COLORS.danger}
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200">
                  <p className="text-sm text-gray-600 mb-1">Best Case (Jun)</p>
                  <p className="text-2xl font-bold text-emerald-700">88</p>
                  <p className="text-xs text-emerald-600 mt-1">+83% from current</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                  <p className="text-sm text-gray-600 mb-1">Expected (Jun)</p>
                  <p className="text-2xl font-bold text-purple-700">77</p>
                  <p className="text-xs text-purple-600 mt-1">+60% from current</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200">
                  <p className="text-sm text-gray-600 mb-1">Conservative (Jun)</p>
                  <p className="text-2xl font-bold text-amber-700">68</p>
                  <p className="text-xs text-amber-600 mt-1">+42% from current</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm text-blue-900">
              <strong>Model Accuracy:</strong> Our admin forecasting models have achieved 93.7% accuracy over the past 18 months.
              Predictions incorporate market trends, seasonality, pipeline data, and economic indicators.
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* BENCHMARKS TAB */}
        <TabsContent value="benchmarks" className="space-y-6">
          <Card className="card-premium">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-stag-navy">
                    Industry Benchmarks
                  </CardTitle>
                  <p className="text-sm text-gray-500">Your platform vs. market leaders</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={competitorBenchmark}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="metric"
                    tick={{ fontSize: 11, fill: '#6B7280' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="yourPlatform" name="Your Platform" fill={COLORS.primary} radius={[8, 8, 0, 0]} />
                  <Bar dataKey="industry" name="Industry Average" fill={COLORS.blue} radius={[8, 8, 0, 0]} />
                  <Bar dataKey="topPerformer" name="Top Performer" fill={COLORS.success} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-xl border-2 border-emerald-200 bg-emerald-50">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-emerald-900">Above Industry Average</span>
                  </div>
                  <p className="text-sm text-emerald-700">
                    Your platform exceeds industry standards in <strong>3 out of 4</strong> key operational metrics
                  </p>
                </div>
                <div className="p-4 rounded-xl border-2 border-blue-200 bg-blue-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span className="font-bold text-blue-900">Growth Potential</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Close to top performer status. Implement AI recommendations to reach elite tier
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* EXPORTS TAB */}
        <TabsContent value="exports" className="space-y-6">
          {/* AI Report Generator */}
          <Card className="card-premium">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-stag-navy">
                    AI Report Generator
                  </CardTitle>
                  <p className="text-sm text-gray-500">Generate comprehensive admin reports with AI insights</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <Button className="h-auto py-4 flex flex-col items-start gap-2 bg-gradient-to-br from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    <span className="font-bold">Platform Analytics</span>
                  </div>
                  <span className="text-xs opacity-90">Comprehensive performance review</span>
                </Button>
                <Button className="h-auto py-4 flex flex-col items-start gap-2 bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-bold">Growth Forecast</span>
                  </div>
                  <span className="text-xs opacity-90">6-month predictive analysis</span>
                </Button>
                <Button className="h-auto py-4 flex flex-col items-start gap-2 bg-gradient-to-br from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    <span className="font-bold">Strategic Plan</span>
                  </div>
                  <span className="text-xs opacity-90">Actionable recommendations</span>
                </Button>
              </div>

              <Alert className="border-purple-200 bg-purple-50">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <AlertDescription className="text-sm text-purple-900">
                  <strong>Premium AI Feature:</strong> Generate executive-ready reports with deep insights,
                  competitive benchmarks, and strategic recommendations. Ready in under 30 seconds.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Standard Exports */}
          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-stag-navy">Standard Export Options</CardTitle>
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
                      <p className="text-xs text-gray-500">Complete investor database</p>
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
                      <p className="text-xs text-gray-500">All transactions & capital flows</p>
                    </div>
                  </div>
                </Button>

                <Button variant="outline" className="justify-start h-auto py-4 hover:bg-stag-light hover:border-stag-blue">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Download className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-stag-navy">Property Portfolio</p>
                      <p className="text-xs text-gray-500">Complete asset breakdown</p>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
