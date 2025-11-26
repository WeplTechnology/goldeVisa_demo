'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Loader2,
  Download,
  TrendingUp,
  Euro,
  Calendar,
  FileText,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Brain,
  Target,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Zap,
  BarChart2,
  Activity,
  DollarSign,
  Info
} from 'lucide-react'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { useEffect, useState } from 'react'
import {
  getPortfolioSummary,
  getMonthlyReturnsData,
  getPropertyPerformance,
  getInvestorData
} from '@/lib/actions/investor-actions'

const COLORS = {
  primary: '#1B365D',
  blue: '#6B9BD1',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6'
}

// Mock AI Data
const aiInsights = [
  {
    type: 'positive',
    title: 'Market Opportunity Detected',
    description: 'Property #2 in Milan Centro is showing 23% higher demand than Q3. Consider leveraging this trend.',
    confidence: 94,
    impact: 'High'
  },
  {
    type: 'warning',
    title: 'Maintenance Alert',
    description: 'Property #1 maintenance costs are 15% above average. Recommend preventive inspection.',
    confidence: 87,
    impact: 'Medium'
  },
  {
    type: 'neutral',
    title: 'Tax Optimization',
    description: 'Based on your portfolio structure, you may benefit from Italian tax deductions. Consult your advisor.',
    confidence: 91,
    impact: 'Medium'
  }
]

const predictiveData = [
  { month: 'Jan', actual: 2400, predicted: 2500, optimistic: 2700, pessimistic: 2300 },
  { month: 'Feb', actual: 2600, predicted: 2650, optimistic: 2850, pessimistic: 2450 },
  { month: 'Mar', actual: 2550, predicted: 2700, optimistic: 2900, pessimistic: 2500 },
  { month: 'Apr', predicted: 2800, optimistic: 3100, pessimistic: 2600 },
  { month: 'May', predicted: 2900, optimistic: 3200, pessimistic: 2700 },
  { month: 'Jun', predicted: 3000, optimistic: 3300, pessimistic: 2800 }
]

const marketSentiment = {
  overall: 78,
  categories: [
    { category: 'Demand', score: 85 },
    { category: 'Price Growth', score: 72 },
    { category: 'Investment Climate', score: 80 },
    { category: 'Regulation', score: 68 },
    { category: 'Tourism', score: 88 }
  ]
}

const benchmarkData = [
  { metric: 'Annual Yield', yourPortfolio: 6.2, marketAvg: 5.1, topQuartile: 7.5 },
  { metric: 'Occupancy Rate', yourPortfolio: 98, marketAvg: 87, topQuartile: 95 },
  { metric: 'Property Appreciation', yourPortfolio: 4.5, marketAvg: 3.8, topQuartile: 5.2 },
  { metric: 'Rental Growth', yourPortfolio: 3.2, marketAvg: 2.5, topQuartile: 4.0 }
]

const aiRecommendations = [
  {
    title: 'Diversify into Florence Market',
    description: 'AI models predict 18% growth in Florence luxury rentals. Your current Milan focus could benefit from geographic diversification.',
    potentialReturn: '+€4,200/year',
    risk: 'Medium',
    timeframe: '6-12 months',
    confidence: 89
  },
  {
    title: 'Optimize Rental Pricing',
    description: 'Dynamic pricing analysis suggests Property #2 could increase rates by 8% based on demand patterns.',
    potentialReturn: '+€1,850/year',
    risk: 'Low',
    timeframe: 'Immediate',
    confidence: 92
  },
  {
    title: 'Green Investment Upgrade',
    description: 'Energy efficiency upgrades could qualify for Italian tax credits (65%) and increase property value by 12%.',
    potentialReturn: '+€15,000 value',
    risk: 'Low',
    timeframe: '3-6 months',
    confidence: 85
  }
]

