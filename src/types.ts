export type PageType = 'cover' | 'index' | 'topper' | 'bio' | 'promo';

export type ThemeId = 'neon-lime' | 'warm-ivory' | 'midnight-space' | 'retro-teal' | 'royal-indigo' | 'cyberpunk-sunset' | 'forest-emerald' | 'coral-charcoal' | 'electric-violet' | 'professional-navy' | 'sage-academy' | 'burgundy-classic' | 'steel-professional' | 'charcoal-amber' | 'ocean-clarity';

export interface ThemeColors {
  primary: string;       // e.g. #b6ff00 (Neon Lime)
  secondary: string;     // e.g. #111111 (Deep Black)
  accent: string;        // e.g. #ffffff (White text / highlights)
  accentBg: string;      // e.g. bg-lime-400
  accentText: string;    // e.g. text-black
  background: string;    // e.g. #18181b (Card bg)
  outerBg: string;       // e.g. #09090b (Page backing)
  textPrimary: string;
  textSecondary: string;
  borderColor: string;
  fontFamilyHead: string;
  fontFamilyBody: string;
  badgeStyle: string;
  gridStyle: string;
}

export interface TeacherPhotoConfig {
  url: string;
  scale: number;    // Multiplier, e.g. 1.0
  xOffset: number;  // Positional delta X %
  yOffset: number;  // Positional delta Y %
  opacity: number;  // 0.0 - 1.0
  saturation: number; // 0.0 - 1.0
  isMonochrome: boolean;
  shadow: 'none' | 'sm' | 'md' | 'lg' | 'glow';
  hasDropShadow: boolean;
}

export interface CoverPageData {
  tagline: string;       // e.g. "SBI PO, SBI CLERK 2024-2025"
  badgeText: string;     // e.g. "Guess Papers Inside"
  issueDate: string;     // e.g. "Feb, 2025"
  mainTitle: string;     // e.g. "QUvNT मंत्र"
  subTitle: string;      // e.g. "SBI CLERK Special Edition"
  bestMagLabel: string;  // e.g. "Best Monthly Magazine for Complete Quant"
  bulletPoints: string[]; // e.g. ["QUANTITY COMPARISON", "DATA SUFFICIENCY", "DI CASELETS", "SPEED MATHS"]
  authorName: string;    // e.g. "HARSHAL AGRAWAL"
  authorCreds: string;   // e.g. "IIT BHU, CAT 99.67%ILER"
  socialHandle: string;  // e.g. "learningcapsules"
}

export interface IndexItem {
  id: string;
  number: string;
  title: string;
  page: string;
}

export interface IndexPageData {
  title: string;          // e.g. "Table of Contents"
  categoryLabel: string;  // e.g. "📚 STUDY PLAN & LOG"
  leftColumnHeader: string; // e.g. "CLERK PRE"
  rightColumnHeader: string; // e.g. "CLERK MAINS"
  leftItems: IndexItem[];
  rightItems: IndexItem[];
  footerDecoration: string; // "curves" | "stripes" | "dots"
}

export interface TopperTalkItem {
  id: string;
  name: string;
  location: string;
  feedback: string;
}

export interface TopperPageData {
  mainTitle: string; // "Toppers' Talk"
  intro: string;     // Short sub-heading
  items: TopperTalkItem[];
}

export interface BioPageData {
  authorName: string;
  title: string;
  subtitle: string;
  paragraphs: string[];
  signatureQuote: string;
  socials: {
    youtube: string;
    telegram: string;
    instagram: string;
  };
}

export interface PromoFlyerData {
  topBadge: string;       // e.g. "Complete Basic to Advanced"
  mainTitle: string;      // e.g. "QUANT EXCLUSIVE"
  authorTag: string;      // e.g. "Harshal Agrawal"
  targetExam: string;     // e.g. "BANKING & INSURANCE EXAMS"
  features: string[];     // ["Complete Syllabus", "Live + Recorded", "Doubt Clearing", ...]
  discountCode: string;   // "SHARK"
  callToAction: string;   // "CLICK HERE TO JOIN"
  subPromoTitle: string;  // "EARLY LEAD [WAY TO SBI] SBI CLERK"
  priceBefore: string;    // "999"
  priceAfter: string;     // "750"
  limitedSeatsLabel: string; // "Offer Only For First 500 Students"
}

