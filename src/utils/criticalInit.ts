
/**
 * Critical initialization that must happen before FCP
 * Only includes tasks that are absolutely necessary for initial render
 */

// Critical resource hints for immediate loading
export const addCriticalResourceHints = () => {
  // Only add the most critical preconnections
  const criticalDomains = [
    'https://fonts.gstatic.com',
    'https://i.imgur.com' // For loading GIF
  ];
  
  criticalDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Preload LCP image and other critical assets
export const preloadCriticalAssets = () => {
  const criticalAssets = [
    "/uploads/b8d3011d-f5cd-4edd-b34e-9ef0827ba186.png", // Logo - visible in viewport
    "https://i.imgur.com/5YtDgG9.gif", // Loading animation
    "/uploads/3caaa473-8150-4b29-88b4-e2e9c696bf1d.png" // LCP image - hero slideshow
  ];
  
  criticalAssets.forEach((src, index) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    link.fetchPriority = index === 2 ? 'high' : 'high'; // LCP image gets highest priority
    document.head.appendChild(link);
  });
};

// Essential window safeguards only
export const setupCriticalSafeguards = () => {
  if (typeof window !== 'undefined') {
    window.googleMapsLoaded = window.googleMapsLoaded || false;
  }
};

// Eliminate render-blocking resources
export const eliminateRenderBlocking = () => {
  // Defer non-critical CSS
  const deferredCSS = [
    // Add any non-critical CSS here if needed
  ];
  
  deferredCSS.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.media = 'print';
    link.onload = () => { link.media = 'all'; };
    document.head.appendChild(link);
  });
  
  // Optimize font loading to prevent render blocking
  const fontOptimizationStyle = document.createElement('style');
  fontOptimizationStyle.textContent = `
    @font-face {
      font-family: 'Inter';
      font-display: swap;
      src: url('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2') format('woff2');
    }
  `;
  document.head.appendChild(fontOptimizationStyle);
};
