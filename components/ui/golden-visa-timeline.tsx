'use client'

import { cn } from '@/lib/utils'
import { Check, Circle, Clock, FileText, Building2, Plane, Award } from 'lucide-react'

interface Milestone {
  id: string
  title: string
  description: string
  status: 'completed' | 'current' | 'pending'
  date?: string
  icon: React.ComponentType<{ className?: string }>
}

const milestones: Milestone[] = [
  {
    id: '1',
    title: 'Investment Completed',
    description: '€250,000 transferred successfully',
    status: 'completed',
    date: 'Nov 15, 2024',
    icon: Check,
  },
  {
    id: '2',
    title: 'KYC Verification',
    description: 'Identity verified by compliance team',
    status: 'completed',
    date: 'Nov 22, 2024',
    icon: FileText,
  },
  {
    id: '3',
    title: 'Property Assignment',
    description: '2 units assigned to your portfolio',
    status: 'completed',
    date: 'Dec 01, 2024',
    icon: Building2,
  },
  {
    id: '4',
    title: 'Document Review',
    description: 'Expected completion: 15 days',
    status: 'current',
    icon: Clock,
  },
  {
    id: '5',
    title: 'Visa Application',
    description: 'Submit residence permit application',
    status: 'pending',
    icon: Plane,
  },
  {
    id: '6',
    title: 'Golden Visa Approval',
    description: 'Italian residency granted',
    status: 'pending',
    icon: Award,
  },
]

export function GoldenVisaTimeline() {
  const completedCount = milestones.filter(m => m.status === 'completed').length
  const progress = (completedCount / milestones.length) * 100

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Overall Progress</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {completedCount} of {milestones.length} steps completed
          </p>
        </div>
        <span className="text-2xl font-bold text-stag-navy">{Math.round(progress)}%</span>
      </div>

      {/* Progress Bar */}
      <div className="progress-premium">
        <div 
          className="progress-premium-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Timeline */}
      <div className="space-y-0 mt-6">
        {milestones.map((milestone, index) => {
          const Icon = milestone.icon
          const isLast = index === milestones.length - 1
          
          return (
            <div key={milestone.id} className="relative flex gap-4">
              {/* Vertical Line */}
              {!isLast && (
                <div 
                  className={cn(
                    'absolute left-[19px] top-10 w-0.5 h-full -bottom-0',
                    milestone.status === 'completed' ? 'bg-emerald-200' : 'bg-gray-200'
                  )}
                />
              )}

              {/* Icon */}
              <div className={cn(
                'relative z-10 flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0',
                milestone.status === 'completed' && 'bg-emerald-100',
                milestone.status === 'current' && 'bg-stag-light',
                milestone.status === 'pending' && 'bg-gray-100'
              )}>
                {milestone.status === 'completed' ? (
                  <Check className="w-5 h-5 text-emerald-600" />
                ) : milestone.status === 'current' ? (
                  <div className="relative">
                    <Icon className="w-5 h-5 text-stag-blue" />
                    <div className="absolute inset-0 animate-ping">
                      <Icon className="w-5 h-5 text-stag-blue opacity-30" />
                    </div>
                  </div>
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
              </div>

              {/* Content */}
              <div className={cn(
                'flex-1 pb-6 pt-1',
                milestone.status === 'pending' && 'opacity-50'
              )}>
                <div className="flex items-center gap-2">
                  <h4 className={cn(
                    'font-semibold',
                    milestone.status === 'current' ? 'text-stag-navy' : 'text-gray-900'
                  )}>
                    {milestone.title}
                  </h4>
                  {milestone.status === 'current' && (
                    <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-stag-blue text-white">
                      IN PROGRESS
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{milestone.description}</p>
                {milestone.date && (
                  <p className="text-xs text-gray-400 mt-1">{milestone.date}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
