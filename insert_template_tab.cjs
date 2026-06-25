const fs = require('fs');

// ── EditorSidebar.tsx ──
const sidebarPath = 'src/components/EditorSidebar.tsx';
let sidebar = fs.readFileSync(sidebarPath, 'utf8');

const anchor = '        {/* ================= TAB 5: FREE-FORM CANVAS ELEMENTS ================= */}';
const insertion = `        {/* ================= TAB 5: TEMPLATES GALLERY ================= */}
        {activeTab === 'templates' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-1.5">
              <LayoutDashboard size={13} className={isDark ? 'text-[#ccff00]' : 'text-emerald-600'} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Pre-Built Templates</span>
              <span className="ml-auto text-[9px] font-mono text-zinc-500">{PREBUILT_TEMPLATES.length} designs</span>
            </div>

            {/* Category filter chips */}
            <div className="flex flex-wrap gap-1.5">
              {['all', ...TEMPLATE_CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setTemplateCategory(cat === 'all' ? 'all' : cat)}
                  className={\`px-2 py-1 rounded-lg text-[10px] font-mono border transition-all cursor-pointer shrink-0 \${
                    templateCategory === cat
                      ? 'border-[#ccff00] bg-[#ccff00]/10 text-[#ccff00]'
                      : isDark
                        ? 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-600'
                        : 'border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:border-slate-300'
                  }\`}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>

            {/* Template cards grid */}
            <div className="grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto pr-1">
              {PREBUILT_TEMPLATES
                .filter(t => templateCategory === 'all' || t.category === templateCategory)
                .map((tpl) => (
                  <div
                    key={tpl.id}
                    className={\`group rounded-xl border overflow-hidden transition-all duration-200 hover:scale-[1.02] cursor-pointer \${
                      isDark
                        ? 'bg-zinc-900/60 border-zinc-800 hover:border-[#ccff00]/50 hover:bg-zinc-850'
                        : 'bg-white border-slate-200 hover:border-emerald-400/50 hover:bg-slate-50'
                    }\`}
                    onClick={() => onLoadTemplate?.(tpl)}
                  >
                    {/* Template thumbnail */}
                    <div className="h-20 flex items-center justify-center overflow-hidden" style={{
                      background: tpl.previewGradient || 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
                    }}>
                      <span className="text-xl font-bold opacity-30 select-none" style={{ color: tpl.theme === 'neon-green' ? '#ccff00' : tpl.theme === 'midnight-purple' ? '#a78bfa' : tpl.theme === 'gold-navy' ? '#fbbf24' : '#fff' }}>
                        {tpl.name.split(' ').map(w => w[0]).join('').slice(0, 3)}
                      </span>
                    </div>

                    {/* Template info */}
                    <div className="p-2 space-y-1">
                      <div className="text-[10px] font-bold truncate">{tpl.name}</div>
                      <div className="text-[8px] font-mono text-zinc-500 line-clamp-2">{tpl.description}</div>
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        <span className={\`px-1.5 py-0.5 rounded text-[7px] font-mono uppercase tracking-wider \${
                          isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500'
                        }\`}>
                          {tpl.pageType}
                        </span>
                        <span className={\`px-1.5 py-0.5 rounded text-[7px] font-mono uppercase tracking-wider \${
                          isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500'
                        }\`}>
                          {tpl.theme}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="text-[8px] font-mono text-zinc-500 italic text-center pt-1">
              Templates set theme, colors, layout & decorations — you can still tweak everything after
            </div>
          </div>
        )}

`;

if (!sidebar.includes(anchor)) {
  console.log('ERROR: Could not find anchor string in EditorSidebar.tsx');
  process.exit(1);
}

// Check if templates tab already exists
if (sidebar.includes('TEMPLATES GALLERY')) {
  console.log('Templates tab already exists, skipping insertion');
} else {
  sidebar = sidebar.replace(anchor, insertion + anchor);
  fs.writeFileSync(sidebarPath, sidebar);
  console.log('EditorSidebar.tsx: Templates tab content inserted successfully');
}

// ── App.tsx ──
const appPath = 'src/App.tsx';
let app = fs.readFileSync(appPath, 'utf8');

// 1. Add Template to imports
if (!app.includes('Template,')) {
  app = app.replace(
    'ThemeId, AppState, DuplicatedElement, CanvasElement,',
    'ThemeId, AppState, DuplicatedElement, CanvasElement, Template,'
  );
  console.log('App.tsx: Added Template to imports');
}

// 2. Add PREBUILT_TEMPLATES import
if (!app.includes('PREBUILT_TEMPLATES')) {
  app = app.replace(
    "import { readBlobAsDataURL } from './utils/exporter';",
    "import { readBlobAsDataURL } from './utils/exporter';\nimport { PREBUILT_TEMPLATES } from './templates';"
  );
  console.log('App.tsx: Added PREBUILT_TEMPLATES import');
}

// 3. Add handleLoadTemplate function before return
const returnTarget = 'return (';
const returnPos = app.indexOf(returnTarget);
const firstReturnPos = app.indexOf(returnTarget, app.indexOf('handleLoadTemplate') > -1 ? 0 : 0);