export interface ElementTransform {
  x: number;          // translate X pixel delta
  y: number;          // translate Y pixel delta
  scale: number;      // scale multiplier (e.g., 0.5 to 2.5)
  rotation: number;   // rotation degrees (0-360)
}

export interface ElementShadowConfig {
  color: string;
  blur: number;
  offsetX: number;
  offsetY: number;
  spread: number;
  inset: boolean;
}

export interface GradientConfig {
  type: 'linear' | 'radial';
  angle: number;
  colors: string[];
  stops?: number[];
}

export interface BackgroundLayer {
  themeId: ThemeId;
  opacity: number;
  blendMode: string;
}

export function gradientToCss(g: GradientConfig): string {
  if (g.type === 'linear') {
    const stops = g.colors.map((c, i) => {
      const p = g.stops?.[i] !== undefined ? g.stops![i] : Math.round((i / (g.colors.length - 1)) * 100);
      return `${c} ${p}%`;
    }).join(', ');
    return `linear-gradient(${g.angle}deg, ${stops})`;
  }
  const stops = g.colors.map((c, i) => {
    const p = g.stops?.[i] !== undefined ? g.stops![i] : Math.round((i / (g.colors.length - 1)) * 100);
    return `${c} ${p}%`;
  }).join(', ');
  return `radial-gradient(circle, ${stops})`;
}

export function shadowToCss(s: ElementShadowConfig, forText: boolean): string {
  const sI = s.inset && !forText ? 'inset ' : '';
  if (forText) {
    return `${sI}${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.color}`;
  }
  return `${sI}${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.spread}px ${s.color}`;
}

export const SYMBOLS: { char: string; label: string }[] = [
  { char: '∑', label: 'Sum' },
  { char: '∫', label: 'Integral' },
  { char: '√', label: 'Root' },
  { char: 'π', label: 'Pi' },
  { char: '∆', label: 'Delta' },
  { char: 'θ', label: 'Theta' },
  { char: 'α', label: 'Alpha' },
  { char: 'β', label: 'Beta' },
  { char: '∞', label: 'Infinity' },
  { char: '≠', label: 'Not Equal' },
  { char: '≈', label: 'Approx' },
  { char: '≤', label: 'Less Eq' },
  { char: '≥', label: 'Greater Eq' },
  { char: '∂', label: 'Partial' },
  { char: '∇', label: 'Nabla' },
  { char: 'λ', label: 'Lambda' },
  { char: 'μ', label: 'Mu' },
  { char: 'σ', label: 'Sigma' },
  { char: 'ω', label: 'Omega' },
  { char: 'φ', label: 'Phi' },
  { char: '∈', label: 'In Set' },
  { char: '∉', label: 'Not In' },
  { char: '∴', label: 'Therefore' },
  { char: '∅', label: 'Empty Set' },
];

export interface DuplicatedElement {
  id: string;
  type: 'text' | 'image';
  section: string;
  field: string;
  label: string;
  value: string;
  transform: ElementTransform;
  customBackground?: string;
  customTextColor?: string;
  customFont?: string;
  customAccent?: string;
  customStyles?: { bold?: boolean; italic?: boolean; underline?: boolean };
  customShadow?: ElementShadowConfig;
  customGradient?: GradientConfig;
}

// ── Template System ──────────────────────────────────────────────

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'featured' | 'math' | 'exam' | 'author' | 'promo';
  tags: string[];
  thumbnailEmoji: string;  // Emoji or short icon character for the template card
  state: Partial<AppState>;
}

