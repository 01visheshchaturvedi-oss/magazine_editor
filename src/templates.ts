import { Template } from './types';

export const PREBUILT_TEMPLATES: Template[] = [
  // ════════════════════════════════════════════
  // TEMPLATE 1: PERCENTAGE & APPLICATION
  // From the user's detailed brief — gold/navy gradient, fraction ring, formula flow
  // ════════════════════════════════════════════
  {
    id: 'percentage-application',
    name: 'Percentage & Application',
    description: 'Premium gold/navy cover with fraction-percentage orbital ring, formula background, and teacher credential bar — inspired by competitive exam magazine design.',
    category: 'featured',
    tags: ['math', 'percentage', 'cover'],
    thumbnailEmoji: '📊',
    state: {
      currentTheme: 'professional-navy',
      currentPage: 'cover',
      fontStyleId: 'serif',
      coverData: {
        tagline: '📌 SBI PO, SBI CLERK 2025-2026',
        badgeText: '🔥 Mantra File — Zero to Infinity',
        issueDate: 'March, 2025',
        mainTitle: 'Percentage & Application',
        subTitle: '✨ Master All Percentage Concepts for Success',
        bestMagLabel: 'Best Monthly Magazine for Complete Quant — Banking Aspirants',
        bulletPoints: [
          'FRACTION TO PERCENTAGE TRICKS',
          'SUCCESSIVE PERCENTAGE CHANGE',
          'PROFIT & LOSS DI',
          'DATA SUFFICIENCY - PERCENTAGE'
        ],
        authorName: 'HARSHAL AGRAWAL',
        authorCreds: 'IIT BHU, CAT 99.67%ILER',
        socialHandle: 'learningcapsules'
      },
      photo: {
        url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600',
        scale: 1.1,
        xOffset: 0,
        yOffset: -5,
        opacity: 1,
        saturation: 1,
        isMonochrome: false,
        shadow: 'glow',
        hasDropShadow: true
      },
      photoGlowColor: '#c9a84c',
      photoGlowWidth: 20,
      customPrimaryColor: '#c9a84c',
      customBackgroundColor: '#1e3a5f',
      backgroundDecoration: 'fraction-ring',
      decorationColor: '#c9a84c',
      decorationOpacity: 70,
      backgroundLayers: [
        { themeId: 'professional-navy', opacity: 0.8, blendMode: 'normal' },
        { themeId: 'royal-indigo', opacity: 0.2, blendMode: 'screen' }
      ],
      backgroundBlur: 2,
      transforms: {
        'cover.mainTitle': { x: 0, y: -10, scale: 1.15, rotation: 0 },
        'cover.subTitle': { x: 0, y: 5, scale: 1.0, rotation: 0 },
        'cover.authorName': { x: 0, y: 0, scale: 1.0, rotation: 0 },
        'cover.authorCreds': { x: 0, y: 0, scale: 1.0, rotation: 0 },
      },
      canvasElements: [
        {
          id: 'template_perc_formula',
          page: 'cover',
          type: 'text',
          x: 180,
          y: 400,
          width: 200,
          height: 30,
          rotation: -5,
          scale: 1,
          content: 'actual value / total value × 100',
          textColor: '#c9a84c',
          fontSize: 11,
          fontFamily: "'JetBrains Mono', monospace",
          opacity: 0.3,
          zIndex: 2
        }
      ]
    }
  },

  // ════════════════════════════════════════════
  // TEMPLATE 2: DATA INTERPRETATION
  // ════════════════════════════════════════════
  {
    id: 'data-interpretation',
    name: 'Data Interpretation',
    description: 'Midnight space/cyan theme with math symbols ring — perfect for DI, caselets, and graph-heavy chapters.',
    category: 'math',
    tags: ['math', 'di', 'data'],
    thumbnailEmoji: '📈',
    state: {
      currentTheme: 'midnight-space',
      currentPage: 'cover',
      fontStyleId: 'modern',
      coverData: {
        tagline: '📌 SBI PO, IBPS RRB 2025',
        badgeText: '🔥 DI Caselets Special',
        issueDate: 'April, 2025',
        mainTitle: 'Data Interpretation',
        subTitle: '✨ Tables | Pie Charts | Bar Graphs | Caselets',
        bestMagLabel: 'Complete DI Module for Banking & Insurance Exams',
        bulletPoints: [
          'TABLE DI & MISSING DI',
          'PIE CHART WITH CALCULATION',
          'CASELET BASED DI',
          'DATA SUFFICIENCY MASTER'
        ],
        authorName: 'HARSHAL AGRAWAL',
        authorCreds: 'IIT BHU, CAT 99.67%ILER',
        socialHandle: 'learningcapsules'
      },
      photo: {
        url: '',
        scale: 1.0,
        xOffset: 0,
        yOffset: 0,
        opacity: 0.8,
        saturation: 0.8,
        isMonochrome: false,
        shadow: 'glow',
        hasDropShadow: true
      },
      customPrimaryColor: '#06b6d4',
      backgroundDecoration: 'math-ring',
      decorationOpacity: 50,
      backgroundLayers: [
        { themeId: 'midnight-space', opacity: 1, blendMode: 'normal' }
      ],
      transforms: {
        'cover.mainTitle': { x: 0, y: 0, scale: 1.1, rotation: 0 },
      }
    }
  },

  // ════════════════════════════════════════════
  // TEMPLATE 3: SPEED MATHS
  // ════════════════════════════════════════════
  {
    id: 'speed-maths',
    name: 'Speed Maths & Simplification',
    description: 'Neon lime/space black with high-energy formula flow background — for calculation speed chapters.',
    category: 'math',
    tags: ['math', 'speed', 'simplification'],
    thumbnailEmoji: '⚡',
    state: {
      currentTheme: 'neon-lime',
      currentPage: 'cover',
      fontStyleId: 'mono',
      coverData: {
        tagline: '📌 SBI CLERK PRELIMS 2025',
        badgeText: '🔥 Speed Booster Module',
        issueDate: 'May, 2025',
        mainTitle: 'SPEED MATHS',
        subTitle: '✨ Simplification | Approximation | Square Root | Cube',
        bestMagLabel: 'Double Your Calculation Speed in 30 Days',
        bulletPoints: [
          'SIMPLIFICATION TRICKS',
          'APPROXIMATION SHORTCUTS',
          'SQUARE & CUBE ROOTS',
          'MULTIPLICATION HACKS'
        ],
        authorName: 'HARSHAL AGRAWAL',
        authorCreds: 'IIT BHU, CAT 99.67%ILER',
        socialHandle: 'learningcapsules'
      },
      photo: {
        url: '',
        scale: 1.0,
        xOffset: 0,
        yOffset: 0,
        opacity: 0.7,
        saturation: 0.9,
        isMonochrome: false,
        shadow: 'glow',
        hasDropShadow: true
      },
      photoGlowColor: '#ccff00',
      photoGlowWidth: 18,
      backgroundDecoration: 'formula-flow',
      decorationColor: '#ccff00',
      decorationOpacity: 40,
      canvasElements: [
        {
          id: 'template_speed_sqrt',
          page: 'cover',
          type: 'symbol',
          x: 30,
          y: 90,
          width: 50,
          height: 50,
          rotation: 0,
          scale: 1,
          content: '√',
          textColor: '#ccff00',
          fontSize: 36,
          fontFamily: 'serif',
          opacity: 0.15,
          zIndex: 2
        }
      ]
    }
  },

  // ════════════════════════════════════════════
  // TEMPLATE 4: TOPPERS' TALK SPOTLIGHT
  // ════════════════════════════════════════════
  {
    id: 'toppers-spotlight',
    name: "Toppers' Talk Spotlight",
    description: 'Royal indigo with golden amber accents and star field — showcase student success stories with prestige.',
    category: 'exam',
    tags: ['topper', 'testimonial'],
    thumbnailEmoji: '⭐',
    state: {
      currentTheme: 'royal-indigo',
      currentPage: 'topper',
      fontStyleId: 'serif',
      topperData: {
        mainTitle: "Toppers' Talk",
        intro: 'Real Aspirants. Real Stories. Read how these champions cracked the toughest banking challenges with dedication and smart work!',
        items: [
          {
            id: 'top1',
            name: 'Smrita Rai',
            location: 'Prayagraj, UP',
            feedback: 'Harshal Sir... Zero to infinity was the ultimate game changer. I completed it 3 times! It built my mains confidence completely and now I cleared both SBI JA and RRB Clerk in my very first serious attempt!'
          },
          {
            id: 'top2',
            name: 'Shubham Ganatra',
            location: 'Bhuj-Kutch, Gujarat',
            feedback: 'Sir, I got high marks in quant because of your daily mains classes. Regular attendance made hard sums feel like childs play.'
          },
          {
            id: 'top3',
            name: 'Naveen Arya',
            location: 'Mau, UP',
            feedback: 'Thanks to entire team! In 2023 I had zero speed. After taking Chapter Flow courses, my arithmetic doubts got flushed away. Proudly cleared RRB Clerk!'
          },
          {
            id: 'top4',
            name: 'Ruchi Agarwal',
            location: 'Agra, UP',
            feedback: 'Mathematics was always my weakest link. Your visual diagrams and intuitive calculations completely transformed my approach. Thank you from the bottom of my heart!'
          },
          {
            id: 'top5',
            name: 'Vaibhava Srivastava',
            location: 'Bareilly, UP',
            feedback: 'After failing 4 PO interviews, your motivational sessions kept me sane. Today I am finally selected in IBPS RRB PO with a stellar score!'
          }
        ]
      },
      backgroundDecoration: 'stars',
      decorationColor: '#fbbf24',
      decorationOpacity: 60,
      backgroundLayers: [
        { themeId: 'royal-indigo', opacity: 1, blendMode: 'normal' }
      ]
    }
  },

  // ════════════════════════════════════════════
  // TEMPLATE 5: COURSE PROMO — QUANT BATCH
  // ════════════════════════════════════════════
  {
    id: 'quant-course-promo',
    name: 'Quant Selection Course',
    description: 'Bold amber/charcoal promo flyer with concentric rings — ideal for course launches and batch announcements.',
    category: 'promo',
    tags: ['promo', 'course', 'batch'],
    thumbnailEmoji: '💎',
    state: {
      currentTheme: 'charcoal-amber',
      currentPage: 'promo',
      fontStyleId: 'modern',
      promoData: {
        topBadge: 'Complete Basic to Advanced Course',
        mainTitle: 'QUANT EXCLUSIVE',
        authorTag: 'Harshal Agrawal [IIT BHU]',
        targetExam: 'BANKING & INSURANCE EXAMS 2025',
        features: [
          'Topicwise Prelims Classes & Mains Modules',
          'Dost & Doubt Clearing Live Video Sessions',
          'Mantra Formulas Book & Mock PDF Sheets',
          'All Latest Pattern & Speed Math Tricks Covered',
          'Weekly Mock Tests with Full Analysis'
        ],
        discountCode: 'TOP10',
        callToAction: 'USE CODE FOR MAXIMUM DISCOUNT',
        subPromoTitle: 'EARLY LEAD [WAY TO SUCCESS] SBI CLERK 2025',
        priceBefore: '1499',
        priceAfter: '999',
        limitedSeatsLabel: 'Offer Limited to First 300 Subscriptions Only'
      },
      backgroundDecoration: 'rings',
      decorationColor: '#ff8c00',
      decorationOpacity: 40,
      backgroundLayers: [
        { themeId: 'charcoal-amber', opacity: 1, blendMode: 'normal' }
      ]
    }
  },

  // ════════════════════════════════════════════
  // TEMPLATE 6: AUTHOR BIO — PREMIUM
  // ════════════════════════════════════════════
  {
    id: 'author-bio-premium',
    name: 'Author Bio — Premium',
    description: 'Burgundy & ivory elegance with signature quote capsule — a distinguished author introduction page.',
    category: 'author',
    tags: ['bio', 'author', 'profile'],
    thumbnailEmoji: '👨‍🏫',
    state: {
      currentTheme: 'burgundy-classic',
      currentPage: 'bio',
      fontStyleId: 'elegant',
      bioData: {
        authorName: 'Harshal Agrawal',
        title: 'AUTHOR & CHIEF MENTOR',
        subtitle: 'Alumnus IIT BHU, CAT 99.67%ile — 8+ Years Teaching Experience',
        paragraphs: [
          'Harshal Agrawal is a renowned expert in the field of Quantitative Aptitude and has dedicated his career to helping students master mathematics. He did both his B.Tech and M.Tech from the prestigious IIT BHU, Varanasi.',
          'He has cleared many competitive exams like CAT (99.67 percentile twice), IIT-JEE, GATE, and several banking exams. Since his days at college, he has shared shortcut strategies and diagrammatic logic to clear complex prelims.',
          'Through his popular YouTube channel "Learning Capsules" and high-quality course modules, he provides free & premium quality education so that even aspirants from remote areas can crack elite exams.'
        ],
        signatureQuote: 'meri padhaai mere ghar walo ne karaa di hai, ab us padhaai se kai gharon mein naukriyaa laani hain, kai saare bacchon ko kaabil banana hai jisse unka parivaar acchi zindagi jee sake.',
        socials: {
          youtube: 'youtube.com/learningcapsules',
          telegram: 't.me/harshalagrawalgroup',
          instagram: 'instagram.com/harshal_capsules'
        }
      },
      photo: {
        url: '',
        scale: 1.0,
        xOffset: 0,
        yOffset: 0,
        opacity: 0.85,
        saturation: 0.9,
        isMonochrome: false,
        shadow: 'lg',
        hasDropShadow: true
      },
      backgroundDecoration: 'scattered-circles',
      decorationColor: '#800020',
      decorationOpacity: 25
    }
  },

  // ════════════════════════════════════════════
  // TEMPLATE 7: ALL-IN-ONE INDEX
  // ════════════════════════════════════════════
  {
    id: 'comprehensive-index',
    name: 'Comprehensive Study Index',
    description: 'Clean sage green index page with organized syllabus columns — perfect for course roadmaps and study plans.',
    category: 'exam',
    tags: ['index', 'syllabus', 'study-plan'],
    thumbnailEmoji: '📚',
    state: {
      currentTheme: 'sage-academy',
      currentPage: 'index',
      fontStyleId: 'theme-default',
      indexData: {
        title: 'Study Roadmap & Syllabus',
        categoryLabel: '📚 COMPLETE STUDY PLAN 2025',
        leftColumnHeader: 'PRELIMS FOCUS',
        rightColumnHeader: '🔥 MAINS MASTERY',
        leftItems: [
          { id: 'l1', number: '01', title: 'Simplification & Approximation', page: '01' },
          { id: 'l2', number: '02', title: 'Quadratic Equations — Speed Hack', page: '08' },
          { id: 'l3', number: '03', title: 'Number Series — All Patterns', page: '15' },
          { id: 'l4', number: '04', title: 'Data Interpretation Basics', page: '24' },
          { id: 'l5', number: '05', title: 'Caselet Solutions', page: '36' },
          { id: 'l6', number: '06', title: 'Speed Maths Level I', page: '42' }
        ],
        rightItems: [
          { id: 'r1', number: '07', title: 'High-Level Logical DI', page: '55' },
          { id: 'r2', number: '08', title: 'Advanced Arithmetic Caselets', page: '68' },
          { id: 'r3', number: '09', title: 'Data Sufficiency Pro', page: '78' },
          { id: 'r4', number: '10', title: 'Probability & Permutation', page: '92' },
          { id: 'r5', number: '11', title: 'Wrong Number Marathon', page: '114' },
          { id: 'r6', number: '12', title: 'Solutions & Explanations', page: '130' }
        ],
        footerDecoration: 'curves'
      },
      backgroundDecoration: 'dot-grid',
      decorationColor: '#2d6a4f',
      decorationOpacity: 30,
      backgroundLayers: [
        { themeId: 'sage-academy', opacity: 1, blendMode: 'normal' }
      ]
    }
  },

  // ════════════════════════════════════════════
  // TEMPLATE 8: REASONING ABILITY
  // ════════════════════════════════════════════
  {
    id: 'reasoning-ability',
    name: 'Reasoning Ability Mastery',
    description: 'Electric violet & lime with scattered circles — for puzzles, syllogisms, and logical reasoning content.',
    category: 'math',
    tags: ['reasoning', 'logic', 'puzzles'],
    thumbnailEmoji: '🧠',
    state: {
      currentTheme: 'electric-violet',
      currentPage: 'cover',
      fontStyleId: 'modern',
      coverData: {
        tagline: '📌 IBPS RRB, SBI PO 2025',
        badgeText: '🔥 Puzzle & Seating Special',
        issueDate: 'June, 2025',
        mainTitle: 'Reasoning Ability',
        subTitle: '✨ Puzzles | Syllogism | Coding-Decoding | Blood Relation',
        bestMagLabel: 'Complete Reasoning Module for Banking & Insurance Exams',
        bulletPoints: [
          'PUZZLES & SEATING ARRANGEMENT',
          'SYLLOGISM — ALL PATTERNS',
          'CODING DECODING TRICKS',
          'INEQUALITIES & BLOOD RELATION'
        ],
        authorName: 'HARSHAL AGRAWAL',
        authorCreds: 'IIT BHU, CAT 99.67%ILER',
        socialHandle: 'learningcapsules'
      },
      backgroundDecoration: 'scattered-circles',
      decorationColor: '#ccff00',
      decorationOpacity: 30,
      backgroundLayers: [
        { themeId: 'electric-violet', opacity: 1, blendMode: 'normal' }
      ],
      transforms: {
        'cover.mainTitle': { x: 0, y: 0, scale: 1.1, rotation: 0 },
      }
    }
  }
];

export const TEMPLATE_CATEGORIES: { id: string; label: string; emoji: string }[] = [
  { id: 'featured', label: '⭐ Featured', emoji: '⭐' },
  { id: 'math', label: '📐 Math Covers', emoji: '📐' },
  { id: 'exam', label: '📋 Exam Pages', emoji: '📋' },
  { id: 'author', label: '👤 Author Bio', emoji: '👤' },
  { id: 'promo', label: '💎 Promo', emoji: '💎' },
];
