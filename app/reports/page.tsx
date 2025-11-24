'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  ArrowDownRight
} from 'lucide-react'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Mock data
const monthlyReturnsData = [
  { month: 'Jul 2024', returns: 850, projected: 850 },
  { month: 'Aug 2024', returns: 1200, projected: 1200 },
  { month: 'Sep 2024', returns: 1650, projected: 1650 },
  { month: 'Oct 2024', returns: 2100, projected: 2100 },
  { month: 'Nov 2024', returns: 2550, projected: 2550 },
  { month: 'Dec 2024', returns: 3270, projected: 3400 },
  { month: 'Jan 2025', returns: 0, projected: 4250 },
  { month: 'Feb 2025', returns: 0, projected: 5100 },
]

const portfolioBreakdown = [
  { name: 'Real Estate', value: 212500, percentage: 85 },
  { name: 'R&D Investment', value: 37500, percentage: 15 }
]

const propertyPerformance = [
  { property: 'Unit 4B', rent: 850, yield: 4.1, occupancy: 100 },
  { property: 'Unit 4C', rent: 870, yield: 4.3, occupancy: 100 }
]

const COLORS = {
  primary: '#1B365D',
  blue: '#6B9BD1',
  success: '#10B981',
  warning: '#F59E0B'
}

export default function ReportsPage() {
  const { user, loading } = useAuth()

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
      subtitle="Track your investment performance"
    >
      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card className="card-premium animate-fade-in-up">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">YTD Returns</p>
                <p className="text-2xl font-bold text-stag-navy mt-1">€3,270</p>
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  +15.2% vs projected
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
                <p className="text-2xl font-bold text-stag-navy mt-1">€1,720</p>
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
                <p className="text-2xl font-bold text-stag-navy mt-1">4.2%</p>
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  Above target
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
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-stag-navy mt-1">€253.2k</p>
                <p className="text-xs text-gray-500 mt-1">+1.3% appreciation</p>
              </div>
              <div className="icon-container-primary">
                <PieChartIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
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
      <Card className="card-premium mb-8 animate-fade-in-up stagger-6">
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
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
              100% OCCUPIED
            </Badge>
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
                {propertyPerformance.map((prop, index) => (
                  <tr key={index} className="border-b border-gray-50 hover:bg-stag-light/30 transition-colors">
                    <td className="py-4 px-4">
                      <p className="font-semibold text-stag-navy">{prop.property}</p>
                      <p className="text-xs text-gray-500">Via Garibaldi 23, Milano</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-stag-navy">€{prop.rent}</p>
                      <p className="text-xs text-gray-500">per month</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-emerald-600">{prop.yield}%</p>
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
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                        RENTED
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Downloadable Reports */}
      <Card className="card-premium animate-fade-in-up stagger-7">
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
