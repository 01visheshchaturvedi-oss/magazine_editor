import { ThemeColors, ThemeId, AppState } from './types';

export const COMPILATION_THEMES: Record<ThemeId, { name: string; colors: ThemeColors }> = {
  'neon-lime': {
    name: 'Neon Lime & Space Black',
    colors: {
      primary: '#ccff00',
      secondary: '#0a0a0c',
      accent: '#ffffff',
      accentBg: 'bg-[#ccff00]',
      accentText: 'text-black',
      background: '#121216',
      outerBg: '#08080a',
      textPrimary: '#ffffff',
      textSecondary: '#a1a1aa',
      borderColor: '#27272a',
      fontFamilyHead: 'font-sans font-extrabold tracking-tighter uppercase',
      fontFamilyBody: 'font-sans',
      badgeStyle: 'bg-[#ccff00] text-black font-bold uppercase rounded-sm border border-black px-2 py-0.5',
      gridStyle: 'bg-[#18181b] border-2 border-dashed border-[#ccff00]/30 rounded-xl p-5',
    }
  },
  'warm-ivory': {
    name: 'Warm Ivory & Crimson Red',
    colors: {
      primary: '#991b1b', // crimson red
      secondary: '#fefcf8', // warm ivory soft
      accent: '#1e293b', // slate deep
      accentBg: 'bg-[#991b1b]',
      accentText: 'text-white',
      background: '#faf6ee',
      outerBg: '#f3ede2',
      textPrimary: '#111827',
      textSecondary: '#4b5563',
      borderColor: '#e5e7eb',
      fontFamilyHead: 'font-serif font-black tracking-normal capitalize',
      fontFamilyBody: 'font-serif',
      badgeStyle: 'bg-[#991b1b] text-white font-serif font-semibold tracking-wide rounded-full px-4 py-1',
      gridStyle: 'bg-[#fcfaf4] border border-[#991b1b]/20 shadow-md rounded-2xl p-6',
    }
  },
  'midnight-space': {
    name: 'Midnight Space & Cyan',
    colors: {
      primary: '#06b6d4', // electric cyan
      secondary: '#030712', // rich dark space
      accent: '#facc15', // neon gold yellow
      accentBg: 'bg-[#06b6d4]',
      accentText: 'text-black',
      background: '#0b0f19',
      outerBg: '#02040a',
      textPrimary: '#ffffff',
      textSecondary: '#94a3b8',
      borderColor: '#1e293b',
      fontFamilyHead: 'font-sans font-black tracking-tight uppercase italic',
      fontFamilyBody: 'font-sans',
      badgeStyle: 'bg-cyan-500 text-black font-semibold rounded-md tracking-wider px-3 py-1',
      gridStyle: 'bg-[#0f172a] border border-cyan-500/30 shadow-cyan-900/30 shadow-lg rounded-xl p-5',
    }
  },
  'retro-teal': {
    name: 'Retro Sandy Teal',
    colors: {
      primary: '#0d9488', // teal
      secondary: '#f59e0b', // amber orange
      accent: '#115e59', // dark teal
      accentBg: 'bg-[#f59e0b]',
      accentText: 'text-black',
      background: '#f0fdfa', // very soft teal-ish white
      outerBg: '#ccfbf1',
      textPrimary: '#134e4a',
      textSecondary: '#0f766e',
      borderColor: '#99f6e4',
      fontFamilyHead: 'font-mono font-bold tracking-widest uppercase',
      fontFamilyBody: 'font-sans',
      badgeStyle: 'bg-amber-130 text-[#134e4a] border-2 border-[#134e4a] font-mono font-bold px-3 py-0.5',
      gridStyle: 'bg-white border-4 border-double border-[#0d9488] shadow-sm rounded-lg p-5',
    }
  },
  'royal-indigo': {
    name: 'Royal Indigo & Amber Gold',
    colors: {
      primary: '#fbbf24', // golden yellow
      secondary: '#1e1b4b', // rich deep blue indigo
      accent: '#ffffff',
      accentBg: 'bg-[#fbbf24]',
      accentText: 'text-black',
      background: '#2e2a72',
      outerBg: '#13113c',
      textPrimary: '#ffffff',
      textSecondary: '#cbd5e1',
      borderColor: '#4338ca',
      fontFamilyHead: 'font-sans font-extrabold tracking-tight uppercase',
      fontFamilyBody: 'font-sans',
      badgeStyle: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold uppercase rounded p-1.5 px-3',
      gridStyle: 'bg-[#25225c] border-2 border-amber-400/55 rounded-3xl p-6 shadow-xl',
    }
  },
  'cyberpunk-sunset': {
    name: 'Cyberpunk Hot Pink',
    colors: {
      primary: '#ff007f', // cyber dynamic pink
      secondary: '#0c041c', // cyber purple black
      accent: '#ffaa00', // energetic orange
      accentBg: 'bg-[#ff007f]',
      accentText: 'text-white',
      background: '#1a0933', // glowing violet
      outerBg: '#090214',
      textPrimary: '#ffffff',
      textSecondary: '#cbd5e1',
      borderColor: '#3c0764',
      fontFamilyHead: 'font-sans font-extrabold tracking-wide uppercase italic',
      fontFamilyBody: 'font-sans',
      badgeStyle: 'bg-[#ff007f] text-white font-bold uppercase rounded border border-[#ffaa00] px-2 py-0.5 shadow-[0_0_10px_#ff007f]',
      gridStyle: 'bg-[#240e44] border-2 border-dashed border-[#ff007f]/50 rounded-2xl p-5 shadow-inner',
    }
  },
  'forest-emerald': {
    name: 'Forest Emerald & Cream Gold',
    colors: {
      primary: '#eab308', // pure warm gold
      secondary: '#022c22', // cozy shadow deep forest
      accent: '#fef3c7', // linen soft
      accentBg: 'bg-[#eab308]',
      accentText: 'text-black',
      background: '#064e3b', // moss green rich
      outerBg: '#021e15',
      textPrimary: '#ffffff',
      textSecondary: '#a7f3d0',
      borderColor: '#0f766e',
      fontFamilyHead: 'font-serif font-extrabold tracking-normal',
      fontFamilyBody: 'font-serif',
      badgeStyle: 'bg-[#eab308] text-black font-semibold rounded-md px-3 py-1 shadow-md',
      gridStyle: 'bg-[#043327] border border-[#eab308]/30 rounded-2xl p-6 shadow-xl',
    }
  },
  'coral-charcoal': {
    name: 'Coral Punch & Charcoal',
    colors: {
      primary: '#f43f5e', // coral vivid rose
      secondary: '#09090b', // absolute charcoal dark
      accent: '#ffffff',
      accentBg: 'bg-[#f43f5e]',
      accentText: 'text-white',
      background: '#18181b', // soft charcoal
      outerBg: '#09090b',
      textPrimary: '#ffffff',
      textSecondary: '#d4d4d8',
      borderColor: '#27272a',
      fontFamilyHead: 'font-sans font-black tracking-tighter uppercase',
      fontFamilyBody: 'font-sans',
      badgeStyle: 'bg-zinc-100 text-black font-extrabold border-2 border-[#f43f5e] tracking-tight px-3 py-1 uppercase rounded-none',
      gridStyle: 'bg-[#27272a]/60 border-l-4 border-[#f43f5e] rounded-xl p-5 shadow-2xl',
    }
  },
  'electric-violet': {
    name: 'Acid Purple & Lime',
    colors: {
      primary: '#ccff00', // acid lime
      secondary: '#0f0d34', // space electric violet black
      accent: '#8b5cf6', // soft lavender accent
      accentBg: 'bg-[#8b5cf6]',
      accentText: 'text-white',
      background: '#1e1b4b', // retro space indigo
      outerBg: '#08051e',
      textPrimary: '#ffffff',
      textSecondary: '#c7d2fe',
      borderColor: '#4338ca',
      fontFamilyHead: 'font-sans font-black tracking-wider uppercase',
      fontFamilyBody: 'font-sans',
      badgeStyle: 'bg-[#ccff00] text-black font-mono font-bold tracking-wider px-2.5 py-1',
      gridStyle: 'bg-[#1e1b4b] border border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)] rounded-lg p-5',
    }
  },
  'professional-navy': {
    name: 'Classic Navy & Gold',
    colors: {
      primary: '#c9a84c', // prestigious gold
      secondary: '#f5f0e8', // warm cream
      accent: '#1e3a5f', // deep navy blue
      accentBg: 'bg-[#c9a84c]',
      accentText: 'text-black',
      background: '#faf8f4', // warm white
      outerBg: '#f0ece3',
      textPrimary: '#1e293b',
      textSecondary: '#475569',
      borderColor: '#d1d5db',
      fontFamilyHead: 'font-serif font-black tracking-normal capitalize',
      fontFamilyBody: 'font-sans',
      badgeStyle: 'bg-[#1e3a5f] text-[#c9a84c] font-serif font-bold tracking-wide rounded-sm px-3 py-1 border border-[#c9a84c]/40',
      gridStyle: 'bg-white border-2 border-[#c9a84c]/30 shadow-lg rounded-xl p-5',
    }
  },
  'sage-academy': {
    name: 'Sage Green & Sand',
    colors: {
      primary: '#2d6a4f', // rich sage green
      secondary: '#fefae0', // cream sand
      accent: '#1b4332', // deep forest
      accentBg: 'bg-[#2d6a4f]',
      accentText: 'text-white',
      background: '#f8faf6', // soft off-white
      outerBg: '#ecfdf5',
      textPrimary: '#1e293b',
      textSecondary: '#475569',
      borderColor: '#d1d5db',
      fontFamilyHead: 'font-sans font-bold tracking-wide uppercase',
      fontFamilyBody: 'font-sans',
      badgeStyle: 'bg-[#2d6a4f] text-white font-sans font-bold uppercase rounded-md px-3 py-1 shadow-sm',
      gridStyle: 'bg-white border border-[#2d6a4f]/25 shadow-md rounded-xl p-5',
    }
  },
  'burgundy-classic': {
    name: 'Burgundy & Ivory',
    colors: {
      primary: '#800020', // classic burgundy
      secondary: '#fffff0', // ivory
      accent: '#333333', // charcoal
      accentBg: 'bg-[#800020]',
      accentText: 'text-white',
      background: '#fdfcf8', // warm off-white
      outerBg: '#f5f0eb',
      textPrimary: '#1a1a1a',
      textSecondary: '#4b5563',
      borderColor: '#d1d5db',
      fontFamilyHead: 'font-serif font-black tracking-normal',
      fontFamilyBody: 'font-serif',
      badgeStyle: 'bg-[#800020] text-white font-serif font-bold uppercase tracking-wider px-3 py-1 rounded-sm shadow-md',
      gridStyle: 'bg-[#fdfcf8] border-2 border-[#800020]/20 rounded-xl p-5 shadow-lg',
    }
  },
  'steel-professional': {
    name: 'Steel Blue & Slate',
    colors: {
      primary: '#4682b4', // steel blue
      secondary: '#f1f5f9', // slate white
      accent: '#1e293b', // dark slate
      accentBg: 'bg-[#4682b4]',
      accentText: 'text-white',
      background: '#ffffff', // clean white
      outerBg: '#f8fafc',
      textPrimary: '#0f172a',
      textSecondary: '#475569',
      borderColor: '#cbd5e1',
      fontFamilyHead: 'font-sans font-extrabold tracking-tight uppercase',
      fontFamilyBody: 'font-sans',
      badgeStyle: 'bg-[#4682b4] text-white font-sans font-bold uppercase rounded-md px-3 py-1 shadow-sm border border-[#4682b4]/50',
      gridStyle: 'bg-white border border-[#4682b4]/20 rounded-xl p-5 shadow-md',
    }
  },
  'charcoal-amber': {
    name: 'Charcoal & Warm Amber',
    colors: {
      primary: '#ff8c00', // warm amber
      secondary: '#1a1a2e', // dark charcoal
      accent: '#e8e8e8', // light grey
      accentBg: 'bg-[#ff8c00]',
      accentText: 'text-black',
      background: '#1e1e2f', // dark navy-charcoal
      outerBg: '#12121e',
      textPrimary: '#f1f5f9',
      textSecondary: '#94a3b8',
      borderColor: '#334155',
      fontFamilyHead: 'font-sans font-black tracking-tight uppercase',
      fontFamilyBody: 'font-sans',
      badgeStyle: 'bg-[#ff8c00] text-black font-sans font-bold uppercase rounded-md px-3 py-1 shadow-sm border border-[#ff8c00]/50',
      gridStyle: 'bg-[#1e1e2f] border-2 border-[#ff8c00]/30 rounded-xl p-5 shadow-inner',
    }
  },
  'ocean-clarity': {
    name: 'Ocean Teal & Pearl',
    colors: {
      primary: '#006d77', // ocean teal
      secondary: '#edf6f9', // pearl white
      accent: '#83c5be', // soft teal
      accentBg: 'bg-[#006d77]',
      accentText: 'text-white',
      background: '#ffffff', // pure white
      outerBg: '#f0f8fa',
      textPrimary: '#1a1a2e',
      textSecondary: '#475569',
      borderColor: '#cbd5e1',
      fontFamilyHead: 'font-sans font-bold tracking-tight uppercase',
      fontFamilyBody: 'font-sans',
      badgeStyle: 'bg-[#006d77] text-white font-sans font-bold uppercase rounded-full px-3 py-1 shadow-sm',
      gridStyle: 'bg-white border border-[#006d77]/20 rounded-2xl p-5 shadow-md',
    }
  }
};

