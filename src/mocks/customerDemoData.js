/**
 * CUSTOMER STUDIO DEMO DATA
 * Sample fixtures for the asset-management, billing, settings and support pages.
 * Everything here is static sample data held in browser memory — nothing is
 * persisted to a server. All media paths point at locally bundled, licensed
 * assets (see docs/ASSET_LICENSES.md).
 */

const IMG = '/images/landing'

export const DEMO_GENERATIONS = [
  { id: 'g-101', type: 'image', tool: 'Text-to-Image', title: 'Twilight Lake Villa', prompt: 'Futuristic architectural villa hovering over a turquoise alpine lake at twilight, warm amber glass facade', model: 'FLUX.2 Klein 4B', dimensions: '1344×768', aspect: '16:9', seed: '482910385', steps: 4, cfg: 3.5, credits: 1, createdAt: '2026-11-13T10:42:00', src: `${IMG}/gallery-architecture.jpg`, sizeBytes: 125343, favorite: true, projectId: 'p-1' },
  { id: 'g-102', type: 'image', tool: 'Text-to-Image', title: 'Cosmic EVA Portrait', prompt: 'Cinematic astronaut portrait with golden reflections in the helmet visor, nebula dust background', model: 'FLUX.2 Klein 4B', dimensions: '1024×1024', aspect: '1:1', seed: '918274619', steps: 4, cfg: 4.0, credits: 1, createdAt: '2026-11-13T09:15:00', src: `${IMG}/hero-astronaut.jpg`, sizeBytes: 938114, favorite: true, projectId: 'p-2' },
  { id: 'g-103', type: 'video', tool: 'Text-to-Video', title: 'Blooming Flower Timelapse', prompt: 'Macro timelapse of a flower opening in soft morning light, shallow depth of field', model: 'Wan 2.1 Video (Cinema 720p)', dimensions: '1280×720', aspect: '16:9', seed: '553019284', steps: 30, cfg: 5.0, credits: 25, duration: '5.0s', createdAt: '2026-11-12T18:30:00', src: '/videos/sample-video.mp4', poster: null, sizeBytes: 1128375, favorite: false, projectId: 'p-2' },
  { id: 'g-104', type: 'image', tool: 'Image-to-Image', title: 'Artisan Flame Burger', prompt: 'Stylised artisan flame burger, molten cheddar, dramatic studio rim light', model: 'FLUX.2 Klein 4B', dimensions: '1024×1024', aspect: '1:1', seed: '219384756', steps: 4, cfg: 3.5, credits: 1, createdAt: '2026-11-12T14:05:00', src: `${IMG}/img2img-result-burger.jpg`, sizeBytes: 97289, favorite: false, projectId: 'p-3' },
  { id: 'g-105', type: 'image', tool: 'Text-to-Image', title: 'Emerald Valley Falls', prompt: 'Mystic waterfall cascading into an emerald fantasy valley, volumetric god rays', model: 'Z-Image Turbo', dimensions: '768×1344', aspect: '9:16', seed: '109283742', steps: 8, cfg: 5.0, credits: 1, createdAt: '2026-11-11T20:22:00', src: `${IMG}/gallery-fantasy.jpg`, sizeBytes: 132926, favorite: true, projectId: 'p-1' },
  { id: 'g-106', type: 'image', tool: 'Image Editor', title: 'Neon Cyber Portrait', prompt: 'Cyberpunk neon relight with magenta and cyan rim lighting', model: 'FLUX.2 Klein 4B', dimensions: '1024×1024', aspect: '1:1', seed: '774102938', steps: 4, cfg: 3.5, credits: 1, createdAt: '2026-11-11T11:48:00', src: `${IMG}/edit-cyberpunk.jpg`, sizeBytes: 300473, favorite: false, projectId: null },
  { id: 'g-107', type: 'video', tool: 'Image-to-Video', title: 'Blossom Motion Study', prompt: 'Gentle breeze moving flower petals, soft focus background, slow zoom in', model: 'Wan 2.1 I2V 14B Cinema', dimensions: '1280×720', aspect: '16:9', seed: '660192837', steps: 30, cfg: 5.0, credits: 20, duration: '5.0s', createdAt: '2026-11-10T16:10:00', src: '/videos/sample-video-2.mp4', poster: null, sizeBytes: 1128375, favorite: false, projectId: 'p-4' },
  { id: 'g-108', type: 'image', tool: 'Text-to-Image', title: 'Luxury Watch Studio', prompt: 'Minimalist luxury smartwatch product render on soft gradient backdrop', model: 'Z-Image Turbo', dimensions: '1024×1024', aspect: '1:1', seed: '629104857', steps: 8, cfg: 5.5, credits: 1, createdAt: '2026-11-09T13:35:00', src: `${IMG}/gallery-product.jpg`, sizeBytes: 24641, favorite: false, projectId: 'p-3' },
  { id: 'g-109', type: 'image', tool: 'Text-to-Image', title: 'Avant-Garde Editorial', prompt: 'High fashion editorial portrait, neutral beige tones, sharp studio rim lighting', model: 'FLUX.2 Klein 4B', dimensions: '1024×1024', aspect: '1:1', seed: '372819401', steps: 4, cfg: 3.5, credits: 1, createdAt: '2026-11-08T10:02:00', src: `${IMG}/gallery-fashion.jpg`, sizeBytes: 142893, favorite: true, projectId: 'p-2' },
  { id: 'g-110', type: 'image', tool: 'Image Editor', title: 'Misty Forest Horse', prompt: 'Ethereal white horse in a misty pine forest, soft diffused light', model: 'FLUX.2 Klein 4B', dimensions: '1152×864', aspect: '4:3', seed: '847291023', steps: 4, cfg: 3.5, credits: 1, createdAt: '2026-11-07T08:44:00', src: `${IMG}/edit-horse-mist.jpg`, sizeBytes: 135859, favorite: false, projectId: 'p-1' },
  { id: 'g-111', type: 'image', tool: 'Text-to-Image', title: 'Desert Motocross Jump', prompt: 'Motocross rider mid-air over desert dunes, dust trails, golden hour', model: 'FLUX.2 Klein 4B', dimensions: '1344×768', aspect: '16:9', seed: '903817264', steps: 4, cfg: 3.5, credits: 1, createdAt: '2026-11-05T17:19:00', src: `${IMG}/gallery-motocross.jpg`, sizeBytes: 115458, favorite: false, projectId: 'p-4' },
  { id: 'g-112', type: 'image', tool: 'Text-to-Image', title: 'Cinematic Twilight Range', prompt: 'Ultra-wide twilight mountain landscape, dramatic clouds, cinematic colour grade', model: 'Z-Image Turbo', dimensions: '1536×640', aspect: '21:9', seed: '118273645', steps: 8, cfg: 5.0, credits: 1, createdAt: '2026-11-03T19:50:00', src: `${IMG}/cta-cinematic-banner.jpg`, sizeBytes: 308492, favorite: false, projectId: null }
]

