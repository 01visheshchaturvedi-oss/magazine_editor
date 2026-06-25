const fs = require('fs');

// ── 1. Insert Templates tab content into EditorSidebar.tsx ──
let sidebar = fs.readFileSync('src/components/EditorSidebar.tsx', 'utf8');

const anchor = '        {/* ================= TAB 5: FREE-FORM CANVAS ELEMENTS ================= */}';
const templatesSection = `        {/* ================= TAB 5: TEMPLATES GALLERY ================= */}
        {activeTab === 'templates' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-1.5">
              <LayoutDashboard size={13} className={isDark ? 'text-[#ccff00]' : 'text-emerald-600'} />
              <span className={\`text-xs font-bold uppercase tracking-wider \${s.textPrimary}\`}>
                Template Gallery
              </span>
              <span className={\`text-[11px] font-mono px-1.5 py-0.5 rounded border \${isDark ? 'bg-zinc-900 border-zinc-850 text-zinc-400' : 'bg-slate-100 border-slate-200 text-slate-500'}\`}>
                {PREBUILT_TEMPLATES.length} Templates
              </span>
            </div>

            <p className={\`text-[11px] \${s.textMuted} leading-normal\`}>
              Apply a pre-designed template to instantly transform your magazine. Each template sets theme, content, decorations, and element positions.
            </p>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setTemplateCategory('all')}
                className={\`px-2 py-1 rounded text-[10px] font-mono border transition-all cursor-pointer shrink-0 \${
                  templateCategory === 'all'
                    ? isDark ? 'border-[#ccff00] bg-[#ccff00]/10 text-[#ccff00]' : 'border-emerald-600 bg-emerald-50 text-emerald-700'
                    : isDark ? 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white' : 'border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }\`}
              >
                All
              </button>
              {TEMPLATE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setTemplateCategory(cat.id)}
                  className={\`px-2 py-1 rounded text-[10px] font-mono border transition-all cursor-pointer shrink-0 \${
                    templateCategory === cat.id
                      ? isDark ? 'border-[#ccff00] bg-[#ccff00]/10 text-[#ccff00]' : 'border-emerald-600 bg-emerald-50 text-emerald-700'
                      : isDark ? 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white' : 'border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }\`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>

            {/* Template Cards */}
            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {PREBUILT_TEMPLATES
                .filter(t => templateCategory === 'all' || t.category === templateCategory)
                .map((template) => (
                  <div
                    key={template.id}
                    className={\`rounded-xl border overflow-hidden transition-all duration-200 \${
                      isDark ? 'bg-zinc-950 border-zinc-800 hover:border-zinc-700' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'
                    }\`}
                  >
                    {/* Template Preview Bar */}
                    <div className="p-3 pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={\`w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0 \${
                            isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-slate-100 border border-slate-200'
                          }\`}>
                            {template.thumbnailEmoji}
                          </div>
                          <div className="min-w-0">
                            <h4 className={\`text-xs font-bold truncate \${s.textPrimary}\`}>{template.name}</h4>
                            <p className={\`text-[10px] \${s.textMuted} leading-tight mt-0.5 line-clamp-2\`}>{template.description}</p>
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {template.tags.map((tag) => (
                          <span key={tag} className={\`text-[8px] font-mono px-1 py-0.5 rounded \${
                            isDark ? 'bg-zinc-900 text-zinc-500 border border-zinc-800' : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }\`}>
                            #{tag}
                          </span>
                        ))}
                        <span className={\`text-[8px] font-mono px-1 py-0.5 rounded \${
                          isDark ? 'bg-zinc-900 text-zinc-500 border border-zinc-800' : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }\`}>
                          {template.category}
                        </span>
                      </div>
                    </div>

                    {/* Action bar */}
                    <div className={\`px-3 py-2 flex gap-2 border-t \${isDark ? 'border-zinc-800 bg-zinc-900/50' : 'border-slate-200 bg-slate-50'}\`}>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(\`Apply "\${template.name}" template? This will replace your current design.\`)) {
                            onLoadTemplate(template);
                          }
                        }}
                        className={\`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 \${
                          isDark
                            ? 'bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30 hover:bg-[#ccff00]/20'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                        }\`}
                      >
                        <Check size={11} />
                        <span>Apply Template</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ================= TAB 6: FREE-FORM CANVAS ELEMENTS ================= */}`;

const anchorIndex = sidebar.indexOf(anchor);
if (anchorIndex === -1) {
  console.error('Anchor not found in EditorSidebar.tsx!');
  process.exit(1);
}

sidebar = sidebar.slice(0, anchorIndex) + templatesSection + sidebar.slice(anchorIndex + anchor.length);
fs.writeFileSync('src/components/EditorSidebar.tsx', sidebar);
console.log('✅ EditorSidebar.tsx updated with Templates tab');

// ── 2. Update App.tsx ──
let app = fs.readFileSync('src/App.tsx', 'utf8');

// Add Template import
const importLine = "import { PageType, ThemeId, AppState, DuplicatedElement, CanvasElement, ElementShadowConfig, GradientConfig, BackgroundLayer } from './types';";
const newImportLine = "import { PageType, ThemeId, AppState, DuplicatedElement, CanvasElement, ElementShadowConfig, GradientConfig, BackgroundLayer, Template } from './types';\nimport { PREBUILT_TEMPLATES } from './templates';";
if (app.includes(importLine)) {
  app = app.replace(importLine, newImportLine);
  console.log('✅ App.tsx imports updated');
} else {
  console.error('Import line not found in App.tsx!');
}

// Add handleLoadTemplate function before the return statement
const loadTemplateFn = `
  // Load a pre-built template
  const handleLoadTemplate = (template: Template) => {
    setState((prev) => {
      const mergedState = { ...INITIAL_STATE, ...template.state, hiddenElements: {} };
      // Apply all partial state from template
      return { ...prev, ...mergedState, currentPage: template.state.currentPage || prev.currentPage };
    });
    setActiveElement(null);
    setSelectedCanvasId(null);
  };
`;

// Insert handleLoadTemplate before the return statement
const returnMarker = '\n  return (\n    <div className={';
if (app.includes(returnMarker)) {
  app = app.replace(returnMarker, loadTemplateFn + '\n  return (\n    <div className={');
  console.log('✅ App.tsx handleLoadTemplate added');
} else {
  console.error('Return statement not found in App.tsx!');
}

// Pass onLoadTemplate to EditorSidebar
const sidebarProp = 'onUpdateAppState={handleUpdateAppState}';
const newSidebarProp = 'onUpdateAppState={handleUpdateAppState}\n           onLoadTemplate={handleLoadTemplate}';
if (app.includes(sidebarProp)) {
  app = app.replace(sidebarProp, newSidebarProp);
  console.log('✅ App.tsx onLoadTemplate prop added');
} else {
  console.error('Sidebar prop not found in App.tsx!');
}

fs.writeFileSync('src/App.tsx', app);
console.log('✅ App.tsx fully updated');
