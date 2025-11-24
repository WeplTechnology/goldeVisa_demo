'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GoldenVisaTimeline } from '@/components/ui/golden-visa-timeline'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Loader2,
  Calendar,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  ExternalLink,
  Info,
  Mail,
  Phone
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useEffect, useState } from 'react'
import {
  getInvestorData,
  getGoldenVisaMilestones,
  type InvestorData,
  type GoldenVisaMilestone
} from '@/lib/actions/investor-actions'

export default function GoldenVisaPage() {
  const { user, loading } = useAuth()
  const [investorData, setInvestorData] = useState<InvestorData | null>(null)
  const [milestones, setMilestones] = useState<GoldenVisaMilestone[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  // Load investor data
  useEffect(() => {
    async function loadData() {
      if (!user) return

      try {
        setDataLoading(true)
        const [investor, milestonesData] = await Promise.all([
          getInvestorData(),
          getGoldenVisaMilestones()
        ])

        setInvestorData(investor)
        setMilestones(milestonesData)
      } catch (error) {
        console.error('Error loading golden visa data:', error)
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

  // Calculate derived data
  const visaStatusDisplay = investorData?.golden_visa_status === 'in_progress' ? 'Active' :
    investorData?.golden_visa_status === 'pending' ? 'Pending' :
    investorData?.golden_visa_status || 'Unknown'

  const visaStartDate = investorData?.visa_start_date ? new Date(investorData.visa_start_date) : null
  const visaExpectedCompletion = investorData?.visa_expected_completion ? new Date(investorData.visa_expected_completion) : null

  const yearsIntoProgram = visaStartDate
    ? Math.floor((Date.now() - visaStartDate.getTime()) / (1000 * 60 * 60 * 24 * 365)) + 1
    : 1

  const completionDate = visaExpectedCompletion
    ? visaExpectedCompletion.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'TBD'

  const yearsRemaining = visaExpectedCompletion
    ? Math.max(0, Math.ceil((visaExpectedCompletion.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 365)))
    : 5

  // Find next milestone
  const nextMilestone = milestones.find(m => m.status === 'in_progress' || m.status === 'pending')
  const daysToNextMilestone = nextMilestone?.due_date
    ? Math.max(0, Math.ceil((new Date(nextMilestone.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null

  return (
    <DashboardLayout
      title="Golden Visa Journey"
      subtitle="Track your path to Italian residency"
    >
      {/* Status Overview */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="card-premium animate-fade-in-up">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Visa Status</p>
                <p className="text-2xl font-bold text-stag-navy mt-1">
                  {dataLoading ? '...' : visaStatusDisplay}
                </p>
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Year {yearsIntoProgram} of 5
                </p>
              </div>
              <div className="icon-container-success">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium animate-fade-in-up stagger-1">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expected Completion</p>
                <p className="text-2xl font-bold text-stag-navy mt-1">
                  {dataLoading ? '...' : completionDate}
                </p>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  ~{yearsRemaining} years remaining
                </p>
              </div>
              <div className="icon-container-primary">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium animate-fade-in-up stagger-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Next Milestone</p>
                <p className="text-2xl font-bold text-stag-navy mt-1">
                  {dataLoading ? '...' : daysToNextMilestone !== null ? `${daysToNextMilestone} days` : 'N/A'}
                </p>
                <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {nextMilestone?.title || 'Document review'}
                </p>
              </div>
              <div className="icon-container-warning">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Alert */}
      <Alert className="mb-8 border-amber-200 bg-amber-50 animate-fade-in-up stagger-3">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-sm text-amber-800">
          <strong className="font-semibold">Action Required:</strong> Please submit your latest utility bill
          and proof of residence by December 9, 2024 to avoid delays in processing.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Timeline - 2 columns */}
        <Card className="lg:col-span-2 card-premium animate-fade-in-up stagger-4">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-bold text-stag-navy">
              Process Timeline
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Your complete journey to Italian citizenship
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <GoldenVisaTimeline milestones={milestones} />
          </CardContent>
        </Card>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Required Documents */}
          <Card className="card-premium animate-fade-in-up stagger-5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-stag-navy flex items-center gap-2">
                <FileText className="w-5 h-5 text-stag-blue" />
                Required Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <DocumentItem
                title="Passport Copy"
                status="approved"
                date="Uploaded Nov 15"
              />
              <DocumentItem
                title="Proof of Investment"
                status="approved"
                date="Uploaded Nov 15"
              />
              <DocumentItem
                title="Criminal Record"
                status="approved"
                date="Uploaded Nov 22"
              />
              <DocumentItem
                title="Utility Bill"
                status="pending"
                date="Due Dec 9"
              />
              <DocumentItem
                title="Proof of Residence"
                status="pending"
                date="Due Dec 9"
              />

              <Separator className="my-3" />

              <Button
                variant="outline"
                className="w-full border-stag-blue text-stag-blue hover:bg-stag-light"
              >
                <FileText className="w-4 h-4 mr-2" />
                Upload Documents
              </Button>
            </CardContent>
          </Card>

          {/* Important Dates */}
          <Card className="card-premium animate-fade-in-up stagger-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-stag-navy flex items-center gap-2">
                <Calendar className="w-5 h-5 text-stag-blue" />
                Important Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <DateItem
                date="Dec 9, 2024"
                title="Document submission deadline"
                status="upcoming"
              />
              <DateItem
                date="Dec 20, 2024"
                title="Property rental income"
                status="upcoming"
              />
              <DateItem
                date="Jan 15, 2025"
                title="Q4 2024 Investment report"
                status="upcoming"
              />
              <DateItem
                date="Jun 2025"
                title="Mid-year review meeting"
                status="future"
              />
              <DateItem
                date="Nov 2029"
                title="Citizenship eligibility"
                status="future"
              />
            </CardContent>
          </Card>

          {/* Support Card */}
          <Card className="card-premium bg-gradient-to-br from-stag-navy to-stag-navy-light text-white animate-fade-in-up stagger-7">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Info className="w-5 h-5" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-white/90">
                Our team is here to assist you with your Golden Visa process.
              </p>
              <div className="space-y-2 text-sm">
                <a
                  href="mailto:support@stagfund.com"
                  className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  support@stagfund.com
                </a>
                <a
                  href="tel:+390123456789"
                  className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  +39 012 345 6789
                </a>
              </div>
              <Button
                variant="secondary"
                className="w-full mt-3"
              >
                Contact Account Manager
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Information Section */}
      <Card className="mt-8 card-premium animate-fade-in-up stagger-8">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-lg font-bold text-stag-navy">
            About the Golden Visa Program
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-stag-navy mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Program Requirements
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-stag-blue mt-1">•</span>
                  <span>Minimum investment of €250,000 in Italian companies or government bonds</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-stag-blue mt-1">•</span>
                  <span>Investment must be maintained for at least 2 years</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-stag-blue mt-1">•</span>
                  <span>Clean criminal record required</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-stag-blue mt-1">•</span>
                  <span>Proof of sufficient financial resources</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-stag-navy mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Benefits
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-stag-blue mt-1">•</span>
                  <span>2-year residence permit, renewable</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-stag-blue mt-1">•</span>
                  <span>Path to permanent residency after 5 years</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-stag-blue mt-1">•</span>
                  <span>Eligibility for Italian citizenship after 10 years</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-stag-blue mt-1">•</span>
                  <span>Visa-free travel within Schengen Area</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-stag-blue mt-1">•</span>
                  <span>Right to work and study in Italy and EU</span>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              For more information about the Italian Golden Visa program
            </p>
            <Button variant="outline" className="gap-2">
              <ExternalLink className="w-4 h-4" />
              Official Guidelines
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}

// Helper Components
function DocumentItem({
  title,
  status,
  date
}: {
  title: string
  status: 'approved' | 'pending' | 'rejected'
  date: string
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-stag-light/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          status === 'approved' ? 'bg-emerald-100' :
          status === 'pending' ? 'bg-amber-100' :
          'bg-red-100'
        }`}>
          {status === 'approved' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : status === 'pending' ? (
            <Clock className="w-4 h-4 text-amber-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-stag-navy">{title}</p>
          <p className="text-xs text-gray-500">{date}</p>
        </div>
      </div>
      {status === 'approved' && (
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Download className="w-4 h-4 text-gray-400" />
        </Button>
      )}
    </div>
  )
}

function DateItem({
  date,
  title,
  status
}: {
  date: string
  title: string
  status: 'upcoming' | 'future'
}) {
  return (
    <div className={`p-3 rounded-lg border ${
      status === 'upcoming'
        ? 'border-amber-200 bg-amber-50/50'
        : 'border-gray-100 bg-gray-50/50'
    }`}>
      <div className="flex items-start gap-3">
        <Calendar className={`w-4 h-4 mt-0.5 ${
          status === 'upcoming' ? 'text-amber-600' : 'text-gray-400'
        }`} />
        <div>
          <p className={`text-sm font-semibold ${
            status === 'upcoming' ? 'text-amber-900' : 'text-gray-700'
          }`}>
            {date}
          </p>
          <p className="text-xs text-gray-600 mt-0.5">{title}</p>
        </div>
      </div>
    </div>
  )
}
