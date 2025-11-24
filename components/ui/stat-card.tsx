'use client'

import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: string
    positive?: boolean
  }
  variant?: 'default' | 'primary' | 'success' | 'warning'
  className?: string
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}: StatCardProps) {
  const variants = {
    default: {
      card: 'bg-white border border-gray-100 hover:border-gray-200',
      iconBg: 'bg-stag-light',
      iconColor: 'text-stag-blue',
      titleColor: 'text-gray-600',
      valueColor: 'text-stag-navy',
      subtitleColor: 'text-gray-500',
    },
    primary: {
      card: 'bg-gradient-to-br from-stag-navy to-stag-navy-light border-0 text-white',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
      titleColor: 'text-white/80',
      valueColor: 'text-white',
      subtitleColor: 'text-white/70',
    },
    success: {
      card: 'bg-gradient-to-br from-emerald-50 to-white border border-emerald-100',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      titleColor: 'text-gray-600',
      valueColor: 'text-emerald-600',
      subtitleColor: 'text-gray-500',
    },
    warning: {
      card: 'bg-gradient-to-br from-amber-50 to-white border border-amber-100',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      titleColor: 'text-gray-600',
      valueColor: 'text-stag-navy',
      subtitleColor: 'text-gray-500',
    },
  }

  const v = variants[variant]

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1',
        v.card,
        variant === 'default' 
          ? 'shadow-premium-sm hover:shadow-premium-md' 
          : 'shadow-premium-md hover:shadow-premium-lg',
        className
      )}
    >
      {/* Background decoration for primary variant */}
      {variant === 'primary' && (
        <>
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
        </>
      )}

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <p className={cn('text-sm font-medium', v.titleColor)}>
            {title}
          </p>
          <div className={cn(
            'flex items-center justify-center w-11 h-11 rounded-xl transition-transform duration-200 hover:scale-105',
            v.iconBg
          )}>
            <Icon className={cn('w-5 h-5', v.iconColor)} />
          </div>
        </div>

        {/* Value */}
        <div className={cn(
          'text-4xl font-bold tracking-tight mb-1 stat-number',
          v.valueColor
        )}>
          {value}
        </div>

        {/* Subtitle & Trend */}
        <div className="flex items-center gap-2">
          {subtitle && (
            <p className={cn('text-sm', v.subtitleColor)}>
              {subtitle}
            </p>
          )}
          {trend && (
            <span className={cn(
              'inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full',
              trend.positive 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-red-100 text-red-700'
            )}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
