/**
 * prerender.ts — Custom static pre-rendering script
 *
 * Runs after `vite build` and `vite build:ssr`.
 * Imports the already-compiled SSR bundle from dist/server/
 * and uses it to generate static HTML for each public route.
 *
 * Usage: npm run build:prerender
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbsolute = (p: string) => path.resolve(__dirname, p);

// --- Minimal DOM Mock for SSR (fixes Leaflet and other browser-only libs) ---
if (typeof global !== 'undefined') {
    (global as any).__isServer__ = true; // Flag for providers to detect SSR
    (global as any).window = {
        addEventListener: () => { },
        removeEventListener: () => { },
        dispatchEvent: () => { },
        location: {
            href: '',
            origin: '',
            pathname: '/',
            hostname: 'localhost',
            search: '',
            hash: ''
        },
        screen: { deviceXDPI: 96, logicalXDPI: 96 },
    };
    (global as any).self = (global as any).window;
    (global as any).screen = (global as any).window.screen;
    const mockElement = () => ({
        setAttribute: () => { },
        style: {},
        appendChild: () => { },
        getContext: () => null,
    });
    const doc: any = {
        createElement: mockElement,
        getElementsByTagName: () => [],
        createTextNode: () => ({}),
        addEventListener: () => { },
        removeEventListener: () => { },
        documentElement: { style: {} },
    };
    doc.head = mockElement();
    doc.body = mockElement();
    (global as any).document = doc;
    if (!(global as any).navigator) {
        Object.defineProperty(global, 'navigator', {
            value: { userAgent: 'node.js' },
            configurable: true,
            writable: true
        });
    }
    const storageMock = () => ({
        getItem: () => null,
        setItem: () => { },
        removeItem: () => { },
        clear: () => { },
    });
    (global as any).localStorage = storageMock();
    (global as any).sessionStorage = storageMock();
    (global as any).requestAnimationFrame = (callback: any) => setTimeout(callback, 0);
    (global as any).cancelAnimationFrame = (id: any) => clearTimeout(id);
}
import { createClient } from '@supabase/supabase-js';

// --- Supabase Config (Read from .env) ---
const envPath = toAbsolute('.env');
const envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf-8') : '';
const env: Record<string, string> = {};
envContent.split('\n').forEach(line => {
    const [key, ...rest] = line.split('=');
    if (key && rest.length) env[key.trim()] = rest.join('=').trim().replace(/^["']|["']$/g, '');
});

const SUPABASE_URL = env['VITE_SUPABASE_URL'];
const SUPABASE_KEY = env['VITE_SUPABASE_PUBLISHABLE_KEY'];
const supabase = (SUPABASE_URL && SUPABASE_KEY) ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// Public static routes
const STATIC_ROUTES = [
    '/',
    '/about-tunisia',
    '/travel-information',
    '/blog',
    '/company-information',
    '/start-my-trip',
];

async function prerender() {
    console.log('\n🚀 Starting pre-render...\n');

    // 1. Fetch Dynamic Blog Slugs
    let dynamicRoutes: string[] = [];
    const blogArticles: any[] = [];

    if (supabase) {
        console.log('  📡 Fetching blog articles from Supabase...');
        const { data, error } = await supabase
            .from('blog_articles')
            .select('*')
            .eq('status', 'published')
            .eq('language', 'JP'); // Only JP for SEO pre-rendering

        if (error) {
            console.error('  ❌ Failed to fetch articles:', error.message);
        } else if (data) {
            data.forEach(article => {
                const slug = article.slug || article.id;
                dynamicRoutes.push(`/blog/${slug}`);
                blogArticles.push(article);
            });
            console.log(`  ✅ Found ${data.length} dynamic articles.`);
        }
    } else {
        console.log('  ⚠️ Supabase config missing, skipping dynamic routes.');
    }

    const allRoutes = [...STATIC_ROUTES, ...dynamicRoutes];
    const sitemapUrls: string[] = [];

    // Read the built index.html as our template
    const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8');

    // Import from the Vite-compiled SSR bundle
    const { render } = await import('./dist/server/entry-server.js');

    for (const url of allRoutes) {
        console.log(`  📄 Rendering: ${url}`);

        try {
            // Inject Article Data into Global Scope for ArticlePage.tsx
            const articleData = blogArticles.find(a => `/blog/${a.slug || a.id}` === url);
            if (articleData) {
                (global as any).__SSR_DATA__ = articleData;
            } else {
                delete (global as any).__SSR_DATA__;
            }

            const { html: appHtml, helmetContext } = render(url);

            // Extract SEO tags
            const helmet = (helmetContext as any).helmet;
            const headTags = helmet
                ? [
                    helmet.title?.toString() || '',
                    helmet.meta?.toString() || '',
                    helmet.link?.toString() || '',
                    helmet.script?.toString() || '',
                ].filter(Boolean).join('\n    ')
                : '';

            let finalHtml = template.replace('<!--app-head-->', headTags);

            if (finalHtml.includes('<div id="root"></div>')) {
                finalHtml = finalHtml.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
            } else {
                finalHtml = finalHtml.replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${appHtml}</div>`);
            }

            const outputDir = url === '/'
                ? toAbsolute('dist')
                : toAbsolute(`dist${url}`);

            fs.mkdirSync(outputDir, { recursive: true });
            fs.writeFileSync(path.join(outputDir, 'index.html'), finalHtml);

            sitemapUrls.push(`https://tunisiatrip.jp${url === '/' ? '' : url}`);
            console.log(`  ✅ Written: dist${url === '/' ? '' : url}/index.html`);
        } catch (err) {
            console.error(`  ❌ Failed to render ${url}:`, err);
        }
    }

    // 2. Generate Sitemap
    console.log('\n  🗺️ Generating dist/sitemap.xml...');
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
  </url>`).join('\n')}
</urlset>`;
    fs.writeFileSync(toAbsolute('dist/sitemap.xml'), sitemap);
    console.log('  ✅ Written: dist/sitemap.xml');

    console.log('\n✨ Pre-rendering complete!\n');
}

prerender().catch(console.error);
