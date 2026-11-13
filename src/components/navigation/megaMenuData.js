/**
 * Kiaan Studio — Mega Menu Configuration Data
 *
 * Mapped to existing verified public routes and landing page anchors.
 * No protected customer routes or fake external links are used.
 */

export const MEGA_MENU_DATA = {
  'ai-image': {
    id: 'ai-image',
    label: 'AI Image',
    columns: [
      {
        title: 'Image Generation',
        items: [
          {
            name: 'Text to Image',
            desc: 'Generate photorealistic visuals from natural language prompts',
            to: '/#hero-prompt'
          },
          {
            name: 'Image to Image',
            desc: 'Transform reference photos with neural visual guidance',
            to: '/#image-to-image'
          },
          {
            name: 'Image Variations',
            desc: 'Create multiple stylistic interpretations in seconds',
            to: '/features#variations'
          }
        ]
      },
      {
        title: 'Creative Controls',
        items: [
          {
            name: 'Aspect Ratios',
            desc: 'Square, landscape, portrait, and custom framing options',
            to: '/features#aspect-ratios'
          },
          {
            name: 'Image Styles',
            desc: 'Photorealistic, anime, cinematic 8k, and 3D concept styles',
            to: '/#how-it-works'
          },
          {
            name: 'Reference Images',
            desc: 'Pose, composition, and color palette matching controls',
            to: '/#image-to-image'
          }
        ]
      },
      {
        title: 'Explore & Showcase',
        items: [
          {
            name: 'Creative Showcase',
            desc: 'Explore diverse community and studio visual creations',
            to: '/#creative-showcase'
          },
          {
            name: 'Explore AI Image',
            desc: 'Overview of FLUX.2 Klein 4B and Z-Image Turbo engines',
            to: '/features'
          }
        ]
      }
    ],
    featured: {
      title: 'FLUX.2 Klein 4B',
      tag: 'Primary Image Engine',
      desc: '4-step distilled rectified flow matching yielding rapid photorealistic visual synthesis at 1024×1024.',
      image: '/images/landing/hero-astronaut.jpg',
      ctaText: 'Explore Models',
      ctaTo: '/features',
      linkText: 'Launch Studio Generator',
      linkTo: '/dashboard/image-generator'
    }
  },

  'ai-video': {
    id: 'ai-video',
    label: 'AI Video',
    columns: [
      {
        title: 'Video Creation',
        items: [
          {
            name: 'Text to Video',
            desc: 'Transform narrative prompts into 5-second cinematic shots',
            to: '/features#text-to-video'
          },
          {
            name: 'Image to Video',
            desc: 'Animate still photographs with natural motion dynamics',
            to: '/features#image-to-video'
          }
        ]
      },
      {
        title: 'Workflow & Controls',
        items: [
          {
            name: 'Video Projects',
            desc: 'Organize sequential visual scenes into project folders',
            to: '/features#projects'
          },
          {
            name: 'Video Settings',
            desc: 'Configure frame rate, temporal coherence, and motion speed',
            to: '/features#settings'
          }
        ]
      },
      {
        title: 'Explore',
        items: [
          {
            name: 'Video Examples',
            desc: 'High-definition motion showcase and temporal dynamics',
            to: '/features#video-showcase'
          },
          {
            name: 'Explore AI Video',
            desc: 'Wan 2.1 3D spatio-temporal diffusion architecture',
            to: '/features'
          }
        ]
      }
    ],
    featured: {
      title: 'Wan 2.1 Video Suite',
      tag: 'Cinematic Motion (Preview)',
      desc: 'Self-hosted 3D spatio-temporal diffusion generating continuous video sequences with natural motion.',
      image: '/images/landing/gallery-motorsport.jpg',
      ctaText: 'Explore Video Specs',
      ctaTo: '/features',
      linkText: 'Evaluation Preview Info',
      linkTo: '/about'
    }
  },

  'ai-editor': {
    id: 'ai-editor',
    label: 'AI Editor',
    columns: [
      {
        title: 'Image Editing',
        items: [
          {
            name: 'Image Editor',
            desc: 'Full-featured visual editing and canvas workstation',
            to: '/dashboard/image-editor'
          },
          {
            name: 'Background Removal',
            desc: 'Clean automatic subject isolation in one click',
            to: '/#image-editing'
          },
          {
            name: 'Image Enhancement',
            desc: 'Restore details, balance lighting, and sharpen focus',
            to: '/#image-editing'
          },
          {
            name: 'Creative Transformations',
            desc: 'Relighting, object inpainting, and aesthetic grading',
            to: '/#image-editing'
          }
        ]
      },
      {
        title: 'Explore',
        items: [
          {
            name: 'Editing Showcase',
            desc: 'Before and after image editing transformations',
            to: '/#image-editing'
          },
          {
            name: 'How Image Editing Works',
            desc: 'Non-destructive layer-based diffusion editing guide',
            to: '/#how-it-works'
          }
        ]
      }
    ],
    featured: {
      title: 'Neural Relighting & Inpainting',
      tag: 'Creative Refinements',
      desc: 'Edit, enhance, and perfect any detail in one streamlined workspace without external software.',
      image: '/images/landing/edit-relighting.jpg',
      ctaText: 'View Transformations',
      ctaTo: '/#image-editing',
      linkText: 'Open Image Editor',
      linkTo: '/dashboard/image-editor'
    }
  },

  'explore': {
    id: 'explore',
    label: 'Explore',
    columns: [
      {
        title: 'Discover',
        items: [
          {
            name: 'Creative Showcase',
            desc: 'Explore diverse visual genres generated with open weights',
            to: '/#creative-showcase'
          },
          {
            name: 'How It Works',
            desc: 'Simple 3-step prompt-to-render creation walkthrough',
            to: '/#how-it-works'
          },
          {
            name: 'Platform Features',
            desc: 'Deep dive into model architecture and local compute',
            to: '/features'
          },
          {
            name: 'About Kiaan Studio',
            desc: 'Our mission for open, self-hosted visual intelligence',
            to: '/about'
          }
        ]
      },
      {
        title: 'Resources',
        items: [
          {
            name: 'Contact Team',
            desc: 'Get in touch for enterprise deployment and feedback',
            to: '/contact'
          },
          {
            name: 'Help & Support',
            desc: 'Knowledge base, system requirements, and FAQs',
            to: '/dashboard/support'
          }
        ]
      }
    ],
    featured: {
      title: 'Kiaan Studio Architecture',
      tag: 'Open-Weight Platform',
      desc: 'Designed for private, self-hosted AI creation with zero 3rd-party API markups or restrictions.',
      image: '/images/landing/gallery-fantasy.jpg',
      ctaText: 'Explore Architecture',
      ctaTo: '/features',
      linkText: 'About the Project',
      linkTo: '/about'
    }
  },

  'pricing': {
    id: 'pricing',
    label: 'Pricing',
    columns: [
      {
        title: 'Subscription Plans',
        items: [
          {
            name: 'Free Tier ($0)',
            desc: '100 monthly credits for newcomers taking first steps',
            to: '/#pricing'
          },
          {
            name: 'Creator ($29)',
            desc: '2,500 credits with expedited GPU queue priority',
            to: '/#pricing'
          },
          {
            name: 'Pro ($59)',
            desc: '8,000 credits with full 4K output and Wan 2.1 Video',
            to: '/#pricing'
          },
          {
            name: 'Business ($199)',
            desc: '30,000 credits with dedicated node allocation',
            to: '/#pricing'
          }
        ]
      },
      {
        title: 'Comparison & Details',
        items: [
          {
            name: 'View All Plans',
            desc: 'Compare complete feature table and credit allowances',
            to: '/pricing'
          },
          {
            name: 'Commercial Licensing',
            desc: 'Commercial open weights with zero 3rd-party API markups',
            to: '/features'
          }
        ]
      }
    ],
    featured: {
      title: 'Studio Pro Tier',
      tag: 'Most Versatile',
      desc: 'Peak performance and unlimited creativity with highest GPU priority and full model suite.',
      image: '/images/landing/howitworks-step3.jpg',
      ctaText: 'Start Free Trial',
      ctaTo: '/register',
      linkText: 'See Full Pricing Table',
      linkTo: '/pricing'
    }
  }
}

