import { ExtractedElement } from '../types';

/**
 * Parse an HTML string and extract visible/meaningful elements
 * that could be useful as design elements.
 */
export function extractElementsFromHtml(html: string): ExtractedElement[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const results: ExtractedElement[] = [];
  const seen = new Set<string>();

  // Extract inline styles from <style> tags
  const styleTags = doc.querySelectorAll('style');
  const globalCss = Array.from(styleTags).map(s => s.textContent || '').join('\n');

  // Helper to compute a CSS string for an element
  const extractCssFor = (el: Element): string => {
    const inline = el.getAttribute('style') || '';
    const cls = Array.from(el.classList);
    let cssFromClasses = '';
    cls.forEach(c => {
      const escaped = c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Find matching rules in global CSS
      const ruleMatch = globalCss.match(
        new RegExp(`\\.${escaped}\\s*\\{[^}]+\\}`, 'g')
      );
      if (ruleMatch) {
        cssFromClasses += ruleMatch.join('\n') + '\n';
      }
    });
    return [inline, cssFromClasses].filter(Boolean).join('\n');
  };

  // Check if element has meaningful visible content
  const hasVisibleContent = (el: Element): boolean => {
    if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.tagName === 'LINK') return false;
    const text = (el.textContent || '').trim();
    if (!text) return false;
    // Skip elements that are purely structural with no real text
    if (text.length < 2) return false;
    return true;
  };

  // Get a human-readable tag name
  const tagLabel = (tag: string): string => {
    const labels: Record<string, string> = {
      H1: 'Heading 1',
      H2: 'Heading 2',
      H3: 'Heading 3',
      H4: 'Heading 4',
      H5: 'Heading 5',
      H6: 'Heading 6',
      SPAN: 'Text Span',
      DIV: 'Container',
      P: 'Paragraph',
      BUTTON: 'Button',
      A: 'Link',
      IMG: 'Image',
      SVG: 'Vector Graphic',
      SECTION: 'Section',
      HEADER: 'Header',
      FOOTER: 'Footer',
      NAV: 'Navigation',
      UL: 'List',
      OL: 'Ordered List',
      LI: 'List Item',
    };
    return labels[tag] || tag.toLowerCase();
  };

  // Recursively walk the DOM and extract elements
  const walk = (node: Node, depth: number = 0) => {
    if (depth > 15) return; // Safety limit
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const el = node as Element;
    const tag = el.tagName;

    // Skip non-visual elements
    if (['SCRIPT', 'STYLE', 'LINK', 'META', 'HEAD', 'NOSCRIPT'].includes(tag)) return;

    // Generate a unique selector for this element
    const getSelector = (e: Element): string => {
      const id = e.id ? `#${e.id}` : '';
      const cls = Array.from(e.classList).filter(c => !c.startsWith('no-print') && c !== 'hidden').join('.');
      const parent = e.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter(c => c.tagName === e.tagName);
        const idx = siblings.indexOf(e) + 1;
        return `${parent.tagName.toLowerCase()} > ${tag.toLowerCase()}${id}${cls ? '.' + cls : ''}:nth-of-type(${idx})`;
      }
      return `${tag.toLowerCase()}${id}${cls ? '.' + cls : ''}`;
    };

    // Collect computed inline styles as a CSS string
    const computedStyle = extractCssFor(el);
    const outerHtml = el.outerHTML;
    const textContent = (el.textContent || '').trim().slice(0, 120);

    // Decide if this element should be extracted
    const childCount = el.children.length;
    const textLen = textContent.length;

    // Priority: elements with direct text content and reasonable complexity
    const isMeaningful =
      hasVisibleContent(el) &&
      (
        // Single text-bearing leaf elements
        childCount === 0 ||
        // Small groups with a clear heading or label
        (childCount <= 5 && textLen > 5 && textLen < 500) ||
        // Structural elements that act as cards/containers
        (childCount <= 8 && textLen > 10 && el.querySelectorAll('*').length <= 20)
      );

    if (isMeaningful) {
      const selector = getSelector(el);
      // Deduplicate by outer HTML hash
      const hash = outerHtml.slice(0, 200);
      if (!seen.has(hash)) {
        seen.add(hash);
        results.push({
          id: `extracted_${results.length}_${Date.now()}`,
          tagName: tag,
          html: outerHtml,
          css: computedStyle + '\n' + (globalCss ? `/* Global styles */\n${globalCss.slice(0, 2000)}` : ''),
          textPreview: textContent.slice(0, 100),
          selector,
        });
      }
    }

    // Recurse into children
    for (let i = 0; i < el.children.length; i++) {
      walk(el.children[i], depth + 1);
    }
  };

  // Walk the body
  const body = doc.body;
  if (body) {
    for (let i = 0; i < body.children.length; i++) {
      walk(body.children[i]);
    }
  }

  // If we found nothing meaningful, fall back to top-level body children
  if (results.length === 0 && body) {
    for (let i = 0; i < body.children.length; i++) {
      const el = body.children[i];
      const text = (el.textContent || '').trim().slice(0, 100);
      if (text) {
        results.push({
          id: `extracted_fallback_${i}_${Date.now()}`,
          tagName: el.tagName,
          html: el.outerHTML,
          css: extractCssFor(el),
          textPreview: text.slice(0, 100),
          selector: `${el.tagName.toLowerCase()}:nth-of-type(${i + 1})`,
        });
      }
    }
  }

  return results;
}

