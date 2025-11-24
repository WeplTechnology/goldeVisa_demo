'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Shield } from 'lucide-react'

export default function AdminDashboardPage() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-navy">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-blue rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary-navy">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">Welcome, {user?.email}</p>
            </div>
          </div>
          <Button onClick={signOut} variant="outline">
            Sign Out
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Investors</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary-navy">1</p>
              <p className="text-sm text-muted-foreground mt-1">Active investors</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary-navy">2</p>
              <p className="text-sm text-muted-foreground mt-1">Total properties</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Capital Raised</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-success">€1.75M</p>
              <p className="text-sm text-muted-foreground mt-1">of €2M target</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary-navy">0</p>
              <p className="text-sm text-muted-foreground mt-1">Pending verification</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Admin Authentication Success! 🎉</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You have successfully logged in as an administrator. The admin authentication system is working correctly.
            </p>
            <div className="mt-4 p-4 bg-primary-light rounded-lg">
              <p className="text-sm font-medium">Admin Features:</p>
              <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground space-y-1">
                <li>Investor management (CRUD operations)</li>
                <li>Property and unit assignment</li>
                <li>Document verification system</li>
                <li>Golden Visa milestone tracking</li>
                <li>Reports generation</li>
                <li>Internal messaging system</li>
                <li>Analytics and insights</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
