import React from 'react';
import { AppState, ThemeColors, ThemeId, CanvasElement, ElementShadowConfig, GradientConfig, gradientToCss, shadowToCss } from '../types';
import { 
  BookOpen, 
  MapPin, 
  Youtube, 
  Trash2, 
  Instagram, 
  Send, 
  Globe, 
  Tv, 
  PhoneCall, 
  User, 
  Award, 
  Flame, 
  Star, 
  PartyPopper,
  Quote
} from 'lucide-react';

interface PageRendererProps {
  state: AppState;
  colors: ThemeColors;
  onUpdateText: (section: string, key: string, value: any) => void;
  onSelectElement: (page: string, key: string, label: string, duplicatedId?: string) => void;
  activeElementId: string | null;
  activeDuplicateId?: string;
  onUpdateTransform: (key: string, value: any) => void;
  onUpdatePhoto: (key: string, value: any) => void;
  onRemoveElementCopy?: (elementId: string, copyIndex: number) => void;
  onDuplicateAnyElement?: (section: string, field: string, label: string, value: string, type?: 'text' | 'image') => void;
  onRemoveDuplicatedElement?: (dupId: string) => void;
  onUpdateDuplicateTransform?: (dupId: string, value: any) => void;
  onUpdateDuplicateText?: (dupId: string, value: string) => void;
  onUpdateDuplicateStyle?: (dupId: string, key: string, value: any) => void;
  onUpdateElementGlow?: (elementId: string, color: string | undefined) => void;
  onUpdateElementGlowWidth?: (elementId: string, width: number | undefined) => void;
  onUpdateElementShadow?: (elementId: string, shadow: ElementShadowConfig | undefined) => void;
  onUpdateElementGradient?: (elementId: string, gradient: GradientConfig | undefined) => void;
  onUpdateCanvasElement?: (id: string, updates: Partial<CanvasElement>) => void;
  onRemoveCanvasElement?: (id: string) => void;
  selectedCanvasId: string | null;
  onSelectCanvas: (id: string | null) => void;
}

