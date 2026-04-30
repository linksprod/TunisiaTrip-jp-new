
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TranslationProvider } from "./components/translation/TranslationProvider";
import HomePage from "./pages/HomePage";
import BlogPage from "./pages/BlogPage";
import AboutTunisiaPage from "./pages/AboutTunisiaPage";
import TravelInformationPage from "./pages/TravelInformationPage";
import ArticlePage from "./pages/ArticlePage";
import NotFoundPage from "./pages/NotFoundPage";
import StartMyTripPage from "./pages/StartMyTripPage";
import { StartMyTripNewPage } from "./pages/StartMyTripNewPage";
import AccommodationSelectionPage from "./pages/AccommodationSelectionPage";
import AirportSelectionPage from "./pages/AirportSelectionPage";
import ItineraryGenerationPage from "./pages/ItineraryGenerationPage";
import AuthPage from "./pages/AuthPage";

// Lazy load non-critical pages to reduce initial bundle size
import { 
  LazyAtlantisPage,
  LazyMigrationPage,
  LazyAdminDashboardPage,
  LazyAdminBlogPage,
  LazyAdminTripPage,
  LazyAdminContactsPage,
  LazyAdminSEOPage,
  LazyAdminUsersPage,
  optimizeRouteTransition
} from "./utils/routeOptimization";

import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminProtectedRoute } from "./components/admin/ProtectedRoute";
import { Toaster } from "./components/ui/toaster";
import { LoadingScreen } from "./components/LoadingScreen";
import { LoadingIndicator } from "./components/ui/LoadingIndicator";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { disableDevTools } from "./utils/disableDevTools";

// Optimized loading fallback component
const RouteFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingIndicator size="lg" message="Loading page..." />
  </div>
);

// Route optimization wrapper
const RouteOptimizer = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  useEffect(() => {
    optimizeRouteTransition(location.pathname);
  }, [location.pathname]);
  
  return <>{children}</>;
};

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  // Log every time the App renders to help with debugging
  console.log("App rendering at:", new Date().toISOString(), "Path:", window.location.pathname);
  
  // Disable developer tools on mount
  useEffect(() => {
    disableDevTools();
  }, []);
  
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <TranslationProvider>
              <RouteOptimizer>
                <Suspense fallback={<RouteFallback />}>
                  <Routes>
                    {/* Critical Routes - SEO-friendly URLs */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/about-tunisia" element={<AboutTunisiaPage />} />
                    <Route path="/travel-information" element={<TravelInformationPage />} />
                    <Route path="/blog/:slug" element={<ArticlePage />} />
        <Route path="/start-my-trip" element={<StartMyTripNewPage />} />
        <Route path="/start-my-trip-old" element={<StartMyTripPage />} />
                    <Route path="/accommodation-selection" element={<AccommodationSelectionPage />} />
                    <Route path="/airport-selection" element={<AirportSelectionPage />} />
                    <Route path="/itinerary-generation" element={<ItineraryGenerationPage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    
                    {/* Legacy redirects for backward compatibility */}
                    <Route path="/about" element={<AboutTunisiaPage />} />
                    <Route path="/travel" element={<TravelInformationPage />} />
                    <Route path="/blog/article/:id" element={<ArticlePage />} />
                    
                    {/* Non-Critical Routes - Lazy loaded */}
                    <Route path="/company-information" element={<LazyAtlantisPage />} />
                    <Route path="/migrate-images" element={<LazyMigrationPage />} />
                    
                    {/* Admin Routes - Lazy loaded and protected */}
                    <Route path="/admin" element={
                      <AdminProtectedRoute>
                        <LazyAdminDashboardPage />
                      </AdminProtectedRoute>
                    } />
                    <Route path="/admin/blog-management" element={
                      <AdminProtectedRoute>
                        <LazyAdminBlogPage />
                      </AdminProtectedRoute>
                    } />
                    <Route path="/admin/trip-management" element={
                      <AdminProtectedRoute>
                        <LazyAdminTripPage />
                      </AdminProtectedRoute>
                    } />
                    <Route path="/admin/contact-management" element={
                      <AdminProtectedRoute>
                        <LazyAdminContactsPage />
                      </AdminProtectedRoute>
                    } />
                    <Route path="/admin/seo-management" element={
                      <AdminProtectedRoute>
                        <LazyAdminSEOPage />
                      </AdminProtectedRoute>
                    } />
                    <Route path="/admin/users" element={
                      <AdminProtectedRoute>
                        <LazyAdminUsersPage />
                      </AdminProtectedRoute>
                    } />
                    {/* Legacy admin redirects */}
                    <Route path="/admin/blog" element={
                      <AdminProtectedRoute>
                        <LazyAdminBlogPage />
                      </AdminProtectedRoute>
                    } />
                    <Route path="/admin/trip" element={
                      <AdminProtectedRoute>
                        <LazyAdminTripPage />
                      </AdminProtectedRoute>
                    } />
                    <Route path="/admin/contacts" element={
                      <AdminProtectedRoute>
                        <LazyAdminContactsPage />
                      </AdminProtectedRoute>
                    } />
                    <Route path="/admin/seo" element={
                      <AdminProtectedRoute>
                        <LazyAdminSEOPage />
                      </AdminProtectedRoute>
                    } />
                    <Route path="/atlantis" element={<LazyAtlantisPage />} />
                    
                    {/* 404 Catch All */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
              </RouteOptimizer>
              <LoadingScreen />
              <Toaster />
              </TranslationProvider>
            </AuthProvider>
          </QueryClientProvider>
        </BrowserRouter>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
