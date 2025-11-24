'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-navy" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-navy">Investor Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, {user?.email}</p>
          </div>
          <Button onClick={signOut} variant="outline">
            Sign Out
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Investment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary-navy">€250,000</p>
              <p className="text-sm text-muted-foreground mt-1">Total investment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary-navy">2</p>
              <p className="text-sm text-muted-foreground mt-1">Units assigned</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-success">Active</p>
              <p className="text-sm text-muted-foreground mt-1">Golden Visa in progress</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Authentication Test Success! 🎉</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You have successfully logged in as an investor. The authentication system is working correctly.
            </p>
            <div className="mt-4 p-4 bg-primary-light rounded-lg">
              <p className="text-sm font-medium">Next steps:</p>
              <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground space-y-1">
                <li>Dashboard will show your investment overview</li>
                <li>Golden Visa timeline with interactive milestones</li>
                <li>Property portfolio with detailed information</li>
                <li>Document management system</li>
                <li>Reports and analytics</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
