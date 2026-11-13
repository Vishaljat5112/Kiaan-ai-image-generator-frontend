/**
 * MOCK DATA FIXTURES
 * Used for development preview in Phase 2.
 * Real data will be connected in Phase 8 (Backend) and Phase 10 (AI Workers).
 */

export const MOCK_MODELS = [
  {
    id: 'flux-2-klein-4b',
    name: 'FLUX.2 Klein 4B',
    type: 'IMAGE',
    license: 'Apache 2.0',
    steps: 4,
    latency: '~1.1s',
    creditCost: 1,
    description: 'Sub-second rectified flow transformer for text-to-image and multimodal editing.'
  },
  {
    id: 'z-image-turbo',
    name: 'Z-Image Turbo',
    type: 'IMAGE',
    license: 'Apache 2.0',
    steps: 8,
    latency: '~2.2s',
    creditCost: 1,
    description: 'Bilingual typography and photorealistic S3-DiT generation.'
  },
  {
    id: 'wan-2.1-t2v-1.3b',
    name: 'Wan 2.1 Video (Draft 480p)',
    type: 'VIDEO',
    license: 'Apache 2.0',
    duration: '5.0s',
    frames: 81,
    creditCost: 12,
    description: 'Fast 3D spatio-temporal video generation at 854×480 resolution.'
  },
  {
    id: 'wan-2.1-t2v-14b',
    name: 'Wan 2.1 Video (Cinema 720p)',
    type: 'VIDEO',
    license: 'Apache 2.0',
    duration: '5.0s',
    frames: 81,
    creditCost: 25,
    description: 'High-definition 1280×720 cinematic video generation with dynamic camera motion.'
  }
]

export const MOCK_USER = {
  id: 'usr_01j981273',
  name: 'Jane Doe',
  email: 'artist@studio.com',
  role: 'creator',
  tier: 'Free Tier',
  credits: 0,
  reservedCredits: 0,
  joinedAt: '2026-11-01'
}

export const MOCK_PLANS = [
  {
    id: 'plan_starter',
    name: 'Free Trial',
    price: 0,
    credits: 25,
    features: ['Standard queue priority', '1 concurrent job', 'Draft 480p video access']
  },
  {
    id: 'plan_creator',
    name: 'Creator',
    price: 19,
    credits: 600,
    features: ['Priority queue (Level 3)', '2 concurrent jobs', 'Commercial usage rights', '720p Cinema video']
  },
  {
    id: 'plan_pro',
    name: 'Pro Studio',
    price: 49,
    credits: 2000,
    features: ['High priority queue (Level 5)', '5 concurrent jobs', 'Full model access', 'Inpainting canvas']
  },
  {
    id: 'plan_enterprise',
    name: 'Enterprise',
    price: 199,
    credits: 10000,
    features: ['Dedicated queue fast-track', '20 concurrent jobs', 'Dedicated worker routing', 'SLA support']
  }
]
