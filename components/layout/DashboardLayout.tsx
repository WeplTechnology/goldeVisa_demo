'use client'

import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface DashboardLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
  isAdmin?: boolean
}

export function DashboardLayout({
  children,
  title,
  subtitle,
  isAdmin = false,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-stag-light/30">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-stag-blue/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-stag-light/50 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 w-96 h-96 bg-stag-blue/3 rounded-full blur-3xl" />
      </div>

      {/* Sidebar */}
      <Sidebar isAdmin={isAdmin} />

      {/* Main Content Area - Fixed margin for sidebar */}
      <div className="ml-[280px] transition-all duration-300 ease-in-out relative">
        {/* Header */}
        <Header title={title} subtitle={subtitle} />

        {/* Page Content */}
        <main className="p-8">
          <div className="max-w-[1440px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
