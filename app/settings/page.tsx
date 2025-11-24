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

export default function SettingsPage() {
  const { user, loading, signOut } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Profile state
  const [fullName, setFullName] = useState('Zhang Wei')
  const [email, setEmail] = useState(user?.email || 'zhang.wei@email.com')
  const [phone, setPhone] = useState('+86 138 0000 0000')
  const [nationality, setNationality] = useState('China')

  // Security state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [documentAlerts, setDocumentAlerts] = useState(true)
  const [visaUpdates, setVisaUpdates] = useState(true)
  const [monthlyReports, setMonthlyReports] = useState(true)

  // Language & Region
  const [language, setLanguage] = useState('en')
  const [timezone, setTimezone] = useState('Asia/Shanghai')
  const [currency, setCurrency] = useState('EUR')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-stag-blue" />
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
      title="Settings"
      subtitle="Manage your account preferences"
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
                Personal Information
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Update your personal details and contact information
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
                    Email cannot be changed. Contact support if needed.
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
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>

                {/* Nationality */}
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input
                    id="nationality"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    disabled
                  />
                  <p className="text-xs text-gray-500">
                    Nationality is set during registration and cannot be changed.
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
                Add an extra layer of security to your account
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
                  Two-factor authentication will be available soon. Contact support for early access.
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
                Notification Preferences
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Choose how you want to receive updates
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Email Notifications */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-stag-navy">Email Notifications</p>
                    <p className="text-sm text-gray-500">
                      Receive updates via email
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
                      Receive important alerts via SMS
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

                  {/* Document Alerts */}
                  <div className="flex items-center justify-between pl-4">
                    <div>
                      <p className="font-medium text-stag-navy">Document Alerts</p>
                      <p className="text-sm text-gray-500">
                        Get notified about document verification and requirements
                      </p>
                    </div>
                    <Switch
                      checked={documentAlerts}
                      onCheckedChange={setDocumentAlerts}
                    />
                  </div>

                  {/* Visa Updates */}
                  <div className="flex items-center justify-between pl-4">
                    <div>
                      <p className="font-medium text-stag-navy">Golden Visa Updates</p>
                      <p className="text-sm text-gray-500">
                        Important updates about your visa process
                      </p>
                    </div>
                    <Switch
                      checked={visaUpdates}
                      onCheckedChange={setVisaUpdates}
                    />
                  </div>

                  {/* Monthly Reports */}
                  <div className="flex items-center justify-between pl-4">
                    <div>
                      <p className="font-medium text-stag-navy">Monthly Reports</p>
                      <p className="text-sm text-gray-500">
                        Receive monthly investment performance reports
                      </p>
                    </div>
                    <Switch
                      checked={monthlyReports}
                      onCheckedChange={setMonthlyReports}
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
                    <option value="zh">中文</option>
                  </select>
                  <p className="text-xs text-gray-500">
                    Multilingual support coming soon
                  </p>
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
                    <option value="Asia/Shanghai">Asia/Shanghai (CST)</option>
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
                    <option value="CNY">CNY (¥)</option>
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
                      Sign out of your account on this device
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

                <div className="flex items-center justify-between p-4 rounded-lg border border-red-200 bg-red-50">
                  <div>
                    <p className="font-medium text-red-900">Delete Account</p>
                    <p className="text-sm text-red-700">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    disabled
                    className="border-red-300 text-red-700"
                  >
                    Delete Account
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  To delete your account, please contact support at{' '}
                  <a href="mailto:support@stagfund.com" className="text-stag-blue hover:underline">
                    support@stagfund.com
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