export interface CanvasElement {
  id: string;
  page: string;
  type: 'text' | 'box' | 'symbol';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scale: number;
  content: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  textColor?: string;
  fontSize?: number;
  fontFamily?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  glowColor?: string;
  glowWidth?: number;
  opacity?: number;
  zIndex?: number;
  clipTop?: number;
  clipRight?: number;
  clipBottom?: number;
  clipLeft?: number;
  shadow?: ElementShadowConfig;
  gradient?: GradientConfig;
}

export interface AppState {
  currentTheme: ThemeId;
  currentPage: PageType;
  photo: TeacherPhotoConfig;
  coverData: CoverPageData;
  indexData: IndexPageData;
  topperData: TopperPageData;
  bioData: BioPageData;
  promoData: PromoFlyerData;
  transforms: Record<string, ElementTransform>;
  customPrimaryColor?: string;
  customBackgroundColor?: string;
  customTextColor?: string;
  customBackgrounds?: Record<string, string | undefined>;
  customElementTextColors?: Record<string, string | undefined>;
  customElementFonts?: Record<string, string | undefined>;
  customElementAccents?: Record<string, string | undefined>;
  hideDragTooltips?: boolean;
  appTheme?: 'light' | 'dark';
  customElementStyles?: Record<string, { bold?: boolean; italic?: boolean; underline?: boolean }>;
  hiddenElements?: Record<string, boolean>;
  elementCopies?: Record<string, string[]>;
  duplicatedElements?: DuplicatedElement[];
  canvasElements?: CanvasElement[];
  fontStyleId?: 'theme-default' | 'modern' | 'serif' | 'mono' | 'scifi' | 'elegant';
  photoGlowColor?: string;
  photoGlowWidth?: number; // slider override e.g. 10 to 40 px
  elementGlowColors?: Record<string, string | undefined>;
  elementGlowWidths?: Record<string, number | undefined>;
  elementShadows?: Record<string, ElementShadowConfig | undefined>;
  elementGradients?: Record<string, GradientConfig | undefined>;
  backgroundBlur?: number;
  backgroundLayers?: BackgroundLayer[];
  backgroundDecoration?: BackgroundDecorationId;
  decorationColor?: string;
  decorationOpacity?: number;
}

export type BackgroundDecorationId = 'none' | 'math-ring' | 'dot-grid' | 'wave-lines' | 'rings' | 'stars' | 'hexagons' | 'crosshatch' | 'diagonal-lines' | 'scattered-circles' | 'zigzag' | 'fraction-ring' | 'formula-flow';

export const BACKGROUND_DECORATIONS: { id: BackgroundDecorationId; label: string; description: string }[] = [
  { id: 'none', label: 'None', description: 'No background decoration' },
  { id: 'math-ring', label: 'Math Symbols Ring', description: 'Floating math symbols arranged in a ring' },
  { id: 'dot-grid', label: 'Dot Grid', description: 'A grid of subtle dots' },
  { id: 'wave-lines', label: 'Wave Lines', description: 'Horizontal sine wave lines' },
  { id: 'rings', label: 'Concentric Rings', description: 'Concentric geometric rings' },
  { id: 'stars', label: 'Star Field', description: 'A field of twinkling stars' },
  { id: 'hexagons', label: 'Hexagon Honeycomb', description: 'Honeycomb hexagonal grid pattern' },
  { id: 'crosshatch', label: 'Crosshatch Grid', description: 'Cross-hatched diagonal lines' },
  { id: 'diagonal-lines', label: 'Diagonal Stripes', description: 'Subtle diagonal striped pattern' },
  { id: 'scattered-circles', label: 'Scattered Circles', description: 'Randomly placed circle outlines' },
  { id: 'zigzag', label: 'Zigzag Waves', description: 'Sharp zigzag wave lines' },
  { id: 'fraction-ring', label: 'Fraction-Percentage Ring', description: 'Fraction-percentage pairs (½=50%, ¼=25%, …) in an orbital ring' },
  { id: 'formula-flow', label: 'Formula Flow', description: 'Floating formula patterns: actual value/total value × 100' },
];

