
/**
 * Route-based optimization utilities for better code splitting
 */

import { lazy } from 'react';

// Lazy load non-critical pages to reduce initial bundle size
export const LazyAtlantisPage = lazy(() => import('../pages/AtlantisPage'));
export const LazyMigrationPage = lazy(() => import('../pages/MigrationPage'));
export const LazyAdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage'));
export const LazyAdminBlogPage = lazy(() => import('../pages/admin/AdminBlogPage'));
export const LazyAdminTripPage = lazy(() => import('../pages/admin/AdminTripPage'));
export const LazyAdminContactsPage = lazy(() => import('../pages/admin/AdminContactsPage'));
export const LazyAdminSEOPage = lazy(() => import('../pages/admin/AdminSEOPage'));
export const LazyAdminUsersPage = lazy(() => import('../pages/admin/AdminUsersPage'));

// Preload critical routes that are likely to be visited
export const preloadCriticalRoutes = () => {
  // Preload blog page since it's likely to be visited from home
  import('../pages/BlogPage');
  import('../pages/AboutTunisiaPage');
  import('../pages/TravelInformationPage');
};

// URL structure optimization - ensure clean, SEO-friendly URLs
export const normalizeUrl = (pathname: string): string => {
  return pathname
    .toLowerCase()
    .replace(/_/g, '-') // Replace underscores with hyphens
    .replace(/\/+/g, '/') // Remove duplicate slashes
    .replace(/\/$/, '') || '/'; // Remove trailing slash except for root
};

// Convert legacy URLs to SEO-friendly format
export const convertToSeoFriendlyUrl = (url: string): string => {
  const normalizedUrl = normalizeUrl(url);
  
  // Convert specific legacy patterns
  const urlMappings: Record<string, string> = {
    '/about': '/about-tunisia',
    '/travel': '/travel-information',
    '/atlantis': '/company-information',
    '/admin/blog': '/admin/blog-management',
    '/admin/trip': '/admin/trip-management', 
    '/admin/contacts': '/admin/contact-management',
    '/admin/seo': '/admin/seo-management'
  };
  
  return urlMappings[normalizedUrl] || normalizedUrl;
};

// Route-specific optimizations
export const optimizeRouteTransition = (pathname: string) => {
  // Normalize the pathname for consistency
  const normalizedPath = normalizeUrl(pathname);
  
  // Add route-specific performance marks
  if (window.performance) {
    performance.mark(`route_${normalizedPath.replace(/[^a-zA-Z0-9]/g, '_')}_start`);
  }
  
  // Route-specific preloading based on normalized path
  switch (normalizedPath) {
    case '/':
    case '':
      // Home page - preload likely next pages
      setTimeout(preloadCriticalRoutes, 1000);
      break;
    case '/blog':
      // Blog page - preload article resources
      import('../pages/ArticlePage');
      break;
    case '/start-my-trip':
      // Start trip page - ensure clean URL structure
      break;
    case '/about-tunisia':
    case '/about':
      // About page optimization
      break;
    case '/travel-information':
    case '/travel':
      // Travel information page optimization
      break;
    case '/company-information':
    case '/atlantis':
      // Company information page optimization
      break;
  }
};