export default function ReportsPage() {
  const { user, loading } = useAuth()
  const [portfolioData, setPortfolioData] = useState<any>(null)
  const [monthlyReturnsData, setMonthlyReturnsData] = useState<any[]>([])
  const [portfolioBreakdown, setPortfolioBreakdown] = useState<any[]>([])
  const [propertyPerformance, setPropertyPerformance] = useState<any[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  // Load reports data
  useEffect(() => {
    if (!user?.id) return

    let mounted = true

    async function loadData() {
      try {
        setDataLoading(true)
        const [portfolio, returns, performance, investor] = await Promise.all([
          getPortfolioSummary(),
          getMonthlyReturnsData(),
          getPropertyPerformance(),
          getInvestorData()
        ])

        if (mounted) {
          setPortfolioData(portfolio)
          setMonthlyReturnsData(returns)
          setPropertyPerformance(performance)

          // Build portfolio breakdown from real data
          if (investor) {
            setPortfolioBreakdown([
              {
                name: 'Real Estate',
                value: investor.real_estate_amount,
                percentage: Math.round((investor.real_estate_amount / investor.investment_amount) * 100)
              },
              {
                name: 'R&D Investment',
                value: investor.rd_amount,
                percentage: Math.round((investor.rd_amount / investor.investment_amount) * 100)
              }
            ])
          }
        }
      } catch (error) {
        console.error('Error loading reports data:', error)
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
      title="Reports & Analytics"
      subtitle="AI-powered investment intelligence"
    >
      {/* AI Premium Badge */}
      <Alert className="mb-6 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <Sparkles className="h-4 w-4 text-purple-600" />
        <AlertDescription className="text-sm text-stag-navy">
          <strong className="font-semibold">AI-Powered Analytics Active</strong>
          {' '}· Using machine learning to analyze your portfolio and market trends in real-time
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ai-insights" className="gap-1">
            <Brain className="w-3 h-3" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="card-premium animate-fade-in-up">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">YTD Returns</p>
                    <p className="text-2xl font-bold text-stag-navy mt-1">
                      {dataLoading ? '...' : `€${portfolioData?.cumulativeReturns?.toLocaleString() || '0'}`}
                    </p>
                    <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3" />
                      Cumulative returns
                    </p>
                  </div>
                  <div className="icon-container-success">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-premium animate-fade-in-up stagger-1">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Monthly</p>
                    <p className="text-2xl font-bold text-stag-navy mt-1">
                      {dataLoading ? '...' : `€${portfolioData?.monthlyRent?.toLocaleString() || '0'}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Rental income</p>
                  </div>
                  <div className="icon-container-primary">
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
                    <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3" />
                      On investment
                    </p>
                  </div>
                  <div className="icon-container-default">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-premium animate-fade-in-up stagger-3">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">AI Score</p>
                    <p className="text-2xl font-bold text-purple-600 mt-1 flex items-center gap-2">
                      94
                      <Sparkles className="w-5 h-5" />
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Portfolio health</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-premium">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Cumulative Returns Chart */}
            <Card className="lg:col-span-2 card-premium animate-fade-in-up stagger-4">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold text-stag-navy">
                      Cumulative Returns
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      Actual vs Projected rental income
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyReturnsData}>
                    <defs>
                      <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.2}/>
                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                      tickLine={false}
                      tickFormatter={(value) => `€${(value/1000).toFixed(1)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      formatter={(value: number) => [`€${value}`, '']}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="returns"
                      name="Actual Returns"
                      stroke={COLORS.blue}
                      strokeWidth={2}
                      fill="url(#colorReturns)"
                    />
                    <Area
                      type="monotone"
                      dataKey="projected"
                      name="Projected"
                      stroke={COLORS.primary}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      fill="url(#colorProjected)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Portfolio Breakdown */}
            <Card className="card-premium animate-fade-in-up stagger-5">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-lg font-bold text-stag-navy">
                  Portfolio Allocation
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={portfolioBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {portfolioBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? COLORS.primary : COLORS.blue} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `€${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>

                <div className="mt-6 space-y-3">
                  {portfolioBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: index === 0 ? COLORS.primary : COLORS.blue }}
                        />
                        <span className="text-sm text-gray-600">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-stag-navy">€{item.value.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{item.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Property Performance */}
          <Card className="card-premium animate-fade-in-up stagger-6">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-stag-navy">
                    Property Performance
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    Individual unit metrics and returns
                  </p>
                </div>
                {dataLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-stag-blue" />
                ) : (
                  <Badge className={
                    propertyPerformance.length > 0 && propertyPerformance.every(p => p.occupancy === 100)
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                      : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                  }>
                    {propertyPerformance.length > 0 && propertyPerformance.every(p => p.occupancy === 100)
                      ? '100% OCCUPIED'
                      : `${Math.round(propertyPerformance.reduce((acc, p) => acc + p.occupancy, 0) / propertyPerformance.length)}% OCCUPIED`
                    }
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Property</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Monthly Rent</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Annual Yield</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Occupancy</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataLoading ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center">
                          <Loader2 className="h-6 w-6 animate-spin text-stag-blue mx-auto" />
                        </td>
                      </tr>
                    ) : propertyPerformance.length > 0 ? (
                      propertyPerformance.map((prop, index) => (
                        <tr key={index} className="border-b border-gray-50 hover:bg-stag-light/30 transition-colors">
                          <td className="py-4 px-4">
                            <p className="font-semibold text-stag-navy">{prop.property}</p>
                            <p className="text-xs text-gray-500">{prop.address}</p>
                          </td>
                          <td className="py-4 px-4">
                            <p className="font-bold text-stag-navy">€{prop.rent?.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">per month</p>
                          </td>
                          <td className="py-4 px-4">
                            <p className="font-semibold text-emerald-600">{prop.yield?.toFixed(1)}%</p>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-full max-w-[100px] h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-emerald-500 rounded-full"
                                  style={{ width: `${prop.occupancy}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-600">{prop.occupancy}%</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge className={
                              prop.status === 'rented'
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                : prop.status === 'available'
                                ? "bg-gray-100 text-gray-700 hover:bg-gray-100"
                                : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                            }>
                              {prop.status?.toUpperCase() || 'N/A'}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-sm text-gray-500">
                          No properties assigned yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
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
                      AI-Powered Insights
                    </CardTitle>
                    <p className="text-sm text-gray-500">Real-time analysis</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {aiInsights.map((insight, index) => (
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
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
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
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-stag-navy">{insight.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {insight.confidence}% confidence
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge className={
                            insight.impact === 'High'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-amber-100 text-amber-700'
                          }>
                            {insight.impact} Impact
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Market Sentiment Radar */}
            <Card className="card-premium">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-stag-navy">
                      Market Sentiment Analysis
                    </CardTitle>
                    <p className="text-sm text-gray-500">AI-analyzed trends</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-2xl font-bold text-stag-navy">{marketSentiment.overall}</span>
                    <span className="text-sm text-gray-600">/ 100</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Overall Market Score</p>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={marketSentiment.categories}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="category" tick={{ fontSize: 12, fill: '#6B7280' }} />
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

          {/* AI Recommendations */}
          <Card className="card-premium">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-stag-navy">
                    AI Investment Recommendations
                  </CardTitle>
                  <p className="text-sm text-gray-500">Personalized strategies for your portfolio</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-3">
                {aiRecommendations.map((rec, index) => (
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
                        <span className="text-gray-500">Potential Return</span>
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
                        <span className="text-gray-500">Timeframe</span>
                        <span className="font-medium text-stag-navy">{rec.timeframe}</span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      className="w-full bg-stag-blue hover:bg-stag-navy"
                    >
                      Learn More
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PREDICTIONS TAB */}
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
                      Predictive Analytics
                    </CardTitle>
                    <p className="text-sm text-gray-500">ML-powered 6-month forecast</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export Forecast
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={predictiveData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    tickLine={false}
                    tickFormatter={(value) => `€${(value/1000).toFixed(1)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: number) => [`€${value}`, '']}
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
                    name="AI Prediction"
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
                    name="Worst Case"
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
                  <p className="text-2xl font-bold text-emerald-700">€3,300</p>
                  <p className="text-xs text-emerald-600 mt-1">+37% from current</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                  <p className="text-sm text-gray-600 mb-1">Expected (Jun)</p>
                  <p className="text-2xl font-bold text-purple-700">€3,000</p>
                  <p className="text-xs text-purple-600 mt-1">+25% from current</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200">
                  <p className="text-sm text-gray-600 mb-1">Worst Case (Jun)</p>
                  <p className="text-2xl font-bold text-amber-700">€2,800</p>
                  <p className="text-xs text-amber-600 mt-1">+16% from current</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm text-blue-900">
              <strong>Model Accuracy:</strong> Our ML models have achieved 91.2% accuracy over the past 24 months.
              Predictions are updated daily based on market data, seasonal trends, and economic indicators.
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
                    Market Benchmarks Comparison
                  </CardTitle>
                  <p className="text-sm text-gray-500">Your performance vs. market averages</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={benchmarkData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="metric"
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
                  />
                  <Legend />
                  <Bar dataKey="yourPortfolio" name="Your Portfolio" fill={COLORS.primary} radius={[8, 8, 0, 0]} />
                  <Bar dataKey="marketAvg" name="Market Average" fill={COLORS.blue} radius={[8, 8, 0, 0]} />
                  <Bar dataKey="topQuartile" name="Top 25%" fill={COLORS.success} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-xl border-2 border-emerald-200 bg-emerald-50">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-emerald-900">Outperforming</span>
                  </div>
                  <p className="text-sm text-emerald-700">
                    Your portfolio beats market average in <strong>3 out of 4</strong> key metrics
                  </p>
                </div>
                <div className="p-4 rounded-xl border-2 border-blue-200 bg-blue-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span className="font-bold text-blue-900">Top Quartile Potential</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Close to top 25% performance. Follow AI recommendations to reach elite tier
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* REPORTS TAB */}
        <TabsContent value="reports" className="space-y-6">
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
                  <p className="text-sm text-gray-500">Generate custom reports with AI analysis</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <Button className="h-auto py-4 flex flex-col items-start gap-2 bg-gradient-to-br from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    <span className="font-bold">AI Portfolio Analysis</span>
                  </div>
                  <span className="text-xs opacity-90">Deep dive into performance</span>
                </Button>
                <Button className="h-auto py-4 flex flex-col items-start gap-2 bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-bold">Market Insights Report</span>
                  </div>
                  <span className="text-xs opacity-90">Trends and opportunities</span>
                </Button>
                <Button className="h-auto py-4 flex flex-col items-start gap-2 bg-gradient-to-br from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    <span className="font-bold">Tax Optimization</span>
                  </div>
                  <span className="text-xs opacity-90">Maximize deductions</span>
                </Button>
              </div>

              <Alert className="border-purple-200 bg-purple-50">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <AlertDescription className="text-sm text-purple-900">
                  <strong>Premium Feature:</strong> AI-generated reports include personalized insights,
                  predictive analytics, and actionable recommendations. Reports are ready in under 30 seconds.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Downloadable Reports */}
          <Card className="card-premium">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-lg font-bold text-stag-navy">
                Available Reports
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Download detailed financial reports
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <ReportCard
                  title="Q4 2024 Investment Report"
                  description="Comprehensive quarterly performance analysis"
                  date="Dec 31, 2024"
                  size="2.4 MB"
                />
                <ReportCard
                  title="Annual Tax Summary 2024"
                  description="Tax documentation for Italian authorities"
                  date="Jan 15, 2025"
                  size="1.8 MB"
                />
                <ReportCard
                  title="Property Valuation Report"
                  description="Current market value assessment"
                  date="Nov 30, 2024"
                  size="3.2 MB"
                />
                <ReportCard
                  title="Rental Income Statement"
                  description="Detailed breakdown of rental revenues"
                  date="Dec 1, 2024"
                  size="0.9 MB"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}

// Helper Component
function ReportCard({ title, description, date, size }: { title: string; description: string; date: string; size: string }) {
  return (
    <div className="p-4 rounded-xl border border-gray-100 hover:border-stag-blue/30 transition-colors bg-gradient-to-r from-stag-light/20 to-transparent group cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-stag-light flex items-center justify-center group-hover:bg-stag-blue/20 transition-colors">
            <FileText className="w-5 h-5 text-stag-blue" />
          </div>
          <div>
            <h4 className="font-semibold text-stag-navy group-hover:text-stag-blue transition-colors">
              {title}
            </h4>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {date}
        </span>
        <span>{size}</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="w-full mt-3 border-stag-blue text-stag-blue hover:bg-stag-light"
      >
        <Download className="w-4 h-4 mr-2" />
        Download PDF
      </Button>
    </div>
  )
}