export const PROJECT_COLORS = ['violet', 'cyan', 'amber', 'emerald', 'rose']

export const DEMO_PROJECTS = [
  { id: 'p-1', name: 'Nordic Landscapes Campaign', description: 'Hero visuals for the winter travel campaign — lakes, falls and misty forests.', color: 'cyan', client: 'Aurora Travel Co.', status: 'Active', createdAt: '2026-11-01T09:00:00', updatedAt: '2026-11-13T10:42:00' },
  { id: 'p-2', name: 'Cosmos Editorial', description: 'Sci-fi editorial series mixing astronaut portraits with fashion styling.', color: 'violet', client: 'Orbit Magazine', status: 'Active', createdAt: '2026-10-28T12:00:00', updatedAt: '2026-11-13T09:15:00' },
  { id: 'p-3', name: 'Product Launch Kit', description: 'Packshots and stylised food renders for Q4 product launches.', color: 'amber', client: 'Internal', status: 'In Review', createdAt: '2026-10-20T15:30:00', updatedAt: '2026-11-12T14:05:00' },
  { id: 'p-4', name: 'Motorsport Reels', description: 'Short animated clips and stills for motorsport social channels.', color: 'rose', client: 'Velocity Racing', status: 'Archived', createdAt: '2026-10-10T10:00:00', updatedAt: '2026-11-10T16:10:00' }
]

