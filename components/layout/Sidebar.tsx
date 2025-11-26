'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Building2,
  FileText,
  TrendingUp,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  Users,
  Shield,
  Sparkles,
  Bot,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

interface SidebarProps {
  isAdmin?: boolean
}

export function Sidebar({ isAdmin = false }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const investorNavItems: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Golden Visa', href: '/golden-visa', icon: Shield },
    { label: 'Properties', href: '/properties', icon: Building2 },
    { label: 'Documents', href: '/documents', icon: FileText },
    { label: 'Reports', href: '/reports', icon: TrendingUp },
    { label: 'Messages', href: '/messages', icon: MessageSquare, badge: '3' },
    { label: 'Settings', href: '/settings', icon: Settings },
  ]

  const adminNavItems: NavItem[] = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Investors', href: '/admin/investors', icon: Users },
    { label: 'Golden Visa', href: '/admin/golden-visa', icon: Shield },
    { label: 'Properties', href: '/admin/properties', icon: Building2 },
    { label: 'Documents', href: '/admin/documents', icon: FileText },
    { label: 'Reports', href: '/admin/reports', icon: TrendingUp },
    { label: 'Messages', href: '/admin/messages', icon: MessageSquare },
    { label: 'AI Assistant', href: '/admin/ai-assistant', icon: Bot },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  const navItems = isAdmin ? adminNavItems : investorNavItems

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen z-40 flex flex-col transition-all duration-300 ease-in-out',
        collapsed ? 'w-20' : 'w-[280px]'
      )}
      style={{
        background: 'linear-gradient(180deg, #1B365D 0%, #152a4a 100%)',
      }}
    >
      {/* Decorative gradient overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top left, rgba(107, 155, 209, 0.15) 0%, transparent 50%)',
        }}
      />

      {/* Logo Section */}
      <div className={cn(
        'relative h-[72px] flex items-center border-b border-white/10',
        collapsed ? 'justify-center px-4' : 'justify-between px-6'
      )}>
        <Link
          href={isAdmin ? '/admin/dashboard' : '/dashboard'}
          className="flex items-center gap-3 group"
        >
          {/* Logo Mark */}
          <div className="relative">
            <div className={cn(
              'flex items-center justify-center rounded-xl bg-gradient-to-br from-stag-blue to-stag-blue-light transition-transform duration-300 group-hover:scale-105',
              collapsed ? 'w-10 h-10' : 'w-11 h-11'
            )}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-xl bg-stag-blue/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Logo Text */}
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-lg text-white tracking-tight">STAG</span>
              <span className="text-[11px] text-white/50 font-medium tracking-wide">GOLDEN VISA</span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item, index) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200',
                collapsed && 'justify-center',
                isActive 
                  ? 'bg-white/15 text-white' 
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              )}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
              title={collapsed ? item.label : undefined}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-stag-blue shadow-glow-blue" />
              )}
              
              {/* Icon with background on active */}
              <div className={cn(
                'flex items-center justify-center rounded-lg transition-all duration-200',
                isActive && 'bg-stag-blue/20',
                collapsed ? 'w-10 h-10' : 'w-9 h-9'
              )}>
                <Icon className={cn(
                  'transition-transform duration-200 group-hover:scale-110',
                  collapsed ? 'w-5 h-5' : 'w-[18px] h-[18px]'
                )} />
              </div>
              
              {!collapsed && (
                <>
                  <span className="font-medium text-sm flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold rounded-full bg-stag-blue text-white">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              
              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-3 py-1.5 bg-stag-navy rounded-lg text-white text-sm font-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-premium-lg z-50">
                  {item.label}
                  {item.badge && (
                    <span className="ml-2 px-1.5 py-0.5 text-[10px] rounded-full bg-stag-blue">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="relative p-3 border-t border-white/10">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200',
            'text-white/50 hover:text-white hover:bg-white/10',
            collapsed && 'justify-center'
          )}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5">
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </div>
          {!collapsed && (
            <span className="font-medium text-sm">Collapse</span>
          )}
        </button>
      </div>
    </aside>
  )
}
