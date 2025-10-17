/*
  Runtime DOM translator for simple exact-match string replacements.
  - Applies Punjabi (pa) or English (en) by swapping visible text content
  - Stores originals in data-i18n-original so we can revert
  - Marks changed nodes with data-i18n-applied="pa"
*/

type Lang = 'en' | 'pa';

let enMap: Record<string, string> = {};
let paMap: Record<string, string> = {};

function normalizeKey(s: string): string {
  return (s || '')
    .replace(/\s+/g, ' ')
    .trim();
}

function loadMaps() {
  // Import JSON files directly
  try {
    enMap = {
      "Home": "Home",
      "Problem & Impact": "Problem & Impact",
      "Soil Guidance": "Soil Guidance",
      "Weather Alerts": "Weather Alerts",
      "Pest Detection": "Pest Detection",
      "Market Prices": "Market Prices",
      "Voice Chatbot": "Voice Chatbot",
      "Feedback": "Feedback",
      "AgroSetu": "AgroSetu",
      "Smart Crop Advisory": "Smart Crop Advisory",
      "for Small Farmers": "for Small Farmers",
      "AI-powered, localized, and multilingual solutions for sustainable farming.": "AI-powered, localized, and multilingual solutions for sustainable farming.",
      "Empowering farmers with smart technology for better crop yields.": "Empowering farmers with smart technology for better crop yields.",
      "Get the App": "Get the App",
      "Watch Demo": "Watch Demo",
      "Farmers Helped": "Farmers Helped",
      "Accuracy Rate": "Accuracy Rate",
      "Crop Types": "Crop Types",
      "AI Support": "AI Support",
      "Comprehensive Farming Solutions": "Comprehensive Farming Solutions",
      "Ready to Transform Your Farming?": "Ready to Transform Your Farming?",
      "Download Now": "Download Now",
      "Learn More": "Learn More",
      "Scan QR for app experience": "Scan QR for app experience",
      "Sign In": "Sign In",
      "My Account": "My Account",
      "Sign Out": "Sign Out"
    };
    
    paMap = {
      "Home": "ਘਰ",
      "Problem & Impact": "ਸਮੱਸਿਆ ਅਤੇ ਪ੍ਰਭਾਵ",
      "Soil Guidance": "ਮਿੱਟੀ ਮਾਰਗਦਰਸ਼ਨ",
      "Weather Alerts": "ਮੌਸਮ ਚੇਤਾਵਨੀਆਂ",
      "Pest Detection": "ਕੀਟ ਪਛਾਣ",
      "Market Prices": "ਬਾਜ਼ਾਰ ਭਾਅ",
      "Voice Chatbot": "ਆਵਾਜ਼ ਚੈਟਬਾਟ",
      "Feedback": "ਫੀਡਬੈਕ",
      "AgroSetu": "ਐਗਰੋਸੇਟੂ",
      "Smart Crop Advisory": "ਸਮਾਰਟ ਫਸਲ ਸਲਾਹਕਾਰ",
      "for Small Farmers": "ਛੋਟੇ ਕਿਸਾਨਾਂ ਲਈ",
      "AI-powered, localized, and multilingual solutions for sustainable farming.": "ਟਿਕਾਊ ਖੇਤੀ ਲਈ ਏਆਈ-ਚਲਿਤ, ਸਥਾਨਕ ਅਤੇ ਬਹੁਭਾਸ਼ੀ ਹਲ।",
      "Empowering farmers with smart technology for better crop yields.": "ਵਧੀਆ ਪੈਦਾਵਾਰ ਲਈ ਸਮਾਰਟ ਤਕਨਾਲੋਜੀ ਨਾਲ ਕਿਸਾਨਾਂ ਨੂੰ ਸਮਰੱਥ ਬਣਾਉਣਾ।",
      "Get the App": "ਐਪ ਪ੍ਰਾਪਤ ਕਰੋ",
      "Watch Demo": "ਡੈਮੋ ਦੇਖੋ",
      "Farmers Helped": "ਸਹਾਇਤਾ ਪ੍ਰਾਪਤ ਕਿਸਾਨ",
      "Accuracy Rate": "ਸ਼ੁੱਧਤਾ ਦਰ",
      "Crop Types": "ਫਸਲਾਂ ਦੀਆਂ ਕਿਸਮਾਂ",
      "AI Support": "ਏਆਈ ਸਹਿਯੋਗ",
      "Comprehensive Farming Solutions": "ਵਿਸਤ੍ਰਿਤ ਖੇਤੀ ਹਲ",
      "Ready to Transform Your Farming?": "ਕੀ ਤੁਸੀਂ ਆਪਣੀ ਖੇਤੀ ਬਦਲਣ ਲਈ ਤਿਆਰ ਹੋ?",
      "Download Now": "ਹੁਣੇ ਡਾਊਨਲੋਡ ਕਰੋ",
      "Learn More": "ਹੋਰ ਜਾਣੋ",
      "Scan QR for app experience": "ਐਪ ਅਨੁਭਵ ਲਈ ਕਿਊਆਰ ਸਕੈਨ ਕਰੋ",
      "Sign In": "ਸਾਈਨ ਇਨ",
      "My Account": "ਮੇਰਾ ਖਾਤਾ",
      "Sign Out": "ਸਾਈਨ ਆਉਟ"
    };
  } catch {
    enMap = {};
    paMap = {};
  }
}

