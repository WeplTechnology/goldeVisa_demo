'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Loader2,
  User,
  Lock,
  Bell,
  Globe,
  Shield,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function AdminSettingsPage() {
  const { user, loading, signOut } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Profile state
  const [fullName, setFullName] = useState('Admin User')
  const [email, setEmail] = useState(user?.email || 'admin@stagfund.com')
  const [phone, setPhone] = useState('+39 06 1234 5678')
  const [role, setRole] = useState('Administrator')

  // Security state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(true)
  const [newInvestorAlerts, setNewInvestorAlerts] = useState(true)
  const [documentAlerts, setDocumentAlerts] = useState(true)
  const [systemAlerts, setSystemAlerts] = useState(true)
  const [weeklyReports, setWeeklyReports] = useState(true)

  // Language & Region
  const [language, setLanguage] = useState('en')
  const [timezone, setTimezone] = useState('Europe/Rome')
  const [currency, setCurrency] = useState('EUR')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stag-light to-white">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-stag-navy to-stag-navy-light flex items-center justify-center shadow-premium-lg">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-stag-blue/20 blur-xl animate-pulse" />
          </div>
          <p className="text-sm text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    setSuccessMessage('')

    // Simular guardado
    setTimeout(() => {
      setIsSaving(false)
      setSuccessMessage('Profile updated successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    }, 1000)
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match')
      return
    }

    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters')
      return
    }

    setIsSaving(true)
    setSuccessMessage('')

    setTimeout(() => {
      setIsSaving(false)
      setSuccessMessage('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setSuccessMessage(''), 3000)
    }, 1000)
  }

  const handleSaveNotifications = async () => {
    setIsSaving(true)
    setSuccessMessage('')

    setTimeout(() => {
      setIsSaving(false)
      setSuccessMessage('Notification preferences saved!')
      setTimeout(() => setSuccessMessage(''), 3000)
    }, 1000)
  }

  return (
    <DashboardLayout
      title="Admin Settings"
      subtitle="Manage your admin account and preferences"
      isAdmin={true}
    >
      {successMessage && (
        <Alert className="mb-6 border-emerald-200 bg-emerald-50 animate-fade-in-up">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <AlertDescription className="text-emerald-800">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-white border border-gray-200 p-1">
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Lock className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <Globe className="w-4 h-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="card-premium animate-fade-in-up">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-lg font-bold text-stag-navy">
                Administrator Information
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Update your admin profile details
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      disabled
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Email cannot be changed. Contact system admin if needed.
                  </p>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10"
                      placeholder="+39 06 1234 5678"
                    />
                  </div>
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={role}
                    disabled
                  />
                  <p className="text-xs text-gray-500">
                    Role is assigned by system administrator
                  </p>
                </div>

                <Separator />

                <Button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-stag-navy to-stag-blue hover:from-stag-blue hover:to-stag-navy"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="card-premium animate-fade-in-up">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-lg font-bold text-stag-navy">
                Change Password
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Update your password to keep your account secure
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Current Password */}
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                  <p className="text-xs text-gray-500">
                    Must be at least 8 characters with letters and numbers
                  </p>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>

                <Separator />

                <Button
                  onClick={handleChangePassword}
                  disabled={isSaving || !currentPassword || !newPassword || !confirmPassword}
                  className="bg-gradient-to-r from-stag-navy to-stag-blue hover:from-stag-blue hover:to-stag-navy"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium animate-fade-in-up stagger-1">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-lg font-bold text-stag-navy flex items-center gap-2">
                <Shield className="w-5 h-5 text-stag-blue" />
                Two-Factor Authentication
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Add an extra layer of security to your admin account
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-stag-navy">Enable 2FA</p>
                  <p className="text-sm text-gray-500">
                    Require a verification code in addition to your password
                  </p>
                </div>
                <Switch disabled />
              </div>
              <Alert className="mt-4 border-blue-200 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-sm text-blue-800">
                  Two-factor authentication will be available soon for admin accounts.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="card-premium animate-fade-in-up">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-lg font-bold text-stag-navy">
                Admin Notification Preferences
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Choose how you want to receive admin updates and alerts
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Email Notifications */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-stag-navy">Email Notifications</p>
                    <p className="text-sm text-gray-500">
                      Receive admin updates via email
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <Separator />

                {/* SMS Notifications */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-stag-navy">SMS Notifications</p>
                    <p className="text-sm text-gray-500">
                      Receive critical alerts via SMS
                    </p>
                  </div>
                  <Switch
                    checked={smsNotifications}
                    onCheckedChange={setSmsNotifications}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <p className="font-semibold text-stag-navy">Alert Types</p>

                  {/* New Investor Alerts */}
                  <div className="flex items-center justify-between pl-4">
                    <div>
                      <p className="font-medium text-stag-navy">New Investor Alerts</p>
                      <p className="text-sm text-gray-500">
                        Get notified when a new investor joins
                      </p>
                    </div>
                    <Switch
                      checked={newInvestorAlerts}
                      onCheckedChange={setNewInvestorAlerts}
                    />
                  </div>

                  {/* Document Alerts */}
                  <div className="flex items-center justify-between pl-4">
                    <div>
                      <p className="font-medium text-stag-navy">Document Alerts</p>
                      <p className="text-sm text-gray-500">
                        Notifications about document submissions and verifications
                      </p>
                    </div>
                    <Switch
                      checked={documentAlerts}
                      onCheckedChange={setDocumentAlerts}
                    />
                  </div>

                  {/* System Alerts */}
                  <div className="flex items-center justify-between pl-4">
                    <div>
                      <p className="font-medium text-stag-navy">System Alerts</p>
                      <p className="text-sm text-gray-500">
                        Important system and security notifications
                      </p>
                    </div>
                    <Switch
                      checked={systemAlerts}
                      onCheckedChange={setSystemAlerts}
                    />
                  </div>

                  {/* Weekly Reports */}
                  <div className="flex items-center justify-between pl-4">
                    <div>
                      <p className="font-medium text-stag-navy">Weekly Reports</p>
                      <p className="text-sm text-gray-500">
                        Receive weekly admin performance and activity reports
                      </p>
                    </div>
                    <Switch
                      checked={weeklyReports}
                      onCheckedChange={setWeeklyReports}
                    />
                  </div>
                </div>

                <Separator />

                <Button
                  onClick={handleSaveNotifications}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-stag-navy to-stag-blue hover:from-stag-blue hover:to-stag-navy"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Preferences'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card className="card-premium animate-fade-in-up">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-lg font-bold text-stag-navy">
                Language & Region
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Customize your language and regional preferences
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Language */}
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stag-blue"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="it">Italiano</option>
                    <option value="pt">Português</option>
                  </select>
                </div>

                {/* Timezone */}
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <select
                    id="timezone"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stag-blue"
                  >
                    <option value="Europe/Rome">Europe/Rome (CET)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                    <option value="America/New_York">America/New York (EST)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>

                {/* Currency */}
                <div className="space-y-2">
                  <Label htmlFor="currency">Display Currency</Label>
                  <select
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stag-blue"
                  >
                    <option value="EUR">EUR (€)</option>
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>

                <Separator />

                <Button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-stag-navy to-stag-blue hover:from-stag-blue hover:to-stag-navy"
                >
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="card-premium border-red-200 animate-fade-in-up stagger-1">
            <CardHeader className="border-b border-red-100 bg-red-50/50">
              <CardTitle className="text-lg font-bold text-red-700">
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-red-200 bg-red-50">
                  <div>
                    <p className="font-medium text-red-900">Sign Out</p>
                    <p className="text-sm text-red-700">
                      Sign out of your admin account on this device
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => signOut()}
                    className="border-red-300 text-red-700 hover:bg-red-100"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
