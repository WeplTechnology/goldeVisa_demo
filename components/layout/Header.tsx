'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Bell, User, LogOut, Settings, ChevronDown, Search } from 'lucide-react'
import Link from 'next/link'

interface HeaderProps {
  title?: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  const { user, signOut, isAdmin } = useAuth()

  return (
    <header className="h-[72px] bg-white/80 backdrop-blur-lg border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30">
      {/* Title Section */}
      <div className="flex items-center gap-4">
        <div>
          {title && (
            <h1 className="text-2xl font-bold text-stag-navy tracking-tight">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Search Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-10 h-10 rounded-xl text-gray-400 hover:text-stag-navy hover:bg-stag-light transition-colors"
        >
          <Search className="w-5 h-5" />
        </Button>

        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative w-10 h-10 rounded-xl text-gray-400 hover:text-stag-navy hover:bg-stag-light transition-colors"
        >
          <Bell className="w-5 h-5" />
          {/* Notification badge */}
          <span className="absolute top-2 right-2 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-stag-blue opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-stag-blue"></span>
          </span>
        </Button>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200 mx-2" />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center gap-3 h-auto py-2 px-3 rounded-xl hover:bg-stag-light transition-colors"
            >
              {/* Avatar */}
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-stag-blue to-stag-navy flex items-center justify-center shadow-premium-sm">
                  <span className="text-white font-semibold text-sm">
                    {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                {/* Online indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
              
              {/* User Info */}
              <div className="text-left hidden md:block">
                <p className="text-sm font-semibold text-stag-navy">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                </p>
                <p className="text-xs text-gray-500">
                  {isAdmin() ? 'Administrator' : 'Investor'}
                </p>
              </div>
              
              <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent 
            align="end" 
            className="w-64 p-2 rounded-xl shadow-premium-lg border-gray-100"
          >
            <DropdownMenuLabel className="px-3 py-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-stag-blue to-stag-navy flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-stag-navy">{user?.email?.split('@')[0]}</p>
                  <p className="text-xs text-gray-500 truncate max-w-[150px]">{user?.email}</p>
                </div>
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator className="my-2" />
            
            <DropdownMenuItem asChild>
              <Link
                href={isAdmin() ? '/admin/settings' : '/settings'}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-stag-light transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Settings className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Settings</p>
                  <p className="text-xs text-gray-500">Manage preferences</p>
                </div>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="my-2" />
            
            <DropdownMenuItem 
              onClick={signOut} 
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-red-600 hover:bg-red-50 transition-colors focus:bg-red-50"
            >
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                <LogOut className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Sign out</p>
                <p className="text-xs text-red-500/70">End your session</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
