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
}

export interface CanvasElement {
  id: string;
  page: string;
  type: 'text' | 'box';
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
}

