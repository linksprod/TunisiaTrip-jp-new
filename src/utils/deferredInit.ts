
/**
 * Non-critical initialization that can happen after FCP
 * These tasks are important but don't block initial render
 */

import { preloadImages } from './imageUtils';

// All non-critical DNS prefetches
export const addDeferredResourceHints = () => {
  const deferredDomains = [
    'fonts.googleapis.com',
    'maps.googleapis.com',
    'api.open-meteo.com'
  ];
  
  deferredDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${domain}`;
    document.head.appendChild(link);
  });
};

// Performance monitoring setup
export const setupPerformanceMonitoring = () => {
  if (!window.performance || !('mark' in window.performance)) return;
  
  performance.mark('app_init_start');
  
  if (!('PerformanceObserver' in window)) return;
  
  try {
    // LCP Observer
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', Math.round(lastEntry.startTime), 'ms');
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    
    // FCP Observer
    const fcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      console.log('FCP:', Math.round(entries[0].startTime), 'ms');
    });
    fcpObserver.observe({ type: 'paint', buffered: true });
  } catch (err) {
    console.warn('Performance monitoring setup failed:', err);
  }
};

// Global error handling
export const setupGlobalErrorHandling = () => {
  window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error || event.message);
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
  });
};

// Preload secondary images after initial load
export const preloadSecondaryAssets = () => {
  const secondaryImages = [
    "/uploads/5d66739d-6d91-48f0-99e6-f5ec39df4306.png", // JP flag
    "/uploads/44101cc8-fa72-4b3f-bd5f-aaf7b31185be.png", // Population image
    "/uploads/6cb11651-d5dc-47a3-ba8c-2b563eaa9b25.png", // Tourists image
  ];
  
  preloadImages(secondaryImages, { 
    priority: 'low',
    onComplete: () => console.log("Secondary assets preloaded")
  });
};

// Run all deferred initialization
export const runDeferredInit = () => {
  addDeferredResourceHints();
  setupPerformanceMonitoring();
  setupGlobalErrorHandling();
  
  // Delay secondary asset loading even further
  setTimeout(preloadSecondaryAssets, 2000);
};
