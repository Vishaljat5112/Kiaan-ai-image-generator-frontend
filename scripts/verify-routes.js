import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { MOCK_MODELS, MOCK_USER, MOCK_PLANS } from '../src/mocks/mockData.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')

console.log('==============================================')
console.log('   KIAAN STUDIO FRONTEND VERIFICATION SUITE   ')
console.log('==============================================\n')

const requiredFiles = [
  'src/App.jsx',
  'src/main.jsx',
  'src/index.css',
  'src/routes/index.jsx',
  'src/layouts/PublicLayout.jsx',
  'src/layouts/CustomerLayout.jsx',
  'src/layouts/AdminLayout.jsx',
  'src/components/ui/Button.jsx',
  'src/components/ui/Card.jsx',
  'src/components/ui/Input.jsx',
  'src/components/ui/Select.jsx',
  'src/components/ui/Badge.jsx',
  'src/components/ui/Modal.jsx',
  'src/components/ui/LoadingSpinner.jsx',
  'src/components/ui/EmptyState.jsx',
  'src/components/ui/ErrorState.jsx',
  'src/components/common/Logo.jsx',
  'src/components/common/RoutePlaceholder.jsx',
  'src/components/navigation/Breadcrumbs.jsx',
  'src/components/navigation/ProfileMenu.jsx',
  'src/components/navigation/megaMenuData.js',
  'src/components/navigation/NavbarMegaMenu.jsx',
  'src/components/landing/HeroSection.jsx',
  'src/components/landing/CreativeShowcaseSection.jsx',
  'src/components/landing/ImageToImageSection.jsx',
  'src/components/landing/HowItWorksSection.jsx',
  'src/components/landing/ImageEditingSection.jsx',
  'src/components/landing/MarketingVisualsSection.jsx',
  'src/components/landing/PricingSection.jsx',
  'src/components/landing/CinematicCtaSection.jsx',
  'src/components/landing/PremiumFooter.jsx',
  // Higgsfield-Inspired Auth Redesign Components
  'src/components/auth/AuthModal.jsx',
  'src/components/auth/AuthLayout.jsx',
  'src/components/auth/AuthImageCarousel.jsx',
  'src/components/auth/AuthForm.jsx',
  'src/components/auth/DemoAccess.jsx',
  // Auth Pages
  'src/pages/auth/LoginPage.jsx',
  'src/pages/auth/AdminLoginPage.jsx',
  'src/pages/auth/RegisterPage.jsx',
  'src/pages/auth/ForgotPasswordPage.jsx',
  // Public Pages
  'src/pages/public/HomePage.jsx',
  'src/pages/public/FeaturesPage.jsx',
  'src/pages/public/PricingPage.jsx',
  'src/pages/public/AboutPage.jsx',
  'src/pages/public/ContactPage.jsx',
  'src/pages/public/PrivacyPage.jsx',
  'src/pages/public/TermsPage.jsx',
  'src/pages/public/NotFoundPage.jsx',
  // Customer Studio Pages
  'src/pages/customer/DashboardOverviewPage.jsx',
  'src/pages/customer/ImageGeneratorPage.jsx',
  'src/pages/customer/VideoGeneratorPage.jsx',
  'src/pages/customer/ImageToImagePage.jsx',
  'src/pages/customer/ImageEditorPage.jsx',
  'src/pages/customer/ImageToVideoPage.jsx',
  'src/pages/customer/GenerationsPage.jsx',
  'src/pages/customer/ProjectsPage.jsx',
  'src/pages/customer/DownloadsPage.jsx',
  'src/pages/customer/CreditsPage.jsx',
  'src/pages/customer/SubscriptionPage.jsx',
  'src/pages/customer/SettingsPage.jsx',
  'src/pages/customer/SupportPage.jsx',
  // Admin Portal Pages
  'src/pages/admin/AdminOverviewPage.jsx',
  'src/pages/admin/AdminUsersPage.jsx',
  'src/pages/admin/AdminPlansPage.jsx',
  'src/pages/admin/AdminCreditsPage.jsx',
  'src/pages/admin/AdminImageJobsPage.jsx',
  'src/pages/admin/AdminVideoJobsPage.jsx',
  'src/pages/admin/AdminModelsPage.jsx',
  'src/pages/admin/AdminGpuPage.jsx',
  'src/pages/admin/AdminQueuePage.jsx',
  'src/pages/admin/AdminRevenuePage.jsx',
  'src/pages/admin/AdminAnalyticsPage.jsx',
  'src/pages/admin/AdminFailedJobsPage.jsx',
  'src/pages/admin/AdminSupportPage.jsx',
  'src/pages/admin/AdminAuditLogsPage.jsx',
  'src/pages/admin/AdminSettingsPage.jsx',
  // Core State & Services
  'src/context/AuthContext.jsx',
  'src/context/authContextInstance.js',
  'src/hooks/useAuth.js',
  'src/hooks/useBreakpoint.js',
  'src/services/api.js'
]

let passed = 0
let failed = 0

for (const relPath of requiredFiles) {
  const fullPath = path.join(root, relPath)
  if (fs.existsSync(fullPath)) {
    const stat = fs.statSync(fullPath)
    if (stat.size > 50) {
      passed++
    } else {
      console.error(`FAIL (Empty file): ${relPath}`)
      failed++
    }
  } else {
    console.error(`FAIL (Missing file): ${relPath}`)
    failed++
  }
}

console.log(`[File Integrity Check]: ${passed}/${requiredFiles.length} files verified intact.`)

// Verify mock fixtures
let mockPassed = true
if (MOCK_MODELS.length !== 4) {
  console.error('FAIL: MOCK_MODELS length mismatch')
  mockPassed = false
}
if (MOCK_PLANS.length !== 4) {
  console.error('FAIL: MOCK_PLANS length mismatch')
  mockPassed = false
}
if (!MOCK_USER.email) {
  console.error('FAIL: MOCK_USER missing email')
  mockPassed = false
}

if (mockPassed) {
  console.log('[Mock Data Check]: MOCK_MODELS, MOCK_PLANS, and MOCK_USER verified.')
}

if (failed === 0 && mockPassed) {
  console.log('\n==============================================')
  console.log(`  SUCCESS: ALL ${passed} COMPONENT & ROUTE CHECKS OK `)
  console.log('==============================================\n')
  process.exit(0)
} else {
  console.error(`\nFAILED with ${failed} missing/corrupt components.`)
  process.exit(1)
}