if (!app.includes('handleLoadTemplate') && returnPos !== -1) {
  const handleLoadTemplate = `
  // Load a pre-built template, applying its state snapshot
  const handleLoadTemplate = useCallback((template: Template) => {
    const updates: Partial<AppState> = {
      title: template.title,
      subtitle: template.subtitle,
      currentPage: template.currentPage,
      pageType: template.pageType,
      theme: template.theme,
      backgroundDecoration: template.backgroundDecoration,
      showTeacherPhoto: template.showTeacherPhoto,
      ...(template.accent !== undefined ? { accent: template.accent } : {}),
      ...(template.glowColor !== undefined ? { glowColor: template.glowColor } : {}),
      ...(template.textShadowColor !== undefined ? { textShadowColor: template.textShadowColor } : {}),
      ...(template.gradientConfig !== undefined ? { gradientConfig: template.gradientConfig } : {}),
      ...(template.backgroundLayers !== undefined ? { backgroundLayers: template.backgroundLayers } : {}),
      ...(template.decorationColor !== undefined ? { decorationColor: template.decorationColor } : {}),
      ...(template.photoOpacity !== undefined ? { photoOpacity: template.photoOpacity } : {}),
      ...(template.photoBorderColor !== undefined ? { photoBorderColor: template.photoBorderColor } : {}),
      ...(template.photoBorderWidth !== undefined ? { photoBorderWidth: template.photoBorderWidth } : {}),
      ...(template.photoGlowColor !== undefined ? { photoGlowColor: template.photoGlowColor } : {}),
      ...(template.photoGlowIntensity !== undefined ? { photoGlowIntensity: template.photoGlowIntensity } : {}),
      ...(template.photoZoom !== undefined ? { photoZoom: template.photoZoom } : {}),
      ...(template.titleSize !== undefined ? { titleSize: template.titleSize } : {}),
      ...(template.titleFont !== undefined ? { titleFont: template.titleFont } : {}),
      ...(template.subtitleSize !== undefined ? { subtitleSize: template.subtitleSize } : {}),
      ...(template.subtitleFont !== undefined ? { subtitleFont: template.subtitleFont } : {}),
      ...(template.customColors !== undefined ? { customColors: template.customColors } : {}),
      ...(template.canvasElements !== undefined ? { canvasElements: template.canvasElements } : {}),
      ...(template.layerOrder !== undefined ? { layerOrder: template.layerOrder } : {}),
      ...(template.decorationStyle !== undefined ? { decorationStyle: template.decorationStyle } : {}),
      ...(template.textElements !== undefined ? { textElements: template.textElements } : {}),
      ...(template.photoSize !== undefined ? { photoSize: template.photoSize } : {}),
      ...(template.photoX !== undefined ? { photoX: template.photoX } : {}),
      ...(template.photoY !== undefined ? { photoY: template.photoY } : {}),
    };
    setState(prev => ({ ...prev, ...updates }));
  }, [setState]);

`;
  app = app.slice(0, returnPos) + handleLoadTemplate + app.slice(returnPos);
  console.log('App.tsx: Added handleLoadTemplate function');
} else {
  console.log('App.tsx: handleLoadTemplate already exists');
}

// 4. Pass onLoadTemplate to EditorSidebar
const sidebarCloseTag = '</EditorSidebar>';
const sidebarOpenIndex = app.indexOf('<EditorSidebar');
const sidebarCloseIndex = app.indexOf(sidebarCloseTag, sidebarOpenIndex);

if (sidebarOpenIndex !== -1 && sidebarCloseIndex !== -1) {
  const editorSidebarContent = app.slice(sidebarOpenIndex, sidebarCloseIndex + sidebarCloseTag.length);

  if (!editorSidebarContent.includes('onLoadTemplate')) {
    // Find the closing > of the opening tag
    const openingTagContent = editorSidebarContent.substring(0, editorSidebarContent.indexOf('>'));
    // Look for props, try to find the last prop before >
    const lastPropPattern = /(\w+=\{.*?\})\s*$/;
    const openingTagMatch = openingTagContent.match(lastPropPattern);

    // Simpler: just replace the /> at end of opening tag with the prop before />
    let newSidebarTag;
    if (editorSidebarContent.includes('/>')) {
      newSidebarTag = editorSidebarContent.replace(
        '/>',
        '          onLoadTemplate={handleLoadTemplate}\n        />'
      );
    } else {
      console.log('ERROR: Could not find self-closing tag pattern in EditorSidebar usage');
      process.exit(1);
    }

    app = app.slice(0, sidebarOpenIndex) + newSidebarTag + app.slice(sidebarOpenIndex + editorSidebarContent.length);
    console.log('App.tsx: Added onLoadTemplate prop to EditorSidebar');
  } else {
    console.log('App.tsx: onLoadTemplate prop already exists');
  }
} else {
  console.log('ERROR: Could not find EditorSidebar in App.tsx');
}

fs.writeFileSync(appPath, app);
console.log('App.tsx: Saved successfully');
console.log('\nAll template changes applied!');
