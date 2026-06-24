import { AppState, ThemeColors } from '../types';
import { COMPILATION_THEMES } from '../data';

export function getSvgIcon(iconName: string): string {
  // SVGs for Lucide Icons to prevent external loader delays in standalone files
  switch (iconName) {
    case 'youtube':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/><path d="m10 15 5-3-5-3z"/></svg>`;
    case 'telegram':
    case 'send':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-400"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>`;
    case 'instagram':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>`;
    case 'quote':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-white opacity-25"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1.12.014a2 2 0 0 1-1.12 1.986c-1 .5-2 1-2 2Z"/><path d="M14 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1.12.014a2 2 0 0 1-1.12 1.986c-1 .5-2 1-2 2Z"/></svg>`;
    case 'star':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    case 'party-popper':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-yellow-400"><path d="M5.8 11.3 2 22l10.7-3.8C10.9 16.2 8 13.3 5.8 11.3z"/><path d="m4 13 1 1-1.5 1.5 2 2L4 19M11.5 5.5l1.5-1.5M16 9.5l1.5-1.5M15 15l2-2M8 5l1.5-1.5M20 4l-.5.5M10 10l-1-1"/></svg>`;
    default:
      return '';
  }
}

export function generateStandaloneHtml(state: AppState): string {
  const activeTheme = COMPILATION_THEMES[state.currentTheme];
  const baseColors = activeTheme.colors;
  const colors = {
    ...baseColors,
    primary: state.customPrimaryColor || baseColors.primary,
    background: state.customBackgroundColor || baseColors.background,
    textPrimary: state.customTextColor || baseColors.textPrimary,
  };
  const { currentPage, photo, coverData, indexData, topperData, bioData, promoData } = state;

  // Render template-specific inner container
  let innerBodyHtml = '';

  // Transform styling getter to preserve dragged & scaled elements in exports
  const getStyleForField = (section: string, field: string, defaultDisplay: string = 'inline-block') => {
    const elementId = `${section}.${field}`;
    const transform = (state.transforms || {})[elementId] || { x: 0, y: 0, scale: 1.0, rotation: 0 };
    let extraStyles = '';
    const customBgs = state.customBackgrounds || {};
    const customBg = customBgs[elementId];
    if (customBg !== undefined) {
      const bgVal = customBg === 'none' ? 'transparent' : customBg;
      extraStyles += ` background-color: ${bgVal} !important; background-image: none !important;`;
    }
    
    // Custom individual element overrides
    const customTextColor = state.customElementTextColors?.[elementId];
    const customFont = state.customElementFonts?.[elementId];
    const customAccent = state.customElementAccents?.[elementId];

    if (customTextColor !== undefined) {
      extraStyles += ` color: ${customTextColor} !important;`;
    }
    if (customFont !== undefined) {
      if (customFont.startsWith('font-family:')) {
        extraStyles += ` font-family: ${customFont.replace('font-family:', '')} !important;`;
      } else if (customFont === 'italic') {
        extraStyles += ` font-style: italic !important;`;
      } else if (customFont === 'bold') {
        extraStyles += ` font-weight: bold !important;`;
      } else if (customFont === 'uppercase') {
        extraStyles += ` text-transform: uppercase !important;`;
      } else if (customFont === 'underline') {
        extraStyles += ` text-decoration: underline !important;`;
      } else {
        extraStyles += ` font-family: ${customFont} !important;`;
      }
    }
    if (customAccent !== undefined) {
      extraStyles += ` border-color: ${customAccent} !important; outline-color: ${customAccent} !important;`;
    }

    // Apply bold/italic/underline from customElementStyles
    const customStyles = (state.customElementStyles || {})[elementId] || {};
    if (customStyles.bold) extraStyles += ` font-weight: bold !important;`;
    if (customStyles.italic) extraStyles += ` font-style: italic !important;`;
    if (customStyles.underline) extraStyles += ` text-decoration: underline !important;`;

    return `display: ${defaultDisplay}; transform: translate(${transform.x}px, ${transform.y}px) scale(${transform.scale}) rotate(${transform.rotation}deg); transform-origin: center;${extraStyles}`;
  };

  const getFontFamilyStyles = () => {
    const styleId = state.fontStyleId || 'theme-default';
    switch (styleId) {
      case 'modern':
        return {
          headStyle: `font-family: 'Space Grotesk', sans-serif; font-weight: 800; text-transform: uppercase; letter-spacing: -0.05em;`,
          bodyStyle: `font-family: 'Inter', sans-serif;`,
        };
      case 'serif':
        return {
          headStyle: `font-family: 'Playfair Display', serif; font-weight: 900; text-transform: none; letter-spacing: normal; font-style: italic;`,
          bodyStyle: `font-family: 'Merriweather', serif;`,
        };
      case 'mono':
        return {
          headStyle: `font-family: 'JetBrains Mono', monospace; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em;`,
          bodyStyle: `font-family: 'JetBrains Mono', monospace;`,
        };
      case 'scifi':
        return {
          headStyle: `font-family: 'Syne', sans-serif; font-weight: 850; text-transform: uppercase; letter-spacing: 0.05em;`,
          bodyStyle: `font-family: 'Outfit', sans-serif;`,
        };
      case 'elegant':
        return {
          headStyle: `font-family: 'Cinzel', serif; font-weight: 800; text-transform: uppercase; letter-spacing: normal;`,
          bodyStyle: `font-family: 'Cormorant Garamond', serif;`,
        };
      case 'theme-default':
      default:
        return {
          headStyle: ``,
          bodyStyle: ``,
        };
    }
  };
  const fonts = getFontFamilyStyles();

  const filters: string[] = [];
  if (photo.isMonochrome) filters.push('grayscale(100%)');
  if (photo.saturation !== 1) filters.push(`saturate(${photo.saturation})`);
  let filterCss = filters.join(' ');
  let shadowCss = '';
  if (photo.shadow === 'glow') {
    const glowCol = state.photoGlowColor || colors.primary;
    const glowWid = state.photoGlowWidth !== undefined ? state.photoGlowWidth : 15;
    shadowCss = `drop-shadow(0 0 ${glowWid}px ${glowCol})`;
  } else if (photo.shadow === 'lg') {
    shadowCss = 'drop-shadow(0 20px 25px rgba(0,0,0,0.45))';
  } else if (photo.shadow === 'md') {
    shadowCss = 'drop-shadow(0 10px 15px rgba(0,0,0,0.3))';
  }

  // Cover representation
  if (currentPage === 'cover') {
    innerBodyHtml = `
      <div class="relative w-full h-full p-8 flex flex-col justify-between overflow-hidden">
        
        <!-- Header -->
        <div class="z-20 flex justify-between items-start">
          <div class="flex flex-col gap-2 max-w-[70%]">
            <span class="inline-block bg-zinc-950 text-white font-mono text-[10px] font-bold px-2.5 py-1.5 tracking-wider uppercase border border-zinc-700 shadow-md" style="${getStyleForField('cover', 'tagline')}">
              ${coverData.tagline}
            </span>
            <div class="inline-block bg-[${colors.primary}] text-black font-extrabold text-[11px] uppercase px-2.5 py-1 mt-1 border border-black shadow mr-auto" style="${getStyleForField('cover', 'badgeText')} background-color: ${colors.primary}">
              ${coverData.badgeText}
            </div>
          </div>
          <span class="text-sm font-semibold tracking-wide border-b-2 uppercase py-1" style="${getStyleForField('cover', 'issueDate')} border-color: ${colors.primary}">
            ${coverData.issueDate}
          </span>
        </div>

        <!-- Teacher portrait background aligned custom scale offsets -->
        <div class="absolute inset-0 z-10 pointer-events-none flex items-end justify-center">
          ${photo.url ? `
            <img 
              src="${photo.url}" 
              class="max-h-[72%] object-contain select-none transition-transform pointer-events-auto" 
              style="transform: scale(${photo.scale}) translate(${photo.xOffset}%, ${photo.yOffset}%) rotate(${((state.transforms || {})['cover.__photo__']?.rotation ?? 0)}deg); filter: ${filterCss} ${shadowCss}; opacity: ${photo.opacity};"
            />
          ` : ''}
        </div>

        <!-- Main centered cover content -->
        <div class="z-20 my-auto text-center relative flex flex-col items-center">
          <h1 class="text-5xl md:text-6xl text-center leading-none tracking-tighter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] filter font-extrabold uppercase" style="${getStyleForField('cover', 'mainTitle', 'block')} color: ${colors.primary};">
            ${coverData.mainTitle}
          </h1>
          <span class="mt-3.5 inline-block text-xs uppercase font-extrabold tracking-widest bg-zinc-900 text-white rounded px-4 py-1.5 border border-zinc-700 shadow-lg" style="${getStyleForField('cover', 'subTitle')}">
            ${coverData.subTitle}
          </span>
          <p class="text-[10px] font-mono tracking-tight text-center uppercase opacity-90 p-1 px-3 bg-black/55 rounded backdrop-blur-[2px] mt-3" style="${getStyleForField('cover', 'bestMagLabel', 'block')}">
            ${coverData.bestMagLabel}
          </p>
        </div>

        <!-- Bullet highlights topics -->
        <div class="z-20 grid grid-cols-2 gap-3 mt-auto mb-4 relative">
          ${coverData.bulletPoints.map((pt, idx) => {
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

            return `
              <div class="flex items-center gap-2 p-2.5 rounded-lg border shadow-xl backdrop-blur-sm ${badgeBgClass}" style="${getStyleForField('cover', `bulletPoints.${idx}`, 'flex')}">
                <span class="flex-shrink-0 w-2 h-2 rounded-full" style="background-color: ${colors.primary}"></span>
                <span class="text-[9px] font-extrabold uppercase tracking-wider">
                  ${pt}
                </span>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Bottom brand bar -->
        <div class="z-20 flex items-center justify-between border-t pt-3 mt-1 border-dashed" style="border-color: ${colors.primary}60">
          <div class="flex flex-col">
            <h4 class="text-xs font-black tracking-wide text-white uppercase" style="${getStyleForField('cover', 'authorName', 'block')}">
              👤 ${coverData.authorName}
            </h4>
            <span 
              class="inline-block text-[9.5px] font-black tracking-wider uppercase px-2 py-0.5 rounded shadow-sm border mt-1 font-mono"
              style="${getStyleForField('cover', 'authorCreds')} background-color: ${colors.primary}18; color: ${colors.primary}; border-color: ${colors.primary}45;"
            >
              🎓 ${coverData.authorCreds}
            </span>
          </div>
          <div class="flex items-center gap-1.5 bg-zinc-950 px-2.5 py-1 rounded border border-zinc-800 text-[9px] font-mono text-zinc-300" style="${getStyleForField('cover', 'socialHandle', 'flex')}">
            ${getSvgIcon('youtube')}
            <span>/${coverData.socialHandle}</span>
          </div>
        </div>

      </div>
    `;
  }

  // Syllabus / Index Representation
  else if (currentPage === 'index') {
    innerBodyHtml = `
      <div class="relative w-full h-full p-8 flex flex-col justify-between overflow-hidden">
        
        <div class="text-center">
          <span class="text-[10px] font-bold uppercase tracking-widest" style="color: ${colors.primary}">
            ${indexData.categoryLabel}
          </span>
          <h2 class="text-3xl md:text-4xl mt-1.5 font-black mb-3" style="${getStyleForField('index', 'title', 'block')}">
            ${indexData.title}
          </h2>
          <div class="w-16 h-1 mx-auto rounded" style="background-color: ${colors.primary}"></div>
        </div>

        <div class="grid grid-cols-2 gap-8 my-auto pt-4">
          
          <!-- Column 1 -->
          <div class="space-y-4">
            <h3 class="text-[12px] font-black uppercase tracking-wider pb-1 border-b" style="${getStyleForField('index', 'leftColumnHeader')}; border-color: ${colors.primary}; color: ${colors.primary}">
              ${indexData.leftColumnHeader}
            </h3>
            <div class="space-y-2.5">
              ${indexData.leftItems.map((item) => `
                <div class="flex items-baseline justify-between gap-1 text-[11px]">
                  <span class="font-mono font-bold" style="color: ${colors.primary}">${item.number}</span>
                  <span class="truncate flex-1 pl-1.5 text-zinc-300 font-medium">${item.title}</span>
                  <span class="border-b border-dotted border-zinc-700 flex-1 mx-1.5 min-w-[12px]"></span>
                  <span class="font-mono font-bold text-zinc-400">p. ${item.page}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Column 2 -->
          <div class="space-y-4">
            <h3 class="text-[12px] font-black uppercase tracking-wider pb-1 border-b" style="${getStyleForField('index', 'rightColumnHeader')}; border-color: ${colors.primary}; color: ${colors.primary}">
              ${indexData.rightColumnHeader}
            </h3>
            <div class="space-y-2.5">
              ${indexData.rightItems.map((item) => `
                <div class="flex items-baseline justify-between gap-1 text-[11px]">
                  <span class="font-mono font-bold" style="color: ${colors.primary}">${item.number}</span>
                  <span class="truncate flex-1 pl-1.5 text-zinc-300 font-medium">${item.title}</span>
                  <span class="border-b border-dotted border-zinc-700 flex-1 mx-1.5 min-w-[12px]"></span>
                  <span class="font-mono font-bold text-zinc-405">p. ${item.page}</span>
                </div>
              `).join('')}
            </div>
          </div>

        </div>

        <div class="pt-5 flex items-center justify-between border-t border-zinc-800">
          <span class="text-[9px] font-mono text-zinc-500">* Complete 30 Days Alternate Plan</span>
          <div class="flex gap-1.5">
            <span class="w-2 h-2 rounded-full" style="background-color: ${colors.primary}"></span>
            <span class="w-6 h-2 rounded-full opacity-60" style="background-color: ${colors.primary}"></span>
            <span class="w-2 h-2 rounded-full" style="background-color: ${colors.primary}"></span>
          </div>
        </div>

      </div>
    `;
  }

  // Topper testimonials grid
  else if (currentPage === 'topper') {
    innerBodyHtml = `
      <div class="relative w-full h-full p-8 flex flex-col justify-between overflow-hidden">
        
        <div class="flex justify-between items-end border-b pb-4" style="border-color: ${colors.primary}30">
          <div>
            <h2 class="text-2xl md:text-3xl font-black" style="${getStyleForField('topper', 'mainTitle', 'block')}">
              ⭐ ${topperData.mainTitle}
            </h2>
            <p class="text-[9px] text-zinc-400 mt-1 max-w-md uppercase font-semibold" style="${getStyleForField('topper', 'intro', 'block')}">
              ${topperData.intro}
            </p>
          </div>
          <div class="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded text-[9px] font-mono text-zinc-300">
            ${getSvgIcon('party-popper')}
            <span>STARS OF 2024</span>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-3.5 my-auto py-3">
          
          <!-- Box 1 -->
          <div class="col-span-2 p-4 rounded-xl border relative" style="background-color: ${colors.background}99; border-color: ${colors.borderColor}">
            <div class="space-y-1">
              <span class="text-[10px] font-black" style="color: ${colors.primary}">👤 ${topperData.items[0]?.name}</span>
              <span class="block text-[7px] text-zinc-500 italic">📍 ${topperData.items[0]?.location}</span>
            </div>
            <p class="text-[9.5px] text-zinc-350 leading-relaxed mt-2 italic font-mono">
              "${topperData.items[0]?.feedback}"
            </p>
          </div>

          <!-- Box 2 -->
          <div class="p-3.5 rounded-xl border flex flex-col justify-between" style="background-color: ${colors.background}99; border-color: ${colors.borderColor}">
            <div class="space-y-1">
              <span class="text-[9px] font-black" style="color: ${colors.primary}">👑 ${topperData.items[1]?.name}</span>
              <span class="block text-[7px] text-zinc-500 italic">${topperData.items[1]?.location}</span>
            </div>
            <p class="text-[8.5px] text-zinc-400 mt-1 leading-normal">
              "${topperData.items[1]?.feedback}"
            </p>
          </div>

          <!-- Box 3 -->
          <div class="p-3.5 rounded-xl border flex flex-col justify-between" style="background-color: ${colors.background}99; border-color: ${colors.borderColor}">
            <div class="space-y-1">
              <span class="text-[9px] font-black" style="color: ${colors.primary}">🌟 ${topperData.items[2]?.name}</span>
              <span class="block text-[7px] text-zinc-500 italic">${topperData.items[2]?.location}</span>
            </div>
            <p class="text-[8.5px] text-zinc-400 mt-1 leading-normal">
              "${topperData.items[2]?.feedback}"
            </p>
          </div>

          <!-- Box 4 -->
          <div class="col-span-2 p-4 rounded-xl border" style="background-color: ${colors.background}99; border-color: ${colors.borderColor}">
            <div class="space-y-1">
              <span class="text-[10px] font-black" style="color: ${colors.primary}">🎓 ${topperData.items[3]?.name}</span>
              <span class="block text-[7px] text-zinc-500 italic">📍 ${topperData.items[3]?.location}</span>
            </div>
            <p class="text-[9.5px] text-zinc-350 mt-2 leading-relaxed italic">
              "${topperData.items[3]?.feedback}"
            </p>
          </div>

        </div>

        <div class="flex items-center justify-between border-t border-zinc-800 pt-4">
          <span class="text-[8px] font-mono text-zinc-500 uppercase">🎯 SUCCESS IS WITHIN YOUR BREADTH!</span>
          <span class="text-[9px] font-bold" style="color: ${colors.primary}">LEARNING CAPSULES PREMIUM MENTORSHIP</span>
        </div>

      </div>
    `;
  }

  // Biography of Author
  else if (currentPage === 'bio') {
    innerBodyHtml = `
      <div class="w-full h-full flex">
        
        <!-- Left Side Bar background -->
        <div class="w-[32%] h-full flex flex-col justify-between p-5 bg-zinc-950 border-r border-zinc-800 z-10">
          <div class="space-y-4">
            <span class="inline-block text-[8px] text-zinc-400 tracking-widest font-mono uppercase pb-1 border-b border-zinc-800 w-full">
              EDITORIAL TEAM
            </span>
            <div class="space-y-0.5">
              <span class="text-[7.5px] text-zinc-500 uppercase font-black block">PRESENTS</span>
              <h3 class="text-xl font-extrabold uppercase leading-none" style="color: ${colors.primary}">
                ${bioData.authorName.split(" ")[0]}
              </h3>
              <h3 class="text-xl font-extrabold uppercase leading-none text-white">
                ${bioData.authorName.split(" ")[1] || ''}
              </h3>
            </div>
            <div class="bg-zinc-900 p-2.5 rounded border border-zinc-850">
              <span class="text-[7px] text-zinc-500 uppercase block font-bold">CREDENTIALS</span>
              <span class="text-[8px] font-mono font-bold text-zinc-300 block uppercase">${bioData.subtitle}</span>
            </div>
          </div>

          <div class="space-y-2.5 text-[8.5px] text-zinc-400 font-mono">
            <div class="flex items-center gap-1.5">
              ${getSvgIcon('youtube')}
              <span>youtube.com</span>
            </div>
            <div class="flex items-center gap-1.5">
              ${getSvgIcon('telegram')}
              <span>t.me/harshalagrawal</span>
            </div>
          </div>
        </div>

        <!-- Right Side -->
        <div class="flex-1 h-full p-8 flex flex-col justify-between z-10">
          <div>
            <span class="text-[8px] uppercase tracking-widest font-extrabold px-2 py-1 rounded" style="${getStyleForField('bio', 'title')}; background-color: ${colors.primary}20; color: ${colors.primary}">
              ${bioData.title}
            </span>
            
            <div class="my-4 h-28 rounded-xl relative overflow-hidden bg-zinc-950 border border-zinc-850 flex items-center justify-center">
              ${photo.url ? `
                <img src="${photo.url}" class="absolute inset-0 w-full h-full object-cover opacity-90" />
              ` : ''}
              <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
              <span class="absolute bottom-2.5 left-3 text-[10px] font-bold text-white uppercase tracking-tight">
                ${bioData.authorName}
              </span>
            </div>
          </div>

          <div class="space-y-3 my-auto">
            ${bioData.paragraphs.map((p, idx) => `
              <p class="text-[9.5px] text-zinc-300 leading-relaxed" style="${getStyleForField('bio', `paragraphs.${idx}`, 'block')}">${p}</p>
            `).join('')}
          </div>

          <div class="mt-4 pt-3.5 border-t border-zinc-800 border-dashed">
            <div class="bg-black/55 p-3.5 rounded-lg border-l-2 font-medium italic relative" style="${getStyleForField('bio', 'signatureQuote', 'block')}; border-color: ${colors.primary}">
              ${getSvgIcon('quote')}
              <p class="text-[9px] leading-relaxed text-zinc-150">
                "${bioData.signatureQuote}"
              </p>
            </div>
          </div>
        </div>

      </div>
    `;
  }

  // Promo Course Flyer Representation
  else if (currentPage === 'promo') {
    innerBodyHtml = `
      <div class="relative w-full h-full p-8 flex flex-col justify-between overflow-hidden text-white bg-zinc-950">
        
        <div class="bg-zinc-90 w-full border border-zinc-800 rounded-lg p-2.5 flex items-center justify-between">
          <span class="text-[8px] uppercase tracking-widest font-black text-yellow-500" style="${getStyleForField('promo', 'topBadge')}">
            💎 ${promoData.topBadge}
          </span>
          <span class="text-[8px] font-mono bg-[#ccff00] text-black font-extrabold px-2 py-0.5 rounded">
            SELECTION BATCH
          </span>
        </div>

        <div class="text-center my-4">
          <h2 class="text-4xl md:text-5xl font-black leading-none tracking-tighter" style="${getStyleForField('promo', 'mainTitle', 'block')}; color: ${colors.primary}">
            ${promoData.mainTitle}
          </h2>
          <p class="text-[10px] uppercase tracking-widest font-semibold mt-1 text-zinc-400" style="${getStyleForField('promo', 'authorTag', 'block')}">
            by ${promoData.authorTag}
          </p>
        </div>

        <div class="space-y-4 my-auto">
          <div class="text-center p-1 bg-black/60 border border-zinc-800 rounded">
            <span class="text-[10px] font-mono tracking-widest uppercase text-yellow-500 font-extrabold" style="${getStyleForField('promo', 'targetExam')}">
              ${promoData.targetExam}
            </span>
          </div>

          <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5">
            <span class="text-[9px] font-extrabold uppercase text-zinc-400 block border-b border-zinc-800 pb-1">
              COURSE HIGHLIGHTS & DELIVERABLES:
            </span>
            <div class="space-y-2">
              ${promoData.features.map((feat, idx) => `
                <div class="flex items-center gap-2 text-[9.5px] text-zinc-300" style="${getStyleForField('promo', `features.${idx}`, 'flex')}">
                  <span class="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                  <span>${feat}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 items-center pt-3">
          
          <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
            <span class="text-[8px] uppercase font-bold text-zinc-500 block">SPECIAL OFFER PRICE</span>
            <div class="flex items-center justify-center gap-2 mt-1">
              <span class="text-xs line-through text-zinc-500 font-bold">₹${promoData.priceBefore}</span>
              <span class="text-lg font-black text-white" style="color: ${colors.primary}">₹${promoData.priceAfter}/-</span>
            </div>
            <span class="text-[7px] text-yellow-500 mt-1 block" style="${getStyleForField('promo', 'limitedSeatsLabel', 'block')}">${promoData.limitedSeatsLabel}</span>
          </div>

          <div class="border-2 border-dashed rounded-xl p-3 text-center" style="border-color: ${colors.primary}; background-color: ${colors.primary}0a">
            <span class="text-[8px] uppercase font-mono font-bold text-zinc-400 block">COUPON CODE:</span>
            <span class="text-lg font-black tracking-widest text-white uppercase block mt-1" style="${getStyleForField('promo', 'discountCode', 'block')}">${promoData.discountCode}</span>
            <span class="text-[6.5px] text-zinc-400 tracking-wider block mt-0.5" style="${getStyleForField('promo', 'callToAction', 'block')}">${promoData.callToAction}</span>
          </div>

        </div>

        <div class="mt-4 pt-3 border-t border-zinc-900 flex justify-between items-center text-[8px] font-mono text-zinc-500">
          <span>📞 HELP: +91 7860251995</span>
          <span>🌐 WWW.LEARNINGCAPSULES.COM</span>
        </div>

      </div>
    `;
  }

  // Embed full AppState as JSON for future re-import
  const stateJson = JSON.stringify(state, null, 2);

  // Build the complete high-contrast independent single page HTML code block
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EduCover Studio - Standalone Template Export</title>
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800;900&family=Cormorant+Garamond:ital,wght@0,450;0,650;1,450&family=Fira+Code:wght@400;600&family=Inter:wght@400;500;700;900&family=JetBrains+Mono:wght@400;500;800&family=Merriweather:wght@400;700&family=Outfit:wght@400;700;900&family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Space+Grotesk:wght@600;700;800&family=Syne:wght@700;800&display=swap" rel="stylesheet">
  
  <!-- CDN Tailwind script for flawless offline styled loading -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
          }
        }
      }
    }
  </script>

  <style>
    body {
      background-color: #0c0c0e;
      color: #fafafa;
      font-family: 'Inter', sans-serif;
      margin: 0;
      padding: 0;
    }

    /* Print settings directly injected into the exported file */
    @page {
      size: A4 portrait;
      margin: 0;
    }
    @media print {
      body {
        background-color: #ffffff;
        color: #000000;
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
      .print-card {
        width: 100vw !important;
        height: 141.42vw !important; /* EXACT A4 portrait ratio (1:1.414) */
        border: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        background-color: ${colors.background} !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }
  </style>
</head>
<body class="flex flex-col items-center justify-center min-h-screen py-10 px-4">

  <!-- Interactive top notification panel that is automatically excluded from printing -->
  <div class="no-print w-full max-w-sm mb-6 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-2.5 shadow-xl text-center">
    <div class="flex items-center justify-center gap-1.5 text-amber-500">
      <span class="text-xl">🌟</span>
      <h3 class="text-xs font-black uppercase tracking-wider text-white">Standalone Exporter Active</h3>
    </div>
    <p class="text-[10px] text-zinc-400 leading-relaxed">
      This is a self-contained, high-fidelity edit copy of your magazine page template. Everything works completely offline! You may keep this file permanently or send it to colleagues.
    </p>
    <div class="pt-2 flex justify-center gap-2">
      <button onclick="window.print()" class="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow cursor-pointer hover:opacity-90">
        🖨️ Save as PDF / Print Page
      </button>
    </div>
  </div>

  <!-- Main High Resolution Standardized A4 Cover block -->
  <div 
    class="print-card relative w-full max-w-md aspect-[210/297] rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 transition-all duration-300"
    style="aspect-ratio: 210 / 297; background-color: ${colors.background}; color: ${colors.textPrimary}; ${fonts.bodyStyle}"
  >
    <!-- Background accents template styling -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      ${state.currentTheme === 'neon-lime' ? `
        <div class="absolute inset-0">
          <div class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div class="absolute top-20 right-0 w-96 h-96 bg-lime-400/10 rounded-full filter blur-[120px]"></div>
        </div>
      ` : ''}

      ${state.currentTheme === 'warm-ivory' ? `
        <div class="absolute inset-0">
          <div class="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#991b1b]/5 to-transparent"></div>
          <div class="absolute inset-0 bg-[radial-gradient(#991b1b08_1px,transparent_1px)] [background-size:16px_16px]"></div>
        </div>
      ` : ''}

      ${state.currentTheme === 'midnight-space' ? `
        <div class="absolute inset-0">
          <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.15),transparent_50%)]"></div>
          <div class="absolute inset-0 bg-[linear-gradient(to_right,#0891b20a_1px,transparent_1px),linear-gradient(to_bottom,#0891b20a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>
      ` : ''}

      ${state.currentTheme === 'professional-navy' ? `
        <div class="absolute inset-0">
          <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,168,76,0.03)_0%,transparent_60%)]"></div>
          <div class="absolute inset-0" style="background-image: linear-gradient(to_right,rgba(30,58,95,0.02)_1px,transparent_1px); background-size: 32px 32px;"></div>
          <div class="absolute top-1/4 left-1/4 w-64 h-64 rounded-full border border-[#c9a84c]/10"></div>
        </div>
      ` : ''}

      ${state.currentTheme === 'sage-academy' ? `
        <div class="absolute inset-0">
          <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(45,106,79,0.04)_0%,transparent_50%)]"></div>
          <div class="absolute inset-0" style="background-image: radial-gradient(rgba(45,106,79,0.03)_1px,transparent_1px); background-size: 20px 20px;"></div>
        </div>
      ` : ''}

      ${state.currentTheme === 'burgundy-classic' ? `
        <div class="absolute inset-0">
          <div class="absolute inset-0" style="background: linear-gradient(180deg,rgba(128,0,32,0.04)_0%,transparent_40%,rgba(128,0,32,0.02)_100%);"></div>
          <div class="absolute -top-10 -right-10 w-72 h-72 rounded-full border border-[#800020]/10"></div>
          <div class="absolute -bottom-10 -left-10 w-72 h-72 rounded-full border border-[#800020]/8"></div>
        </div>
      ` : ''}

      ${state.currentTheme === 'steel-professional' ? `
        <div class="absolute inset-0">
          <div class="absolute inset-0" style="background-image: linear-gradient(to_right,rgba(70,130,180,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(70,130,180,0.03)_1px,transparent_1px); background-size: 20px 20px;"></div>
          <div class="absolute top-0 right-0 w-96 h-96 bg-[#4682b4]/5 rounded-full" style="filter: blur(100px);"></div>
        </div>
      ` : ''}

      ${state.currentTheme === 'charcoal-amber' ? `
        <div class="absolute inset-0">
          <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,140,0,0.04)_0%,transparent_60%)]"></div>
          <div class="absolute inset-0" style="background-image: linear-gradient(45deg,rgba(51,65,85,0.04)_1px,transparent_1px); background-size: 24px 24px;"></div>
        </div>
      ` : ''}

      ${state.currentTheme === 'ocean-clarity' ? `
        <div class="absolute inset-0">
          <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,109,119,0.03)_0%,transparent_50%)]"></div>
          <div class="absolute inset-0" style="background-image: linear-gradient(to_right,rgba(131,197,190,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(131,197,190,0.04)_1px,transparent_1px); background-size: 28px 28px;"></div>
        </div>
      ` : ''}
    </div>

    <!-- Page Content injection -->
    ${innerBodyHtml}

  </div>

  <div class="no-print mt-6 text-center">
    <p class="text-[9px] text-zinc-500 font-mono">
      EDU-COVER STUDIO • BUILT AND COMPILED BY DEEPMIND ANTIGRAVITY ENGINE
    </p>
  </div>

  <!-- Embedded state data for re-import -->
  <script id="educover-state-data" type="application/json">
${stateJson}
  </script>

</body>
</html>`;
}