/**
 * Serialize an extracted element's HTML + CSS into a self-contained
 * mini HTML snippet that can be injected into a canvas element.
 */
export function serializeExtractedElement(el: ExtractedElement): string {
  return `<!-- Extracted: ${el.textPreview} -->\n<style>\n${el.css}\n</style>\n${el.html}`;
}

/**
 * Extract likely theme colors (background, text, primary/accent) from an HTML string.
 * Uses simple heuristics: looks at body styles, style tags, and prominent inline colors.
 */
export function extractThemeColorsFromHtml(html: string): { background: string; textPrimary: string; primary: string; name: string } {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const body = doc.body;

  // Default fallbacks
  let background = '#ffffff';
  let textPrimary = '#000000';
  let primary = '#0066cc';

  if (!body) return { background, textPrimary, primary, name: 'Imported Theme' };

  // 1. Collect all CSS text from <style> tags
  const allCss = Array.from(doc.querySelectorAll('style')).map(s => s.textContent || '').join('\n');

  // 2. Check body's inline style for background-color/color
  const bodyStyle = body.getAttribute('style') || '';
  const bgMatch = bodyStyle.match(/background(?:-color)?\s*:\s*([^;]+)/i);
  if (bgMatch) background = bgMatch[1].trim();
  const textMatch = bodyStyle.match(/color\s*:\s*([^;]+)/i);
  if (textMatch) textPrimary = textMatch[1].trim();

  // 3. Check CSS for body/HTML background-color
  const bodyBgCss = allCss.match(/body\s*\{[^}]*background(?:-color)?\s*:\s*([^;}]+)/i);
  if (bodyBgCss) background = bodyBgCss[1].trim();
  const bodyTextCss = allCss.match(/body\s*\{[^}]*color\s*:\s*([^;}]+)/i);
  if (bodyTextCss) textPrimary = bodyTextCss[1].trim();

  // 4. Extract a primary/accent color: look for the most saturated color used in the document
  const colorMap = new Map<string, number>();
  
  // Check all elements for inline styles with color or background-color
  const allElements = body.querySelectorAll('*');
  allElements.forEach(el => {
    const style = (el as HTMLElement).style;
    if (style.color && style.color !== textPrimary && style.color !== '#000' && style.color !== '#000000') {
      const c = style.color.toLowerCase();
      colorMap.set(c, (colorMap.get(c) || 0) + 1);
    }
    if (style.backgroundColor && style.backgroundColor !== 'transparent' && style.backgroundColor !== background) {
      const c = style.backgroundColor.toLowerCase();
      colorMap.set(c, (colorMap.get(c) || 0) + 2);
    }
  });

  // Also look at class-based CSS for color usage
  const colorProps = allCss.matchAll(/(?:color|background(?:-color)?)\s*:\s*([^;{}]+)/gi);
  for (const match of colorProps) {
    const c = match[1].trim().toLowerCase();
    if (c !== textPrimary && c !== background && c !== '#fff' && c !== '#ffffff' && c !== '#000' && c !== '#000000') {
      colorMap.set(c, (colorMap.get(c) || 0) + 1);
    }
  }

  // Promote any non-grayscale color that appears frequently as the primary
  let bestScore = 0;
  colorMap.forEach((count, color) => {
    // Skip grayscale colors
    if (/^(rgb\(\s*(\d+)\s*,\s*\2\s*,\s*\2\)|#[0-9a-f]{3}$|#[0-9a-f]{6}$)/i.test(color)) {
      // Could be a named gray like 'gray', 'silver', etc.
      if (['gray','grey','silver','lightgray','darkgray','gainsboro','whitesmoke'].includes(color)) return;
    }
    // Skip very dark or very light
    if (count > bestScore) {
      bestScore = count;
      primary = color;
    }
  });

  // Extract a name from the title or use default
  const title = doc.querySelector('title');
  const name = title ? `Imported: ${title.textContent?.trim().slice(0, 30) || 'Theme'}` : 'Imported Theme';

  return { background, textPrimary, primary, name };
}
