import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'

// Layouts
import { PublicLayout } from '../layouts/PublicLayout'
import { CustomerLayout } from '../layouts/CustomerLayout'
import { AdminLayout } from '../layouts/AdminLayout'

// Public Marketing Pages
import { HomePage } from '../pages/public/HomePage'
import { FeaturesPage } from '../pages/public/FeaturesPage'
import { PricingPage } from '../pages/public/PricingPage'
import { AboutPage } from '../pages/public/AboutPage'
import { ContactPage } from '../pages/public/ContactPage'
import { PrivacyPage } from '../pages/public/PrivacyPage'
import { TermsPage } from '../pages/public/TermsPage'
import { NotFoundPage } from '../pages/public/NotFoundPage'

// Compact Auth Modal Component & Standalone Pages
import { AuthModal } from '../components/auth/AuthModal'
import { LoginPage } from '../pages/auth/LoginPage'
import { AdminLoginPage } from '../pages/auth/AdminLoginPage'
import { RegisterPage } from '../pages/auth/RegisterPage'
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage'

// Customer Studio Pages
import { DashboardOverviewPage } from '../pages/customer/DashboardOverviewPage'
import { ImageGeneratorPage } from '../pages/customer/ImageGeneratorPage'
import { VideoGeneratorPage } from '../pages/customer/VideoGeneratorPage'
import { ImageToImagePage } from '../pages/customer/ImageToImagePage'
import { ImageEditorPage } from '../pages/customer/ImageEditorPage'
import { ImageToVideoPage } from '../pages/customer/ImageToVideoPage'
import { GenerationsPage } from '../pages/customer/GenerationsPage'
import { ProjectsPage } from '../pages/customer/ProjectsPage'
import { DownloadsPage } from '../pages/customer/DownloadsPage'
import { CreditsPage } from '../pages/customer/CreditsPage'
import { SubscriptionPage } from '../pages/customer/SubscriptionPage'
import { SettingsPage } from '../pages/customer/SettingsPage'
import { SupportPage } from '../pages/customer/SupportPage'

// Admin Portal Pages
import { AdminOverviewPage } from '../pages/admin/AdminOverviewPage'
import { AdminUsersPage } from '../pages/admin/AdminUsersPage'
import { AdminPlansPage } from '../pages/admin/AdminPlansPage'
import { AdminCreditsPage } from '../pages/admin/AdminCreditsPage'
import { AdminImageJobsPage } from '../pages/admin/AdminImageJobsPage'
import { AdminVideoJobsPage } from '../pages/admin/AdminVideoJobsPage'
import { AdminModelsPage } from '../pages/admin/AdminModelsPage'
import { AdminGpuPage } from '../pages/admin/AdminGpuPage'
import { AdminQueuePage } from '../pages/admin/AdminQueuePage'
import { AdminRevenuePage } from '../pages/admin/AdminRevenuePage'
import { AdminAnalyticsPage } from '../pages/admin/AdminAnalyticsPage'
import { AdminFailedJobsPage } from '../pages/admin/AdminFailedJobsPage'
import { AdminSupportPage } from '../pages/admin/AdminSupportPage'
import { AdminAuditLogsPage } from '../pages/admin/AdminAuditLogsPage'
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage'

export function AppRoutes() {
  const location = useLocation()

  // Identify whether the current route is an authentication modal route
  const isAuthModalRoute = [
    '/login',
    '/admin-login',
    '/register',
    '/forgot-password'
  ].includes(location.pathname)

  // Use background location if available, otherwise default to public landing page ('/')
  // This ensures refreshing or directly navigating to /login renders over the landing page
  const backgroundLocation = isAuthModalRoute
    ? (location.state?.background || { pathname: '/' })
    : null

  // The base route tree evaluates against backgroundLocation (if auth modal is active) or the actual location
  const actualLocation = backgroundLocation || location

  return (
    <>
      <Routes location={actualLocation}>
        {/* 1. Public Marketing & Information Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />

          {/* Standalone Route Fallbacks for Non-modal Environments */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* 404 Catch-All Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* 2. Customer Studio Routes */}
        <Route path="/dashboard" element={<CustomerLayout />}>
          <Route index element={<DashboardOverviewPage />} />
          <Route path="image-generator" element={<ImageGeneratorPage />} />
          <Route path="video-generator" element={<VideoGeneratorPage />} />
          <Route path="image-to-image" element={<ImageToImagePage />} />
          <Route path="image-editor" element={<ImageEditorPage />} />
          <Route path="image-to-video" element={<ImageToVideoPage />} />
          <Route path="generations" element={<GenerationsPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="downloads" element={<DownloadsPage />} />
          <Route path="credits" element={<CreditsPage />} />
          <Route path="subscription" element={<SubscriptionPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="support" element={<SupportPage />} />
        </Route>

        {/* 3. Admin Portal Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverviewPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="plans" element={<AdminPlansPage />} />
          <Route path="credits" element={<AdminCreditsPage />} />
          <Route path="image-jobs" element={<AdminImageJobsPage />} />
          <Route path="video-jobs" element={<AdminVideoJobsPage />} />
          <Route path="models" element={<AdminModelsPage />} />
          <Route path="gpu" element={<AdminGpuPage />} />
          <Route path="queue" element={<AdminQueuePage />} />
          <Route path="revenue" element={<AdminRevenuePage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="failed-jobs" element={<AdminFailedJobsPage />} />
          <Route path="support" element={<AdminSupportPage />} />
          <Route path="audit-logs" element={<AdminAuditLogsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Routes>

      {/* Render the compact authentication modal over the background route */}
      {isAuthModalRoute && (
        <AuthModal
          initialMode={
            location.pathname === '/register'
              ? 'signup'
              : location.pathname === '/forgot-password'
                ? 'forgot-password'
                : 'login'
          }
          initialRole={location.pathname === '/admin-login' ? 'admin' : 'customer'}
        />
      )}
    </>
  )
}

export default AppRoutes
