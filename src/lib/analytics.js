// Analytics helper for GA4

let isInitialized = false;

// Helper to check if gtag is available
const hasGtag = () => typeof window !== 'undefined' && typeof window.gtag === 'function';

/**
 * Initializes Google Analytics by dynamically injecting the gtag script
 * @param {string} measurementId - The GA4 Measurement ID (e.g. G-XXXXXXXXXX)
 */
export function initGA(measurementId) {
  if (!measurementId || typeof window === 'undefined' || isInitialized) {
    if (!measurementId && typeof window !== 'undefined' && !isInitialized) {
      console.log('[Analytics] No measurement ID provided. Operating in dry-run mode.');
    }
    return;
  }

  try {
    // Dynamic script injection
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());

    // Disable automatic page_view tracking since we trigger it manually
    window.gtag('config', measurementId, {
      send_page_view: false
    });

    isInitialized = true;
    console.log(`[Analytics] Google Analytics initialized with ID: ${measurementId}`);
  } catch (error) {
    console.error('[Analytics] Failed to initialize Google Analytics:', error);
  }
}

/**
 * Tracks a page view with active settings context
 * @param {string} pagePath - The URL path of the page (e.g., '/' or '/design')
 * @param {string} labelType - The active label type
 * @param {string} appLang - The active application language
 */
export function trackPageView(pagePath, labelType, appLang) {
  const browserLang = typeof navigator !== 'undefined' ? navigator.language : 'unknown';
  
  if (hasGtag()) {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      label_type: labelType,
      app_language: appLang,
      browser_language: browserLang
    });
  } else {
    console.log('[Analytics Dry-run] Page View:', pagePath, {
      label_type: labelType,
      app_language: appLang,
      browser_language: browserLang
    });
  }
}

/**
 * Tracks a custom event
 * @param {string} eventName - The name of the event
 * @param {object} eventParams - The parameters associated with the event
 */
export function trackEvent(eventName, eventParams) {
  if (hasGtag()) {
    window.gtag('event', eventName, eventParams);
  } else {
    console.log('[Analytics Dry-run] Event:', eventName, eventParams);
  }
}
