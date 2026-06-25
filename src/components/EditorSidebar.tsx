import React, { useRef, useState, useEffect } from 'react';
import { AppState, ThemeId, PageType, CanvasElement } from '../types';
import { COMPILATION_THEMES } from '../data';
import { 
  Paintbrush, 
  RotateCcw, 
  Layers, 
  Settings, 
  User, 
  Plus, 
  ChevronRight, 
  Eye, 
  EyeOff,
  Grid, 
  Image as ImageIcon,
  Check,
  Award,
  BookOpen,
  Trash2,
  ArrowUpRight,
  Sliders,
  FolderOpen,
  Sparkles,
  HelpCircle,
  Square
} from 'lucide-react';

interface EditorSidebarProps {
  state: AppState;
  onChangeTheme: (theme: ThemeId) => void;
  onChangePage: (page: PageType) => void;
  onUpdatePhoto: (key: string, value: any) => void;
  onUpdateText: (section: string, key: string, value: any) => void;
  onResetData: () => void;
  activeElement: { section: string; field: string; label: string; duplicatedId?: string } | null;
  onClearActiveElement: () => void;
  onUpdateTransform: (key: string, value: any) => void;
  onSelectElement: (page: string, key: string, label: string, duplicatedId?: string) => void;
  onToggleHideElement: (elementId: string) => void;
  onDuplicateElement: (section: string, field: string) => void;
  onDuplicateAnyElement: (section: string, field: string, label: string, value: string, type?: 'text' | 'image') => void;
  onRemoveDuplicatedElement: (dupId: string) => void;
  onUpdateDuplicateTransform: (dupId: string, value: any) => void;
  onUpdateDuplicateText: (dupId: string, value: string) => void;
  onUpdateDuplicateStyle: (dupId: string, key: string, value: any) => void;
  onRemoveElementCopy?: (elementId: string, copyIndex: number) => void;
  onUpdateElementGlow?: (elementId: string, color: string | undefined) => void;
  onUpdateElementGlowWidth?: (elementId: string, width: number | undefined) => void;
  onAddCanvasElement?: (type: 'text' | 'box', overrides?: Partial<CanvasElement>) => void;
  onUpdateCanvasElement?: (id: string, updates: Partial<CanvasElement>) => void;
  onRemoveCanvasElement?: (id: string) => void;
  selectedCanvasId: string | null;
  onSelectCanvas: (id: string | null) => void;
  onImportHtml: () => void;
  onSaveDesign: (name: string) => void;
  onLoadDesign: (name: string) => void;
  onDeleteDesign: (name: string) => void;
  savedDesigns: string[];
  appTheme: 'light' | 'dark';
  onExportElementStyle: () => void;
  onImportElementStyle: () => void;
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  state,
  onChangeTheme,
  onChangePage,
  onUpdatePhoto,
  onUpdateText,
  onResetData,
  activeElement,
  onClearActiveElement,
  onUpdateTransform,
  onSelectElement,
  onToggleHideElement,
  onDuplicateElement,
  onDuplicateAnyElement,
  onRemoveDuplicatedElement,
  onUpdateDuplicateTransform,
  onUpdateDuplicateText,
  onUpdateDuplicateStyle,
  onRemoveElementCopy,
  onUpdateElementGlow,
  onUpdateElementGlowWidth,
  onAddCanvasElement,
  onUpdateCanvasElement,
  onRemoveCanvasElement,
  selectedCanvasId,
  onSelectCanvas,
  onImportHtml,
  onSaveDesign,
  onLoadDesign,
  onDeleteDesign,
  savedDesigns,
  appTheme,
  onExportElementStyle,
  onImportElementStyle
}) => {
  const [designName, setDesignName] = useState('');
  const isDark = appTheme === 'dark';
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // High-fidelity tab identifier: pages, design, photo, editor
  const [activeTab, setActiveTab] = useState<'pages' | 'design' | 'photo' | 'editor' | 'elements'>('pages');

  // Theme-aware class helpers
  const s = {
    aside: `w-full lg:w-96 p-5 flex flex-col gap-5 overflow-y-auto shrink-0 select-none border-r lg:border-r-0 ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-slate-200 text-slate-700'}`,
    panel: `rounded-xl border ${isDark ? 'bg-zinc-950/50 border-zinc-800/80' : 'bg-white border-slate-200 shadow-sm'}`,
    panelSolid: `rounded-xl border ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`,
    panelInner: `rounded-xl border ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'}`,
    textPrimary: isDark ? 'text-white' : 'text-slate-900',
    textSecondary: isDark ? 'text-zinc-300' : 'text-slate-700',
    textMuted: isDark ? 'text-zinc-400' : 'text-slate-500',
    tabBar: `grid grid-cols-5 gap-1 p-1 rounded-xl border shadow-inner ${isDark ? 'bg-zinc-950 border-zinc-855/80' : 'bg-slate-100 border-slate-200'}`,
    tabBtn: (sel: boolean) => sel
      ? `py-2 px-1 rounded-lg text-[10px] font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${isDark ? 'bg-zinc-800 text-white border border-zinc-700 shadow-md scale-105' : 'bg-white text-slate-900 border border-slate-300 shadow-sm scale-105'}`
      : `py-2 px-1 rounded-lg text-[10px] font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-900/50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`,
    pageBtn: (sel: boolean) => sel
      ? `w-full text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer flex justify-between items-center bg-[#ccff00]/10 border-[#ccff00] text-[#ccff00] font-black shadow-sm`
      : `w-full text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer flex justify-between items-center ${isDark ? 'bg-zinc-950 border-zinc-800 hover:bg-zinc-850 text-zinc-300' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'}`,
    layerBtn: (sel: boolean, hidden: boolean) => `flex items-center gap-1 rounded-lg border text-xs transition-colors ${hidden ? 'opacity-40' : ''} ${sel
      ? 'bg-[#ccff00]/10 border-[#ccff00]'
      : isDark ? 'bg-zinc-900/60 border-zinc-850 hover:bg-zinc-800' : 'bg-white border-slate-200 hover:bg-slate-100'
    }`,
    themeBtn: (sel: boolean) => sel
      ? `w-full p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all cursor-pointer border-[#ccff00] bg-zinc-950 shadow-sm`
      : `w-full p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all cursor-pointer ${isDark ? 'border-zinc-800 bg-zinc-950 hover:bg-zinc-850' : 'border-slate-200 bg-white hover:bg-slate-50'}`,
    input: `w-full rounded-lg border p-2.5 text-xs font-medium focus:ring-1 focus:ring-[#ccff00] focus:outline-none ${isDark ? 'bg-zinc-950 text-white border-zinc-800' : 'bg-white text-slate-900 border-slate-200'}`,
    textarea: `w-full rounded-lg border p-2.5 text-xs focus:ring-1 focus:ring-[#ccff00] focus:outline-none font-medium leading-relaxed ${isDark ? 'bg-zinc-950 text-white border-zinc-800' : 'bg-white text-slate-900 border-slate-200'}`,
    badgeDefault: (active: boolean) => `px-2 py-1 rounded text-[9px] font-mono border transition-all cursor-pointer hover:scale-105 shrink-0 ${active ? 'border-cyan-400 bg-cyan-950/20 text-cyan-300 shadow-sm' : isDark ? 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white' : 'border-slate-200 bg-white text-slate-500 hover:text-slate-900'}`,
    divider: isDark ? 'border-zinc-800' : 'border-slate-200',
    dividerLight: isDark ? 'border-zinc-805/55' : 'border-slate-200/70',
  };

  const activeTheme = COMPILATION_THEMES[state.currentTheme];

  // Auto-focus on active element inspect tab when user clicks on any element
  useEffect(() => {
    if (activeElement) {
      setActiveTab('editor');
    }
  }, [activeElement]);

  // Auto-switch to the Layer tab when a canvas element is selected
  useEffect(() => {
    if (selectedCanvasId) {
      setActiveTab('editor');
    }
  }, [selectedCanvasId]);

  // Image Upload handler translates local file to client-side dataURI
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onUpdatePhoto('url', reader.result as string);
        setActiveTab('photo'); // Switch to photo settings for instant feedback
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file dialog
  const triggerImageSelect = () => {
    fileInputRef.current?.click();
  };

  // Helper directory of editable fields dynamically computed per page
  const getPageLayers = (page: string) => {
    switch (page) {
      case 'cover':
        return [
          { field: 'mainTitle', label: 'Main Magazine Title' },
          { field: 'subTitle', label: 'Subtitle / Edition Type' },
          { field: 'tagline', label: 'Tagline Header' },
          { field: 'badgeText', label: 'Sticker Announcement' },
          { field: 'issueDate', label: 'Issue Date/Month' },
          { field: 'bestMagLabel', label: 'Confidence Label Statement' },
          { field: 'authorName', label: 'Author Name' },
          { field: 'authorCreds', label: 'Author Credentials' },
          { field: 'socialHandle', label: 'Social Branding Handle' }
        ];
      case 'index':
        return [
          { field: 'title', label: 'Index Title' },
          { field: 'leftColumnHeader', label: 'Column 1 Header' },
          { field: 'rightColumnHeader', label: 'Column 2 Header' }
        ];
      case 'topper':
        return [
          { field: 'mainTitle', label: 'Toppers Talk Title' },
          { field: 'intro', label: 'Toppers Intro text' }
        ];
      case 'bio':
        return [
          { field: 'title', label: 'Author Header Title' },
          ...state.bioData.paragraphs.map((_, idx) => ({
            field: `paragraphs.${idx}`,
            label: `Bio Paragraph ${idx + 1}`
          })),
          { field: 'signatureQuote', label: 'Signature Quote Capsule' }
        ];
      case 'promo':
        return [
          { field: 'topBadge', label: 'Promotion Top Tag' },
          { field: 'mainTitle', label: 'Course Main Title' },
          { field: 'authorTag', label: 'Author Subline' },
          { field: 'targetExam', label: 'Target Exam Category' },
          ...state.promoData.features.map((_, idx) => ({
            field: `features.${idx}`,
            label: `Feature Bullet ${idx + 1}`
          })),
          { field: 'limitedSeatsLabel', label: 'Limited Seats Tag' },
          { field: 'discountCode', label: 'Coupon Discount Code' },
          { field: 'callToAction', label: 'CTA Label' }
        ];
      default:
        return [];
    }
  };

  // Helper to dynamically render input controls based on parsed active elements
  const renderSelectedElementInput = () => {
    if (!activeElement) {
      return (
        <div className={`${s.panel} p-5 text-center space-y-3`}>
          <div className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-500' : 'bg-slate-100 border-slate-200 text-slate-400'}`} style={{ borderWidth: 1 }}>
            <Sliders size={18} />
          </div>
          <div className="space-y-1">
            <h4 className={`text-xs font-bold ${s.textPrimary}`}>No Selected Layer</h4>
            <p className={`text-[10px] ${s.textMuted} max-w-[240px] mx-auto leading-relaxed`}>
              Click on any text block on the magazine cover preview, or choose from the <b>Layer List</b> under the <b>Pages</b> tab to edit text custom styles, sizes, and backgrounds!
            </p>
          </div>
        </div>
      );
    }

    const { section, field, label, duplicatedId } = activeElement;

    // Determine if we're editing a duplicated element
    const activeDup = duplicatedId ? (state.duplicatedElements || []).find((d) => d.id === duplicatedId) : null;

    // elementId for transforms/overrides is always `${section}.${field}`.
    // Duplicate elements store their transform/styles in `duplicatedElements` keyed by `duplicatedId`.
    const elementId = `${section}.${field}`;


    // Use duplicate's transform if editing a duplicate
    const transform = activeDup
      ? activeDup.transform
      : field === '__photo__'
        ? {
            x: state.photo.xOffset,
            y: state.photo.yOffset,
            scale: state.photo.scale,
            rotation: (state.transforms || {})[elementId]?.rotation ?? 0,
          }
        : (state.transforms || {})[elementId] || { x: 0, y: 0, scale: 1.0, rotation: 0 };

    // Get value safely
    let value = "";
    if (activeDup) {
      value = activeDup.value;
    } else if (section === 'cover') {
      if (field.startsWith('bulletPoints.')) {
        const idx = parseInt(field.split('.')[1]);
        value = state.coverData.bulletPoints[idx] || "";
      } else {
        value = (state.coverData as any)[field] || "";
      }
    } else if (section === 'index') {
      value = (state.indexData as any)[field] || "";
    } else if (section === 'topper') {
      value = (state.topperData as any)[field] || "";
    } else if (section === 'bio') {
      if (field.startsWith('paragraphs.')) {
        const idx = parseInt(field.split('.')[1]);
        value = state.bioData.paragraphs[idx] || "";
      } else {
        value = (state.bioData as any)[field] || "";
      }
    } else if (section === 'promo') {
      if (field.startsWith('features.')) {
        const idx = parseInt(field.split('.')[1]);
        value = state.promoData.features[idx] || "";
      } else {
        value = (state.promoData as any)[field] || "";
      }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const val = e.target.value;
      if (activeDup) {
        onUpdateDuplicateText(activeDup.id, val);
      } else if (section === 'cover' && field.startsWith('bulletPoints.')) {
        const idx = parseInt(field.split('.')[1]);
        const arr = [...state.coverData.bulletPoints];
        arr[idx] = val;
        onUpdateText('cover', 'bulletPoints', arr);
      } else if (section === 'bio' && field.startsWith('paragraphs.')) {
        const idx = parseInt(field.split('.')[1]);
        const arr = [...state.bioData.paragraphs];
        arr[idx] = val;
        onUpdateText('bio', 'paragraphs', arr);
      } else if (section === 'promo' && field.startsWith('features.')) {
        const idx = parseInt(field.split('.')[1]);
        const arr = [...state.promoData.features];
        arr[idx] = val;
        onUpdateText('promo', 'features', arr);
      } else {
        onUpdateText(section, field, val);
      }
    };

    const handleXChange = (val: number) => {
      if (activeDup) onUpdateDuplicateTransform(activeDup.id, { x: val });
      else if (field === '__photo__') onUpdatePhoto('xOffset', val);
      else onUpdateTransform(elementId, { x: val });
    };

    const handleYChange = (val: number) => {
      if (activeDup) onUpdateDuplicateTransform(activeDup.id, { y: val });
      else if (field === '__photo__') onUpdatePhoto('yOffset', val);
      else onUpdateTransform(elementId, { y: val });
    };

    const handleScaleChange = (val: number) => {
      if (activeDup) onUpdateDuplicateTransform(activeDup.id, { scale: val });
      else if (field === '__photo__') onUpdatePhoto('scale', val);
      else onUpdateTransform(elementId, { scale: val });
    };

    const handleRotationChange = (val: number) => {
      if (activeDup) onUpdateDuplicateTransform(activeDup.id, { rotation: val });
      else onUpdateTransform(elementId, { rotation: val });
    };

    const handleResetTransform = () => {
      if (activeDup) onUpdateDuplicateTransform(activeDup.id, { x: 0, y: 0, scale: 1.0, rotation: 0 });
      else if (field === '__photo__') {
        onUpdatePhoto('xOffset', 0);
        onUpdatePhoto('yOffset', -5);
        onUpdatePhoto('scale', 1.1);
        onUpdateTransform(elementId, { rotation: 0 });
      } else onUpdateTransform(elementId, { x: 0, y: 0, scale: 1.0, rotation: 0 });
    };

    return (
      <div className="space-y-4">
        {/* Selected Layer Info */}
        <div className="bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-xl p-4.5 space-y-4 animate-fadeIn">
          <div className={`flex justify-between items-center p-1.5 rounded-lg border ${isDark ? 'bg-black/20 border-[#ccff00]/10' : 'bg-black/5 border-[#ccff00]/20'}`}>
            <span className="text-[9px] font-mono uppercase bg-[#ccff00] font-extrabold tracking-wide text-black px-2 py-0.5 rounded shadow-sm">
              Layer: {label}
            </span>
            <button 
              onClick={onClearActiveElement}
              className={`text-[10px] underline cursor-pointer ${isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Deselect
            </button>
          </div>
          
          {field !== '__photo__' && (
            <div>
              <label className={`block text-xs font-semibold ${s.textSecondary} mb-2`}>
                Editing raw text:
              </label>

              {field.includes('paragraphs') || field.includes('feedback') || field.includes('signatureQuote') ? (
                <textarea
                  value={value}
                  onChange={handleChange}
                  rows={3}
                  className={s.textarea}
                />
              ) : (
                <input
                  type="text"
                  value={value}
                  onChange={handleChange}
                  className={s.input}
                />
              )}
            </div>
          )}

          {/* Text Style Toolbar: Bold / Italic / Underline toggle buttons — hidden for image/photo */}
          {field !== '__photo__' && (() => {
            const currentStyles = activeDup
              ? (activeDup.customStyles || {})
              : ((state.customElementStyles || {})[elementId] || {});
            const isBold = !!currentStyles.bold;
            const isItalic = !!currentStyles.italic;
            const isUnderline = !!currentStyles.underline;

            const toggleStyle = (styleKey: 'bold' | 'italic' | 'underline') => {
              if (activeDup) {
                const newStyles = { ...(activeDup.customStyles || {}) };
                if (newStyles[styleKey]) delete newStyles[styleKey];
                else newStyles[styleKey] = true;
                onUpdateDuplicateStyle(activeDup.id, 'customStyles', Object.keys(newStyles).length ? newStyles : undefined);
              } else {
                const allStyles = { ...(state.customElementStyles || {}) };
                const elemStyles = { ...(allStyles[elementId] || {}) };
                if (elemStyles[styleKey]) {
                  delete elemStyles[styleKey];
                } else {
                  elemStyles[styleKey] = true;
                }
                if (Object.keys(elemStyles).length === 0) {
                  delete allStyles[elementId];
                } else {
                  allStyles[elementId] = elemStyles;
                }
                onUpdateText('global', 'customElementStyles', allStyles);
              }
            };

            return (
              <div className="pt-1.5 pb-1">
                <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-bold block mb-1.5">Text Style</span>
                <div className="flex gap-1">
                  {/* Bold Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleStyle('bold')}
                    className={`w-9 h-8 rounded-lg border text-xs font-black transition-all cursor-pointer flex items-center justify-center ${
                      isBold
                        ? 'bg-[#ccff00] text-black border-[#ccff00] shadow-sm'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800 hover:text-white'
                    }`}
                    title="Toggle Bold"
                    aria-label="Toggle Bold"
                  >
                    <span className="text-sm">B</span>
                  </button>

                  {/* Italic Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleStyle('italic')}
                    className={`w-9 h-8 rounded-lg border text-xs font-black transition-all cursor-pointer flex items-center justify-center ${
                      isItalic
                        ? 'bg-[#ccff00] text-black border-[#ccff00] shadow-sm'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800 hover:text-white'
                    }`}
                    title="Toggle Italic"
                    aria-label="Toggle Italic"
                  >
                    <span className="text-sm italic">I</span>
                  </button>

                  {/* Underline Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleStyle('underline')}
                    className={`w-9 h-8 rounded-lg border text-xs font-black transition-all cursor-pointer flex items-center justify-center ${
                      isUnderline
                        ? 'bg-[#ccff00] text-black border-[#ccff00] shadow-sm'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800 hover:text-white'
                    }`}
                    title="Toggle Underline"
                    aria-label="Toggle Underline"
                  >
                    <span className="text-sm underline">U</span>
                  </button>

                  {/* Clear all styles button */}
                  {(isBold || isItalic || isUnderline) && (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeDup) {
                          onUpdateDuplicateStyle(activeDup.id, 'customStyles', undefined);
                        } else {
                          const allStyles = { ...(state.customElementStyles || {}) };
                          delete allStyles[elementId];
                          onUpdateText('global', 'customElementStyles', allStyles);
                        }
                      }}
                      className="px-2 h-8 rounded-lg border border-zinc-800 bg-zinc-900 text-[9px] text-zinc-500 hover:text-red-400 transition-colors cursor-pointer font-mono shrink-0"
                      title="Clear all text styles"
                      aria-label="Clear all text styles"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Text background override controller */}
          {field !== '__photo__' && (() => {
            const currentBg = activeDup ? activeDup.customBackground : (state.customBackgrounds || {})[elementId];
            const handleBgChange = (bgValue: string | undefined) => {
              if (activeDup) {
                onUpdateDuplicateStyle(activeDup.id, 'customBackground', bgValue);
              } else {
                const bgs = { ...(state.customBackgrounds || {}) };
                if (bgValue === undefined) {
                  delete bgs[elementId];
                } else {
                  bgs[elementId] = bgValue;
                }
                onUpdateText('global', 'customBackgrounds', bgs);
              }
            };

            return (
              <div className="pt-3.5 border-t border-zinc-800/50 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-400 block uppercase font-bold text-left">Text Block Background</span>
                  <span className="text-[9px] font-mono text-zinc-200 uppercase bg-zinc-900 border border-zinc-850 px-1.5 py-0.5 rounded">
                    {currentBg === undefined ? 'Theme Default' : currentBg === 'none' ? 'None (Transparent)' : currentBg}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 items-center">
                  {/* Custom Color Input */}
                  <input
                    type="color"
                    id={`bg-color-${elementId}`}
                    value={currentBg && currentBg !== 'none' ? currentBg : '#000000'}
                    onChange={(e) => handleBgChange(e.target.value)}
                    className="w-8 h-8 rounded border border-zinc-800 cursor-pointer bg-transparent shrink-0"
                    title="Choose Custom Color"
                    aria-label="Choose custom background color"
                  />

                  {/* Presets */}
                  {[
                    { label: 'Transparent', value: 'none', bg: 'transparent' },
                    { label: 'Deep Black', value: '#0a0a0a', bg: '#0a0a0a' },
                    { label: 'Glass Black', value: 'rgba(0,0,0,0.55)', bg: 'rgba(0,0,0,0.55)' },
                    { label: 'Clean White', value: '#ffffff', bg: '#ffffff' },
                    { label: 'Primary Accent', value: activeTheme.colors.primary, bg: activeTheme.colors.primary },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handleBgChange(preset.value)}
                      className={`px-2 py-1 rounded text-[9px] font-mono border transition-all cursor-pointer hover:scale-105 shrink-0 ${
                        currentBg === preset.value
                          ? 'border-cyan-400 bg-cyan-950/20 text-cyan-300 shadow-sm'
                          : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}

                  {/* Reset button */}
                  {currentBg !== undefined && (
                    <button
                      type="button"
                      onClick={() => handleBgChange(undefined)}
                      className="ml-auto text-[9px] text-red-500 hover:text-red-400 underline font-mono shrink-0 cursor-pointer font-bold"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {/* Detach Background Box — converts the text's background into a separate movable canvas box */}
                {currentBg !== undefined && currentBg !== 'none' && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById(`editable-${section}-${field}`);
                        if (!el) return;
                        const container = el.closest('[style*="aspect-ratio: 210 / 297"]');
                        if (!container) return;
                        const elRect = el.getBoundingClientRect();
                        const containerRect = container.getBoundingClientRect();
                        const relX = Math.round(elRect.left - containerRect.left);
                        const relY = Math.round(elRect.top - containerRect.top);
                        const w = Math.round(elRect.width);
                        const h = Math.round(elRect.height);
                        const bgVal = currentBg;
                        // Clear background from original element
                        if (activeDup) {
                          onUpdateDuplicateStyle(activeDup.id, 'customBackground', 'none');
                        } else {
                          const bgs = { ...(state.customBackgrounds || {}) };
                          delete bgs[elementId];
                          onUpdateText('global', 'customBackgrounds', bgs);
                        }
                        // Create a new canvas box at the element's exact position
                        onAddCanvasElement?.('box', {
                          page: state.currentPage,
                          x: relX,
                          y: relY,
                          width: w,
                          height: h,
                          backgroundColor: bgVal,
                          borderRadius: 4,
                          zIndex: 5,
                        });
                      }}
                      className="w-full py-1.5 px-3 text-[10px] font-mono rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-[#ccff00] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>✂️</span> Detach Background Box
                    </button>
                    <p className="text-[8px] text-zinc-500 mt-1 leading-tight">Creates a separate box element with this background. Now you can move text &amp; background independently!</p>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Text color override controller */}
          {field !== '__photo__' && (() => {
            const currentTextColor = activeDup ? activeDup.customTextColor : (state.customElementTextColors || {})[elementId];
            const handleTextColorChange = (colorValue: string | undefined) => {
              if (activeDup) {
                onUpdateDuplicateStyle(activeDup.id, 'customTextColor', colorValue);
              } else {
                const colorsMap = { ...(state.customElementTextColors || {}) };
                if (colorValue === undefined) {
                  delete colorsMap[elementId];
                } else {
                  colorsMap[elementId] = colorValue;
                }
                onUpdateText('global', 'customElementTextColors', colorsMap);
              }
            };

            return (
              <div className="pt-3.5 border-t border-zinc-805/50 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-400 block uppercase font-bold text-left">Main Text Color</span>
                  <span className="text-[9px] font-mono text-zinc-200 uppercase bg-zinc-900 border border-zinc-850 px-1.5 py-0.5 rounded">
                    {currentTextColor === undefined ? 'Theme Default' : currentTextColor}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 items-center">
                  <input
                    type="color"
                    id={`text-color-${elementId}`}
                    value={currentTextColor || '#ffffff'}
                    onChange={(e) => handleTextColorChange(e.target.value)}
                    className="w-8 h-8 rounded border border-zinc-800 cursor-pointer bg-transparent shrink-0"
                    title="Choose Custom Color"
                    aria-label="Choose custom text color"
                  />

                  {[
                    { label: 'White', value: '#ffffff' },
                    { label: 'Pure Black', value: '#000000' },
                    { label: 'Accent Lime', value: '#ccff00' },
                    { label: 'Cyan Blue', value: '#00f0ff' },
                    { label: 'Soft Sand', value: '#f4f4f0' },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handleTextColorChange(preset.value)}
                      className={`px-2 py-1 rounded text-[9px] font-mono border transition-all cursor-pointer hover:scale-105 shrink-0 ${
                        currentTextColor === preset.value
                          ? 'border-cyan-400 bg-cyan-950/20 text-cyan-300 shadow-sm'
                          : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}

                  {currentTextColor !== undefined && (
                    <button
                      type="button"
                      onClick={() => handleTextColorChange(undefined)}
                      className="ml-auto text-[9px] text-red-500 hover:text-red-400 underline font-mono shrink-0 cursor-pointer font-bold"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Font Style / Typeface override controller — hidden for image/photo */}
          {field !== '__photo__' && (() => {
            const currentFont = activeDup ? activeDup.customFont : (state.customElementFonts || {})[elementId];
            const handleFontChange = (fontValue: string | undefined) => {
              if (activeDup) {
                onUpdateDuplicateStyle(activeDup.id, 'customFont', fontValue);
              } else {
                const fontsMap = { ...(state.customElementFonts || {}) };
                if (fontValue === undefined || fontValue === '') {
                  delete fontsMap[elementId];
                } else {
                  fontsMap[elementId] = fontValue;
                }
                onUpdateText('global', 'customElementFonts', fontsMap);
              }
            };

            return (
              <div className="pt-3.5 border-t border-zinc-805/50 space-y-2">
                <span className="text-[10px] text-zinc-400 block uppercase font-bold text-left">Font Face / Style Override</span>
                <div className="flex gap-2">
                  <select
                    value={currentFont || ''}
                    onChange={(e) => handleFontChange(e.target.value || undefined)}
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="">Default Theme Style</option>
                    <optgroup label="Custom Typefaces">
                      <option value="font-family: 'Space Grotesk', sans-serif">Space Grotesk (Modern)</option>
                      <option value="font-family: 'Playfair Display', serif">Playfair Display (Serif)</option>
                      <option value="font-family: 'JetBrains Mono', monospace">JetBrains Mono (Technical)</option>
                      <option value="font-family: 'Syne', sans-serif">Syne (Sci-Fi)</option>
                      <option value="font-family: 'Cinzel', serif">Cinzel (Elegant Serif)</option>
                      <option value="font-family: 'Cormorant Garamond', serif">Cormorant Garamond</option>
                      <option value="font-family: 'Inter', sans-serif">Inter (Sans)</option>
                    </optgroup>
                    <optgroup label="Style Modifiers">
                      <option value="italic">Italicize Text</option>
                      <option value="bold">Bold Text</option>
                      <option value="uppercase">All Caps / Uppercase</option>
                      <option value="underline">Underline Text</option>
                    </optgroup>
                  </select>

                  {currentFont && (
                    <button
                      type="button"
                      onClick={() => handleFontChange(undefined)}
                      className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-[9px] border border-zinc-805 text-red-400 rounded-lg shrink-0 cursor-pointer font-bold"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Accent / Border color override controller — hidden for image/photo */}
          {field !== '__photo__' && (() => {
            const currentAccentColor = activeDup ? activeDup.customAccent : (state.customElementAccents || {})[elementId];
            const handleAccentColorChange = (accentValue: string | undefined) => {
              if (activeDup) {
                onUpdateDuplicateStyle(activeDup.id, 'customAccent', accentValue);
              } else {
                const accentsMap = { ...(state.customElementAccents || {}) };
                if (accentValue === undefined) {
                  delete accentsMap[elementId];
                } else {
                  accentsMap[elementId] = accentValue;
                }
                onUpdateText('global', 'customElementAccents', accentsMap);
              }
            };

            return (
              <div className="pt-3.5 border-t border-zinc-805/50 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-400 block uppercase font-bold text-left">Accent / Border Highlight Color</span>
                  <span className="text-[9px] font-mono text-zinc-200 uppercase bg-zinc-900 border border-zinc-850 px-1.5 py-0.5 rounded">
                    {currentAccentColor === undefined ? 'Theme Default' : currentAccentColor}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 items-center">
                  <input
                    type="color"
                    id={`accent-color-${elementId}`}
                    value={currentAccentColor || activeTheme.colors.primary}
                    onChange={(e) => handleAccentColorChange(e.target.value)}
                    className="w-8 h-8 rounded border border-zinc-800 cursor-pointer bg-transparent shrink-0"
                    title="Choose Accent Color"
                    aria-label="Choose accent highlight color"
                  />

                  {[
                    { label: 'Theme Accent', value: activeTheme.colors.primary },
                    { label: 'Neon Cyber', value: '#e2ff00' },
                    { label: 'Vivid Violet', value: '#c084fc' },
                    { label: 'Sunset Red', value: '#ef4444' },
                    { label: 'Clean Border', value: '#27272a' },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handleAccentColorChange(preset.value)}
                      className={`px-2 py-1 rounded text-[9px] font-mono border transition-all cursor-pointer hover:scale-105 shrink-0 ${
                        currentAccentColor === preset.value
                          ? 'border-cyan-400 bg-cyan-950/20 text-cyan-300 shadow-sm'
                          : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}

                  {currentAccentColor !== undefined && (
                    <button
                      type="button"
                      onClick={() => handleAccentColorChange(undefined)}
                      className="ml-auto text-[9px] text-red-500 hover:text-red-400 underline font-mono shrink-0 cursor-pointer font-bold"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Element Glow color/width control — hidden for photo (has its own) */}
          {field !== '__photo__' && (() => {
            const currentGlowColor = activeDup ? undefined : (state.elementGlowColors || {})[elementId];
            const currentGlowWidth = activeDup ? undefined : (state.elementGlowWidths || {})[elementId] ?? 15;

            const handleGlowColorChange = (color: string | undefined) => {
              if (activeDup) return;
              onUpdateElementGlow?.(elementId, color);
            };

            const handleGlowWidthChange = (w: number) => {
              if (activeDup) return;
              onUpdateElementGlowWidth?.(elementId, w);
            };

            return (
              <div className="pt-3.5 border-t border-zinc-805/50 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-400 block uppercase font-bold text-left">Outer Glow</span>
                  <span className="text-[9px] font-mono text-zinc-200 uppercase bg-zinc-900 border border-zinc-850 px-1.5 py-0.5 rounded">
                    {currentGlowColor === undefined ? 'Off' : currentGlowColor}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 items-center">
                  <input
                    type="color"
                    id={`glow-color-${elementId}`}
                    value={currentGlowColor || '#00ffcc'}
                    onChange={(e) => handleGlowColorChange(e.target.value)}
                    className="w-8 h-8 rounded border border-zinc-800 cursor-pointer bg-transparent shrink-0"
                    title="Choose Glow Color"
                    aria-label="Choose glow color"
                  />

                  {[
                    { label: 'Off', value: undefined },
                    { label: 'Cyan', value: '#00ffcc' },
                    { label: 'Lime', value: '#ccff00' },
                    { label: 'Violet', value: '#c084fc' },
                    { label: 'Amber', value: '#f59e0b' },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handleGlowColorChange(preset.value)}
                      className={`px-2 py-1 rounded text-[9px] font-mono border transition-all cursor-pointer hover:scale-105 shrink-0 ${
                        currentGlowColor === preset.value
                          ? 'border-cyan-400 bg-cyan-950/20 text-cyan-300 shadow-sm'
                          : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {currentGlowColor !== undefined && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] text-zinc-500">
                      <span>Glow Width</span>
                      <span>{currentGlowWidth}px</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="40"
                      value={currentGlowWidth}
                      onChange={(e) => handleGlowWidthChange(Number(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                      aria-label="Outer glow radius"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        handleGlowColorChange(undefined);
                        handleGlowWidthChange(15);
                      }}
                      className="text-[9px] text-red-500 hover:text-red-400 underline font-mono cursor-pointer font-bold"
                    >
                      Reset Glow
                    </button>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Duplicate & Hide/Remove action buttons — shown for ALL elements */}
          {(() => {
            const isDupEditor = !!activeDup;
            const isHidden = !isDupEditor && !!(state.hiddenElements || {})[`${section}.${field}`];

            return (
              <div className="pt-2 pb-0 flex gap-2">
                {/* Duplicate button — universal: creates a fully editable clone */}
                <button
                  type="button"
                  onClick={() => {
                    onDuplicateAnyElement(section, field, label, value);
                  }}
                  className="flex-1 py-2 px-2 bg-teal-950/20 hover:bg-teal-900/30 border border-dashed border-teal-500/40 rounded-lg text-[9px] font-mono text-teal-400 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  title="Create a fully editable duplicate of this element"
                  aria-label="Duplicate element"
                >
                  <Plus size={11} />
                  <span>Duplicate</span>
                </button>

                {/* For duplicated elements — show Remove; for originals — show Hide/Show */}
                {isDupEditor ? (
                  <button
                    type="button"
                    onClick={() => {
                      onRemoveDuplicatedElement(activeDup!.id);
                      onClearActiveElement();
                    }}
                    className="flex-1 py-2 px-2 bg-red-950/20 hover:bg-red-900/30 border border-dashed border-red-500/40 rounded-lg text-[9px] font-mono text-red-400 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    title="Remove this duplicated element"
                    aria-label="Remove duplicate"
                  >
                    <span>Remove</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onToggleHideElement(`${section}.${field}`);
                      onClearActiveElement();
                    }}
                    className={`flex-1 py-2 px-2 border border-dashed rounded-lg text-[9px] font-mono transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                      isHidden
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/30'
                        : 'bg-red-950/20 border-red-500/40 text-red-400 hover:bg-red-900/30'
                    }`}
                    title={isHidden ? 'Show this element again' : 'Hide this element for this session'}
                    aria-label={isHidden ? 'Show element' : 'Hide element'}
                  >
                    {isHidden ? <><Eye size={11} /><span>Show</span></> : <><EyeOff size={11} /><span>Hide</span></>}
                  </button>
                )}
              </div>
            );
          })()}

          {/* Export/Import Style Preset buttons */}
          <div className="pt-1 flex gap-2">
            <button
              type="button"
              onClick={onExportElementStyle}
              className="flex-1 py-2 px-2 border rounded-lg text-[9px] font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 bg-purple-950/20 hover:bg-purple-900/30 border-dashed border-purple-500/40 text-purple-400"
              title="Export this element's style (background, colors, font, glow, position) as a .json preset file"
            >
              <ArrowUpRight size={11} />
              <span>Export Style</span>
            </button>
            <button
              type="button"
              onClick={onImportElementStyle}
              className="flex-1 py-2 px-2 border rounded-lg text-[9px] font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 bg-indigo-950/20 hover:bg-indigo-900/30 border-dashed border-indigo-500/40 text-indigo-400"
              title="Import a .json style preset and apply it to this element"
            >
              <FolderOpen size={11} />
              <span>Import Style</span>
            </button>
          </div>

          {/* Dynamic position and scale coordinates and slider overrides */}
          <div className="pt-3 border-t border-zinc-800 space-y-3.5">
            <div className="flex justify-between items-center text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
              <span>📐 Shift & Resize</span>
              <button
                type="button"
                onClick={handleResetTransform}
                className="text-[9px] text-amber-400 hover:underline cursor-pointer font-semibold"
              >
                Reset Layout Position
              </button>
            </div>

            {/* Size slider */}
            <div>
              <div className="flex justify-between text-[9px] mb-1.5 text-zinc-400 uppercase font-mono">
                <span>Scale Size / text multiplier</span>
                <span className="text-white font-bold">{Math.round(transform.scale * 100)}%</span>
              </div>
              <input
                type="range"
                id={`scale-${elementId}`}
                min="0.4"
                max="2.5"
                step="0.05"
                value={transform.scale}
                onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
                className="w-full accent-[#ccff00] cursor-pointer"
                aria-label="Scale size / text multiplier"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pb-1">
              {/* Position X slider */}
              <div>
                <div className="flex justify-between text-[9px] mb-1.5 text-zinc-400 uppercase font-mono">
                  <span>Shift X (Align)</span>
                  <span className="text-white font-bold">{transform.x}px</span>
                </div>
                <input
                  type="range"
                  id={`shift-x-${elementId}`}
                  min="-200"
                  max="200"
                  step="1"
                  value={transform.x}
                  onChange={(e) => handleXChange(parseInt(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                  aria-label="Horizontal position offset"
                />
              </div>

              {/* Position Y slider */}
              <div>
                <div className="flex justify-between text-[9px] mb-1.5 text-zinc-400 uppercase font-mono">
                  <span>Shift Y (V-Align)</span>
                  <span className="text-white font-bold">{transform.y ?? 0}px</span>
                </div>
                <input
                  type="range"
                  id={`shift-y-${elementId}`}
                  min="-250"
                  max="250"
                  step="1"
                  value={transform.y ?? 0}
                  onChange={(e) => handleYChange(parseInt(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                  aria-label="Vertical position offset"
                />
              </div>
            </div>

            {/* Rotation slider (0-360 degrees) */}
            <div>
              <div className="flex justify-between text-[9px] mb-1.5 text-zinc-400 uppercase font-mono">
                <span>Rotation</span>
                <span className="text-white font-bold">{Math.round(transform.rotation ?? 0)}°</span>
              </div>
              <input
                type="range"
                id={`rotation-${elementId}`}
                min="0"
                max="360"
                step="1"
                value={transform.rotation ?? 0}
                onChange={(e) => handleRotationChange(parseInt(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer"
                aria-label="Element rotation"
              />
            </div>
            
            <p className="text-[9px] text-zinc-400 leading-normal bg-black/40 p-2.5 rounded border border-zinc-850/60 font-mono">
              💡 <b>Drag & drop support:</b> You can also left-click and drag this text directly on the canvas with your mouse!
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Directory block showing layers of text
  const renderLayersList = () => {
    const layers = getPageLayers(state.currentPage);
    return (
      <div className={`space-y-2.5 ${s.panel} p-4`}>
        <div className="flex items-center justify-between">
          <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${s.textPrimary}`}>
            <Layers size={13} className="text-[#ccff00]" />
            <span>📝 Layers List Directory</span>
          </label>
          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${isDark ? 'bg-zinc-900 border-zinc-850 text-zinc-400' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
            {layers.length} Layers
          </span>
        </div>

        <p className={`text-[9px] ${s.textMuted} leading-normal mb-1`}>
          Click any magazine field below to instantly unlock custom colors, fonts, margins, and layout offsets:
        </p>

        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {layers.map((layer) => {
            const isSelected = activeElement?.field === layer.field;
            const elementId = `${state.currentPage}.${layer.field}`;
            const isHidden = !!(state.hiddenElements || {})[elementId];
            return (
              <div
                key={layer.field}
                className={s.layerBtn(isSelected, isHidden)}
              >
                <button
                  onClick={() => onToggleHideElement(elementId)}
                  className={`px-1.5 py-1.5 rounded-l-lg transition-colors shrink-0 cursor-pointer ${isDark ? 'text-zinc-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}
                  title={isHidden ? 'Show this element' : 'Hide this element'}
                  aria-label={isHidden ? 'Show element' : 'Hide element'}
                >
                  {isHidden ? <Eye size={11} /> : <EyeOff size={11} />}
                </button>
                <button
                  onClick={() => onSelectElement(state.currentPage, layer.field, layer.label)}
                  className={`flex-1 text-left py-1.5 pr-3 flex items-center justify-between cursor-pointer ${
                    isSelected ? 'text-[#ccff00] font-bold' : s.textSecondary
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? 'bg-[#ccff00]' : isDark ? 'bg-zinc-650' : 'bg-slate-300'}`} />
                    <span className={`truncate ${isHidden ? 'line-through' : ''}`}>{layer.label}</span>
                  </div>
                  <ChevronRight size={11} className={isSelected ? 'text-[#ccff00]' : isDark ? 'text-zinc-600' : 'text-slate-300'} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Canvas Elements in Layer List */}
        {(state.canvasElements ?? []).filter(el => el.page === state.currentPage).length > 0 && (
          <>
            <div className="flex items-center justify-between pt-2 border-t border-zinc-800 mt-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                <Square size={10} className="text-[#ccff00]" />
                <span>Canvas Elements</span>
              </span>
              <span className={"text-[9px] font-mono px-1.5 py-0.5 rounded border " + (isDark ? 'bg-zinc-900 border-zinc-850 text-zinc-400' : 'bg-slate-100 border-slate-200 text-slate-500')}>
                {(state.canvasElements ?? []).filter(el => el.page === state.currentPage).length} Items
              </span>
            </div>
            {(state.canvasElements ?? [])
              .filter(el => el.page === state.currentPage)
              .map((el) => {
                const isCanvasSelected = selectedCanvasId === el.id;
                return (
                  <div
                    key={el.id}
                    className={s.layerBtn(isCanvasSelected, false)}
                  >
                    <button
                      onClick={() => onSelectCanvas(el.id)}
                      className={"flex-1 text-left py-1.5 pr-3 pl-3 flex items-center justify-between cursor-pointer " + (
                        isCanvasSelected ? 'text-[#ccff00] font-bold' : s.textSecondary
                      )}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className={"w-1.5 h-1.5 rounded-full shrink-0 " + (isCanvasSelected ? 'bg-[#ccff00]' : isDark ? 'bg-zinc-650' : 'bg-slate-300')} />
                        <span className="truncate text-[10px]">{el.type === 'box' ? '📦 Box' : '📝 Text'}{el.content ? ': "' + el.content.slice(0, 15) + (el.content.length > 15 ? '...' : '') + '"' : ''}</span>
                      </div>
                      <ChevronRight size={11} className={isCanvasSelected ? 'text-[#ccff00]' : isDark ? 'text-zinc-600' : 'text-slate-300'} />
                    </button>
                  </div>
                );
              })}
          </>
        )}
      </div>
    );
  };

  return (
    <aside className={s.aside}>
      
      {/* Brand Launcher Header */}
      <div className={`flex items-center gap-3 border-b ${s.dividerLight} pb-3.5`}>
        <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 via-lime-400 to-[#ccff00] text-black shadow-md">
          <Grid size={18} className="stroke-[2.5]" />
        </div>
        <div>
          <h2 className={`text-sm font-black uppercase tracking-tight ${s.textPrimary}`}>EduCover Studio</h2>
          <p className={`text-[9px] uppercase tracking-widest font-mono ${s.textMuted}`}>High-Contrast Designer</p>
        </div>
      </div>

      {/* 🚀 TAB CONTROLLER: MAKE THE APP HIGHLY USER FRIENDLY */}
      <div className={s.tabBar}>
        {[
          { id: 'pages', label: 'Pages', icon: BookOpen, tooltip: 'Page & Layers List' },
          { id: 'design', label: 'Design', icon: Paintbrush, tooltip: 'Global Themes' },
          { id: 'photo', label: 'Teacher', icon: User, tooltip: 'Portrait Picture' },
          { id: 'editor', label: 'Layer', icon: Settings, tooltip: 'Layer Properties', badge: activeElement ? '•' : null },
          { id: 'elements', label: 'Elements', icon: Square, tooltip: 'Add free-form boxes & text' }
        ].map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={s.tabBtn(isSelected)}
              title={tab.tooltip}
            >
              <div className="relative">
                <tab.icon size={14} className={isSelected ? 'text-[#ccff00]' : isDark ? 'text-zinc-400' : 'text-slate-400'} />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-1.5 text-[14px] leading-none text-[#ccff00] font-black animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[9px] uppercase tracking-wide leading-none">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 🔮 SCROLLABLE TABS CONTENT AREA */}
      <div className="flex-1 space-y-5">
        
        {/* ================= TAB 1: PAGES ================= */}
        {activeTab === 'pages' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="space-y-2.5">
              <label className={`flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider ${s.textPrimary}`}>
                <BookOpen size={13} className="text-primary" />
                <span>Select Magazine Page</span>
              </label>
              
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { id: 'cover', name: '1. Cover Highlight page', desc: 'Main Title, teacher picture overlap' },
                  { id: 'index', name: '2. Index Page / Syllabus', desc: 'Syllabus table of contents list' },
                  { id: 'topper', name: '3. Toppers\' Talk Grid', desc: 'Asymmetric layout of student feedbacks' },
                  { id: 'bio', name: '4. Author Biography', desc: 'Profile block, Hindi quotes capsule' },
                  { id: 'promo', name: '5. Selection Course Flyer', desc: 'Pricing boxes, features checkmark list' }
                ].map((pg) => {
                  const isSelected = state.currentPage === pg.id;
                  return (
                    <button
                      key={pg.id}
                      onClick={() => {
                        onChangePage(pg.id as PageType);
                        onClearActiveElement();
                      }}
                      className={s.pageBtn(isSelected)}
                    >
                      <div className="truncate">
                        <span className="block font-bold">{pg.name}</span>
                        <span className={`block text-[9px] font-normal truncate ${isSelected ? 'text-[#ccff00]/80' : s.textMuted}`}>{pg.desc}</span>
                      </div>
                      {isSelected && <Check size={14} className="text-[#ccff00] shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Interactive Layer directory list */}
            {renderLayersList()}
          </div>
        )}

        {/* ================= TAB 2: DESIGN & THEME PALETTE ================= */}
        {activeTab === 'design' && (
          <div className="space-y-4.5 animate-fadeIn">
            {/* Palette selection */}
            <div className="space-y-2.5">
              <label className={`flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider ${s.textPrimary}`}>
                <Paintbrush size={13} className="text-primary" />
                <span>Aesthetic Color Palette</span>
              </label>

              <div className="grid grid-cols-1 gap-2">
                {(Object.keys(COMPILATION_THEMES) as ThemeId[]).map((thmId) => {
                  const thm = COMPILATION_THEMES[thmId];
                  const isSelected = state.currentTheme === thmId;
                  return (
                    <button
                      key={thmId}
                      onClick={() => onChangeTheme(thmId)}
                      className={s.themeBtn(isSelected)}
                    >
                      <div className="flex items-center gap-2">
                        {/* Palette Preview pill */}
                        <div className="flex -space-x-1.5 shrink-0">
                          <div className="w-4.5 h-4.5 rounded-full border border-black shadow" style={{ backgroundColor: thm.colors.primary }} />
                          <div className="w-4.5 h-4.5 rounded-full border border-black shadow" style={{ backgroundColor: thm.colors.background }} />
                          <div className="w-4.5 h-4.5 rounded-full border border-black shadow" style={{ backgroundColor: thm.colors.secondary }} />
                        </div>
                        <span className={`font-semibold ${isSelected ? 'text-[#ccff00]' : s.textSecondary}`}>
                          {thm.name}
                        </span>
                      </div>

                      <div 
                        className="w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px]"
                        style={{ backgroundColor: isSelected ? thm.colors.primary : 'transparent', color: thm.colors.accentText }}
                      >
                        {isSelected && "✓"}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Typography and advanced fine-tuning overrides */}
            <div className={`${s.panelSolid} p-4 space-y-4`}>
              <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b ${s.divider} ${s.textPrimary}`}>
                <Settings size={13} className="text-cyan-400" />
                <span>Global Typography Override</span>
              </span>

              {/* Font Selection Dropdown */}
              <div className="space-y-1.5">
                <span className={`text-[10px] ${s.textMuted} block uppercase font-bold text-left`}>Override Typography Style</span>
                <select
                  value={state.fontStyleId || 'theme-default'}
                  onChange={(e) => onUpdateText('global', 'fontStyleId', e.target.value)}
                  className={`w-full rounded-lg p-2 text-xs focus:outline-none cursor-pointer ${isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                >
                  <option value="theme-default">Default Theme Typeface Style</option>
                  <option value="modern">Space Grotesk & Inter (Modern Sans)</option>
                  <option value="serif">Playfair & Merriweather (Editorial Serif)</option>
                  <option value="mono">JetBrains Mono Typeface (Technical Mono)</option>
                  <option value="scifi">Syne & Outfit (Space Sci-Fi)</option>
                  <option value="elegant">Cinzel & Cormorant (Regal Elegant)</option>
                </select>
              </div>

              {/* Palette Fine-Tuner Grid */}
              <div className={`space-y-2.5 pt-2 border-t ${s.divider}`}>
                <span className={`text-[10px] ${s.textMuted} block uppercase font-bold text-left`}>Custom Palette Fine-Tuning</span>
                
                <div className="space-y-2.5">
                  {/* Primary Accent override */}
                  <div className="flex items-center justify-between gap-2.5">
                    <span className={`text-[9px] ${s.textMuted} font-mono`}>Accent Color:</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        id="custom-primary-color"
                        value={state.customPrimaryColor || activeTheme.colors.primary}
                        onChange={(e) => onUpdateText('global', 'customPrimaryColor', e.target.value)}
                        className={`w-6 h-6 bg-transparent border rounded cursor-pointer shrink-0 ${isDark ? 'border-zinc-800' : 'border-slate-300'}`}
                        aria-label="Accent color"
                      />
                      <span className={`font-mono text-[9px] w-14 truncate ${isDark ? 'text-zinc-350' : 'text-slate-500'}`}>
                        {state.customPrimaryColor || "(Default)"}
                      </span>
                      {state.customPrimaryColor && (
                        <button 
                          type="button"
                          onClick={() => onUpdateText('global', 'customPrimaryColor', undefined)}
                          className="text-[8px] text-red-500 hover:text-red-400 underline font-mono shrink-0 cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Background override */}
                  <div className="flex items-center justify-between gap-2.5">
                    <span className={`text-[9px] ${s.textMuted} font-mono`}>Card/Page BG:</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        id="custom-bg-color"
                        value={state.customBackgroundColor || activeTheme.colors.background}
                        onChange={(e) => onUpdateText('global', 'customBackgroundColor', e.target.value)}
                        className={`w-6 h-6 bg-transparent border rounded cursor-pointer shrink-0 ${isDark ? 'border-zinc-800' : 'border-slate-300'}`}
                        aria-label="Card background color"
                      />
                      <span className={`font-mono text-[9px] w-14 truncate ${isDark ? 'text-zinc-350' : 'text-slate-500'}`}>
                        {state.customBackgroundColor || "(Default)"}
                      </span>
                      {state.customBackgroundColor && (
                        <button 
                          type="button"
                          onClick={() => onUpdateText('global', 'customBackgroundColor', undefined)}
                          className="text-[8px] text-red-500 hover:text-red-400 underline font-mono shrink-0 cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Main Text Primary override */}
                  <div className="flex items-center justify-between gap-2.5">
                    <span className={`text-[9px] ${s.textMuted} font-mono`}>Main Text Color:</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        id="custom-text-color"
                        value={state.customTextColor || activeTheme.colors.textPrimary}
                        onChange={(e) => onUpdateText('global', 'customTextColor', e.target.value)}
                        className={`w-6 h-6 bg-transparent border rounded cursor-pointer shrink-0 ${isDark ? 'border-zinc-800' : 'border-slate-300'}`}
                        aria-label="Main text color"
                      />
                      <span className={`font-mono text-[9px] w-14 truncate ${isDark ? 'text-zinc-350' : 'text-slate-500'}`}>
                        {state.customTextColor || "(Default)"}
                      </span>
                      {state.customTextColor && (
                        <button 
                          type="button"
                          onClick={() => onUpdateText('global', 'customTextColor', undefined)}
                          className="text-[8px] text-red-500 hover:text-red-400 underline font-mono shrink-0 cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* General theme reset overrides button */}
              {(
                state.customPrimaryColor || 
                state.customBackgroundColor || 
                state.customTextColor || 
                (state.fontStyleId && state.fontStyleId !== 'theme-default') || 
                (state.customBackgrounds && Object.keys(state.customBackgrounds).length > 0) ||
                (state.customElementTextColors && Object.keys(state.customElementTextColors).length > 0) ||
                (state.customElementFonts && Object.keys(state.customElementFonts).length > 0) ||
                (state.customElementAccents && Object.keys(state.customElementAccents).length > 0)
              ) && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateText('global', 'customPrimaryColor', undefined);
                      onUpdateText('global', 'customBackgroundColor', undefined);
                      onUpdateText('global', 'customTextColor', undefined);
                      onUpdateText('global', 'fontStyleId', 'theme-default');
                      onUpdateText('global', 'customBackgrounds', {});
                      onUpdateText('global', 'customElementTextColors', {});
                      onUpdateText('global', 'customElementFonts', {});
                      onUpdateText('global', 'customElementAccents', {});
                    }}
                    className={`w-full py-2 text-[10px] border border-dashed rounded-lg font-mono transition-colors uppercase cursor-pointer ${isDark ? 'bg-red-950/20 hover:bg-red-950/30 border-red-500/30 text-red-400' : 'bg-red-50 hover:bg-red-100 border-red-300/50 text-red-600'}`}
                  >
                    Clear All Design Overrides
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 3: PORTRAIT PHOTOGRAPH ================= */}
        {activeTab === 'photo' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="space-y-2.5">
              <label className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${s.textPrimary}`}>
                <ImageIcon size={13} className="text-[#ccff00]" />
                <span>Teacher/Author Photo</span>
              </label>

              <div className={`space-y-3 ${s.panelSolid} p-4`}>
                <div className="space-y-1">
                  <span className={`text-[10px] ${s.textMuted} block uppercase font-bold text-left`}>Upload isolated Portrait (PNG)</span>
                  <button
                    type="button"
                    onClick={triggerImageSelect}
                    className={`w-full py-2.5 px-3 border text-xs rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors ${isDark ? 'bg-zinc-900 hover:bg-zinc-850 border-zinc-800 text-white' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'}`}
                  >
                    <Plus size={14} className="text-[#ccff00]" />
                    <span>Upload Picture file</span>
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="hidden" 
                  />
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className={`text-[10px] ${s.textMuted} block uppercase font-bold text-left`}>Paste web URL directly</span>
                  <input
                    type="url"
                    placeholder="https://example.com/teacher-portrait.png"
                    value={state.photo.url}
                    onChange={(e) => onUpdatePhoto('url', e.target.value)}
                    className={`w-full rounded-lg p-2.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#ccff00] ${isDark ? 'bg-zinc-900 border-zinc-850 text-white placeholder-zinc-600' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'}`}
                  />
                </div>

                {state.photo.url && (
                  <div className={`space-y-3.5 pt-3.5 border-t ${s.divider}`}>
                    
                    {/* Scale slider */}
                    <div>
                      <div className={`flex justify-between text-[10px] mb-1 ${s.textMuted}`}>
                        <span>PORTRAIT SCALE SIZE</span>
                        <span className={`font-bold ${s.textPrimary}`}>{Math.round(state.photo.scale * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        id="photo-scale"
                        min="0.5"
                        max="2.0"
                        step="0.05"
                        value={state.photo.scale}
                        onChange={(e) => onUpdatePhoto('scale', parseFloat(e.target.value))}
                        className="w-full accent-[#ccff00]"
                        aria-label="Portrait scale size"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Offset X coordinate */}
                      <div>
                        <div className={`flex justify-between text-[9px] mb-1 ${isDark ? 'text-zinc-405' : 'text-slate-500'}`}>
                          <span>HORIZONTAL (X)</span>
                          <span className={`font-bold ${s.textPrimary}`}>{state.photo.xOffset}%</span>
                        </div>
                        <input
                          type="range"
                          id="photo-offset-x"
                          min="-100"
                          max="100"
                          step="1"
                          value={state.photo.xOffset}
                          onChange={(e) => onUpdatePhoto('xOffset', parseInt(e.target.value))}
                          className="w-full accent-cyan-400"
                          aria-label="Horizontal offset"
                        />
                      </div>

                      {/* Offset Y coordinate */}
                      <div>
                        <div className={`flex justify-between text-[9px] mb-1 ${isDark ? 'text-zinc-405' : 'text-slate-500'}`}>
                          <span>VERTICAL (Y)</span>
                          <span className={`font-bold ${s.textPrimary}`}>{state.photo.yOffset}%</span>
                        </div>
                        <input
                          type="range"
                          id="photo-offset-y"
                          min="-80"
                          max="50"
                          step="1"
                          value={state.photo.yOffset}
                          onChange={(e) => onUpdatePhoto('yOffset', parseInt(e.target.value))}
                          className="w-full accent-amber-400"
                          aria-label="Vertical offset"
                        />
                      </div>
                    </div>

                    {/* Shadows & Monochrome adjustments */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => onUpdatePhoto('isMonochrome', !state.photo.isMonochrome)}
                        className={`py-1.5 px-2 rounded-lg border text-[9px] font-mono cursor-pointer uppercase font-semibold ${
                          state.photo.isMonochrome
                            ? "border-[#ccff00] bg-[#ccff00]/10 text-[#ccff00]"
                            : isDark ? "border-zinc-800 bg-zinc-900 text-zinc-405 hover:text-white" : "border-slate-200 bg-white text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        {state.photo.isMonochrome ? "✓ Monochrome" : "Full Color"}
                      </button>

                      <button
                        type="button"
                        onClick={() => onUpdatePhoto('shadow', state.photo.shadow === 'glow' ? 'lg' : 'glow')}
                        className={`py-1.5 px-2 rounded-lg border text-[9px] font-mono cursor-pointer uppercase font-semibold ${
                          state.photo.shadow === 'glow'
                            ? "border-[#ccff00] bg-[#ccff00]/10 text-[#ccff00]"
                            : isDark ? "border-zinc-800 bg-zinc-900 text-zinc-405 hover:text-white" : "border-slate-200 bg-white text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        {state.photo.shadow === 'glow' ? "✨ Glow ON" : "Simple Shadow"}
                      </button>
                    </div>

                    {/* Advanced Glow Customization parameters */}
                    {state.photo.shadow === 'glow' && (
                      <div className={`space-y-3 pt-3 border-t ${s.divider} text-left`}>
                        {/* Glow Color pick */}
                        <div>
                          <div className={`flex justify-between text-[10px] mb-1 ${s.textMuted}`}>
                            <span>GLOW OUTLINE COLOR</span>
                            <span className={`font-mono text-[9px] uppercase ${isDark ? 'text-[#ccff00]' : 'text-teal-600'}`}>{state.photoGlowColor || activeTheme.colors.primary}</span>
                          </div>
                          <div className="flex gap-2 items-center">
                            <input
                              type="color"
                              id="photo-glow-color"
                              value={state.photoGlowColor || activeTheme.colors.primary}
                              onChange={(e) => onUpdateText('global', 'photoGlowColor', e.target.value)}
                              className={`w-8 h-8 bg-transparent border rounded cursor-pointer shrink-0 ${isDark ? 'border-zinc-800' : 'border-slate-300'}`}
                              aria-label="Glow outline color"
                            />
                            <div className="flex flex-wrap gap-1">
                              {['#b6ff00', '#ff007f', '#00f0ff', '#eab308', '#ccff00', '#8b5cf6'].map((hex) => (
                                <button
                                  key={hex}
                                  type="button"
                                  onClick={() => onUpdateText('global', 'photoGlowColor', hex)}
                                  className="w-4 h-4 rounded border border-black cursor-pointer hover:scale-110 transition-transform shrink-0"
                                  style={{ backgroundColor: hex }}
                                  title={hex}
                                />
                              ))}
                              {state.photoGlowColor && (
                                <button
                                  type="button"
                                  onClick={() => onUpdateText('global', 'photoGlowColor', undefined)}
                                  className={`px-1.5 py-0.5 text-[8px] border rounded cursor-pointer font-mono ${isDark ? 'bg-zinc-900 hover:bg-zinc-850 border-zinc-805 text-zinc-400' : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-500'}`}
                                >
                                  Reset
                                </button>
      )}
                            </div>
                          </div>
                        </div>

                        {/* Glow Width slider */}
                        <div>
                          <div className={`flex justify-between text-[10px] mb-1 ${s.textMuted} font-mono`}>
                            <span>OUTER GLOW RADIUS</span>
                            <span className={`font-bold ${s.textPrimary}`}>{state.photoGlowWidth !== undefined ? state.photoGlowWidth : 15}px</span>
                          </div>
                          <input
                            type="range"
                            id="photo-glow-width"
                            min="4"
                            max="48"
                            step="1"
                            value={state.photoGlowWidth !== undefined ? state.photoGlowWidth : 15}
                            onChange={(e) => onUpdateText('global', 'photoGlowWidth', parseInt(e.target.value))}
                            className="w-full accent-cyan-400"
                            aria-label="Outer glow radius"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: SELECTION EDITOR ================= */}
        {activeTab === 'editor' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Topic Badges Manager specifically if cover page selected and no element or topic clicked */}
            {state.currentPage === 'cover' && !activeElement && (
              <div className={`space-y-3 ${s.panelSolid} p-4`}>
                <div className={`flex items-center justify-between pb-1.5 border-b ${s.divider}`}>
                  <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${s.textPrimary}`}>
                    <Layers size={13} className="text-[#ccff00]" />
                    <span>Topic Highlights</span>
                  </span>
                  <span className={`text-[10px] ${s.textMuted} font-mono`}>
                    Count: {state.coverData.bulletPoints.length}
                  </span>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {state.coverData.bulletPoints.map((pt, idx) => (
                    <div key={idx} className={`flex gap-2 items-center border p-2 rounded-lg group/badge relative ${isDark ? 'bg-zinc-900 border-zinc-850' : 'bg-white border-slate-200'}`}>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: activeTheme.colors.primary }} />
                      <span className={`text-[10.5px] uppercase font-black truncate pl-1 max-w-[150px] ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                        {pt}
                      </span>
                      <div className="ml-auto flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            onSelectElement('cover', `bulletPoints.${idx}`, `Topic Badge ${idx + 1}`);
                          }}
                          className={`px-2 py-0.5 rounded text-[9px] cursor-pointer font-bold border ${isDark ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white border-zinc-800' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900 border-slate-200'}`}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...state.coverData.bulletPoints];
                            updated.splice(idx, 1);
                            onUpdateText('cover', 'bulletPoints', updated);
                            onClearActiveElement();
                          }}
                          className={`p-1 rounded transition-colors cursor-pointer border ${isDark ? 'bg-red-950/20 text-red-500 hover:bg-red-900/40 border-red-900/30' : 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200'}`}
                          title="Delete badge"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const updated = [...state.coverData.bulletPoints, 'NEW TOPIC SECTION'];
                    const newIdx = state.coverData.bulletPoints.length;
                    onUpdateText('cover', 'bulletPoints', updated);
                    setTimeout(() => {
                      onSelectElement('cover', `bulletPoints.${newIdx}`, `Topic Badge ${newIdx + 1}`);
                    }, 50);
                  }}
                  className={`w-full py-2 border rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${isDark ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/25 text-emerald-400 border-emerald-500/30 hover:border-emerald-500/60' : 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-200 hover:border-emerald-400'}`}
                >
                  <Plus size={12} />
                  <span>Add Topic Badge</span>
                </button>
              </div>
            )}

            {/* Canvas element properties */}
            {selectedCanvasId && !activeElement && (() => {
              const canvasEl = (state.canvasElements ?? []).find(e => e.id === selectedCanvasId);
              if (!canvasEl) return null;
              return (
                <div className={`space-y-3 ${s.panelSolid} p-4 animate-fadeIn`}>
                  <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800">
                    <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-zinc-200">
                      <Square size={13} className="text-[#ccff00]" />
                      <span>Canvas {canvasEl.type === 'text' ? 'Text' : 'Box'}</span>
                    </span>
                    <button onClick={() => onSelectCanvas(null)} className="text-zinc-500 hover:text-white text-[10px] cursor-pointer">✕</button>
                  </div>

                  {canvasEl.type === 'text' && (
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">Text Content</label>
                      <textarea
                        value={canvasEl.content || ''}
                        onChange={(e) => onUpdateCanvasElement?.(canvasEl.id, { content: e.target.value })}
                        className="w-full px-2 py-1.5 border border-zinc-800 rounded-lg text-xs font-mono bg-zinc-950 text-white focus:outline-none focus:ring-1 focus:ring-[#ccff00] resize-none"
                        rows={3}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">X</label>
                      <input type="number" value={Math.round(canvasEl.x)} onChange={(e) => onUpdateCanvasElement?.(canvasEl.id, { x: parseInt(e.target.value) || 0 })}
                        className="w-full px-2 py-1 border border-zinc-800 rounded-lg text-xs font-mono bg-zinc-950 text-white focus:outline-none focus:ring-1 focus:ring-[#ccff00]" />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">Y</label>
                      <input type="number" value={Math.round(canvasEl.y)} onChange={(e) => onUpdateCanvasElement?.(canvasEl.id, { y: parseInt(e.target.value) || 0 })}
                        className="w-full px-2 py-1 border border-zinc-800 rounded-lg text-xs font-mono bg-zinc-950 text-white focus:outline-none focus:ring-1 focus:ring-[#ccff00]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">Width</label>
                      <input type="number" value={Math.round(canvasEl.width)} onChange={(e) => { const v = parseInt(e.target.value) || 40; onUpdateCanvasElement?.(canvasEl.id, { width: v }); }}
                        className="w-full px-2 py-1 border border-zinc-800 rounded-lg text-xs font-mono bg-zinc-950 text-white focus:outline-none focus:ring-1 focus:ring-[#ccff00]" />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">Height</label>
                      <input type="number" value={Math.round(canvasEl.height)} onChange={(e) => { const v = parseInt(e.target.value) || 40; onUpdateCanvasElement?.(canvasEl.id, { height: v }); }}
                        className="w-full px-2 py-1 border border-zinc-800 rounded-lg text-xs font-mono bg-zinc-950 text-white focus:outline-none focus:ring-1 focus:ring-[#ccff00]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">Rotation</label>
                      <input type="number" value={Math.round(canvasEl.rotation || 0)} onChange={(e) => onUpdateCanvasElement?.(canvasEl.id, { rotation: parseInt(e.target.value) || 0 })}
                        className="w-full px-2 py-1 border border-zinc-800 rounded-lg text-xs font-mono bg-zinc-950 text-white focus:outline-none focus:ring-1 focus:ring-[#ccff00]" />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">Opacity</label>
                      <input type="number" min="0" max="1" step="0.05" value={canvasEl.opacity ?? 1} onChange={(e) => onUpdateCanvasElement?.(canvasEl.id, { opacity: parseFloat(e.target.value) || 1 })}
                        className="w-full px-2 py-1 border border-zinc-800 rounded-lg text-xs font-mono bg-zinc-950 text-white focus:outline-none focus:ring-1 focus:ring-[#ccff00]" />
                    </div>
                  </div>

                  {canvasEl.type === 'box' && (
                    <>
                      <div>
                        <label className="text-[10px] font-mono text-zinc-400 block mb-1">Background Color</label>
                        <input type="color" value={canvasEl.backgroundColor || '#1a1a2e'} onChange={(e) => onUpdateCanvasElement?.(canvasEl.id, { backgroundColor: e.target.value })}
                          className="w-full h-8 rounded-lg cursor-pointer bg-transparent border-0" />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-zinc-400 block mb-1">Border Radius</label>
                        <input type="range" min="0" max="50" value={canvasEl.borderRadius ?? 0} onChange={(e) => onUpdateCanvasElement?.(canvasEl.id, { borderRadius: parseInt(e.target.value) })}
                          className="w-full accent-cyan-400" />
                      </div>
                    </>
                  )}

                  {canvasEl.type === 'text' && (
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">Text Color</label>
                      <input type="color" value={canvasEl.textColor || '#ffffff'} onChange={(e) => onUpdateCanvasElement?.(canvasEl.id, { textColor: e.target.value })}
                        className="w-full h-8 rounded-lg cursor-pointer bg-transparent border-0" />
                    </div>
                  )}
                  {/* Detach Background - only for text elements with bg */}
                  {canvasEl.type === 'text' && canvasEl.backgroundColor && (
                    <div className="pt-1">
                      <button
                        onClick={() => {
                          if (!canvasEl.backgroundColor) return;
                          // Create a new box element with the same bg, behind the text
                          onAddCanvasElement?.('box', {
                            page: canvasEl.page,
                            x: canvasEl.x,
                            y: canvasEl.y,
                            width: canvasEl.width,
                            height: canvasEl.height,
                            backgroundColor: canvasEl.backgroundColor,
                            borderWidth: canvasEl.borderWidth,
                            borderColor: canvasEl.borderColor,
                            borderRadius: canvasEl.borderRadius ?? 4,
                            zIndex: (canvasEl.zIndex ?? 1) - 1,
                          });
                          // Clear bg from text element
                          onUpdateCanvasElement?.(canvasEl.id, {
                            backgroundColor: undefined,
                            borderWidth: undefined,
                            borderColor: undefined,
                          });
                        }}
                        className="w-full py-1.5 px-3 text-[10px] font-mono rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-[#ccff00] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>✂️</span> Detach Background Box
                      </button>
                      <p className="text-[8px] text-zinc-500 mt-1 leading-tight">Creates a separate box element from the text background, allowing independent movement</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">Border Color</label>
                      <input type="color" value={canvasEl.borderColor || '#000000'} onChange={(e) => onUpdateCanvasElement?.(canvasEl.id, { borderColor: e.target.value })}
                        className="w-full h-8 rounded-lg cursor-pointer bg-transparent border-0" />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">Border Width</label>
                      <input type="number" min="0" max="10" value={canvasEl.borderWidth ?? 2} onChange={(e) => onUpdateCanvasElement?.(canvasEl.id, { borderWidth: parseInt(e.target.value) || 0 })}
                        className="w-full px-2 py-1 border border-zinc-800 rounded-lg text-xs font-mono bg-zinc-950 text-white focus:outline-none focus:ring-1 focus:ring-[#ccff00]" />
                    </div>
                  </div>

                  {canvasEl.type === 'text' && (
                    <div className="space-y-2">
                      <div>
                        <label className="text-[10px] font-mono text-zinc-400 block mb-1">Font Size</label>
                        <input type="range" min="8" max="72" value={canvasEl.fontSize ?? 16} onChange={(e) => onUpdateCanvasElement?.(canvasEl.id, { fontSize: parseInt(e.target.value) })}
                          className="w-full accent-cyan-400" />
                      </div>
                      <div className="flex gap-2">
                        <label className="flex items-center gap-1.5 text-[10px] text-zinc-300 cursor-pointer">
                          <input type="checkbox" checked={!!canvasEl.bold} onChange={(e) => onUpdateCanvasElement?.(canvasEl.id, { bold: e.target.checked })} />
                          Bold
                        </label>
                        <label className="flex items-center gap-1.5 text-[10px] text-zinc-300 cursor-pointer">
                          <input type="checkbox" checked={!!canvasEl.italic} onChange={(e) => onUpdateCanvasElement?.(canvasEl.id, { italic: e.target.checked })} />
                          Italic
                        </label>
                        <label className="flex items-center gap-1.5 text-[10px] text-zinc-300 cursor-pointer">
                          <input type="checkbox" checked={!!canvasEl.underline} onChange={(e) => onUpdateCanvasElement?.(canvasEl.id, { underline: e.target.checked })} />
                          Underline
                        </label>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 block mb-1">Z-Index</label>
                    <input type="number" value={canvasEl.zIndex ?? 10} onChange={(e) => onUpdateCanvasElement?.(canvasEl.id, { zIndex: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1 border border-zinc-800 rounded-lg text-xs font-mono bg-zinc-950 text-white focus:outline-none focus:ring-1 focus:ring-[#ccff00]" />
                  </div>

                  {/* Trim Controls - CSS clip-path inset sliders */}
                  <div className="pt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-mono text-zinc-400 block font-bold">✂️ Trim Background</label>
                      {(canvasEl.clipTop != null || canvasEl.clipRight != null || canvasEl.clipBottom != null || canvasEl.clipLeft != null) && (
                        <button
                          type="button"
                          onClick={() => onUpdateCanvasElement?.(canvasEl.id, { clipTop: undefined, clipRight: undefined, clipBottom: undefined, clipLeft: undefined })}
                          className="text-[9px] text-red-500 hover:text-red-400 underline font-mono cursor-pointer"
                        >
                          Reset All Trims
                        </button>
                      )}
                    </div>
                    <p className="text-[8px] text-zinc-500 leading-tight">Cut away unwanted edges from the background box. Higher values trim more from each side.</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="flex justify-between text-[9px] text-zinc-500 font-mono"><span>Top</span><span className="text-zinc-300">{canvasEl.clipTop ?? 0}px</span></div>
                        <input type="range" min="0" max="100" value={canvasEl.clipTop ?? 0}
                          onChange={(e) => onUpdateCanvasElement?.(canvasEl.id, { clipTop: parseInt(e.target.value) })}
                          className="w-full accent-rose-400 cursor-pointer" />
                      </div>
                      <div>
                        <div className="flex justify-between text-[9px] text-zinc-500 font-mono"><span>Bottom</span><span className="text-zinc-300">{canvasEl.clipBottom ?? 0}px</span></div>
                        <input type="range" min="0" max="100" value={canvasEl.clipBottom ?? 0}
                          onChange={(e) => onUpdateCanvasElement?.(canvasEl.id, { clipBottom: parseInt(e.target.value) })}
                          className="w-full accent-rose-400 cursor-pointer" />
                      </div>
                      <div>
                        <div className="flex justify-between text-[9px] text-zinc-500 font-mono"><span>Left</span><span className="text-zinc-300">{canvasEl.clipLeft ?? 0}px</span></div>
                        <input type="range" min="0" max="100" value={canvasEl.clipLeft ?? 0}
                          onChange={(e) => onUpdateCanvasElement?.(canvasEl.id, { clipLeft: parseInt(e.target.value) })}
                          className="w-full accent-rose-400 cursor-pointer" />
                      </div>
                      <div>
                        <div className="flex justify-between text-[9px] text-zinc-500 font-mono"><span>Right</span><span className="text-zinc-300">{canvasEl.clipRight ?? 0}px</span></div>
                        <input type="range" min="0" max="100" value={canvasEl.clipRight ?? 0}
                          onChange={(e) => onUpdateCanvasElement?.(canvasEl.id, { clipRight: parseInt(e.target.value) })}
                          className="w-full accent-rose-400 cursor-pointer" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-1 border-t border-zinc-800">
                    <label className="text-[10px] font-mono text-zinc-400 block mb-1">Glow</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="color" value={canvasEl.glowColor || '#ccff00'} onChange={(e) => onUpdateCanvasElement?.(canvasEl.id, { glowColor: e.target.value })}
                        className="w-full h-8 rounded-lg cursor-pointer bg-transparent border-0" />
                      <input type="number" min="0" max="50" value={canvasEl.glowWidth ?? 15} onChange={(e) => onUpdateCanvasElement?.(canvasEl.id, { glowWidth: parseInt(e.target.value) || 0 })}
                        className="w-full px-2 py-1 border border-zinc-800 rounded-lg text-xs font-mono bg-zinc-950 text-white focus:outline-none focus:ring-1 focus:ring-[#ccff00]" />
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Core Layer properties inspector (only for non-canvas elements) */}
            {!selectedCanvasId && (
            <div className="space-y-3">
              <label className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${s.textPrimary}`}>
                <Sliders size={13} className="text-cyan-400" />
                <span>Selected Layer Properties</span>
              </label>

              {renderSelectedElementInput()}
            </div>
          )}
        </div>
        )}

        {/* ================= TAB 5: FREE-FORM CANVAS ELEMENTS ================= */}
        {activeTab === 'elements' && (
          <div className="space-y-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Add New Element</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onAddCanvasElement?.('box')}
                className="py-3 px-3 border border-dashed border-zinc-600 rounded-xl text-[10px] font-mono text-zinc-300 hover:border-[#ccff00] hover:text-[#ccff00] bg-zinc-900/40 hover:bg-zinc-800/40 transition-colors cursor-pointer flex items-center justify-center gap-2"
                title="Add a decorative box"
              >
                <Square size={14} />
                <span>Add Box</span>
              </button>
              <button
                type="button"
                onClick={() => onAddCanvasElement?.('text')}
                className="py-3 px-3 border border-dashed border-zinc-600 rounded-xl text-[10px] font-mono text-zinc-300 hover:border-[#ccff00] hover:text-[#ccff00] bg-zinc-900/40 hover:bg-zinc-800/40 transition-colors cursor-pointer flex items-center justify-center gap-2"
                title="Add a free text element"
              >
                <span className="text-xs font-bold">T</span>
                <span>Add Text</span>
              </button>
            </div>

            {/* List of existing canvas elements */}
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Canvas Elements</div>
            <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
              {(state.canvasElements ?? []).length === 0 && (
                <div className="text-[10px] font-mono text-zinc-500 italic">No free-form elements yet</div>
              )}
              {(state.canvasElements ?? [])
                .filter(el => el.page === state.currentPage)
                .map((el) => (
                <div
                  key={el.id}
                  className="flex items-center justify-between gap-2 py-1.5 px-2 rounded-lg border border-zinc-800 bg-zinc-900/50"
                >
                  <span className="text-[10px] font-mono text-zinc-300 truncate flex-1">
                    {el.type === 'box' ? '📦 Box' : '📝 Text'}
                    {el.content ? `: "${el.content.slice(0, 20)}${el.content.length > 20 ? '...' : ''}"` : ''}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveCanvasElement?.(el.id)}
                    className="text-red-500 hover:text-red-400 cursor-pointer shrink-0"
                    title="Remove element"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* CURATOR 5: IMPORT / SAVE / LOAD / RESET */}
      <div className={`border-t ${s.dividerLight} pt-3.5 space-y-2`}>
        
        {/* Import & Save row */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onImportHtml}
            className={`flex-1 py-2 px-2 border rounded-lg text-[9px] font-mono font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${isDark ? 'bg-blue-950/20 hover:bg-blue-900/30 text-blue-400 border-blue-500/40' : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300/50'}`}
            title="Import a design from an exported EduCover HTML file"
          >
            <FolderOpen size={11} />
            <span>Import HTML</span>
          </button>
          
          {/* Save design dropdown toggle */}
          <div className="flex-1 relative">
            <div className="flex gap-1">
              <input
                type="text"
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                placeholder="Design name..."
                className={`flex-1 min-w-0 px-2 py-1.5 border rounded-lg text-[9px] font-mono focus:outline-none focus:ring-1 focus:ring-[#ccff00] ${isDark ? 'bg-zinc-950 text-white border-zinc-800' : 'bg-white text-slate-900 border-slate-200'}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && designName.trim()) {
                    onSaveDesign(designName.trim());
                    setDesignName('');
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  if (designName.trim()) {
                    onSaveDesign(designName.trim());
                    setDesignName('');
                  }
                }}
                className={`px-2 py-1.5 border rounded-lg text-[9px] font-mono font-semibold cursor-pointer transition-colors ${isDark ? 'bg-emerald-950/20 hover:bg-emerald-900/30 text-emerald-400 border-emerald-500/40' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300/50'}`}
                title="Save current design for later use"
              >
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Saved designs list */}
        {savedDesigns.length > 0 && (
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {savedDesigns.map((name) => (
              <div key={name} className={`flex items-center gap-1 rounded border text-[9px] font-mono ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200'}`}>
                <button
                  type="button"
                  onClick={() => onLoadDesign(name)}
                  className={`flex-1 text-left py-1 px-2 cursor-pointer hover:font-bold truncate ${isDark ? 'text-zinc-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
                  title={`Load design: ${name}`}
                >
                  {name}
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteDesign(name)}
                  className={`px-1.5 py-1 cursor-pointer hover:text-red-500 shrink-0 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}
                  title="Delete saved design"
                >
                  <Trash2 size={10} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Reset button */}
        <button
          type="button"
          onClick={onResetData}
          className={`w-full py-2 px-3 border rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${isDark ? 'bg-zinc-950 text-zinc-405 hover:text-white border-zinc-800 hover:bg-zinc-900' : 'bg-white text-slate-500 hover:text-slate-900 border-slate-200 hover:bg-slate-50'}`}
          title="Restore original draft texts and layers"
        >
          <RotateCcw size={12} />
          <span>Reset Draft Text</span>
        </button>
      </div>

    </aside>
  );
};