export const DEFAULT_TEACHER_PHOTOS = [
  {
    name: 'Harshal Agrawal (Standard)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600', // Beautiful mock person photo
    // Let's use a nice custom transparent-like premium portrait or generic avatar that is extremely high-res
    alternativeUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600'
  }
];

export const INITIAL_STATE: AppState = {
  currentTheme: 'neon-lime',
  currentPage: 'cover',
  photo: {
    // Default high quality teacher portrait with simple gradient backdrop or cutout ready
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
  coverData: {
    tagline: '📌 SBI PO, SBI CLERK 2024 - 2025',
    badgeText: '🔥 Guess Papers Inside',
    issueDate: 'Feb, 2025',
    mainTitle: 'QUvNT मंत्र',
    subTitle: '✨ SBI CLERK Special Edition',
    bestMagLabel: 'Best Monthly Magazine for Complete Quant',
    bulletPoints: [
      'QUANTITY COMPARISON',
      'DATA SUFFICIENCY',
      'DI CASELETS',
      'SPEED MATHS'
    ],
    authorName: 'HARSHAL AGRAWAL',
    authorCreds: 'IIT BHU, CAT 99.67%ILER',
    socialHandle: 'learningcapsules'
  },
  indexData: {
    title: 'Table of Contents',
    categoryLabel: '📚 STUDY PLAN & LOG',
    leftColumnHeader: 'CLERK PRELIMS',
    rightColumnHeader: '🔥 CLERK MAINS',
    leftItems: [
      { id: 'l1', number: '01', title: 'Simplification Secrets', page: '01' },
      { id: 'l2', number: '02', title: 'Quadratic Equations Speed Hack', page: '08' },
      { id: 'l3', number: '03', title: 'Missing Number Series Basics', page: '15' },
      { id: 'l4', number: '04', title: 'Data Interpretation Foundation', page: '24' },
      { id: 'l5', number: '05', title: 'Caselet Solutions [Topicwise]', page: '36' },
      { id: 'l6', number: '06', title: 'Speed Maths Level-I', page: '42' }
    ],
    rightItems: [
      { id: 'r1', number: '07', title: 'High-Level Logical DI', page: '55' },
      { id: 'r2', number: '08', title: 'Advanced Arithmetic Caselets', page: '68' },
      { id: 'r3', number: '09', title: 'Data Sufficiency Pro level', page: '78' },
      { id: 'r4', number: '10', title: 'Probability & Permutation', page: '92' },
      { id: 'r5', number: '11', title: 'Wrong Number Marathon', page: '114' },
      { id: 'r6', number: '12', title: 'Solutions & Explanations', page: '130' }
    ],
    footerDecoration: 'curves'
  },
  topperData: {
    mainTitle: "Toppers' Talk",
    intro: 'Real Aspirants. Real Stories. Read how these champions cracked the toughest banking challenges with dedication!',
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
        feedback: 'Sir, I got high marks in quant because of your daily mains classes. Regular attendance made hard sums feel like childs play. Handing pre and mains simultaneously is key.'
      },
      {
        id: 'top3',
        name: 'Naveen Arya',
        location: 'Mau, UP',
        feedback: 'Thanks to entire team! In 2023 I had zero speed. After taking Chapter Flow courses and downloading the weekly Mantras, my arithmetic doubts got flushed away. Proudly cleared RRB Clerk!'
      },
      {
        id: 'top4',
        name: 'Ruchi Agarwal',
        location: 'Agra, UP',
        feedback: 'I want to say thank you from the bottom of my heart. Mathematics was always my weakest link. Your visual diagrams and intuitive calculations completely transformed my approach.'
      },
      {
        id: 'top5',
        name: 'Vaibhava Srivastava',
        location: 'Bareilly, UP',
        feedback: 'After failing 4 PO interviews by narrow margins, your motivational sessions kept me sane. Today I am finally selected in IBPS RRB PO with a stellar score!'
      }
    ]
  },
  bioData: {
    authorName: 'Harshal Agrawal',
    title: 'AUTHOR & CHIEF MENTOR',
    subtitle: 'Alumnus IIT BHU, CAT 99.67%ile',
    paragraphs: [
      'Harshal Agrawal is a renowned expert in the field of Quantitative Aptitude and has dedicated his career to helping students master mathematics. He did both his B.Tech and M.Tech from the prestigious IIT BHU, Varanasi.',
      'He has cleared many competitive exams like CAT (99.67 percentile twice), IIT-JEE, GATE, and several banking exams. Since his days at college, he has shared shortcut strategies and diagrammatic logic to clear complex prelims.',
      'Through his popular YouTube channel "Learning Capsules" and high-quality course modules, he provides free & premium quality education so that even aspirants from remote areas can crack elite exams.'
    ],
    signatureQuote: ' meri padhaai mere ghar walo ne karaa di hai, ab us padhaai se kai gharon mein naukriyaa laani hain, kai saare bacchon ko kaabil banana hai jisse unka parivaar acchi zindagi jee sake. ',
    socials: {
      youtube: 'youtube.com/learningcapsules',
      telegram: 't.me/harshalagrawalgroup',
      instagram: 'instagram.com/harshal_capsules'
    }
  },
  promoData: {
    topBadge: 'Complete Basic to Advanced Course',
    mainTitle: 'QUANT EXCLUSIVE',
    authorTag: 'Harshal Agrawal [IIT BHU]',
    targetExam: 'BANKING & INSURANCE EXAMS',
    features: [
      'Topicwise Prelims Classes & Mains Modules',
      'Dost & Doubt Clearing Live Video Sessions',
      'Mantra Formulas Book & Mock PDF Sheets',
      'All Latest Pattern & Speed Math Tricks Covered'
    ],
    discountCode: 'SHARK',
    callToAction: 'USE CODE FOR MAXIMUM DISCOUNT',
    subPromoTitle: 'EARLY LEAD [WAY TO SUCCESS] SBI CLERK 2025',
    priceBefore: '999',
    priceAfter: '750',
    limitedSeatsLabel: 'Offer Limited to First 500 Subscriptions Only'
  },
  transforms: {},
  customBackgrounds: {},
  customElementTextColors: {},
  customElementFonts: {},
  customElementAccents: {},
  customElementStyles: {},
  hiddenElements: {},
  elementCopies: {},
  duplicatedElements: [],
  canvasElements: [],
  hideDragTooltips: false,
  appTheme: 'light',
  elementShadows: {},
  elementGradients: {},
  backgroundBlur: 0,
  backgroundLayers: []
};