export const DEMO_DOWNLOADS = [
  { id: 'd-1', name: 'twilight-lake-villa.jpg', type: 'image', format: 'JPG', sizeBytes: 125343, downloadedAt: '2026-11-13T10:50:00', src: `${IMG}/gallery-architecture.jpg`, thumb: `${IMG}/gallery-architecture.jpg`, source: 'Text-to-Image' },
  { id: 'd-2', name: 'cosmic-eva-portrait.jpg', type: 'image', format: 'JPG', sizeBytes: 938114, downloadedAt: '2026-11-13T09:20:00', src: `${IMG}/hero-astronaut.jpg`, thumb: `${IMG}/hero-astronaut.jpg`, source: 'Text-to-Image' },
  { id: 'd-3', name: 'blooming-flower-timelapse.mp4', type: 'video', format: 'MP4', sizeBytes: 1128375, downloadedAt: '2026-11-12T18:41:00', src: '/videos/sample-video.mp4', thumb: null, source: 'Text-to-Video' },
  { id: 'd-4', name: 'artisan-flame-burger.jpg', type: 'image', format: 'JPG', sizeBytes: 97289, downloadedAt: '2026-11-12T14:12:00', src: `${IMG}/img2img-result-burger.jpg`, thumb: `${IMG}/img2img-result-burger.jpg`, source: 'Image-to-Image' },
  { id: 'd-5', name: 'blossom-motion-study.mp4', type: 'video', format: 'MP4', sizeBytes: 1128375, downloadedAt: '2026-11-10T16:25:00', src: '/videos/sample-video-2.mp4', thumb: null, source: 'Image-to-Video' },
  { id: 'd-6', name: 'neon-cyber-portrait.jpg', type: 'image', format: 'JPG', sizeBytes: 300473, downloadedAt: '2026-11-11T12:00:00', src: `${IMG}/edit-cyberpunk.jpg`, thumb: `${IMG}/edit-cyberpunk.jpg`, source: 'Image Editor' },
  { id: 'd-7', name: 'luxury-watch-studio.jpg', type: 'image', format: 'JPG', sizeBytes: 24641, downloadedAt: '2026-11-09T13:40:00', src: `${IMG}/gallery-product.jpg`, thumb: `${IMG}/gallery-product.jpg`, source: 'Text-to-Image' },
  { id: 'd-8', name: 'emerald-valley-falls.jpg', type: 'image', format: 'JPG', sizeBytes: 132926, downloadedAt: '2026-11-08T21:05:00', src: `${IMG}/gallery-fantasy.jpg`, thumb: `${IMG}/gallery-fantasy.jpg`, source: 'Text-to-Image' }
]

// 14-day usage series (credits consumed per day)
export const DEMO_USAGE_DAILY = [
  { day: '31 Oct', image: 4, video: 0 }, { day: '01 Nov', image: 6, video: 12 }, { day: '02 Nov', image: 3, video: 0 },
  { day: '03 Nov', image: 8, video: 0 }, { day: '04 Nov', image: 5, video: 25 }, { day: '05 Nov', image: 9, video: 0 },
  { day: '06 Nov', image: 2, video: 0 }, { day: '07 Nov', image: 7, video: 12 }, { day: '08 Nov', image: 11, video: 0 },
  { day: '09 Nov', image: 6, video: 0 }, { day: '10 Nov', image: 4, video: 20 }, { day: '11 Nov', image: 10, video: 0 },
  { day: '12 Nov', image: 7, video: 25 }, { day: '13 Nov', image: 5, video: 0 }
]

export const DEMO_TRANSACTIONS = [
  { id: 'tx-1012', date: '2026-11-13T10:42:00', description: 'Text-to-Image · FLUX.2 Klein 4B', type: 'debit', category: 'image', amount: -1 },
  { id: 'tx-1011', date: '2026-11-12T18:30:00', description: 'Text-to-Video · Wan 2.1 Cinema 720p', type: 'debit', category: 'video', amount: -25 },
  { id: 'tx-1010', date: '2026-11-12T14:05:00', description: 'Image-to-Image · FLUX.2 Klein 4B', type: 'debit', category: 'image', amount: -1 },
  { id: 'tx-1009', date: '2026-11-11T09:00:00', description: 'Failed job refund · Wan 2.1 Draft', type: 'refund', category: 'video', amount: 12 },
  { id: 'tx-1008', date: '2026-11-10T16:10:00', description: 'Image-to-Video · Wan 2.1 I2V 14B', type: 'debit', category: 'video', amount: -20 },
  { id: 'tx-1007', date: '2026-11-08T12:00:00', description: 'Credit top-up · 200 credit pack', type: 'credit', category: 'topup', amount: 200 },
  { id: 'tx-1006', date: '2026-11-07T08:44:00', description: 'Image Editor · generative fill', type: 'debit', category: 'image', amount: -1 },
  { id: 'tx-1005', date: '2026-11-04T15:20:00', description: 'Text-to-Video · Wan 2.1 Cinema 720p', type: 'debit', category: 'video', amount: -25 },
  { id: 'tx-1004', date: '2026-11-01T00:00:00', description: 'Monthly plan allowance · Free Tier', type: 'credit', category: 'plan', amount: 25 },
  { id: 'tx-1003', date: '2026-11-01T00:00:00', description: 'Welcome bonus credits', type: 'credit', category: 'bonus', amount: 100 }
]

export const DEMO_BILLING_HISTORY = [
  { id: 'INV-2026-0011', date: '2026-11-08T12:00:00', description: '200 credit top-up pack', amount: 9, status: 'Paid' },
  { id: 'INV-2026-0010', date: '2026-10-08T12:00:00', description: 'Creator plan · monthly', amount: 19, status: 'Paid' },
  { id: 'INV-2026-0009', date: '2026-09-08T12:00:00', description: 'Creator plan · monthly', amount: 19, status: 'Paid' },
  { id: 'INV-2026-0008', date: '2026-08-08T12:00:00', description: 'Creator plan · monthly', amount: 19, status: 'Refunded' }
]