loadMaps();

const TEXT_ATTRS = ['aria-label', 'title', 'alt', 'placeholder'];

function isVisible(node: Element): boolean {
  const style = window.getComputedStyle(node as Element);
  return style && style.display !== 'none' && style.visibility !== 'hidden';
}

function traverse(node: Node, applyTo: 'text' | 'attrs' | 'both', replacer: (s: string) => string) {
  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as HTMLElement;
    if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return;
    if (!isVisible(el)) return;
    if (applyTo !== 'text') {
      for (const attr of TEXT_ATTRS) {
        if (el.hasAttribute(attr)) {
          const key = el.getAttribute(attr)!;
          const orig = el.getAttribute('data-i18n-original-' + attr) ?? key;
          if (!el.hasAttribute('data-i18n-original-' + attr)) {
            el.setAttribute('data-i18n-original-' + attr, key);
          }
          const next = replacer(orig);
          if (next !== orig) {
            el.setAttribute(attr, next);
            el.setAttribute('data-i18n-applied', 'pa');
          }
        }
      }
    }
    for (const child of Array.from(el.childNodes)) traverse(child, applyTo, replacer);
  } else if (node.nodeType === Node.TEXT_NODE && applyTo !== 'attrs') {
    const text = node.nodeValue ?? '';
    const parent = node.parentElement;
    if (!parent || !isVisible(parent)) return;
    const orig = (parent.getAttribute('data-i18n-original-text') ?? text);
    if (!parent.hasAttribute('data-i18n-original-text')) parent.setAttribute('data-i18n-original-text', text);
    const next = replacer(orig);
    if (next !== orig) {
      node.nodeValue = next;
      parent.setAttribute('data-i18n-applied', 'pa');
    }
  }
}

function replaceWithMap(map: Record<string, string>) {
  const replacer = (s: string) => {
    const key = normalizeKey(s);
    const next = map[key];
    if (next == null && key) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn('[i18n] Missing translation for:', key);
      }
    }
    return next ?? s;
  };
  traverse(document.body, 'both', replacer);
}

function restoreOriginal() {
  const all = document.querySelectorAll('[data-i18n-applied]');
  all.forEach((el) => {
    const element = el as HTMLElement;
    const origText = element.getAttribute('data-i18n-original-text');
    if (origText != null) {
      // Replace all text nodes within element to original if they match the current content lengthwise
      for (const n of Array.from(element.childNodes)) {
        if (n.nodeType === Node.TEXT_NODE) {
          n.nodeValue = origText;
        }
      }
    }
    for (const attr of TEXT_ATTRS) {
      const origAttr = element.getAttribute('data-i18n-original-' + attr);
      if (origAttr != null) element.setAttribute(attr, origAttr);
    }
    element.removeAttribute('data-i18n-applied');
  });
}

export function applyLanguage(lang: Lang) {
  if (typeof window === 'undefined') return;
  if (!enMap || !paMap) loadMaps();
  
  console.log('[i18n] Applying language:', lang);
  
  if (lang === 'en') {
    restoreOriginal();
    console.log('[i18n] Restored to English');
    return;
  }
  // Start from clean English before applying pa
  restoreOriginal();
  replaceWithMap(paMap);
  console.log('[i18n] Applied Punjabi translations');
}


