import React, { Suspense } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TranslationProvider } from './components/translation/TranslationProvider';
import { PageSEO } from './components/common/PageSEO';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import AboutTunisiaPage from './pages/AboutTunisiaPage';
import TravelInformationPage from './pages/TravelInformationPage';
import BlogPage from './pages/BlogPage';
import AtlantisPage from './pages/AtlantisPage';
import { StartMyTripNewPage } from './pages/StartMyTripNewPage';
import NotFoundPage from './pages/NotFoundPage';
import ArticlePage from './pages/ArticlePage';

interface RenderResult {
    html: string;
    helmetContext: Record<string, unknown>;
}

// Route -> Component map for pre-rendering
const ROUTES: Record<string, React.ComponentType> = {
    '/': HomePage,
    '/about-tunisia': AboutTunisiaPage,
    '/travel-information': TravelInformationPage,
    '/blog': BlogPage,
    '/company-information': AtlantisPage,
    '/start-my-trip': StartMyTripNewPage,
};

export function render(url: string): RenderResult {
    const helmetContext: Record<string, unknown> = {};
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: 0, staleTime: Infinity } },
    });

    let PageComponent = ROUTES[url];

    // Handle dynamic blog routes
    if (!PageComponent && url.startsWith('/blog/')) {
        PageComponent = ArticlePage;
        const slug = decodeURIComponent(url.split('/blog/')[1]);
        (global as any).__SSR_SLUG__ = slug;
    } else {
        delete (global as any).__SSR_SLUG__;
    }

    if (!PageComponent) {
        throw new Error(`No component found for route: ${url}`);
    }

    try {
        const html = renderToString(
            <HelmetProvider context={helmetContext}>
                <QueryClientProvider client={queryClient}>
                    <StaticRouter location={url}>
                        <Suspense fallback="">
                            <AuthProvider>
                                <Suspense fallback="">
                                    <TranslationProvider>
                                        <Suspense fallback="">
                                            <PageComponent />
                                        </Suspense>
                                    </TranslationProvider>
                                </Suspense>
                            </AuthProvider>
                        </Suspense>
                    </StaticRouter>
                </QueryClientProvider>
            </HelmetProvider>
        );
        return { html, helmetContext };
    } catch (error: any) {
        console.error(`SSR Error for ${url}:`, error);
        return {
            html: `<!-- SSR Error for ${url}: ${error.message} -->`,
            helmetContext
        };
    }
}