export const PageRenderer: React.FC<PageRendererProps> = ({
  state,
  colors: propColors,
  onUpdateText,
  onSelectElement,
  activeElementId,
  activeDuplicateId,
  onUpdateTransform,
  onUpdatePhoto,
  onRemoveElementCopy,
  onDuplicateAnyElement,
  onRemoveDuplicatedElement,
  onUpdateDuplicateTransform,
  onUpdateDuplicateText,
  onUpdateDuplicateStyle,
  onUpdateElementGlow,
  onUpdateElementGlowWidth,
  onUpdateElementShadow: _onUpdateElementShadow,
  onUpdateElementGradient: _onUpdateElementGradient,
  onUpdateCanvasElement,
  onRemoveCanvasElement,
  selectedCanvasId,
  onSelectCanvas
}) => {
  const getFontFamilyStyles = () => {
    const styleId = state.fontStyleId || 'theme-default';
    switch (styleId) {
      case 'modern':
        return {
          headStyle: { fontFamily: "'Space Grotesk', sans-serif" },
          bodyStyle: { fontFamily: "'Inter', sans-serif" },
          headClass: 'font-sans font-bold tracking-tight uppercase',
          bodyClass: 'font-sans'
        };
      case 'serif':
        return {
          headStyle: { fontFamily: "'Playfair Display', serif" },
          bodyStyle: { fontFamily: "'Merriweather', serif" },
          headClass: 'font-serif font-black tracking-normal italic capitalize',
          bodyClass: 'font-serif'
        };
      case 'mono':
        return {
          headStyle: { fontFamily: "'JetBrains Mono', monospace" },
          bodyStyle: { fontFamily: "'JetBrains Mono', monospace" },
          headClass: 'font-mono font-bold tracking-widest uppercase',
          bodyClass: 'font-mono'
        };
      case 'scifi':
        return {
          headStyle: { fontFamily: "'Syne', sans-serif" },
          bodyStyle: { fontFamily: "'Outfit', sans-serif" },
          headClass: 'font-sans font-extrabold tracking-wide uppercase',
          bodyClass: 'font-sans'
        };
      case 'elegant':
        return {
          headStyle: { fontFamily: "'Cinzel', serif" },
          bodyStyle: { fontFamily: "'Cormorant Garamond', serif" },
          headClass: 'font-serif font-bold tracking-normal uppercase',
          bodyClass: 'font-serif'
        };
      case 'theme-default':
      default:
        return {
          headStyle: {},
          bodyStyle: {},
          headClass: propColors.fontFamilyHead,
          bodyClass: propColors.fontFamilyBody
        };
    }
  };

  const fonts = getFontFamilyStyles();

  const computedColors = {
    ...propColors,
    primary: state.customPrimaryColor || propColors.primary,
    background: state.customBackgroundColor || propColors.background,
    textPrimary: state.customTextColor || propColors.textPrimary,
    fontFamilyHead: fonts.headClass,
    fontFamilyBody: fonts.bodyClass,
  };

  const colors = computedColors;

  const { currentPage, photo, coverData, indexData, topperData, bioData, promoData } = state;

  // Render a clickable wrapper for real-time live editing focus
  const EditableText = ({
    section,
    field,
    label,
    className = "",
    children,
    multiline = false
  }: {
    section: string;
    field: string;
    label: string;
    className?: string;
    children: React.ReactNode;
    multiline?: boolean;
    key?: React.Key;
  }) => {
    const elementId = `${section}.${field}`;
    const isSelected = activeElementId === elementId;
    const transform = (state.transforms || {})[elementId] || { x: 0, y: 0, scale: 1.0, scaleX: 1.0, scaleY: 1.0 };

    const style: React.CSSProperties = {
      transform: `translate(${transform.x}px, ${transform.y}px) scaleX(${(transform as any).scaleX ?? transform.scale}) scaleY(${(transform as any).scaleY ?? transform.scale}) scale(${transform.scale}) rotate(${transform.rotation ?? 0}deg)`,
      transformOrigin: 'center',
      transition: 'box-shadow 0.2s ease',
      display: className.includes('inline') ? 'inline-block' : 'block',
    };

    const handlePointerDown = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
      e.stopPropagation();
      onSelectElement(section, field, label);

      const isTouch = 'touches' in e;
      const startX = isTouch ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
      const startY = isTouch ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;

      const activeX = transform.x;
      const activeY = transform.y;

      const handlePointerMove = (moveEvent: MouseEvent | TouchEvent) => {
        const isMoveTouch = 'touches' in moveEvent;
        const currentX = isMoveTouch ? (moveEvent as TouchEvent).touches[0].clientX : (moveEvent as MouseEvent).clientX;
        const currentY = isMoveTouch ? (moveEvent as TouchEvent).touches[0].clientY : (moveEvent as MouseEvent).clientY;

        const deltaX = currentX - startX;
        const deltaY = currentY - startY;

        onUpdateTransform(elementId, {
          x: activeX + deltaX,
          y: activeY + deltaY
        });
      };

      const handlePointerUp = () => {
        window.removeEventListener('mousemove', handlePointerMove);
        window.removeEventListener('mouseup', handlePointerUp);
        window.removeEventListener('touchmove', handlePointerMove);
        window.removeEventListener('touchend', handlePointerUp);
      };

      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('mouseup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove, { passive: true });
      window.addEventListener('touchend', handlePointerUp);
    };

    const handleResizeStart = (
      e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
      dir: 'nw' | 'ne' | 'se' | 'sw' | 'n' | 's' | 'e' | 'w'
    ) => {
      e.stopPropagation();
      e.preventDefault();

      const isTouch = 'touches' in e;
      const startClientX = isTouch ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
      const startClientY = isTouch ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
      const startScale = transform.scale;
      const startX = transform.x;
      const startY = transform.y;

      const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
        const isMoveTouch = 'touches' in moveEvent;
        const currentClientX = isMoveTouch ? (moveEvent as TouchEvent).touches[0].clientX : (moveEvent as MouseEvent).clientX;
        const currentClientY = isMoveTouch ? (moveEvent as TouchEvent).touches[0].clientY : (moveEvent as MouseEvent).clientY;

        const deltaX = currentClientX - startClientX;
        const deltaY = currentClientY - startClientY;

        const startScaleX = (transform as any).scaleX ?? startScale;
        const startScaleY = (transform as any).scaleY ?? startScale;

        // Dead zone: ignore tiny movements
        if (Math.abs(deltaX) < 2 && Math.abs(deltaY) < 2) return;

        // For side handles: change only one axis. For corners: change both.
        let nextScaleX = startScaleX;
        let nextScaleY = startScaleY;
        let nextX = startX;
        let nextY = startY;

        // Horizontal (E/W)
        if (dir.includes('e') || dir.includes('w')) {
          // dragging right increases width (E), dragging left decreases width (W)
          let axisDeltaX = deltaX;
          if (dir.includes('w')) axisDeltaX = -axisDeltaX;

          const newSX = Math.max(0.2, Math.min(3, startScaleX + axisDeltaX * 0.005));
          nextScaleX = Math.round(newSX * 100) / 100;

          // Anchor nudge so the opposite side stays visually in place.
          const anchorNudgeX = axisDeltaX * 0.5;
          if (dir.includes('e')) nextX = startX + anchorNudgeX;
          if (dir.includes('w')) nextX = startX - anchorNudgeX;
        }

        // Vertical (N/S)
        if (dir.includes('n') || dir.includes('s')) {
          let axisDeltaY = deltaY;
          if (dir.includes('n')) axisDeltaY = -axisDeltaY;

          const newSY = Math.max(0.2, Math.min(3, startScaleY + axisDeltaY * 0.005));
          nextScaleY = Math.round(newSY * 100) / 100;

          const anchorNudgeY = axisDeltaY * 0.5;
          if (dir.includes('n')) nextY = startY - anchorNudgeY;
          if (dir.includes('s')) nextY = startY + anchorNudgeY;
        }

        onUpdateTransform(elementId, {
          x: Math.round(nextX),
          y: Math.round(nextY),
          // keep scale for backward compatibility
          scale: (Math.round(((nextScaleX + nextScaleY) / 2) * 100) / 100),
          scaleX: nextScaleX,
          scaleY: nextScaleY,
        });
      };


      const handleUp = () => {
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleUp);
        window.removeEventListener('touchmove', handleMove);
        window.removeEventListener('touchend', handleUp);
      };

      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleUp);
      window.addEventListener('touchmove', handleMove, { passive: true });
      window.addEventListener('touchend', handleUp);
    };

    const customBgs = state.customBackgrounds || {};
    const customTextColor = state.customElementTextColors?.[elementId];
    const customFont = state.customElementFonts?.[elementId];
    const customAccent = state.customElementAccents?.[elementId];
    const customBg = customBgs[elementId];
    const customStyles = (state.customElementStyles || {})[elementId] || {};

    // Gradient support
    const customGradient = (state.elementGradients || {})[elementId];
    const gradientCss = customGradient ? gradientToCss(customGradient) : null;

    // Shadow support
    const customShadow = (state.elementShadows || {})[elementId];
    const shadowCss = customShadow ? shadowToCss(customShadow, true) : null;

    // Check if this element is hidden for the current session
    const isHidden = !!(state.hiddenElements || {})[elementId];

    const hasAnyOverride = customBg !== undefined || customTextColor !== undefined || customFont !== undefined || customAccent !== undefined || Object.keys(customStyles).length > 0 || gradientCss !== null;

    let processedChildren = children;
    if (hasAnyOverride && React.isValidElement(processedChildren)) {
      const child = processedChildren as React.ReactElement<any>;
      let childClass = child.props.className || "";
      if (customBg) {
        childClass = childClass.replace(/\b(bg-\S+|from-\S+|to-\S+|via-\S+)\b/g, '');
      }
      if (customTextColor || gradientCss) {
        childClass = childClass.replace(/\b(text-\S+)\b/g, (match) => {
          if (match.match(/\btext-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl|left|right|center|justify|start|end)\b/)) {
            return match;
          }
          return '';
        });
      }
      if (customAccent) {
        childClass = childClass.replace(/\b(border-\S+)\b/g, (match) => {
          if (match.match(/\bborder-(0|2|4|8)\b/)) return match;
          return '';
        });
      }

      const styleOverrides: React.CSSProperties = {
        ...(child.props.style || {}),
      };

      if (customBg !== undefined) {
        styleOverrides.backgroundColor = customBg === 'none' ? 'transparent' : customBg;
      }
      if (gradientCss) {
        styleOverrides.background = gradientCss;
        styleOverrides.backgroundClip = 'text';
        (styleOverrides as any).WebkitBackgroundClip = 'text';
        (styleOverrides as any).WebkitTextFillColor = 'transparent';
        styleOverrides.color = 'transparent';
      } else if (customTextColor !== undefined) {
        styleOverrides.color = customTextColor;
      }
      if (customFont !== undefined) {
        if (customFont.startsWith('font-family:')) {
          styleOverrides.fontFamily = customFont.replace('font-family:', '');
        } else if (customFont === 'italic') {
          styleOverrides.fontStyle = 'italic';
        } else if (customFont === 'bold') {
          styleOverrides.fontWeight = 'bold';
        } else if (customFont === 'uppercase') {
          styleOverrides.textTransform = 'uppercase';
        } else if (customFont === 'underline') {
          styleOverrides.textDecoration = 'underline';
        } else {
          styleOverrides.fontFamily = customFont;
        }
      }
      if (customAccent !== undefined) {
        styleOverrides.borderColor = customAccent;
        styleOverrides.outlineColor = customAccent;
      }

      // Apply bold/italic/underline from customElementStyles
      if (customStyles.bold) styleOverrides.fontWeight = 'bold';
      if (customStyles.italic) styleOverrides.fontStyle = 'italic';
      if (customStyles.underline) styleOverrides.textDecoration = 'underline';

      processedChildren = React.cloneElement(child, {
        className: childClass,
        style: styleOverrides,
      });
    }

    const glowColor = (state.elementGlowColors || {})[elementId];
    const glowWidth = (state.elementGlowWidths || {})[elementId] ?? 15;
    const glowStyle = glowColor ? { filter: `drop-shadow(0 0 ${glowWidth}px ${glowColor})` } : {};

    const shadowStyle = shadowCss ? { textShadow: shadowCss } : {};

    return (
      <div
        id={`editable-${section}-${field}`}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        style={{ ...style, ...glowStyle, ...shadowStyle, display: isHidden ? 'none' : undefined }}
        className={`group relative cursor-grab active:cursor-grabbing rounded transition-transform duration-75 hover:bg-primary/20 hover:ring-2 hover:ring-primary/60 p-0.5 ${
          isSelected ? "ring-2 ring-primary bg-primary/10" : ""
        } ${className}`}
        title={`Hold & drag to position or click to edit ${label}`}
      >
        {processedChildren}

        {/* Render inline duplicates for this element — exact style match via element cloning */}
        {(() => {
          const dups = (state.duplicatedElements || []).filter(
            (d) => d.section === section && d.field === field
          );
          if (dups.length === 0) return null;

          const origChild = React.isValidElement(children) ? (children as React.ReactElement<any>) : null;
          const origTag = origChild && typeof origChild.type === 'string' ? origChild.type : 'span';
          const origClassName = origChild?.props?.className || '';
          const origStyle: React.CSSProperties = origChild?.props?.style || {};

          return dups.map((dup, dupIdx) => {
            const isDupSelected = activeDuplicateId === dup.id;

            // Start from original's inline style, then merge duplicate's overrides on top
            const dupOverrides: React.CSSProperties = { ...origStyle };
            const dc = dup.customStyles || {};
            if (dup.customBackground) dupOverrides.backgroundColor = dup.customBackground === 'none' ? 'transparent' : dup.customBackground;
            if (dup.customGradient) {
              const gCss = gradientToCss(dup.customGradient);
              dupOverrides.background = gCss;
              dupOverrides.backgroundClip = 'text';
              (dupOverrides as any).WebkitBackgroundClip = 'text';
              (dupOverrides as any).WebkitTextFillColor = 'transparent';
              dupOverrides.color = 'transparent';
            } else if (dup.customTextColor) {
              dupOverrides.color = dup.customTextColor;
            }
            if (dup.customFont) {
              if (dup.customFont.startsWith('font-family:')) dupOverrides.fontFamily = dup.customFont.replace('font-family:', '');
              else if (dup.customFont === 'italic') dupOverrides.fontStyle = 'italic';
              else if (dup.customFont === 'bold') dupOverrides.fontWeight = 'bold';
              else if (dup.customFont === 'uppercase') dupOverrides.textTransform = 'uppercase';
              else if (dup.customFont === 'underline') dupOverrides.textDecoration = 'underline';
              else dupOverrides.fontFamily = dup.customFont;
            }
            if (dup.customAccent) { dupOverrides.borderColor = dup.customAccent; dupOverrides.outlineColor = dup.customAccent; }
            if (dc.bold) dupOverrides.fontWeight = 'bold';
            if (dc.italic) dupOverrides.fontStyle = 'italic';
            if (dc.underline) dupOverrides.textDecoration = 'underline';
            const dupShadowCss = dup.customShadow ? shadowToCss(dup.customShadow, true) : null;

            const dupTf = dup.transform;

            const handleDupPointerDown = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
              e.stopPropagation();
              onSelectElement(section, field, dup.label, dup.id);

              const isTouch = 'touches' in e;
              const startX = isTouch ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
              const startY = isTouch ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
              const activeX = dup.transform.x;
              const activeY = dup.transform.y;

              const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
                const isMoveTouch = 'touches' in moveEvent;
                const currentX = isMoveTouch ? (moveEvent as TouchEvent).touches[0].clientX : (moveEvent as MouseEvent).clientX;
                const currentY = isMoveTouch ? (moveEvent as TouchEvent).touches[0].clientY : (moveEvent as MouseEvent).clientY;
                onUpdateDuplicateTransform?.(dup.id, {
                  x: activeX + (currentX - startX),
                  y: activeY + (currentY - startY),
                });
              };

              const handleUp = () => {
                window.removeEventListener('mousemove', handleMove);
                window.removeEventListener('mouseup', handleUp);
                window.removeEventListener('touchmove', handleMove);
                window.removeEventListener('touchend', handleUp);
              };

              window.addEventListener('mousemove', handleMove);
              window.addEventListener('mouseup', handleUp);
              window.addEventListener('touchmove', handleMove, { passive: true });
              window.addEventListener('touchend', handleUp);
            };

            return (
              <div
                key={dup.id}
                onMouseDown={handleDupPointerDown}
                onTouchStart={handleDupPointerDown}
                style={{
                  position: 'absolute',
                  left: dupTf.x,
                  top: dupTf.y,
                  transform: `scale(${dupTf.scale}) rotate(${dupTf.rotation ?? 0}deg)`,
                  transformOrigin: 'center',
                  zIndex: 25,
                  ...(dupShadowCss ? { textShadow: dupShadowCss } : {}),
                }}
                className={`group cursor-grab active:cursor-grabbing rounded hover:ring-2 hover:ring-primary/60 p-0.5 ${
                  isDupSelected ? 'ring-2 ring-primary bg-primary/10' : ''
                }`}
              >
                {React.createElement(origTag as string, {
                  className: origClassName,
                  style: dupOverrides,
                }, dup.value)}

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveDuplicatedElement?.(dup.id);
                  }}
                  className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[8px] opacity-60 hover:opacity-100 transition-opacity cursor-pointer shadow z-40"
                  title="Remove this duplicate"
                >
                  ✕
                </button>
              </div>
            );
          });
        })()}

        {!state.hideDragTooltips && (
          <span className="absolute -top-5 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-black text-white text-[10px] font-mono px-1.5 py-0.5 rounded shadow z-50 pointer-events-none transition-transform whitespace-nowrap">
            Drag / Edit {label}
          </span>
        )}

        {/* Resize handles — include sides (N/S/E/W) too */}
        {isSelected && ['nw','n','ne','e','se','s','sw','w'].map((corner) => {
          const sz = 24;
          const visSize = 12;
          const off = -(sz / 2);
          const invScale = 1 / (transform.scale || 1);
          function getHandleStyle(dir: string): React.CSSProperties {
            const base: React.CSSProperties = {
              position: 'absolute',
              width: sz,
              height: sz,
              transform: `scale(${invScale})`,
              transformOrigin: 'center',
              zIndex: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            };
            if (dir.includes('n')) base.top = off;
            if (dir.includes('s')) base.bottom = off;
            if (dir === 'n' || dir === 's') { base.left = '50%'; base.marginLeft = -(sz/2); }
            if (dir === 'w') { base.left = off; base.top = '50%'; base.marginTop = -(sz/2); }
            if (dir === 'e') { base.right = off; base.top = '50%'; base.marginTop = -(sz/2); }
            if (dir === 'nw') base.left = off;
            if (dir === 'ne') base.right = off;
            if (dir === 'sw') base.left = off;
            if (dir === 'se') base.right = off;
            return base;
          }
          return (
            <div
              key={corner}
              onMouseDown={(e) => handleResizeStart(e, corner as 'nw'|'n'|'ne'|'e'|'se'|'s'|'sw'|'w')}
              onTouchStart={(e) => handleResizeStart(e, corner as 'nw'|'n'|'ne'|'e'|'se'|'s'|'sw'|'w')}
              style={{...getHandleStyle(corner), cursor: `${corner}-resize`}}
              className="pointer-events-auto"
            >
              <div
                style={{ width: visSize, height: visSize, pointerEvents: 'none' }}
                className="bg-[#ccff00] border-2 border-zinc-900 rounded-sm shadow-md"
              />
            </div>
          );
        })}
      </div>
    );
  };

  const [editingCanvasId, setEditingCanvasId] = React.useState<string | null>(null);

  // Render free-form canvas elements on the current page
  const renderCanvasElements = () => {
    const elements = (state.canvasElements || []).filter((e) => e.page === currentPage);
    if (elements.length === 0) return null;

    return elements.map((el) => {
      const isSelected = selectedCanvasId === el.id;

      const handleDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (editingCanvasId === el.id) return;
        onSelectCanvas(el.id);
        setEditingCanvasId(null);

        const isTouch = 'touches' in e;
        const startX = isTouch ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
        const startY = isTouch ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
        const activeX = el.x;
        const activeY = el.y;

        const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
          const isMoveTouch = 'touches' in moveEvent;
          const currentX = isMoveTouch ? (moveEvent as TouchEvent).touches[0].clientX : (moveEvent as MouseEvent).clientX;
          const currentY = isMoveTouch ? (moveEvent as TouchEvent).touches[0].clientY : (moveEvent as MouseEvent).clientY;
          onUpdateCanvasElement?.(el.id, { x: activeX + (currentX - startX), y: activeY + (currentY - startY) });
        };

        const handleUp = () => {
          window.removeEventListener('mousemove', handleMove);
          window.removeEventListener('mouseup', handleUp);
          window.removeEventListener('touchmove', handleMove);
          window.removeEventListener('touchend', handleUp);
        };

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleUp);
        window.addEventListener('touchmove', handleMove, { passive: true });
        window.addEventListener('touchend', handleUp);
      };

      const handleResize = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, corner: string) => {
        e.stopPropagation();
        e.preventDefault();

        const isTouch = 'touches' in e;
        const startX = isTouch ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
        const startY = isTouch ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
        const startW = el.width;
        const startH = el.height;
        const startElX = el.x;
        const startElY = el.y;
        const ratio = el.height / (el.width || 1);

        const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
          const isMoveTouch = 'touches' in moveEvent;
          const currentX = isMoveTouch ? (moveEvent as TouchEvent).touches[0].clientX : (moveEvent as MouseEvent).clientX;
          const currentY = isMoveTouch ? (moveEvent as TouchEvent).touches[0].clientY : (moveEvent as MouseEvent).clientY;
          const deltaX = currentX - startX;
          const deltaY = currentY - startY;

          let newW = Math.max(40, startW + deltaX);
          let newH = Math.max(40, startH + deltaY);
          const updates: Partial<CanvasElement> = {};

          // Side handles: stretch only one dimension, sides adjust position
          if (corner === 'n' || corner === 's') {
            // Vertical-only stretch: keep width, only change height
            newW = startW;
            if (corner === 'n') {
              newH = Math.max(40, startH - deltaY);
              updates.y = startElY + (startH - newH);
            } else {
              newH = Math.max(40, startH + deltaY);
            }
          } else if (corner === 'w' || corner === 'e') {
            // Horizontal-only stretch: keep height, only change width
            newH = startH;
            if (corner === 'w') {
              newW = Math.max(40, startW - deltaX);
              updates.x = startElX + (startW - newW);
            } else {
              newW = Math.max(40, startW + deltaX);
            }
          } else {
            // Corner handles: maintain aspect ratio
            const useWidth = Math.abs(deltaX) > Math.abs(deltaY);
            if (useWidth) {
              newH = Math.round(newW * ratio);
            } else {
              newW = Math.round(newH / ratio);
            }
            if (corner.includes('w')) updates.x = startElX - (newW - startW);
            if (corner.includes('n')) updates.y = startElY - (newH - startH);
          }

          updates.width = newW;
          updates.height = newH;
          onUpdateCanvasElement?.(el.id, updates);
        };

        const handleUp = () => {
          window.removeEventListener('mousemove', handleMove);
          window.removeEventListener('mouseup', handleUp);
          window.removeEventListener('touchmove', handleMove);
          window.removeEventListener('touchend', handleUp);
        };

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleUp);
        window.addEventListener('touchmove', handleMove, { passive: true });
        window.addEventListener('touchend', handleUp);
      };

      const glowStyle = el.glowColor ? { filter: `drop-shadow(0 0 ${el.glowWidth ?? 15}px ${el.glowColor})` } : {};
      const elShadowCss = el.shadow ? shadowToCss(el.shadow, el.type === 'text') : null;
      const elGradientCss = el.gradient ? gradientToCss(el.gradient) : null;

      const canvasTextStyle: React.CSSProperties = {};
      if (elShadowCss) {
        if (el.type === 'text' || el.type === 'symbol') {
          canvasTextStyle.textShadow = elShadowCss;
        } else {
          canvasTextStyle.boxShadow = elShadowCss;
        }
      }
      if (elGradientCss && (el.type === 'text' || el.type === 'symbol')) {
        canvasTextStyle.background = elGradientCss;
        canvasTextStyle.backgroundClip = 'text';
        (canvasTextStyle as any).WebkitBackgroundClip = 'text';
        (canvasTextStyle as any).WebkitTextFillColor = 'transparent';
        canvasTextStyle.color = 'transparent';
      }

      return (
        <div
          key={el.id}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          style={{
            position: 'absolute',
            left: el.x,
            top: el.y,
            width: el.width,
            height: el.height,
            transform: `scale(${el.scale}) rotate(${el.rotation}deg)`,
            transformOrigin: 'center',
            zIndex: el.zIndex ?? 10,
            opacity: el.opacity ?? 1,
            cursor: 'grab',
            backgroundColor: el.backgroundColor || (el.type === 'box' ? '#1a1a2e' : undefined),
            border: el.borderColor ? `${el.borderWidth ?? 2}px solid ${el.borderColor}` : undefined,
            borderRadius: el.borderRadius ?? 0,
            color: el.textColor || '#ffffff',
            fontSize: el.fontSize ?? 16,
            fontFamily: el.fontFamily || 'sans-serif',
            fontWeight: el.bold ? 'bold' : undefined,
            fontStyle: el.italic ? 'italic' : undefined,
            textDecoration: el.underline ? 'underline' : undefined,
            padding: el.type === 'text' ? '8px 12px' : undefined,
            display: 'flex',
            alignItems: el.type === 'symbol' ? 'center' : el.type === 'text' ? 'center' : 'stretch',
            justifyContent: el.type === 'symbol' ? 'center' : el.type === 'text' ? 'flex-start' : 'stretch',
            overflow: 'hidden',
            wordBreak: 'break-word',
            userSelect: 'none',
            ...glowStyle,
            ...canvasTextStyle,
            ...(el.clipTop != null || el.clipRight != null || el.clipBottom != null || el.clipLeft != null
              ? { clipPath: `inset(${el.clipTop ?? 0}px ${el.clipRight ?? 0}px ${el.clipBottom ?? 0}px ${el.clipLeft ?? 0}px)` }
              : {}),
          }}
          className={`rounded transition-shadow ${isSelected ? 'ring-2 ring-[#ccff00]' : 'hover:ring-1 hover:ring-[#ccff00]/50'}`}
        >
          {el.type === 'text' && editingCanvasId === el.id ? (
            <textarea
              value={el.content || ''}
              onChange={(e) => onUpdateCanvasElement?.(el.id, { content: e.target.value })}
              onBlur={() => setEditingCanvasId(null)}
              onKeyDown={(e) => { if (e.key === 'Escape') { setEditingCanvasId(null); } }}
              autoFocus
              style={{
                width: '100%',
                height: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                resize: 'none',
                color: 'inherit',
                fontSize: 'inherit',
                fontFamily: 'inherit',
                fontWeight: 'inherit',
                fontStyle: 'inherit',
                textDecoration: 'inherit',
                padding: 0,
                margin: 0,
                overflow: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            />
          ) : el.type === 'symbol' ? (
            <span
              style={{
                pointerEvents: isSelected ? 'auto' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
              }}
            >
              {el.content || '∑'}
            </span>
          ) : el.type === 'text' ? (
            <span
              onDoubleClick={(e) => { e.stopPropagation(); setEditingCanvasId(el.id); }}
              style={{ pointerEvents: isSelected ? 'auto' : 'none' }}
            >
              {el.content || 'Text'}
            </span>
          ) : null}

          {/* Resize handles - 8 directions */}
          {isSelected && ['nw','n','ne','e','se','s','sw','w'].map((dir) => {
            const isCorner = dir.length === 2;
            const sz = isCorner ? 18 : 14;
            const off = isCorner ? -9 : -7;
            function getStyle(dir: string): React.CSSProperties {
              const base: React.CSSProperties = {
                position: 'absolute', width: sz, height: sz,
                zIndex: 60, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              };
              if (dir.includes('n')) base.top = off;
              if (dir.includes('s')) base.bottom = off;
              if (dir === 'n' || dir === 's') { base.left = '50%'; base.marginLeft = -(sz/2); }
              if (dir === 'w') { base.left = off; base.top = '50%'; base.marginTop = -(sz/2); }
              if (dir === 'e') { base.right = off; base.top = '50%'; base.marginTop = -(sz/2); }
              if (dir === 'nw') base.left = off;
              if (dir === 'ne') base.right = off;
              if (dir === 'sw') base.left = off;
              if (dir === 'se') base.right = off;
              return base;
            }
            const cursors: Record<string, string> = {
              'nw':'nw-resize','n':'n-resize','ne':'ne-resize',
              'e':'e-resize','se':'se-resize','s':'s-resize',
              'sw':'sw-resize','w':'w-resize'
            };
            return (
                <div
                  key={dir}
                  onMouseDown={(e) => handleResize(e, dir)}
                  onTouchStart={(e) => handleResize(e, dir)}
                  style={{...getStyle(dir), cursor: cursors[dir]}}
                  className="pointer-events-auto"
                >
                  <div className={"bg-[#ccff00] border-2 border-zinc-900 rounded-sm shadow-md pointer-events-none " + (isCorner ? 'w-2.5 h-2.5' : 'w-2 h-2')} />
                </div>
              );
            })}
        </div>
      );
    });
  };

  // Render a bullet points list creator for the Cover Page
  const handleBulletChange = (index: number, val: string) => {
    const updated = [...coverData.bulletPoints];
    updated[index] = val;
    onUpdateText('cover', 'bulletPoints', updated);
  };

  // Photo Style Filter generator
  const getPhotoStyle = () => {
    const filters = [];
    if (photo.isMonochrome) {
      filters.push('grayscale(100%)');
    }
    if (photo.saturation !== 1) {
      filters.push(`saturate(${photo.saturation})`);
    }
    
    // Custom drop-shadow / glows based on themes
    let shadowStyle = "none";
    if (photo.shadow === 'glow') {
      const glowCol = state.photoGlowColor || colors.primary;
      const glowWid = state.photoGlowWidth !== undefined ? state.photoGlowWidth : 15;
      shadowStyle = `drop-shadow(0 0 ${glowWid}px ${glowCol})`;
    } else if (photo.shadow === 'lg') {
      shadowStyle = 'drop-shadow(0 20px 25px rgba(0,0,0,0.45))';
    } else if (photo.shadow === 'md') {
      shadowStyle = 'drop-shadow(0 10px 15px rgba(0,0,0,0.3))';
    }

    const photoRotation = (state.transforms || {})['cover.__photo__']?.rotation ?? 0;
    return {
      transform: `scale(${photo.scale}) translate(${photo.xOffset}%, ${photo.yOffset}%) rotate(${photoRotation}deg)`,
      opacity: photo.opacity,
      filter: `${filters.join(' ')} ${shadowStyle}`,
      transition: 'all 0.15s ease-out'
    };
  };

  const handlePhotoPointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    const isTouch = 'touches' in e;
    const startX = isTouch ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    const startY = isTouch ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;

    const activeX = photo.xOffset;
    const activeY = photo.yOffset;

    const handlePointerMove = (moveEvent: MouseEvent | TouchEvent) => {
      const isMoveTouch = 'touches' in moveEvent;
      const currentX = isMoveTouch ? (moveEvent as TouchEvent).touches[0].clientX : (moveEvent as MouseEvent).clientX;
      const currentY = isMoveTouch ? (moveEvent as TouchEvent).touches[0].clientY : (moveEvent as MouseEvent).clientY;

      const deltaX = (currentX - startX) * 0.45;
      const deltaY = (currentY - startY) * 0.45;

      const nextX = Math.max(-100, Math.min(100, Math.round(activeX + deltaX)));
      const nextY = Math.max(-80, Math.min(50, Math.round(activeY + deltaY)));

      onUpdatePhoto('xOffset', nextX);
      onUpdatePhoto('yOffset', nextY);
    };

    const handlePointerUp = () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);
  };

  // Render duplicated image elements (e.g., photo copies)
  const renderImageDuplicates = () => {
    const imageDups = (state.duplicatedElements || []).filter(
      (d) => d.type === 'image' && d.section === currentPage
    );
    if (imageDups.length === 0) return null;

    return imageDups.map((dup) => {
      const isDupSelected = activeDuplicateId === dup.id;
      const dupTf = dup.transform;

      const handleImgDupDrag = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        e.stopPropagation();
        onSelectElement(dup.section, dup.field, dup.label, dup.id);

        const isTouch = 'touches' in e;
        const startX = isTouch ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
        const startY = isTouch ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
        const activeX = dup.transform.x;
        const activeY = dup.transform.y;

        const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
          const isMoveTouch = 'touches' in moveEvent;
          const currentX = isMoveTouch ? (moveEvent as TouchEvent).touches[0].clientX : (moveEvent as MouseEvent).clientX;
          const currentY = isMoveTouch ? (moveEvent as TouchEvent).touches[0].clientY : (moveEvent as MouseEvent).clientY;
          onUpdateDuplicateTransform?.(dup.id, {
            x: activeX + (currentX - startX),
            y: activeY + (currentY - startY),
          });
        };

        const handleUp = () => {
          window.removeEventListener('mousemove', handleMove);
          window.removeEventListener('mouseup', handleUp);
          window.removeEventListener('touchmove', handleMove);
          window.removeEventListener('touchend', handleUp);
        };

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleUp);
        window.addEventListener('touchmove', handleMove, { passive: true });
        window.addEventListener('touchend', handleUp);
      };

      return (
        <div
          key={dup.id}
          onMouseDown={handleImgDupDrag}
          onTouchStart={handleImgDupDrag}
          style={{
            position: 'absolute',
            bottom: '15%',
            left: '50%',
            transform: `translate(-50%, 0) translate(${dupTf.x}px, ${dupTf.y}px) scale(${dupTf.scale}) rotate(${dupTf.rotation ?? 0}deg)`,
            transformOrigin: 'center',
            zIndex: 15,
          }}
          className={`cursor-grab active:cursor-grabbing rounded-lg overflow-hidden group pointer-events-auto ${
            isDupSelected ? 'ring-2 ring-primary' : 'hover:ring-2 hover:ring-primary/60'
          }`}
        >
          <img
            src={dup.value}
            alt="Duplicated"
            className="max-h-[50vh] object-contain pointer-events-none"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemoveDuplicatedElement?.(dup.id);
            }}
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] opacity-60 hover:opacity-100 transition-opacity cursor-pointer shadow z-40"
            title="Remove this duplicate"
          >
            ✕
          </button>
        </div>
      );
    });
  };

  // Render duplicated heading copies for current page
  const renderElementCopies = () => {
    const copies: Record<string, string[]> = state.elementCopies || {};
    const pagePrefix = currentPage + '.';
    const pageCopies = Object.entries(copies).filter(([key]) => key.startsWith(pagePrefix));
    if (pageCopies.length === 0) return null;

    return (
      <div className="absolute bottom-1 right-1 z-50 flex flex-col gap-0.5 max-w-[50%]">
        {pageCopies.map(([elementId, copyArr]) =>
          copyArr.map((text, idx) => (
            <div
              key={`copy-${elementId}-${idx}`}
              className="group/copy relative bg-black/70 backdrop-blur-sm rounded px-1.5 py-0.5 border border-zinc-700/50 flex items-center gap-1"
              title={`Duplicated: ${text}`}
            >
              <span className="text-[7px] text-zinc-300 font-mono truncate max-w-[120px]">
                {text}
              </span>
              {onRemoveElementCopy && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveElementCopy(elementId, idx);
                  }}
                  className="shrink-0 w-3.5 h-3.5 rounded-full bg-red-500/30 hover:bg-red-500/60 text-white flex items-center justify-center opacity-0 group-hover/copy:opacity-100 transition-opacity cursor-pointer"
                  title="Remove copy"
                >
                  <span className="text-[6px] leading-none">✕</span>
                </button>
              )}
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div 
      className="relative w-full aspect-[210/297] rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 select-none border border-zinc-800"
      style={{ aspectRatio: '210 / 297', backgroundColor: colors.background, color: colors.textPrimary, ...fonts.bodyStyle }}
    >
      {/* Dynamic Google Fonts Stylesheet loader */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800;900&family=Cormorant+Garamond:ital,wght@0,450;0,650;1,450&family=Fira+Code:wght@400;600&family=Inter:wght@400;600;950&family=JetBrains+Mono:wght@500;800&family=Merriweather:wght@400;700&family=Outfit:wght@400;700;900&family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Space+Grotesk:wght@600;700;800&family=Syne:wght@700;800&display=swap');
      `}</style>

      {/* BACKGROUND GRAPHIC ACCENTS - Multi-layer compositing with blur & blend-modes */}
      {(() => {
        const bgLayers = (state.backgroundLayers && state.backgroundLayers.length > 0)
          ? state.backgroundLayers
          : [{ themeId: state.currentTheme, opacity: 1, blendMode: 'normal' } as const];
        const bgBlur = state.backgroundBlur || 0;

        const renderThemeBg = (thId: ThemeId) => {
          switch (thId) {
            case 'neon-lime':
              return (<div className="absolute inset-0"><div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" /><div className="absolute top-20 right-0 w-96 h-96 bg-lime-400/10 rounded-full filter blur-[120px]" /><div className="absolute bottom-20 left-0 w-96 h-96 bg-zinc-800/20 rounded-full filter blur-[100px]" /></div>);
            case 'warm-ivory':
              return (<div className="absolute inset-0"><div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#991b1b]/5 to-transparent" /><div className="absolute inset-0 bg-[radial-gradient(#991b1b08_1px,transparent_1px)] [background-size:16px_16px]" /><div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border border-red-900/5" /><div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full border border-red-900/5" /></div>);
            case 'midnight-space':
              return (<div className="absolute inset-0"><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.15),transparent_50%)]" /><div className="absolute inset-0 bg-[linear-gradient(to_right,#0891b20a_1px,transparent_1px),linear-gradient(to_bottom,#0891b20a_1px,transparent_1px)] bg-[size:40px_40px]" /><div className="absolute top-1/3 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-ping" /><div className="absolute top-1/4 right-24 w-1 h-1 bg-white rounded-full opacity-80" /><div className="absolute bottom-1/3 right-10 w-2 h-2 bg-cyan-400 rounded-full opacity-60" /></div>);
            case 'retro-teal':
              return (<div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(#115e59 8%, transparent 8%)", backgroundSize: "12px 12px" }}><div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 via-teal-500/10 to-transparent" /></div>);
            case 'royal-indigo':
              return (<div className="absolute inset-0"><div className="absolute inset-0 bg-[linear-gradient(30deg,#1e1b4b_20%,#312e81_50%,#1e1b4b_80%)]" /><div className="absolute top-10 right-10 w-48 h-48 rounded-full border-4 border-amber-400/10" /><div className="absolute bottom-20 left-10 w-64 h-64 rounded-full border-2 border-amber-400/5" /></div>);
            case 'cyberpunk-sunset':
              return (<div className="absolute inset-0"><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#ff007f10_0%,transparent_60%)]" /><div className="absolute top-10 right-10 w-48 h-48 bg-[#ff007f]/10 rounded-full filter blur-[80px]" /></div>);
            case 'forest-emerald':
              return (<div className="absolute inset-0"><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,#eab30808_0%,transparent_50%)]" /><div className="absolute top-5 left-5 w-32 h-32 bg-[#eab308]/8 rounded-full filter blur-[60px]" /></div>);
            case 'coral-charcoal':
              return (<div className="absolute inset-0"><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#f43f5e10_0%,transparent_50%)]" /><div className="absolute inset-0 bg-[linear-gradient(to_right,#f43f5e08_1px,transparent_1px)] bg-[size:32px_32px]" /></div>);
            case 'electric-violet':
              return (<div className="absolute inset-0"><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#8b5cf610_0%,transparent_50%)]" /><div className="absolute bottom-10 right-10 w-48 h-48 bg-[#ccff00]/8 rounded-full filter blur-[100px]" /></div>);
            case 'professional-navy':
              return (<div className="absolute inset-0"><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#c9a84c08_0%,transparent_60%)]" /><div className="absolute inset-0 bg-[linear-gradient(to_right,#1e3a5f06_1px,transparent_1px)] bg-[size:32px_32px]" /><div className="absolute top-1/4 left-1/4 w-64 h-64 border border-[#c9a84c]/10 rounded-full" /><div className="absolute bottom-10 right-10 w-48 h-48 border border-[#c9a84c]/8 rounded-full" /></div>);
            case 'sage-academy':
              return (<div className="absolute inset-0"><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,#2d6a4f08_0%,transparent_50%)]" /><div className="absolute inset-0 bg-[radial-gradient(#2d6a4f06_1px,transparent_1px)] [background-size:20px_20px]" /><div className="absolute top-10 right-10 w-32 h-32 bg-[#2d6a4f]/5 rounded-full blur-3xl" /><div className="absolute bottom-20 left-5 w-24 h-24 bg-[#2d6a4f]/5 rounded-full blur-2xl" /></div>);
            case 'burgundy-classic':
              return (<div className="absolute inset-0"><div className="absolute inset-0 bg-[linear-gradient(180deg,#80002008_0%,transparent_40%,#80002005_100%)]" /><div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#800020]/20 to-transparent" /><div className="absolute -top-10 -right-10 w-72 h-72 rounded-full border border-[#800020]/10" /><div className="absolute -bottom-10 -left-10 w-72 h-72 rounded-full border border-[#800020]/8" /></div>);
            case 'steel-professional':
              return (<div className="absolute inset-0"><div className="absolute inset-0 bg-[linear-gradient(to_right,#4682b406_1px,transparent_1px),linear-gradient(to_bottom,#4682b406_1px,transparent_1px)] bg-[size:20px_20px]" /><div className="absolute top-0 right-0 w-96 h-96 bg-[#4682b4]/5 rounded-full blur-[100px]" /><div className="absolute bottom-0 left-0 w-64 h-64 bg-[#4682b4]/3 rounded-full blur-[80px]" /></div>);
            case 'charcoal-amber':
              return (<div className="absolute inset-0"><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#ff8c0006_0%,transparent_60%)]" /><div className="absolute inset-0 bg-[linear-gradient(45deg,#33415508_1px,transparent_1px)] bg-[size:24px_24px]" /><div className="absolute top-1/3 -left-10 w-48 h-48 bg-[#ff8c00]/5 rounded-full blur-[60px]" /><div className="absolute bottom-1/4 right-0 w-40 h-40 bg-[#ff8c00]/5 rounded-full blur-[50px]" /></div>);
            case 'ocean-clarity':
              return (<div className="absolute inset-0"><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#006d7706_0%,transparent_50%)]" /><div className="absolute inset-0 bg-[linear-gradient(to_right,#83c5be08_1px,transparent_1px),linear-gradient(to_bottom,#83c5be08_1px,transparent_1px)] bg-[size:28px_28px]" /><div className="absolute top-20 right-20 w-56 h-56 border border-[#006d77]/10 rounded-full" /><div className="absolute bottom-10 left-1/3 w-4 h-4 bg-[#006d77]/20 rounded-full" /><div className="absolute top-1/3 right-1/4 w-2 h-2 bg-[#83c5be]/30 rounded-full" /></div>);
            default: return null;
          }
        };

        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none"
               style={{ filter: bgBlur > 0 ? `blur(${bgBlur}px)` : undefined }}>
            {bgLayers.map((layer, i) => (
              <div key={i} className="absolute inset-0"
                   style={{ opacity: layer.opacity, mixBlendMode: layer.blendMode as any }}>
                {renderThemeBg(layer.themeId as ThemeId)}
              </div>
            ))}
          </div>
        );
      })()}

      {/* 1. COVER PAGE VIEW */}
      {currentPage === 'cover' && (
        <div key="page-cover" className="relative w-full h-full p-6 flex flex-col justify-between overflow-hidden">
          
          {/* Cover Header Details */}
          <div className="z-20 flex justify-between items-start">
            <div className="flex flex-col gap-1.5 max-w-[70%]">
              {/* Hangtag Badge */}
              <EditableText section="cover" field="tagline" label="Tagline Header">
                <span className="inline-block bg-zinc-950 text-white font-mono text-[9px] font-bold px-2 py-1 tracking-wider uppercase border border-zinc-700 shadow-md">
                  {coverData.tagline}
                </span>
              </EditableText>

              {/* Secondary Guess Paper Sticker */}
              <EditableText section="cover" field="badgeText" label="Sticker Announcement">
                <div className="inline-block bg-primary text-black font-extrabold text-[10px] uppercase skew-x-[-12deg] px-2 py-0.5 mt-1 border border-black shadow">
                  {coverData.badgeText}
                </div>
              </EditableText>
            </div>

            {/* Publication Issue Month */}
            <EditableText section="cover" field="issueDate" label="Issue Date/Month">
              <span className="text-sm font-semibold tracking-wide border-b-2 uppercase py-0.5" style={{ borderColor: colors.primary }}>
                {coverData.issueDate}
              </span>
            </EditableText>
          </div>

          {/* LAYERED PORTRAIT OF THE TEACHER / AUTHOR */}
          <div
            className="absolute inset-0 z-10 pointer-events-none flex items-end justify-center"
            onMouseDown={() => onSelectElement('cover', '__photo__', 'Teacher Photo')}
          >
            {photo.url ? (
              <img
                src={photo.url}
                alt="Teacher Portrait"
                referrerPolicy="no-referrer"
                onMouseDown={(e) => {
                  onSelectElement('cover', '__photo__', 'Teacher Photo');
                  handlePhotoPointerDown(e);
                }}
                onTouchStart={(e) => {
                  onSelectElement('cover', '__photo__', 'Teacher Photo');
                  handlePhotoPointerDown(e);
                }}
                className={`max-h-[72%] object-contain select-none transition-transform pointer-events-auto cursor-grab active:cursor-grabbing rounded-lg ${
                  activeElementId === 'cover.__photo__' ? 'ring-2 ring-primary' : 'hover:ring-2 hover:ring-primary/45'
                }`}
                style={getPhotoStyle()}
              />
            ) : (
              <div className="w-56 h-72 mb-12 bg-zinc-800/40 rounded-xl flex items-center justify-center border border-zinc-700 pointer-events-auto">
                <p className="text-xs text-zinc-500 font-mono text-center px-4">No photograph uploaded. Use sidebar to add yours!</p>
              </div>
            )}
            {/* Render duplicated photo copies */}
            {renderImageDuplicates()}
          </div>

          {/* MAIN MAGAZINE BRAND TITLE - Overlapping the picture nicely */}
          <div className="z-20 my-auto text-center relative flex flex-col items-center">
            <EditableText section="cover" field="mainTitle" label="Main Magazine Title" className="w-full">
              <h1 
                className={`${colors.fontFamilyHead} text-5xl md:text-6xl text-center leading-none tracking-tighter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] filter`}
                style={{ color: colors.primary, ...fonts.headStyle }}
              >
                {coverData.mainTitle}
              </h1>
            </EditableText>

            <EditableText section="cover" field="subTitle" label="Subtitle / Edition Type" className="mt-2.5 inline-block">
              <span className="inline-block text-xs uppercase font-extrabold tracking-widest bg-zinc-950 text-white rounded px-3 py-1 border border-zinc-700 shadow-lg">
                {coverData.subTitle}
              </span>
            </EditableText>

            <EditableText section="cover" field="bestMagLabel" label="Confidence Label Statement" className="mt-2 max-w-xs mx-auto">
              <p className="text-[10px] font-mono tracking-tight text-center uppercase opacity-90 p-1 px-2 bg-black/40 rounded backdrop-blur-[2px]">
                {coverData.bestMagLabel}
              </p>
            </EditableText>
          </div>

          {/* HIGH-CONTRAST BADGES / FLOATING TOPICS (Override picture style) */}
          <div className="z-20 grid grid-cols-2 gap-2 mt-auto mb-4 relative">
            {coverData.bulletPoints.map((pt, idx) => {
              // Get theme customized styling for the topic badges
              let badgeBgClass = "bg-black/90 border-zinc-800 text-white";
              if (state.currentTheme === 'neon-lime') {
                badgeBgClass = "bg-zinc-950/95 border-lime-400/40 text-lime-300";
              } else if (state.currentTheme === 'warm-ivory') {
                badgeBgClass = "bg-red-950/15 border-red-800/45 text-red-900";
              } else if (state.currentTheme === 'midnight-space') {
                badgeBgClass = "bg-cyan-950/90 border-cyan-500/50 text-cyan-200";
              } else if (state.currentTheme === 'retro-teal') {
                badgeBgClass = "bg-teal-950/90 border-teal-500/45 text-teal-300";
              } else if (state.currentTheme === 'royal-indigo') {
                badgeBgClass = "bg-indigo-950/95 border-amber-400/50 text-amber-300";
              } else if (state.currentTheme === 'professional-navy') {
                badgeBgClass = "bg-[#f5f0e8]/95 border-[#c9a84c]/40 text-[#1e3a5f] font-bold";
              } else if (state.currentTheme === 'sage-academy') {
                badgeBgClass = "bg-white/95 border-[#2d6a4f]/30 text-[#1b4332]";
              } else if (state.currentTheme === 'burgundy-classic') {
                badgeBgClass = "bg-[#fdfcf8]/95 border-[#800020]/20 text-[#800020] font-bold";
              } else if (state.currentTheme === 'steel-professional') {
                badgeBgClass = "bg-white/95 border-[#4682b4]/30 text-[#1e293b]";
              } else if (state.currentTheme === 'charcoal-amber') {
                badgeBgClass = "bg-[#1a1a2e]/95 border-[#ff8c00]/40 text-[#ff8c00]";
              } else if (state.currentTheme === 'ocean-clarity') {
                badgeBgClass = "bg-white/95 border-[#006d77]/25 text-[#006d77] font-bold";
              }

              return (
                <div 
                  key={idx}
                >
                  <EditableText section="cover" field={`bulletPoints.${idx}`} label={`Topic Badge ${idx + 1}`}>
                    <div className={`flex items-center gap-1.5 p-2 rounded-lg border shadow-xl backdrop-blur-sm ${badgeBgClass}`}>
                      <span className="flex-shrink-0 w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
                      <span className="text-[9px] font-extrabold uppercase tracking-wider">
                        {pt}
                      </span>
                    </div>
                  </EditableText>
                </div>
              );
            })}
          </div>

          {/* BOTTOM PROFILE TAG (Footer layout) */}
          <div className="z-25 flex items-center justify-between border-t pt-2.5 mt-1 border-dashed" style={{ borderColor: `${colors.primary}60` }}>
            <div className="flex flex-col">
              <EditableText section="cover" field="authorName" label="Author Name">
                <h4 className="text-xs font-black tracking-wide text-white uppercase">
                  👤 {coverData.authorName}
                </h4>
              </EditableText>
              <EditableText section="cover" field="authorCreds" label="Author Credentials">
                <span 
                  className="inline-block text-[9.5px] font-black tracking-wider uppercase px-2 py-0.5 rounded shadow-sm border mt-1 font-mono"
                  style={{ 
                    backgroundColor: `${colors.primary}18`, 
                    color: colors.primary, 
                    borderColor: `${colors.primary}45` 
                  }}
                >
                  🎓 {coverData.authorCreds}
                </span>
              </EditableText>
            </div>

            {/* Social Tag */}
            <EditableText section="cover" field="socialHandle" label="Social Branding Handle">
              <div className="flex items-center gap-1.5 bg-zinc-950 px-2 py-1 rounded border border-zinc-800 text-[8px] font-mono text-zinc-300">
                <Youtube size={10} className="text-red-500" />
                <span>/{coverData.socialHandle}</span>
              </div>
            </EditableText>
          </div>

          {/* Render duplicated heading copies */}
          {renderElementCopies()}

          {/* Free-form canvas elements */}
          {renderCanvasElements()}

        </div>
      )}

      {/* 2. INDEX / TOC PAGE VIEW */}
      {currentPage === 'index' && (
        <div key="page-index" className="relative w-full h-full p-8 flex flex-col justify-between overflow-hidden">
          
          {/* TOC Top Section */}
          <div className="z-10 text-center">
            <EditableText section="index" field="categoryLabel" label="Category Label">
              <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: colors.primary }}>
                {indexData.categoryLabel}
              </span>
            </EditableText>
            <EditableText section="index" field="title" label="Index Title">
              <h2 className={`${colors.fontFamilyHead} text-3xl md:text-4xl mt-1 font-black mb-3`} style={fonts.headStyle}>
                {indexData.title}
              </h2>
            </EditableText>
            <div className="w-16 h-1 mx-auto rounded" style={{ backgroundColor: colors.primary }} />
          </div>

          {/* TWO COLUMN CONTENT INDEX */}
          <div className="z-10 grid grid-cols-2 gap-6 my-auto pt-2">
            
            {/* Left Column (e.g. Prelims) */}
            <div className="space-y-3.5">
              <EditableText section="index" field="leftColumnHeader" label="Column 1 Header">
                <h3 className="text-[11px] font-black uppercase tracking-wider pb-1 border-b" style={{ borderColor: colors.primary, color: colors.primary }}>
                  ⚡ {indexData.leftColumnHeader}
                </h3>
              </EditableText>

              <div className="space-y-2">
                {indexData.leftItems.map((item, idx) => (
                  <div key={item.id} className="flex items-baseline justify-between gap-1 text-[10px] group/item">
                    <span className="font-mono font-bold" style={{ color: colors.primary }}>
                      {item.number}
                    </span>
                    <span className="truncate flex-1 pl-1 text-zinc-300 font-medium">
                      {item.title}
                    </span>
                    <span className="border-b border-dotted border-zinc-700 flex-1 mx-1 min-w-[12px] h-2" />
                    <span className="font-mono font-bold text-zinc-400">
                      p. {item.page}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column (e.g. Mains) */}
            <div className="space-y-3.5">
              <EditableText section="index" field="rightColumnHeader" label="Column 2 Header">
                <h3 className="text-[11px] font-black uppercase tracking-wider pb-1 border-b" style={{ borderColor: colors.primary, color: colors.primary }}>
                  {indexData.rightColumnHeader}
                </h3>
              </EditableText>

              <div className="space-y-2">
                {indexData.rightItems.map((item, idx) => (
                  <div key={item.id} className="flex items-baseline justify-between gap-1 text-[10px] group/item">
                    <span className="font-mono font-bold" style={{ color: colors.primary }}>
                      {item.number}
                    </span>
                    <span className="truncate flex-1 pl-1 text-zinc-300 font-medium">
                      {item.title}
                    </span>
                    <span className="border-b border-dotted border-zinc-700 flex-1 mx-1 min-w-[12px] h-2" />
                    <span className="font-mono font-bold text-zinc-400">
                      p. {item.page}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Table of Contents Footer with abstract graphic element */}
          <div className="z-10 pt-4 flex items-center justify-between border-t border-zinc-800">
            <span className="text-[8px] font-mono text-zinc-500">
              * Alternate Day 1/Day 2 Revision Blueprint
            </span>
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
              <span className="w-6 h-2 rounded-full opacity-60" style={{ backgroundColor: colors.primary }} />
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
            </div>
          </div>

          {/* Interactive footer wave shape mimic */}
          <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none opacity-10">
            <svg viewBox="0 0 1440 320" className="w-full h-full">
              <path 
                fill={colors.primary} 
                d="M0,192L48,197.3C96,203,192,213,288,202.7C384,192,480,160,576,149.3C672,139,768,149,864,170.7C960,192,1056,224,1152,218.7C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              />
            </svg>
          </div>

          {/* Render duplicated heading copies */}
          {renderElementCopies()}

          {renderCanvasElements()}

        </div>
      )}

      {/* 3. TOPPER'S TALK PAGE VIEW */}
      {currentPage === 'topper' && (
        <div key="page-topper" className="relative w-full h-full p-6 flex flex-col justify-between overflow-hidden">
          
          {/* Page Title */}
          <div className="z-10 flex justify-between items-end border-b pb-3" style={{ borderColor: `${colors.primary}30` }}>
            <div>
              <EditableText section="topper" field="mainTitle" label="Toppers Talk Title">
                <h2 className={`${colors.fontFamilyHead} text-2xl md:text-3xl font-black`} style={fonts.headStyle}>
                  ⭐ {topperData.mainTitle}
                </h2>
              </EditableText>
              <EditableText section="topper" field="intro" label="Toppers Intro text">
                <p className="text-[8px] text-zinc-400 mt-1 max-w-md uppercase font-semibold">
                  {topperData.intro}
                </p>
              </EditableText>
            </div>
            
            <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded text-[8px] font-mono text-zinc-300">
              <PartyPopper size={11} className="text-yellow-400" />
              <span>STARS OF 2024</span>
            </div>
          </div>

          {/* BENTO-GRID OF FEEDBACKS */}
          <div className="z-10 grid grid-cols-3 gap-3 my-auto py-2">
            
            {/* Card 1 Large Span 2 */}
            <div className="col-span-2 p-3.5 rounded-xl border relative overflow-hidden flex flex-col justify-between" style={{ backgroundColor: `${colors.background}99`, borderColor: colors.borderColor }}>
              <div className="absolute top-2 right-2 text-zinc-750 font-serif text-3xl leading-none opacity-30 select-none">“</div>
              <div className="space-y-1">
                <span className="text-[10px] font-black tracking-wide" style={{ color: colors.primary }}>
                  👤 {topperData.items[0]?.name}
                </span>
                <span className="block text-[7px] text-zinc-500 italic">
                  📍 {topperData.items[0]?.location}
                </span>
              </div>
              <p className="text-[9px] text-zinc-300 leading-relaxed mt-2 italic font-mono">
                "{topperData.items[0]?.feedback}"
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-3 rounded-xl border flex flex-col justify-between" style={{ backgroundColor: `${colors.background}99`, borderColor: colors.borderColor }}>
              <div className="space-y-1">
                <span className="text-[9px] font-black" style={{ color: colors.primary }}>
                  👑 {topperData.items[1]?.name}
                </span>
                <span className="block text-[7px] text-zinc-500 italic">{topperData.items[1]?.location}</span>
              </div>
              <p className="text-[8px] text-zinc-400 mt-1 leading-snug line-clamp-5">
                "{topperData.items[1]?.feedback}"
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-3 rounded-xl border flex flex-col justify-between" style={{ backgroundColor: `${colors.background}99`, borderColor: colors.borderColor }}>
              <div className="space-y-1">
                <span className="text-[9px] font-black" style={{ color: colors.primary }}>
                  🌟 {topperData.items[2]?.name}
                </span>
                <span className="block text-[7px] text-zinc-500 italic">{topperData.items[2]?.location}</span>
              </div>
              <p className="text-[8px] text-zinc-400 mt-1 leading-snug line-clamp-5">
                "{topperData.items[2]?.feedback}"
              </p>
            </div>

            {/* Card 4 Large Span 2 */}
            <div className="col-span-2 p-3.5 rounded-xl border relative flex flex-col justify-between" style={{ backgroundColor: `${colors.background}99`, borderColor: colors.borderColor }}>
              <div className="space-y-1">
                <span className="text-[10px] font-black" style={{ color: colors.primary }}>
                  🎓 {topperData.items[3]?.name}
                </span>
                <span className="block text-[7px] text-zinc-500 italic">📍 {topperData.items[3]?.location}</span>
              </div>
              <p className="text-[8.5px] text-zinc-300 mt-1.5 leading-relaxed italic">
                "{topperData.items[3]?.feedback}"
              </p>
            </div>

            {/* Bottom mini row topper */}
            <div className="col-span-3 p-2.5 rounded-xl border-2 border-dashed flex items-center justify-between" style={{ borderColor: `${colors.primary}50` }}>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-white">V</div>
                <div>
                  <span className="text-[9px] font-black block text-zinc-200">{topperData.items[4]?.name}</span>
                  <span className="text-[6px] text-zinc-500 block">{topperData.items[4]?.location}</span>
                </div>
              </div>
              <p className="text-[8px] text-zinc-400 max-w-[70%] truncate italic">
                "{topperData.items[4]?.feedback}"
              </p>
            </div>

          </div>

          {/* Topper Talk Footer */}
          <div className="z-10 flex items-center justify-between border-t border-zinc-800 pt-3">
            <span className="text-[8px] font-mono text-zinc-500 uppercase">
              🎯 YOUR STORY COULD BE HERE NEXT MONTH!
            </span>
            <span className="text-[8px] font-bold" style={{ color: colors.primary }}>
              LEARNING CAPSULES SUBSCRIBERS
            </span>
          </div>

          {/* Render duplicated heading copies */}
          {renderElementCopies()}

          {renderCanvasElements()}

        </div>
      )}

      {/* 4. AUTHOR BIO PAGE VIEW */}
      {currentPage === 'bio' && (
        <div key="page-bio" className="relative w-full h-full flex overflow-hidden">
          
          {/* Left Dark Block (Authority highlight bar) */}
          <div className="w-[32%] h-full flex flex-col justify-between p-4 bg-zinc-950 border-r border-zinc-800 z-10">
            <div className="space-y-4">
              <span className="inline-block text-[7px] text-zinc-400 tracking-widest font-mono uppercase border-b border-zinc-800 pb-1 w-full">
                EDITORIAL TEAM
              </span>
              
              <div className="space-y-0.5">
                <span className="text-[7px] text-zinc-500 uppercase font-bold block">PRESENTS</span>
                <h3 className={`${colors.fontFamilyHead} text-lg font-black leading-none uppercase`} style={{ color: colors.primary, ...fonts.headStyle }}>
                  {bioData.authorName.split(" ")[0]}
                </h3>
                <h3 className={`${colors.fontFamilyHead} text-lg font-black leading-none uppercase text-white`} style={fonts.headStyle}>
                  {bioData.authorName.split(" ")[1]}
                </h3>
              </div>

              {/* Little stats display */}
              <div className="space-y-1.5 pt-2">
                <div className="bg-zinc-900/80 p-2 rounded border border-zinc-900">
                  <span className="text-[7px] text-zinc-500 uppercase block">CREDENTIALS</span>
                  <span className="text-[8px] font-mono font-bold text-zinc-200 block uppercase">{bioData.subtitle}</span>
                </div>
              </div>
            </div>

            {/* Social handles list */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[8px] text-zinc-400 font-mono">
                <Youtube size={10} className="text-red-500" />
                <span className="truncate">LCapsules</span>
              </div>
              <div className="flex items-center gap-1.5 text-[8px] text-zinc-400 font-mono">
                <Send size={10} className="text-blue-400" />
                <span className="truncate">t.me/hgroup</span>
              </div>
            </div>
          </div>

          {/* Right Main content column */}
          <div className="flex-1 h-full p-6 flex flex-col justify-between z-10">
            
            {/* Header segment */}
            <div>
              <EditableText section="bio" field="title" label="Author Header Title">
                <span className="text-[8px] uppercase tracking-widest font-extrabold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
                  {bioData.title}
                </span>
              </EditableText>
              
              {/* Profile Image Space */}
              <div className="my-4 h-32 rounded-xl relative overflow-hidden bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                {photo.url ? (
                  <img
                    src={photo.url}
                    alt="Author Bio Image"
                    className="absolute inset-0 w-full h-full object-cover opacity-95 hover:scale-105 transition-transform"
                    style={{ filter: photo.isMonochrome ? 'grayscale(100%)' : 'none' }}
                  />
                ) : (
                  <User size={30} className="text-zinc-600" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-3 text-[9px] font-black text-white uppercase drop-shadow">
                  {bioData.authorName}
                </span>
              </div>
            </div>

            {/* Bio Paragraphs */}
            <div className="space-y-2.5 my-auto">
              {bioData.paragraphs.map((p, idx) => (
                <EditableText key={idx} section="bio" field={`paragraphs.${idx}`} label={`Bio Paragraph ${idx + 1}`}>
                  <p className="text-[9px] text-zinc-300 leading-relaxed">
                    {p}
                  </p>
                </EditableText>
              ))}
            </div>

            {/* Signature Quote / Hindi philosophy - featured in screenshots */}
            <div className="mt-4 pt-3 border-t border-zinc-800 border-dashed">
              <EditableText section="bio" field="signatureQuote" label="Signature Quote Capsule">
                <div className="bg-black/40 p-3 rounded-lg border-l-2 p-3 font-medium text-white italic relative" style={{ borderColor: colors.primary }}>
                  <Quote size={12} className="absolute top-1 right-2 opacity-20 text-white" />
                  <p className="text-[8.5px] leading-relaxed text-zinc-100">
                    "{bioData.signatureQuote}"
                  </p>
                </div>
              </EditableText>
            </div>

          </div>

          {/* Render duplicated heading copies */}
          {renderElementCopies()}

          {renderCanvasElements()}

        </div>
      )}

      {/* 5. PROMO FLYER VIEW */}
      {currentPage === 'promo' && (
        <div key="page-promo" className="relative w-full h-full p-6 flex flex-col justify-between overflow-hidden text-white bg-zinc-950">
          
          {/* Floating cyber header */}
          <div className="z-10 bg-zinc-900 border border-zinc-800 rounded-lg p-2 flex items-center justify-between">
            <EditableText section="promo" field="topBadge" label="Promotion Top Tag">
              <span className="text-[8px] uppercase tracking-widest font-black text-yellow-400">
                💎 {promoData.topBadge}
              </span>
            </EditableText>

            <span className="text-[7.5px] font-mono bg-[#ccff00] text-black font-extrabold px-1.5 py-0.2 rounded">
              SELECTION BATCH
            </span>
          </div>

          {/* Main big block course title */}
          <div className="z-10 text-center my-3 relative">
            <EditableText section="promo" field="mainTitle" label="Course Main Title">
              <h2 className="text-4xl md:text-5xl font-black leading-none tracking-tighter" style={{ color: colors.primary }}>
                {promoData.mainTitle}
              </h2>
            </EditableText>

            <EditableText section="promo" field="authorTag" label="Author subline">
              <p className="text-[9px] uppercase tracking-widest font-semibold mt-1 text-zinc-400">
                by {promoData.authorTag}
              </p>
            </EditableText>
          </div>

          {/* Sub promo title segment & bullet list */}
          <div className="z-10 space-y-3 my-auto">
            
            {/* Target Exam Label */}
            <div className="text-center p-1 bg-black/50 border border-zinc-800 rounded">
              <EditableText section="promo" field="targetExam" label="Target Exam Category">
                <span className="text-[9px] font-mono tracking-widest uppercase text-yellow-500 font-extrabold">
                  {promoData.targetExam}
                </span>
              </EditableText>
            </div>

            {/* Key Features Box */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3.5 space-y-2">
              <span className="text-[8px] font-extrabold uppercase text-zinc-400 block border-b border-zinc-800 pb-1">
                COURSE HIGHLIGHTS & DELIVERABLES:
              </span>
              
              <div className="space-y-1.5">
                {promoData.features.map((feat, idx) => (
                  <EditableText key={idx} section="promo" field={`features.${idx}`} label={`Feature Bullet ${idx + 1}`}>
                    <div className="flex items-center gap-1.5 text-[8.5px] text-zinc-300">
                      <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                      <span>{feat}</span>
                    </div>
                  </EditableText>
                ))}
              </div>
            </div>

          </div>

          {/* Pricing & Code Coupon Banner */}
          <div className="z-10 grid grid-cols-2 gap-3 items-center pt-2">
            
            {/* Price section */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-center flex flex-col justify-center">
              <span className="text-[7.5px] uppercase font-bold text-zinc-500 block">SPECIAL OFFER PRICE</span>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-xs line-through text-zinc-500 font-bold">
                  ₹{promoData.priceBefore}
                </span>
                <span className="text-lg font-black text-white" style={{ color: colors.primary }}>
                  ₹{promoData.priceAfter}/-
                </span>
              </div>
              <EditableText section="promo" field="limitedSeatsLabel" label="Limited Seats tag">
                <span className="text-[6.5px] text-yellow-500 mt-1 block">
                  {promoData.limitedSeatsLabel}
                </span>
              </EditableText>
            </div>

            {/* Discount Code Section */}
            <div className="bg-primary/10 border-2 border-dashed rounded-xl p-2.5 text-center flex flex-col justify-center select-all" style={{ borderColor: colors.primary }}>
              <span className="text-[7.5px] uppercase font-mono font-bold text-zinc-400 block">USE COUPON CODE:</span>
              <EditableText section="promo" field="discountCode" label="Coupon discount Code">
                <span className="text-lg font-black tracking-widest text-white uppercase block mt-1">
                  {promoData.discountCode}
                </span>
              </EditableText>
              <EditableText section="promo" field="callToAction" label="CTA Label">
                <span className="text-[6px] text-zinc-400 tracking-wider block mt-0.5">
                  {promoData.callToAction}
                </span>
              </EditableText>
            </div>

          </div>

          {/* Footer Callout */}
          <div className="z-10 mt-3 pt-2.5 border-t border-zinc-900 flex justify-between items-center text-[7.5px] font-mono text-zinc-500">
            <span>📞 HELP: +91 7860251995</span>
            <span>🌐 WWW.LEARNINGCAPSULES.COM</span>
          </div>

          {/* Render duplicated heading copies */}
          {renderElementCopies()}

          {renderCanvasElements()}

        </div>
      )}

    </div>
  );
};
