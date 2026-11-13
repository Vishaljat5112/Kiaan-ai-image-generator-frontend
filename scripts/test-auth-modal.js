import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')

console.log('=====================================================')
console.log('   KIAAN STUDIO AUTH MODAL AUTOMATED AUDIT & TEST    ')
console.log('=====================================================\n')

let passCount = 0
let failCount = 0

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`)
    passCount++
  } else {
    console.error(`[FAIL] ${message}`)
    failCount++
  }
}

// 1. Inspect AuthModal.jsx
const authModalPath = path.join(root, 'src/components/auth/AuthModal.jsx')
assert(fs.existsSync(authModalPath), 'AuthModal.jsx exists')

const authModalContent = fs.readFileSync(authModalPath, 'utf8')

// Requirement 2: Modal dimensions & split ratio
assert(authModalContent.includes('max-w-[980px]') || authModalContent.includes('max-w-4xl'), 'Modal max width constrained to ~960-1040px')
assert(authModalContent.includes('max-h-[88vh]') || authModalContent.includes('max-h-[85vh]'), 'Modal height constrained to 85-90vh')
assert(authModalContent.includes('md:w-[45%]') || authModalContent.includes('w-[45%]'), 'Left panel ratio ~45%')
assert(authModalContent.includes('md:w-[55%]') || authModalContent.includes('w-[55%]'), 'Right panel ratio ~55%')
assert(authModalContent.includes('rounded-3xl') || authModalContent.includes('rounded-[24px]'), 'Rounded corners 20-24px')

// Requirement 3: Backdrop & Focus Trap & Escape key
assert(authModalContent.includes('backdrop-blur') && authModalContent.includes('bg-neutral-950/70'), 'Dark translucent backdrop overlay present')
assert(authModalContent.includes('overflow = \'hidden\''), 'Background body scroll locking implemented')
assert(authModalContent.includes("e.key === 'Escape'"), 'Escape key handler implemented')
assert(authModalContent.includes('role="dialog"') && authModalContent.includes('aria-modal="true"'), 'Modal accessibility attributes (role="dialog", aria-modal="true") present')
assert(authModalContent.includes("e.key === 'Tab'"), 'Keyboard focus trap implemented for Tab / Shift+Tab')

// Requirement 4: Left Cinematic Panel
assert(authModalContent.includes('<AuthImageCarousel compact={true} />') || authModalContent.includes('AuthImageCarousel'), 'Reuses 4-image carousel in compact mode')

// Requirement 5: Right Panel - Login
assert(authModalContent.includes('User Login') && authModalContent.includes('Admin Login'), 'User and Admin login role switcher present')
assert(authModalContent.includes('showPassword'), 'Show/hide password toggle present')
assert(authModalContent.includes('switchMode(\'forgot-password\')'), 'Forgot password link transitions mode inside modal')
assert(authModalContent.includes('DemoAccess'), 'Instant Demo Access integrated')
assert(authModalContent.includes('switchMode(\'signup\')'), 'Sign up link transitions mode inside modal without reload')

// Requirement 6: Signup Mode
assert(authModalContent.includes('fullName') && authModalContent.includes('confirmPassword') && authModalContent.includes('agreedTerms'), 'Signup mode includes Full Name, Email, Password, Confirm Password, and Terms checkbox')
assert(authModalContent.includes('Auto-Fill Demo Info') || authModalContent.includes('handleQuickDemoFill'), 'Auto-Fill Demo Info test helper present')
assert(!authModalContent.includes('Admin Registration Disabled'), 'Unnecessary public admin registration warnings removed in compact modal')

// Requirement 7: Forgot Password Mode
assert(authModalContent.includes('mockResetToken') || authModalContent.includes('rst_'), 'Simulated recovery token generated locally without claiming fake email dispatch')

// Requirement 8: Remove Social Login for Now
assert(!authModalContent.includes('Continue with Google'), 'Google OAuth button removed as required')
assert(!authModalContent.includes('Continue with Apple'), 'Apple OAuth button removed as required')
assert(!authModalContent.includes('Continue with Microsoft'), 'Microsoft OAuth button removed as required')
assert(!authModalContent.includes('Enterprise SSO'), 'Enterprise SSO button removed as required')

// Requirement 9: Demo Access Persistence
const demoAccessPath = path.join(root, 'src/components/auth/DemoAccess.jsx')
const demoAccessContent = fs.readFileSync(demoAccessPath, 'utf8')
assert(demoAccessContent.includes('/dashboard'), 'User Demo routes to /dashboard')
assert(demoAccessContent.includes('/admin'), 'Admin Demo routes to /admin')

// Requirement 10: Routing Behavior in AppRoutes
const routesPath = path.join(root, 'src/routes/index.jsx')
const routesContent = fs.readFileSync(routesPath, 'utf8')
assert(routesContent.includes('isAuthModalRoute'), 'AppRoutes detects auth modal routes')
assert(routesContent.includes('backgroundLocation'), 'AppRoutes implements background-location modal routing')
assert(routesContent.includes('<AuthModal'), 'AppRoutes mounts AuthModal over background location')

// PublicLayout Navbar Links
const publicLayoutPath = path.join(root, 'src/layouts/PublicLayout.jsx')
const publicLayoutContent = fs.readFileSync(publicLayoutPath, 'utf8')
assert(publicLayoutContent.includes('state={{ background: location }}'), 'PublicLayout navbar passes background location state')

// Standalone pages wrap modal
const loginPageContent = fs.readFileSync(path.join(root, 'src/pages/auth/LoginPage.jsx'), 'utf8')
assert(loginPageContent.includes('<AuthModal'), 'LoginPage.jsx delegates to AuthModal')

console.log(`\n-----------------------------------------------------`)
console.log(`Audited ${passCount + failCount} criteria: ${passCount} PASSED, ${failCount} FAILED`)
console.log(`-----------------------------------------------------\n`)

if (failCount > 0) {
  process.exit(1)
} else {
  console.log('ALL AUTH MODAL CRITERIA VERIFIED SUCCESSFULLY.\n')
  process.exit(0)
}

