import fs from 'fs';
import path from 'path';

// ── Update EditorSidebar.tsx: insert Templates tab content ──
const sidebarPath = 'src/components/EditorSidebar.tsx';
let sidebar = fs.readFileSync(sidebarPath, 'utf8');

const templateTabContent = `
        {/* ================= TAB 5: TEMPLATES GALLERY ================= */}
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
                  onClick={() => setTemplateFilter(cat === 'all' ? null : cat)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono border transition-all cursor-pointer shrink-0 ${
                    (cat === 'all' && !templateFilter) || templateFilter === cat
                      ? 'border-[#ccff00] bg-[#ccff00]/10 text-[#ccff00]'
                      : isDark
                        ? 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-600'
                        : 'border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>

            {/* Template cards grid */}
            <div className="grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto pr-1">
              {PREBUILT_TEMPLATES
                .filter(t => !templateFilter || t.category === templateFilter)
                .map((tpl) => (
                  <div
                    key={tpl.id}
                    className={`group rounded-xl border overflow-hidden transition-all duration-200 hover:scale-[1.02] cursor-pointer ${
                      isDark
                        ? 'bg-zinc-900/60 border-zinc-800 hover:border-[#ccff00]/50 hover:bg-zinc-850'
                        : 'bg-white border-slate-200 hover:border-emerald-400/50 hover:bg-slate-50'
                    }`}
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
                        <span className={`px-1.5 py-0.5 rounded text-[7px] font-mono uppercase tracking-wider ${
                          isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {tpl.pageType}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[7px] font-mono uppercase tracking-wider ${
                          isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500'
                        }`}>
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

// Insert TEMPLATES GALLERY section before the ELEMENTS tab
const elementsAnchor = '{/* ================= TAB 5: FREE-FORM CANVAS ELEMENTS ================= */}';
const insertPos = sidebar.indexOf(elementsAnchor);
if (insertPos !== -1) {
  sidebar = sidebar.slice(0, insertPos) + templateTabContent + sidebar.slice(insertPos);
  fs.writeFileSync(sidebarPath, sidebar);
  console.log('✅ EditorSidebar.tsx: Templates tab content inserted');
} else {
  console.log('❌ EditorSidebar.tsx: Could not find elements anchor');
  process.exit(1);
}

// ── Update EditorSidebar.tsx: add templateFilter state ──
// Insert after activeTab state line: const [activeTab, setActiveTab] = useState<string>('pages');
sidebar = fs.readFileSync(sidebarPath, 'utf8');
const stateInsertTarget = "useState<string>('pages');";
const stateInsertPos = sidebar.indexOf(stateInsertTarget);
if (stateInsertPos !== -1) {
  const suffix = sidebar.slice(stateInsertPos + stateInsertTarget.length);
  // Check if templateFilter already exists
  if (!suffix.includes('templateFilter')) {
    sidebar = sidebar.slice(0, stateInsertPos + stateInsertTarget.length) +
      `\n  const [templateFilter, setTemplateFilter] = useState<string | null>(null);` +
      suffix;
    fs.writeFileSync(sidebarPath, sidebar);
    console.log('✅ EditorSidebar.tsx: templateFilter state added');
  } else {
    console.log('ℹ️ EditorSidebar.tsx: templateFilter already exists');
  }
} else {
  console.log('❌ EditorSidebar.tsx: Could not find activeTab state');
}

// ── Update App.tsx: wire up handleLoadTemplate ──
const appPath = 'src/App.tsx';
let app = fs.readFileSync(appPath, 'utf8');

// 1. Add Template to imports
if (!app.includes('Template,')) {
  app = app.replace(
    "ThemeId, AppState, DuplicatedElement, CanvasElement,",
    "ThemeId, AppState, DuplicatedElement, CanvasElement, Template,"
  );
  console.log('✅ App.tsx: Added Template to imports');
}

// 2. Add PREBUILT_TEMPLATES import
if (!app.includes("PREBUILT_TEMPLATES")) {
  app = app.replace(
    "import { readBlobAsDataURL } from './utils/exporter';",
    "import { readBlobAsDataURL } from './utils/exporter';\nimport { PREBUILT_TEMPLATES } from './templates';"
  );
  console.log('✅ App.tsx: Added PREBUILT_TEMPLATES import');
}

// 3. Add handleLoadTemplate function before the return statement
const returnTarget = 'return (';
const returnPos = app.indexOf(returnTarget);
if (!app.includes('handleLoadTemplate') && returnPos !== -1) {
  const handleLoadTemplate = `
  // Load a pre-built template, applying its state snapshot
  const handleLoadTemplate = useCallback((template: Template) => {
    const updates: Partial<AppState> = {
      title: template.title,
      subtitle: template.subtitle,
      // ... spread all template state fields
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
  console.log('✅ App.tsx: Added handleLoadTemplate function');
}

// 4. Pass onLoadTemplate to EditorSidebar
const sidebarUsage = app.indexOf('<EditorSidebar');
if (sidebarUsage !== -1) {
  const afterSidebarOpen = app.indexOf('>', sidebarUsage);
  const sidebarClose = app.indexOf('</EditorSidebar>', sidebarUsage);
  const sidebarContent = app.slice(sidebarUsage, sidebarClose + 16);
  
  if (!sidebarContent.includes('onLoadTemplate') && afterSidebarOpen !== -1) {
    // Find the closing tag and add the prop before it
    const closingBracket = sidebarContent.lastIndexOf('/>');
    if (closingBracket !== -1) {
      const propInsertPos = sidebarUsage + closingBracket;
      app = app.slice(0, propInsertPos) + '\n          onLoadTemplate={handleLoadTemplate}' + app.slice(propInsertPos);
      console.log('✅ App.tsx: Added onLoadTemplate prop to EditorSidebar');
    } else {
      console.log('❌ App.tsx: Could not find self-closing tag for EditorSidebar');
    }
  } else {
    console.log('ℹ️ App.tsx: onLoadTemplate already exists or cannot locate');
  }
}

fs.writeFileSync(appPath, app);
console.log('✅ App.tsx: Saved');

console.log('\n🎉 All template changes applied!');
