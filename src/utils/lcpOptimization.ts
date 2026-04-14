
/**
 * LCP-specific optimizations to reduce Largest Contentful Paint
 */

export const optimizeLCPImage = () => {
  // Create high-priority preload for LCP image
  const lcpImageUrl = "/uploads/3caaa473-8150-4b29-88b4-e2e9c696bf1d.png";
  
  // Check if preload already exists
  const existingPreload = document.querySelector(`link[rel="preload"][href="${lcpImageUrl}"]`);
  if (!existingPreload) {
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = lcpImageUrl;
    preloadLink.fetchPriority = 'high';
    preloadLink.crossOrigin = 'anonymous';
    document.head.insertBefore(preloadLink, document.head.firstChild);
  }
  
  // Add resource hint for the image domain
  const imageOrigin = new URL(lcpImageUrl, window.location.origin).origin;
  const existingPreconnect = document.querySelector(`link[rel="preconnect"][href="${imageOrigin}"]`);
  if (!existingPreconnect) {
    const preconnectLink = document.createElement('link');
    preconnectLink.rel = 'preconnect';
    preconnectLink.href = imageOrigin;
    preconnectLink.crossOrigin = 'anonymous';
    document.head.appendChild(preconnectLink);
  }
};

export const setupLCPMonitoring = () => {
  if (!('PerformanceObserver' in window)) return;
  
  try {
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
        element?: Element;
        url?: string;
      };
      const lcpTime = Math.round(lastEntry.startTime);
      
      console.log(`LCP: ${lcpTime}ms`, lastEntry.element || 'Unknown element');
      
      // Track if we're meeting the 2.5s target
      if (lcpTime > 2500) {
        console.warn(`⚠️ LCP exceeded target by ${lcpTime - 2500}ms`);
      } else {
        console.log(`✅ LCP within target (${lcpTime}ms ≤ 2500ms)`);
      }
      
      // Performance mark for analytics
      if (window.performance?.mark) {
        performance.mark(`lcp-${lcpTime}`);
      }
    });
    
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    
    return () => lcpObserver.disconnect();
  } catch (err) {
    console.warn('LCP monitoring setup failed:', err);
  }
};
