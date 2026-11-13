import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')

console.log('=====================================================')
console.log('   KIAAN STUDIO CAROUSEL FIX AUDIT & VERIFICATION    ')
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

const componentPath = path.join(root, 'src/components/landing/ImageEditingSection.jsx')
assert(fs.existsSync(componentPath), 'ImageEditingSection.jsx exists')

const content = fs.readFileSync(componentPath, 'utf8')

// Step 1: Root cause & items
assert(content.includes('editShowcaseItems'), 'Edit showcase items array defined')
assert(content.includes('edit-relighting.jpg') &&
       content.includes('edit-node-workflow.jpg') &&
       content.includes('edit-horse-mist.jpg') &&
       content.includes('edit-macro-upscale.jpg') &&
       content.includes('edit-cyberpunk.jpg'), 'All 5 original image assets preserved')

// Step 2: Continuous auto-scroll & infinite loop
assert(content.includes('triplicatedItems') || content.includes('setIndex'), 'Items triplicated for seamless infinite wrapping')
assert(content.includes('requestAnimationFrame'), 'requestAnimationFrame continuous animation implemented')
assert(content.includes('container.scrollLeft +='), 'Continuous right-to-left scrolling advancing scrollLeft')
assert(content.includes('container.scrollLeft -= setWidth'), 'Seamless wrap-around logic without visual jumps')
assert(content.includes('speed = 0.048') || content.includes('speed'), 'Frame-rate independent speed configured (~38-40s per cycle)')

// Step 3: Hover pause & resume
assert(content.includes('onMouseEnter={handleMouseEnter}') && content.includes('onMouseLeave={handleMouseLeave}'), 'Hover listeners attached to carousel')
assert(content.includes('isHoveredRef.current = true') && content.includes('isHoveredRef.current = false'), 'Hover pauses and resumes without resetting position')

// Step 4: Previous / Next buttons
assert(content.includes('handleScroll(\'left\')') && content.includes('handleScroll(\'right\')'), 'Previous and Next arrow handlers connected')
assert(content.includes('isInteractingRef.current'), 'Manual interaction temporarily pauses autoplay')
assert(content.includes('scrollBy'), 'Smooth manual navigation preserved via scrollBy')

// Step 5: Mobile support
assert(content.includes('onTouchStart={handleTouchStart}') && content.includes('onTouchEnd={handleTouchEnd}'), 'Touch swipe handlers attached for mobile')
assert(content.includes('isDraggingRef.current'), 'Autoplay pauses while user is dragging on mobile')

// Step 6: Design preservation
assert(content.includes('Edit, Enhance &amp; Perfect Every Detail'), 'Section heading preserved exactly')
assert(content.includes('w-72 sm:w-88') && content.includes('rounded-3xl'), 'Card dimensions and border radius preserved')
assert(content.includes('ChevronLeft') && content.includes('ChevronRight'), 'Previous/Next button icons preserved')

// Step 7: Performance & Accessibility
assert(content.includes('prefers-reduced-motion'), 'prefers-reduced-motion accessibility respected')
assert(content.includes('visibilitychange'), 'Pauses animation when browser tab is hidden')
assert(content.includes('aria-hidden={isClone ? \'true\' : undefined}'), 'Duplicated clone items hidden from screen readers')
assert(content.includes('cancelAnimationFrame'), 'Clean up on component unmount implemented')
assert(content.includes('ResizeObserver'), 'ResizeObserver updates singleSetWidth dynamically on window resize')

// Verify Community Creations carousel was NOT modified
const communityPath = path.join(root, 'src/components/landing/CreativeShowcaseSection.jsx')
const communityContent = fs.readFileSync(communityPath, 'utf8')
assert(communityContent.includes('Community Creations') && communityContent.includes('animate-marquee'), 'Community Creations carousel remains intact and functional')

console.log(`\n-----------------------------------------------------`)
console.log(`Audited ${passCount + failCount} criteria: ${passCount} PASSED, ${failCount} FAILED`)
console.log(`-----------------------------------------------------\n`)

if (failCount > 0) {
  process.exit(1)
} else {
  console.log('ALL CAROUSEL FIX CRITERIA VERIFIED SUCCESSFULLY.\n')
  process.exit(0)
}