export const HELP_CATEGORIES = [
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'generation', label: 'Image & Video Generation' },
  { id: 'credits', label: 'Credits & Billing' },
  { id: 'account', label: 'Account & Security' }
]

export const HELP_ARTICLES = [
  { id: 'a-1', category: 'getting-started', title: 'Creating your first image', readMins: 3, body: 'Open AI Image Generator from the sidebar, describe your scene in the prompt box, choose a model and aspect ratio, then press Generate. Use the inspiration presets if you need a starting point. Results appear on the canvas and in My Generations.' },
  { id: 'a-2', category: 'getting-started', title: 'Organising work with Projects', readMins: 2, body: 'Projects group generations by campaign or client. Create a project from My Projects, then assign generations to it from the project details view. Projects can be renamed, recoloured, archived or deleted at any time.' },
  { id: 'a-3', category: 'generation', title: 'Writing effective prompts', readMins: 5, body: 'Describe subject, environment, lighting, camera and style in that order. Be specific ("35mm, golden hour, shallow depth of field") rather than abstract. Use the negative prompt to exclude artefacts such as blur or watermarks.' },
  { id: 'a-4', category: 'generation', title: 'Choosing aspect ratio and resolution', readMins: 2, body: '1:1 suits social feeds, 16:9 suits video and desktop, 9:16 suits stories and reels. Higher resolutions and longer videos consume more credits — the cost is always shown on the Generate button before you start.' },
  { id: 'a-5', category: 'generation', title: 'Animating a still image', readMins: 4, body: 'In Image-to-Video, upload a keyframe, describe the motion you want, pick a camera trajectory and set the motion intensity. Subtle intensity keeps the subject stable; high intensity produces more dramatic movement.' },
  { id: 'a-6', category: 'credits', title: 'How credits are charged', readMins: 3, body: 'Each generation reserves credits when it starts and settles them when it finishes. Image jobs typically cost 1 credit; video jobs cost 10–25 credits depending on model and resolution. Failed jobs are refunded automatically.' },
  { id: 'a-7', category: 'credits', title: 'Changing or cancelling your plan', readMins: 2, body: 'Visit Subscription to compare plans, switch between monthly and yearly billing, upgrade or downgrade. Downgrades take effect at the end of the current billing period.' },
  { id: 'a-8', category: 'account', title: 'Updating your password', readMins: 1, body: 'Go to Profile & Settings → Security, enter your current password and a new password of at least 8 characters, then confirm.' },
  { id: 'a-9', category: 'account', title: 'Notification preferences', readMins: 1, body: 'Profile & Settings → Notifications lets you control job-completion alerts, low-credit warnings, product updates and the weekly usage digest.' }
]

export const FAQS = [
  { q: 'Do I own the images and videos I generate?', a: 'Yes. On paid plans you receive full commercial usage rights to your outputs, subject to the Terms of Service.' },
  { q: 'Why did my generation fail?', a: 'Most failures are caused by moderation filters or temporary capacity limits. Credits for failed jobs are refunded automatically.' },
  { q: 'Do unused credits roll over?', a: 'Plan allowance credits reset each billing cycle. Purchased top-up credits do not expire.' },
  { q: 'Can I use a reference image?', a: 'Yes — Text-to-Image, Image-to-Image and Image-to-Video all accept reference uploads in PNG, JPG or WebP.' },
  { q: 'Is my data used to train models?', a: 'No. Prompts, uploads and outputs are never used to train foundation models.' }
]

export const DEMO_TICKETS = [
  {
    id: 'TCK-1042',
    subject: 'Video generation stuck at 90%',
    category: 'Generation',
    priority: 'High',
    status: 'Open',
    createdAt: '2026-11-12T19:05:00',
    messages: [
      { from: 'you', at: '2026-11-12T19:05:00', text: 'My Wan 2.1 Cinema job has been at 90% for over 10 minutes. Job ID g-103.' },
      { from: 'support', at: '2026-11-12T19:40:00', text: 'Thanks for reporting this. We can see the job completed on our side — please refresh My Generations. If it is still missing we will refund the 25 credits.' }
    ]
  },
  {
    id: 'TCK-1031',
    subject: 'Invoice needs company GST details',
    category: 'Billing',
    priority: 'Normal',
    status: 'Resolved',
    createdAt: '2026-11-02T11:20:00',
    messages: [
      { from: 'you', at: '2026-11-02T11:20:00', text: 'Could you reissue INV-2026-0010 with our company name and tax number?' },
      { from: 'support', at: '2026-11-02T15:00:00', text: 'Done — the updated invoice is available in Subscription → Billing history.' }
    ]
  }
]
