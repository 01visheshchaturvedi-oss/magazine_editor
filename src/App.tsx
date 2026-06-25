import React, { useState, useEffect, useRef } from 'react';
import { PageType, ThemeId, AppState, DuplicatedElement, CanvasElement } from './types';
import { INITIAL_STATE, COMPILATION_THEMES } from './data';
import { PageRenderer } from './components/PageRenderer';
import { EditorSidebar } from './components/EditorSidebar';
import { generateStandaloneHtml } from './utils/exporter';
import { 
  Printer, 
  HelpCircle, 
  Layers, 
  Sparkles, 
  Eye, 
  Grid, 
  ArrowLeftRight,
  Monitor,
  Download,
  CheckCircle,
  Undo2,
  Redo2,
  FileCode,
  Sun,
  Moon,
  EyeOff,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

export default function App() {
  // Load state: check for bridge data from quants_maagzine first, then localStorage, then defaults
  const [state, setState] = useState<AppState>(() => {
    try {
      const bridgeData = localStorage.getItem('educover_bridge');
      if (bridgeData) {
        localStorage.removeItem('educover_bridge');
        const parsed = JSON.parse(bridgeData);
        return { ...INITIAL_STATE, ...parsed };
      }
      const saved = localStorage.getItem('educover_state');
      const parsed = saved ? JSON.parse(saved) : INITIAL_STATE;
      // Reset hidden elements on refresh so they come back
      return { ...parsed, hiddenElements: {} };
    } catch {
      return INITIAL_STATE;
    }
  });

  // Keep track of which text element is currently focused for inline editing
  const [activeElement, setActiveElement] = useState<{
    section: string;
    field: string;
    label: string;
    duplicatedId?: string;
  } | null>(null);

  const [lastSaved, setLastSaved] = useState<string>('');
  const [showPrintTip, setShowPrintTip] = useState(true);
  const [canvasZoom, setCanvasZoom] = useState(0.75); // 75% default zoom for comfortable editing
  const [selectedCanvasId, setSelectedCanvasId] = useState<string | null>(null);

  // Save changes to localStorage for continuity
  useEffect(() => {
    try {
      localStorage.setItem('educover_state', JSON.stringify(state));
      localStorage.setItem('educover_exported_at', String(Date.now()));
      // Display small feedback
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSaved(now);
    } catch (e) {
      console.error("Storage failed:", e);
    }
  }, [state]);

  // Undo/redo history stacks
  const pastStates = React.useRef<AppState[]>([]);
  const futureStates = React.useRef<AppState[]>([]);
  const suppressHistory = React.useRef(false);
  const prevStateRef = React.useRef(state);

  React.useEffect(() => {
    if (suppressHistory.current) {
      suppressHistory.current = false;
      prevStateRef.current = state;
      return;
    }
    if (prevStateRef.current !== state) {
      pastStates.current = [...pastStates.current.slice(-49), prevStateRef.current];
      futureStates.current = [];
      prevStateRef.current = state;
    }
  }, [state]);

  const [canUndo, setCanUndo] = React.useState(false);
  const [canRedo, setCanRedo] = React.useState(false);

  const handleUndo = () => {
    if (pastStates.current.length === 0) return;
    const prev = pastStates.current[pastStates.current.length - 1];
    pastStates.current = pastStates.current.slice(0, -1);
    futureStates.current = [state, ...futureStates.current];
    suppressHistory.current = true;
    setState(prev);
  };

  const handleRedo = () => {
    if (futureStates.current.length === 0) return;
    const next = futureStates.current[0];
    futureStates.current = futureStates.current.slice(1);
    pastStates.current = [...pastStates.current, state];
    suppressHistory.current = true;
    setState(next);
  };

  React.useEffect(() => {
    setCanUndo(pastStates.current.length > 0);
    setCanRedo(futureStates.current.length > 0);
  }, [pastStates.current.length, futureStates.current.length]);

  const isDark = state.appTheme === 'dark';
  const activeTheme = COMPILATION_THEMES[state.currentTheme];

  const handleUpdateText = (section: string, key: string, value: any) => {
    setState((prev) => {
      if (section === 'cover') {
        return {
          ...prev,
          coverData: { ...prev.coverData, [key]: value }
        };
      } else if (section === 'index') {
        return {
          ...prev,
          indexData: { ...prev.indexData, [key]: value }
        };
      } else if (section === 'topper') {
        return {
          ...prev,
          topperData: { ...prev.topperData, [key]: value }
        };
      } else if (section === 'bio') {
        return {
          ...prev,
          bioData: { ...prev.bioData, [key]: value }
        };
      } else if (section === 'promo') {
        return {
          ...prev,
          promoData: { ...prev.promoData, [key]: value }
        };
      } else if (section === 'global') {
        return {
          ...prev,
          [key]: value
        };
      }
      return prev;
    });
  };

  const handleUpdatePhoto = (key: string, value: any) => {
    setState((prev) => ({
      ...prev,
      photo: { ...prev.photo, [key]: value }
    }));
  };

  const handleUpdateTransform = (key: string, value: any) => {
    setState((prev) => {
      const transforms = prev.transforms || {};
      const current = transforms[key] || { x: 0, y: 0, scale: 1.0, rotation: 0 };
      return {
        ...prev,
        transforms: {
          ...transforms,
          [key]: { ...current, ...value }
        }
      };
    });
  };

  const handleUpdateDuplicateTransform = (dupId: string, value: any) => {
    setState((prev) => {
      const dups = [...(prev.duplicatedElements || [])];
      const idx = dups.findIndex((d) => d.id === dupId);
      if (idx === -1) return prev;
      const dup = { ...dups[idx] };
      dup.transform = { ...dup.transform, ...value };
      dups[idx] = dup;
      return { ...prev, duplicatedElements: dups };
    });
  };

  const handleChangeTheme = (theme: ThemeId) => {
    setState((prev) => ({ ...prev, currentTheme: theme }));
  };

  const handleChangePage = (page: PageType) => {
    setState((prev) => ({ ...prev, currentPage: page }));
    // Clear active selection focus when resetting page to avoid mis-mappings
    setActiveElement(null);
  };

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to reset all custom texts and values back to the default magazine templates? This will overwrite your current changes.")) {
      setState(INITIAL_STATE);
      setActiveElement(null);
    }
  };

  // Toggle element visibility for current session (reappears on refresh)
  const handleToggleHideElement = (elementId: string) => {
    setState((prev) => {
      const hidden = { ...(prev.hiddenElements || {}) };
      if (hidden[elementId]) {
        delete hidden[elementId];
      } else {
        hidden[elementId] = true;
      }
      return { ...prev, hiddenElements: hidden };
    });
  };

  // Helper to get the text value for a given section and field
  const getFieldValue = (prev: AppState, section: string, field: string): string => {
    if (field === '__photo__') return prev.photo.url || '';
    if (section === 'cover') {
      if (field.startsWith('bulletPoints.')) {
        const idx = parseInt(field.split('.')[1]);
        return prev.coverData.bulletPoints[idx] || '';
      }
      return (prev.coverData as any)[field] || '';
    }
    if (section === 'index') return (prev.indexData as any)[field] || '';
    if (section === 'topper') return (prev.topperData as any)[field] || '';
    if (section === 'bio') {
      if (field.startsWith('paragraphs.')) {
        const idx = parseInt(field.split('.')[1]);
        return prev.bioData.paragraphs[idx] || '';
      }
      return (prev.bioData as any)[field] || '';
    }
    if (section === 'promo') {
      if (field.startsWith('features.')) {
        const idx = parseInt(field.split('.')[1]);
        return prev.promoData.features[idx] || '';
      }
      return (prev.promoData as any)[field] || '';
    }
    return '';
  };

  // Duplicate an element (array-based or heading)
  const handleDuplicateElement = (section: string, field: string) => {
    setState((prev) => {
      // Helper: clone with unique id for object items
      const cloneWithId = (item: any) => ({
        ...item,
        id: item.id ? `${item.id}_copy_${Date.now()}` : undefined
      });

      if (section === 'cover' && field.startsWith('bulletPoints.')) {
        const idx = parseInt(field.split('.')[1]);
        const arr = [...prev.coverData.bulletPoints];
        if (idx >= 0 && idx < arr.length) {
          arr.splice(idx + 1, 0, arr[idx]);
        }
        return { ...prev, coverData: { ...prev.coverData, bulletPoints: arr } };
      }
      if (section === 'bio' && field.startsWith('paragraphs.')) {
        const idx = parseInt(field.split('.')[1]);
        const arr = [...prev.bioData.paragraphs];
        if (idx >= 0 && idx < arr.length) {
          arr.splice(idx + 1, 0, arr[idx]);
        }
        return { ...prev, bioData: { ...prev.bioData, paragraphs: arr } };
      }
      if (section === 'promo' && field.startsWith('features.')) {
        const idx = parseInt(field.split('.')[1]);
        const arr = [...prev.promoData.features];
        if (idx >= 0 && idx < arr.length) {
          arr.splice(idx + 1, 0, arr[idx]);
        }
        return { ...prev, promoData: { ...prev.promoData, features: arr } };
      }
      if (section === 'index' && field.startsWith('leftItems.')) {
        const idx = parseInt(field.split('.')[1]);
        const arr = [...prev.indexData.leftItems];
        if (idx >= 0 && idx < arr.length) {
          arr.splice(idx + 1, 0, cloneWithId(arr[idx]));
        }
        return { ...prev, indexData: { ...prev.indexData, leftItems: arr } };
      }
      if (section === 'index' && field.startsWith('rightItems.')) {
        const idx = parseInt(field.split('.')[1]);
        const arr = [...prev.indexData.rightItems];
        if (idx >= 0 && idx < arr.length) {
          arr.splice(idx + 1, 0, cloneWithId(arr[idx]));
        }
        return { ...prev, indexData: { ...prev.indexData, rightItems: arr } };
      }
      if (section === 'topper' && field.startsWith('items.')) {
        const idx = parseInt(field.split('.')[1]);
        const arr = [...prev.topperData.items];
        if (idx >= 0 && idx < arr.length) {
          arr.splice(idx + 1, 0, cloneWithId(arr[idx]));
        }
        return { ...prev, topperData: { ...prev.topperData, items: arr } };
      }
      
      // For heading elements (non-array): store copy in elementCopies
      const elementId = `${section}.${field}`;
      const currentValue = getFieldValue(prev, section, field);
      const copies = { ...(prev.elementCopies || {}) };
      const existing = copies[elementId] || [];
      copies[elementId] = [...existing, currentValue];
      return { ...prev, elementCopies: copies };
    });
  };

  const handleDuplicateAnyElement = (section: string, field: string, label: string, value?: string, type: 'text' | 'image' = 'text') => {
    setState((prev) => {
      const dups = prev.duplicatedElements || [];
      const copyIdx = dups.filter((d) => d.section === section && d.field === field).length;
      const newId = `dup_${section}_${field}_${Date.now()}`;
      const origTransform = (prev.transforms || {})[`${section}.${field}`] || { x: 0, y: 0, scale: 1.0, rotation: 0 };
      const resolvedValue = value || getFieldValue(prev, section, field);
      const resolvedType = field === '__photo__' ? 'image' as const : type;
      const newDup: DuplicatedElement = {
        id: newId,
        type: resolvedType,
        section,
        field,
        label: label,
        value: resolvedValue,
        transform: {
          x: origTransform.x + 15 + copyIdx * 5,
          y: origTransform.y + 15 + copyIdx * 5,
          scale: origTransform.scale,
          rotation: 0,
        },
        customBackground: (prev.customBackgrounds || {})[`${section}.${field}`],
        customTextColor: (prev.customElementTextColors || {})[`${section}.${field}`],
        customFont: (prev.customElementFonts || {})[`${section}.${field}`],
        customAccent: (prev.customElementAccents || {})[`${section}.${field}`],
        customStyles: { ...((prev.customElementStyles || {})[`${section}.${field}`] || {}) },
      };
      return { ...prev, duplicatedElements: [...dups, newDup] };
    });
  };

  const handleRemoveDuplicatedElement = (dupId: string) => {
    setState((prev) => ({
      ...prev,
      duplicatedElements: (prev.duplicatedElements || []).filter((d) => d.id !== dupId),
    }));
  };

  // For duplicated elements, update their text value
  const handleUpdateDuplicateText = (dupId: string, value: string) => {
    setState((prev) => {
      const dups = [...(prev.duplicatedElements || [])];
      const idx = dups.findIndex((d) => d.id === dupId);
      if (idx === -1) return prev;
      dups[idx] = { ...dups[idx], value };
      return { ...prev, duplicatedElements: dups };
    });
  };

  // For duplicated elements, update their style overrides
  const handleUpdateDuplicateStyle = (dupId: string, key: string, value: any) => {
    setState((prev) => {
      const dups = [...(prev.duplicatedElements || [])];
      const idx = dups.findIndex((d) => d.id === dupId);
      if (idx === -1) return prev;
      const dup = { ...dups[idx] };
      if (key === 'customBackground') dup.customBackground = value;
      else if (key === 'customTextColor') dup.customTextColor = value;
      else if (key === 'customFont') dup.customFont = value;
      else if (key === 'customAccent') dup.customAccent = value;
      else if (key === 'customStyles') dup.customStyles = value;
      dups[idx] = dup;
      return { ...prev, duplicatedElements: dups };
    });
  };

  // Remove a heading copy from elementCopies
  const handleRemoveElementCopy = (elementId: string, copyIndex: number) => {
    setState((prev) => {
      const copies = { ...(prev.elementCopies || {}) };
      const existing = [...(copies[elementId] || [])];
      if (copyIndex >= 0 && copyIndex < existing.length) {
        existing.splice(copyIndex, 1);
        if (existing.length === 0) {
          delete copies[elementId];
        } else {
          copies[elementId] = existing;
        }
      }
      return { ...prev, elementCopies: copies };
    });
  };

  // Element glow color/width handlers
  const handleUpdateElementGlow = (elementId: string, color: string | undefined) => {
    setState((prev) => ({
      ...prev,
      elementGlowColors: { ...(prev.elementGlowColors || {}), [elementId]: color },
    }));
  };

  const handleUpdateElementGlowWidth = (elementId: string, width: number | undefined) => {
    setState((prev) => ({
      ...prev,
      elementGlowWidths: { ...(prev.elementGlowWidths || {}), [elementId]: width },
    }));
  };

  // Canvas free-form element handlers
  const handleAddCanvasElement = (type: 'text' | 'box', overrides?: Partial<CanvasElement>) => {
    setState((prev) => {
      const elements = prev.canvasElements || [];
      const count = elements.length;
      const defaults: CanvasElement = type === 'box'
        ? { id: `ce_${Date.now()}`, page: prev.currentPage, type: 'box', x: 80 + count * 25, y: 80 + count * 25, width: 200, height: 150, rotation: 0, scale: 1, content: '', backgroundColor: '#1a1a2e', borderColor: '#ccff00', borderWidth: 2, borderRadius: 8, opacity: 1, zIndex: 10 }
        : { id: `ce_${Date.now()}`, page: prev.currentPage, type: 'text', x: 80 + count * 25, y: 80 + count * 25, width: 240, height: 40, rotation: 0, scale: 1, content: 'New Text', textColor: '#ffffff', fontSize: 16, fontFamily: 'sans-serif', opacity: 1, zIndex: 10 };
      return { ...prev, canvasElements: [...elements, { ...defaults, ...overrides, id: defaults.id, type }] };
    });
  };

  const handleUpdateCanvasElement = (id: string, updates: Partial<CanvasElement>) => {
    setState((prev) => {
      const elements = [...(prev.canvasElements || [])];
      const idx = elements.findIndex((e) => e.id === id);
      if (idx === -1) return prev;
      elements[idx] = { ...elements[idx], ...updates };
      return { ...prev, canvasElements: elements };
    });
  };

  const handleRemoveCanvasElement = (id: string) => {
    setState((prev) => ({
      ...prev,
      canvasElements: (prev.canvasElements || []).filter((e) => e.id !== id),
    }));
  };

  // Helper print dialog caller
  const handlePrint = () => {
    window.print();
  };

  // File input ref for importing exported HTML
  const importFileRef = useRef<HTMLInputElement>(null);
  // File input ref for importing element style presets
  const elementStyleImportRef = useRef<HTMLInputElement>(null);

  // Import design from exported HTML file
  const handleImportHtml = () => {
    importFileRef.current?.click();
  };

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const html = reader.result as string;
        // Extract embedded state JSON from the exported HTML
        const match = html.match(/<script id="educover-state-data" type="application\/json">([\s\S]*?)<\/script>/);
        if (match && match[1]) {
          const parsed = JSON.parse(match[1].trim());
          setState({ ...parsed, hiddenElements: {} });
          setActiveElement(null);
          alert('Design imported successfully! All elements are now editable.');
        } else {
          alert('Could not find embedded state data in this HTML file. Make sure it was exported from EduCover Studio.');
        }
      } catch (err) {
        console.error('Import failed:', err);
        alert('Failed to import design. The file may be corrupted or incompatible.');
      }
    };
    reader.readAsText(file);
    // Reset input so the same file can be selected again
    e.target.value = '';
  };

  // Save/Load design templates to localStorage
  const [savedDesigns, setSavedDesigns] = useState<Record<string, AppState>>(() => {
    try {
      const saved = localStorage.getItem('educover_saved_designs');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  const handleSaveDesign = (name: string) => {
    if (!name.trim()) return;
    const designs = { ...savedDesigns, [name.trim()]: state };
    setSavedDesigns(designs);
    localStorage.setItem('educover_saved_designs', JSON.stringify(designs));
  };

  const handleLoadDesign = (name: string) => {
    const design = savedDesigns[name];
    if (design) {
      setState({ ...design, hiddenElements: {} });
      setActiveElement(null);
    }
  };

  const handleDeleteDesign = (name: string) => {
    const designs = { ...savedDesigns };
    delete designs[name];
    setSavedDesigns(designs);
    localStorage.setItem('educover_saved_designs', JSON.stringify(designs));
  };

  // Export the current active element's styling as a downloadable .json preset
  const handleExportElementStyle = () => {
    if (!activeElement) return;
    const { section, field, duplicatedId } = activeElement;
    const elementId = `${section}.${field}`;
    
    // For duplicated elements, read from the dup directly
    const activeDup = duplicatedId ? (state.duplicatedElements || []).find((d) => d.id === duplicatedId) : null;
    
    const preset = {
      version: 1,
      name: `Style - ${activeElement.label}`,
      elementStyles: {
        customBackground: activeDup
          ? activeDup.customBackground
          : (state.customBackgrounds || {})[elementId],
        customTextColor: activeDup
          ? activeDup.customTextColor
          : (state.customElementTextColors || {})[elementId],
        customFont: activeDup
          ? activeDup.customFont
          : (state.customElementFonts || {})[elementId],
        customAccent: activeDup
          ? activeDup.customAccent
          : (state.customElementAccents || {})[elementId],
        customStyles: activeDup
          ? (activeDup.customStyles || undefined)
          : (state.customElementStyles || {})[elementId],
        glowColor: activeDup ? undefined : (state.elementGlowColors || {})[elementId],
        glowWidth: activeDup ? undefined : (state.elementGlowWidths || {})[elementId],
        transform: activeDup
          ? { ...activeDup.transform }
          : field === '__photo__'
            ? { x: state.photo.xOffset, y: state.photo.yOffset, scale: state.photo.scale, rotation: (state.transforms || {})[elementId]?.rotation ?? 0 }
            : { ...((state.transforms || {})[elementId] || { x: 0, y: 0, scale: 1.0, rotation: 0 }) },
      }
    };

    const blob = new Blob([JSON.stringify(preset, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `style-${elementId.replace(/[^a-zA-Z0-9]/g, '_')}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import and apply an element style preset .json file to the current active element
  const handleImportElementStyle = () => {
    elementStyleImportRef.current?.click();
  };

  const handleImportElementStyleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const preset = JSON.parse(reader.result as string);
        if (!preset.elementStyles) {
          alert('Invalid style preset file. Could not find "elementStyles" key.');
          return;
        }
        if (!activeElement) {
          alert('Please select a layer/element first before importing a style preset.');
          return;
        }
        const { section, field, duplicatedId } = activeElement;
        const elementId = `${section}.${field}`;
        const s = preset.elementStyles;

        // Apply each style property if present in the preset
        setState((prev) => {
          let newState = { ...prev };

          if (duplicatedId) {
            // For duplicated elements, apply to the dup's properties
            const dups = [...(prev.duplicatedElements || [])];
            const idx = dups.findIndex((d) => d.id === duplicatedId);
            if (idx !== -1) {
              const dup = { ...dups[idx] };
              if (s.customBackground !== undefined) dup.customBackground = s.customBackground;
              if (s.customTextColor !== undefined) dup.customTextColor = s.customTextColor;
              if (s.customFont !== undefined) dup.customFont = s.customFont;
              if (s.customAccent !== undefined) dup.customAccent = s.customAccent;
              if (s.customStyles !== undefined) dup.customStyles = { ...s.customStyles };
              if (s.transform) {
                dup.transform = { ...dup.transform, ...s.transform };
              }
              dups[idx] = dup;
              newState = { ...newState, duplicatedElements: dups };
            }
          } else {
            // For original elements
            if (s.customBackground !== undefined) {
              const bgs = { ...(prev.customBackgrounds || {}) };
              bgs[elementId] = s.customBackground === 'none' ? 'none' : s.customBackground;
              newState = { ...newState, customBackgrounds: bgs };
            }
            if (s.customTextColor !== undefined) {
              const colorsMap = { ...(prev.customElementTextColors || {}) };
              colorsMap[elementId] = s.customTextColor;
              newState = { ...newState, customElementTextColors: colorsMap };
            }
            if (s.customFont !== undefined) {
              const fontsMap = { ...(prev.customElementFonts || {}) };
              if (s.customFont) fontsMap[elementId] = s.customFont;
              newState = { ...newState, customElementFonts: fontsMap };
            }
            if (s.customAccent !== undefined) {
              const accentsMap = { ...(prev.customElementAccents || {}) };
              accentsMap[elementId] = s.customAccent;
              newState = { ...newState, customElementAccents: accentsMap };
            }
            if (s.customStyles !== undefined) {
              const allStyles = { ...(prev.customElementStyles || {}) };
              allStyles[elementId] = { ...s.customStyles };
              newState = { ...newState, customElementStyles: allStyles };
            }
            if (s.glowColor !== undefined) {
              const glows = { ...(prev.elementGlowColors || {}) };
              glows[elementId] = s.glowColor;
              newState = { ...newState, elementGlowColors: glows };
            }
            if (s.glowWidth !== undefined) {
              const widths = { ...(prev.elementGlowWidths || {}) };
              widths[elementId] = s.glowWidth;
              newState = { ...newState, elementGlowWidths: widths };
            }
            if (s.transform && field !== '__photo__') {
              const transforms = { ...(prev.transforms || {}) };
              const current = transforms[elementId] || { x: 0, y: 0, scale: 1.0, rotation: 0 };
              transforms[elementId] = { ...current, ...s.transform };
              newState = { ...newState, transforms };
            }
            if (s.transform && field === '__photo__') {
              const photo = { ...prev.photo };
              if (s.transform.x !== undefined) photo.xOffset = s.transform.x;
              if (s.transform.y !== undefined) photo.yOffset = s.transform.y;
              if (s.transform.scale !== undefined) photo.scale = s.transform.scale;
              newState = { ...newState, photo };
            }
          }

          return newState;
        });

        alert(`Style preset "${preset.name || 'Unnamed'}" applied to "${activeElement.label}"!`);
      } catch (err) {
        console.error('Style import failed:', err);
        alert('Failed to import style preset. The file may be corrupted or incompatible.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Standalone HTML Exporter
  const handleDownloadHtml = () => {
    try {
      const generatedCode = generateStandaloneHtml(state);
      const blob = new Blob([generatedCode], { type: 'text/html;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `edu_cover_${state.currentPage}_${state.currentTheme}.html`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("HTML Export failed:", err);
      alert("Something went wrong with the HTML export. Please check console logs.");
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans select-none overflow-x-hidden transition-colors duration-250 ${isDark ? 'bg-zinc-950 text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
      
      {/* GLOBAL HEADBOARD STATS HEADER */}
      <header className={`py-3.5 px-6 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50 transition-colors border-b backdrop-blur-md ${isDark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white/90 border-slate-200'}`}>
        
        {/* Left Side: Title */}
        <div className="flex items-center gap-3">
          <span className="text-xl">🎨</span>
          <div>
            <h1 className={`text-base font-black tracking-tight flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span>EDU-COVER STUDIO</span>
              <span className="text-[9px] uppercase font-mono tracking-widest bg-yellow-400 text-black px-1.5 py-0.2 rounded font-black">
                PRO MULTI-THEME
              </span>
            </h1>
            <p className={`text-[10px] ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              High-contrast study materials & magazine cover layout builder for elite educators.
            </p>
          </div>
        </div>

        {/* Middle quick stats pills */}
        <div className="hidden md:flex items-center gap-4 text-xs font-mono">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px]">AUTO-SAVE:</span>
            <span className={`text-[10px] font-bold ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{lastSaved || 'Initial load'}</span>
          </div>

          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
            <Sparkles size={11} className={isDark ? 'text-[#ccff00]' : 'text-teal-600'} />
            <span className="text-[10px]">CURRENT:</span>
            <span className={`text-[10px] font-bold uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeTheme.name}</span>
          </div>
        </div>

        {/* Right side download / save / print / theme custom action buttons */}
        <div className="flex items-center gap-2">

          {/* Undo / Redo buttons */}
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold ${
              canUndo
                ? isDark
                  ? 'bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700'
                  : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50 shadow-sm'
                : 'opacity-30 cursor-not-allowed'
            }`}
            title="Undo last action"
          >
            <Undo2 size={13} className="stroke-[2.5]" />
            <span className="text-[10px] font-mono font-bold leading-none">UNDO</span>
          </button>

          <button
            onClick={handleRedo}
            disabled={!canRedo}
            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold ${
              canRedo
                ? isDark
                  ? 'bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700'
                  : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50 shadow-sm'
                : 'opacity-30 cursor-not-allowed'
            }`}
            title="Redo undone action"
          >
            <Redo2 size={13} className="stroke-[2.5]" />
            <span className="text-[10px] font-mono font-bold leading-none">REDO</span>
          </button>

          {/* Tooltip Visibility Toggle Button */}
          <button
            onClick={() => handleUpdateText('global', 'hideDragTooltips', !state.hideDragTooltips)}
            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold ${
              state.hideDragTooltips
                ? 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20'
                : isDark
                  ? 'bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700'
                  : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50 shadow-sm'
            }`}
            title={`${state.hideDragTooltips ? 'Show' : 'Hide'} 'Drag / Edit' popups on hover`}
          >
            <EyeOff size={13} className={state.hideDragTooltips ? "text-red-500" : isDark ? "text-[#ccff00]" : "text-teal-600"} />
            <span className="text-[10px] font-mono font-bold leading-none">
              TOOLTIPS: {state.hideDragTooltips ? "OFF" : "ON"}
            </span>
          </button>

          {/* WorkSpace UI Theme Lever Button */}
          <button
            onClick={() => handleUpdateText('global', 'appTheme', isDark ? 'light' : 'dark')}
            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold ${
              isDark 
                ? 'bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700' 
                : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50 shadow-sm'
            }`}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Workspace`}
          >
            {isDark ? (
              <>
                <Sun size={13} className="text-yellow-400 fill-yellow-400" />
                <span className="text-[10px] font-mono font-bold leading-none">LIGHT MODE</span>
              </>
            ) : (
              <>
                <Moon size={13} className="text-indigo-600 fill-indigo-600/10" />
                <span className="text-[10px] font-mono font-bold leading-none">DARK MODE</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadHtml}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center gap-2 ${
              isDark
                ? 'bg-zinc-800 text-white hover:bg-zinc-700 hover:text-[#ccff00] border-zinc-700'
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200 hover:text-teal-700 border-slate-200'
            }`}
            title="Download fully self-contained offline HTML file"
          >
            <FileCode size={13} className="stroke-[2.5]" />
            <span>Export Standalone HTML</span>
          </button>

          <button
            onClick={handlePrint}
            className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:opacity-90 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-sm"
            title="Download or Print as PDF file"
          >
            <Printer size={13} className="stroke-[2.5]" />
            <span>In-App PDF Print</span>
          </button>
          
        </div>

      </header>

      {/* CORE FRAMEWORK AREA: WORKSPACE */}
      <div className={`flex-1 flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x transition-colors ${isDark ? 'divide-zinc-800' : 'divide-slate-200'}`}>
        
        {/* Left Side: Sidebar controls & customizations options */}
        <EditorSidebar
          state={state}
          onChangeTheme={handleChangeTheme}
          onChangePage={handleChangePage}
          onUpdatePhoto={handleUpdatePhoto}
          onUpdateText={handleUpdateText}
          onResetData={handleResetData}
          activeElement={activeElement}
          onClearActiveElement={() => setActiveElement(null)}
          onUpdateTransform={handleUpdateTransform}
          onSelectElement={(sec, fld, lbl, dupId) => {
            setActiveElement({ section: sec, field: fld, label: lbl, duplicatedId: dupId });
          }}
          onToggleHideElement={handleToggleHideElement}
          onDuplicateElement={handleDuplicateElement}
          onDuplicateAnyElement={handleDuplicateAnyElement}
          onRemoveDuplicatedElement={handleRemoveDuplicatedElement}
          onUpdateDuplicateTransform={handleUpdateDuplicateTransform}
          onUpdateDuplicateText={handleUpdateDuplicateText}
          onUpdateDuplicateStyle={handleUpdateDuplicateStyle}
          onUpdateElementGlow={handleUpdateElementGlow}
          onUpdateElementGlowWidth={handleUpdateElementGlowWidth}
          onAddCanvasElement={handleAddCanvasElement}
          onUpdateCanvasElement={handleUpdateCanvasElement}
          onRemoveCanvasElement={handleRemoveCanvasElement}
          selectedCanvasId={selectedCanvasId}
          onSelectCanvas={setSelectedCanvasId}
          onRemoveElementCopy={handleRemoveElementCopy}
          onImportHtml={handleImportHtml}
          onSaveDesign={handleSaveDesign}
          onLoadDesign={handleLoadDesign}
          onDeleteDesign={handleDeleteDesign}
          savedDesigns={Object.keys(savedDesigns)}
          appTheme={state.appTheme || 'light'}
          onExportElementStyle={handleExportElementStyle}
          onImportElementStyle={handleImportElementStyle}
        />

        {/* Hidden file input for importing designs */}
        <input
          type="file"
          ref={importFileRef}
          accept=".html"
          onChange={handleImportFileChange}
          className="hidden"
        />

        {/* Hidden file input for importing element style presets */}
        <input
          type="file"
          ref={elementStyleImportRef}
          accept=".json"
          onChange={handleImportElementStyleFileChange}
          className="hidden"
        />

        {/* Middle/Right Side: Live visual canvas screen preview */}
        <main className={`flex-1 p-6 lg:p-12 flex flex-col items-center justify-center relative min-h-[500px] transition-colors ${isDark ? 'bg-zinc-950' : 'bg-slate-50'}`}>
          
          {/* Guide Bar with Zoom Controls */}
          <div className={`w-full max-w-3xl mb-3 flex items-center justify-between text-[11px] px-3 py-2 rounded-xl border transition-colors ${
            isDark 
              ? 'text-zinc-400 bg-zinc-900 border-zinc-805/75' 
              : 'text-slate-600 bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center gap-1.5">
              <Eye size={12} className={isDark ? 'text-[#ccff00]' : 'text-teal-600'} />
              <span>Canvas preview</span>
            </div>
            <div className="flex items-center gap-3">
              {/* Zoom Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCanvasZoom(z => Math.max(0.25, z - 0.1))}
                  className={`p-1 rounded border transition-all cursor-pointer ${
                    isDark
                      ? 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-600'
                      : 'bg-white text-slate-500 border-slate-200 hover:text-slate-800 hover:border-slate-300'
                  }`}
                  title="Zoom out"
                  aria-label="Zoom out"
                >
                  <ZoomOut size={12} />
                </button>
                <span className={`font-mono text-[10px] font-bold min-w-[38px] text-center ${
                  isDark ? 'text-zinc-300' : 'text-slate-700'
                }`}>
                  {Math.round(canvasZoom * 100)}%
                </span>
                <button
                  onClick={() => setCanvasZoom(z => Math.min(1.5, z + 0.1))}
                  className={`p-1 rounded border transition-all cursor-pointer ${
                    isDark
                      ? 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-600'
                      : 'bg-white text-slate-500 border-slate-200 hover:text-slate-800 hover:border-slate-300'
                  }`}
                  title="Zoom in"
                  aria-label="Zoom in"
                >
                  <ZoomIn size={12} />
                </button>
                {/* Zoom slider */}
                <input
                  type="range"
                  min="0.25"
                  max="1.5"
                  step="0.05"
                  value={canvasZoom}
                  onChange={(e) => setCanvasZoom(parseFloat(e.target.value))}
                  className="w-16 h-1 accent-[#ccff00] cursor-pointer"
                  aria-label="Canvas zoom level"
                />
              </div>

              <button
                onClick={() => handleUpdateText('global', 'hideDragTooltips', !state.hideDragTooltips)}
                className={`px-2 py-0.5 rounded text-[9px] font-mono border transition-all cursor-pointer ${
                  state.hideDragTooltips
                    ? "bg-red-500/10 text-red-500 border-red-500/30 font-bold"
                    : isDark
                      ? "bg-zinc-800 text-zinc-300 border-zinc-700 hover:text-white"
                      : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                }`}
                title="Hide/Show drag overlay badges and text hints"
              >
                {state.hideDragTooltips ? "Tooltips Off" : "Hide Tooltips"}
              </button>
              <span className={`font-mono px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider ${
                isDark ? 'bg-zinc-950 text-[#ccff00]' : 'bg-slate-100 text-teal-700 font-bold'
              }`}>
                A4
              </span>
            </div>
          </div>

          {/* Interactive Layout Box with actual canvas - scrollable when zoomed in */}
          <div className="w-full max-w-3xl overflow-auto relative">
            <div
              style={{
                transform: `scale(${canvasZoom})`,
                transformOrigin: 'top center',
                transition: 'transform 0.2s ease',
                width: canvasZoom < 1 ? '100%' : undefined,
              }}
              className="group"
            >
              <PageRenderer
                state={state}
                colors={activeTheme.colors}
                onUpdateText={handleUpdateText}
                onSelectElement={(sec, fld, lbl, dupId) => {
                  setActiveElement({ section: sec, field: fld, label: lbl, duplicatedId: dupId });
                }}
                activeElementId={activeElement ? `${activeElement.section}.${activeElement.field}` : null}
                activeDuplicateId={activeElement?.duplicatedId}
                onUpdateTransform={handleUpdateTransform}
                onUpdatePhoto={handleUpdatePhoto}
                onRemoveElementCopy={handleRemoveElementCopy}
                onDuplicateAnyElement={handleDuplicateAnyElement}
                onRemoveDuplicatedElement={handleRemoveDuplicatedElement}
                onUpdateDuplicateTransform={handleUpdateDuplicateTransform}
                onUpdateDuplicateText={handleUpdateDuplicateText}
                onUpdateDuplicateStyle={handleUpdateDuplicateStyle}
                onUpdateElementGlow={handleUpdateElementGlow}
                onUpdateElementGlowWidth={handleUpdateElementGlowWidth}
                onUpdateCanvasElement={handleUpdateCanvasElement}
                onRemoveCanvasElement={handleRemoveCanvasElement}
                selectedCanvasId={selectedCanvasId}
                onSelectCanvas={setSelectedCanvasId}
              />

              {/* Hint message box showing up on layout hover */}
              {!state.hideDragTooltips && (
                <div className={`absolute top-3 left-3 text-[10px] font-mono font-bold px-2 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border ${
                  isDark 
                    ? 'bg-zinc-950/85 text-zinc-300 border-zinc-700/50 backdrop-blur' 
                    : 'bg-white/95 text-slate-700 border-slate-200 backdrop-blur'
                }`}>
                  Click & drag any content directly on the page to adjust!
                </div>
              )}
            </div>
          </div>

          {/* Interactive printing helpers segment for better user UX */}
          {showPrintTip && (
            <div className={`w-full max-w-sm mt-6 p-4 rounded-xl border flex gap-3.5 relative transition-colors ${
              isDark 
                ? 'border-zinc-800 bg-zinc-900/50' 
                : 'border-slate-205 bg-white shadow-sm'
            }`}>
              <span className="text-xl">💡</span>
              <div className="space-y-1">
                <h4 className={`text-xs font-extrabold uppercase tracking-wide ${isDark ? 'text-amber-400' : 'text-amber-650'}`}>A4 Standardized Printing</h4>
                <p className={`text-[10px] leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  We've standardized the layout to professional <b>A4 PDF size</b>. When printing or exporting, choose <b>"Save as PDF"</b> or <b>"Print"</b>, set your layout to <b>Portrait</b>, paper size to <b>A4</b>, and margins to <b>None</b> or <b>Minimum</b> to get exact publication fits!
                </p>
              </div>
              <button 
                className={`absolute top-2 right-2 font-bold text-xs p-1 ${isDark ? 'text-zinc-500 hover:text-white' : 'text-slate-400 hover:text-slate-800'}`}
                onClick={() => setShowPrintTip(false)}
              >
                ✕
              </button>
            </div>
          )}

          {/* CSS TARGET FOR BOTH HIGH-RESOLUTION PRINTING (A4 PORTRAIT) & LIGHT WORKSPACE THEME SYSTEM */}
          <style dangerouslySetInnerHTML={{ __html: `
            @page {
              size: A4 portrait;
              margin: 0;
            }
            @media print {
              /* Hide standard headers, sidebars and tips during browser print mode */
              body * {
                visibility: hidden;
              }
              header, aside, .lg\\:w-96, .bg-zinc-900\\/90, .border-b, button, .max-w-sm, style, .text-zinc-500 {
                display: none !important;
                height: 0 !important;
              }
              /* Render only our specific visual PageRenderer element */
              [key^="page-"] {
                visibility: visible !important;
                position: fixed !important;
                left: 0 !important;
                top: 0 !important;
                width: 100vw !important;
                height: 141.42vw !important; /* Forces A4 aspect ratio @ 1:1.414 precisely */
                margin: 0 !important;
                padding: 1.5cm !important;
                border: none !important;
                border-radius: 0 !important;
                box-shadow: none !important;
                background-color: ${activeTheme.colors.background} !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }

            /* LIGHT WORKSPACE WORKBENCH STYLING OVERRIDES */
            .light-workspace {
              background-color: #f8fafc !important;
              color: #1e293b !important;
            }
            .light-workspace aside {
              background-color: #ffffff !important;
              border-right: 1px solid #cbd5e1 !important;
              color: #334155 !important;
            }
            /* Override background panels */
            .light-workspace aside .bg-zinc-950,
            .light-workspace aside .bg-zinc-900,
            .light-workspace aside div[class*="bg-zinc-950"],
            .light-workspace aside div[class*="bg-zinc-900"] {
              background-color: #f8fafc !important;
              border-color: #cbd5e1 !important;
            }
            /* Button & list-item theme adaptions */
            .light-workspace aside button {
              color: #475569 !important;
              border-color: #cbd5e1 !important;
            }
            .light-workspace aside button[class*="bg-zinc-950"],
            .light-workspace aside button[class*="bg-zinc-900"] {
              background-color: #ffffff !important;
              border-color: #cbd5e1 !important;
            }
            .light-workspace aside button[class*="bg-zinc-950"]:hover,
            .light-workspace aside button[class*="bg-zinc-900"]:hover,
            .light-workspace aside button[class*="hover:bg-zinc-850"]:hover,
            .light-workspace aside button[class*="hover:bg-zinc-800"]:hover {
              background-color: #f1f5f9 !important;
              color: #0f172a !important;
            }
            /* Standard text & label brightness corrections */
            .light-workspace aside h2,
            .light-workspace aside h3,
            .light-workspace aside h4,
            .light-workspace aside label,
            .light-workspace aside span[class*="text-zinc-150"],
            .light-workspace aside span[class*="text-zinc-100"],
            .light-workspace aside span[class*="text-zinc-200"],
            .light-workspace aside span[class*="text-white"],
            .light-workspace aside .text-white,
            .light-workspace aside .text-zinc-100,
            .light-workspace aside .text-zinc-200 {
              color: #0f172a !important;
            }
            .light-workspace aside p,
            .light-workspace aside .text-zinc-400,
            .light-workspace aside .text-zinc-500,
            .light-workspace aside span[class*="text-zinc-400"],
            .light-workspace aside span[class*="text-zinc-500"],
            .light-workspace aside .text-zinc-350 {
              color: #64748b !important;
            }
            /* Accent selection indicator transformations */
            .light-workspace aside button[class*="border-[#ccff00]"],
            .light-workspace aside button[class*="bg-[#ccff00]/10"],
            .light-workspace aside button[class*="border-\\[\\#ccff00\\]"] {
              background-color: #f0fdf4 !important;
              border-color: #10b981 !important;
              color: #065f46 !important;
            }
            .light-workspace aside button[class*="border-[#ccff00]"] span,
            .light-workspace aside button[class*="border-\\[\\#ccff00\\]"] span {
              color: #047857 !important;
              font-weight: 700 !important;
            }
            .light-workspace aside button[class*="border-[#ccff00]"] svg,
            .light-workspace aside button[class*="border-\\[\\#ccff00\\]"] svg {
              color: #10b981 !important;
            }
            .light-workspace aside button[class*="border-primary"] {
              border-color: #10b981 !important;
              background-color: #f0fdf4 !important;
            }
            .light-workspace aside button[class*="border-primary"] span {
              color: #065f46 !important;
              font-weight: 700 !important;
            }
            /* Form input adaptions */
            .light-workspace aside select,
            .light-workspace aside input[type="text"],
            .light-workspace aside textarea {
              background-color: #ffffff !important;
              color: #0f172a !important;
              border-color: #cbd5e1 !important;
            }
            .light-workspace aside select:focus,
            .light-workspace aside input[type="text"]:focus,
            .light-workspace aside textarea:focus {
              border-color: #10b981 !important;
              box-shadow: 0 0 0 1px #10b981 !important;
            }
            .light-workspace aside div[class*="bg-[#ccff00]/10"] {
              background-color: #f0fdf4 !important;
              border-color: #a7f3d0 !important;
              color: #065f46 !important;
            }
            .light-workspace aside div[class*="bg-[#ccff00]/10"] span[class*="text-black"] {
              background-color: #10b981 !important;
              color: #ffffff !important;
            }
            .light-workspace aside div[class*="bg-[#ccff00]/10"] span[class*="text-[#ccff00]"] {
              color: #047857 !important;
            }
            .light-workspace aside input[type="range"] {
              accent-color: #10b981 !important;
            }
            /* Universal separators */
            .light-workspace aside .border-t,
            .light-workspace aside .border-b,
            .light-workspace aside .border-zinc-800,
            .light-workspace aside .border-zinc-850 {
              border-color: #cbd5e1 !important;
            }
          `}} />

        </main>

      </div>
    </div>
  );
}
