/**
 * Shared utility patterns and functions for image migration from external sources.
 */

// Patterns specifically targeting external uploads that need migration to Supabase
export const EXTERNAL_UPLOAD_PATTERNS = [
    '/uploads/',
    'https://uploads.',
    '.externalproject.com/'
];

/**
 * Extracts image URLs from HTML content that match external upload patterns.
 * @param html The HTML string to scan
 * @returns Array of unique image URLs
 */
export const extractImagesFromHtml = (html: string): string[] => {
    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    const cssRegex = /url\(['"]?([^'"()]+)['"]?\)/g;
    const results: string[] = [];
    let match;

    // Extract from img tags
    while ((match = imgRegex.exec(html)) !== null) {
        const url = match[1];
        // Specifically look for external uploads
        if (EXTERNAL_UPLOAD_PATTERNS.some(pattern => url.includes(pattern)) &&
            !url.endsWith('.svg') &&
            !url.startsWith('data:image/svg')) {
            results.push(url);
        }
    }

    // Extract from CSS background URLs
    while ((match = cssRegex.exec(html)) !== null) {
        const url = match[1];
        if (EXTERNAL_UPLOAD_PATTERNS.some(pattern => url.includes(pattern)) &&
            !url.endsWith('.svg') &&
            !url.startsWith('data:image/svg')) {
            results.push(url);
        }
    }

    return [...new Set(results)]; // Remove duplicates
};

/**
 * Normalizes relative URLs to absolute URLs based on the current origin.
 * @param src The URL to normalize
 * @returns Absolute URL or null if invalid
 */
export const normalizeImageUrl = (src: string): string | null => {
    if (!src || src.startsWith('data:')) return null;

    // Handle relative URLs
    if (src.startsWith('/')) {
        return window.location.origin + src;
    }

    // Keep absolute URLs as is
    if (src.startsWith('http')) {
        return src;
    }

    // Handle relative URLs without leading slash
    return window.location.origin + '/' + src;
};

/**
 * Scans a list of page paths for external images.
 * @param pages Array of page paths to scan
 * @param progressCallback Optional callback for scanning progress
 * @returns Array of unique absolute image URLs
 */
export const scanPagesForExternalImages = async (
    pages: string[],
    progressCallback?: (scanned: number, total: number) => void
): Promise<string[]> => {
    const foundImages: string[] = [];

    // Scan current page first (if in browser)
    if (typeof document !== 'undefined') {
        const currentPageHtml = document.documentElement.outerHTML;
        foundImages.push(...extractImagesFromHtml(currentPageHtml));
    }

    let scannedCount = 1;
    const totalPages = pages.length;

    for (const path of pages) {
        try {
            const response = await fetch(path);
            if (!response.ok) continue;

            const html = await response.text();
            const pageImages = extractImagesFromHtml(html);
            foundImages.push(...pageImages);

            if (progressCallback) {
                progressCallback(scannedCount, totalPages);
            }
            scannedCount++;
        } catch (error) {
            console.error(`Error scanning page ${path}:`, error);
        }
    }

    // Normalize and filter
    const normalizedImages = foundImages
        .map(normalizeImageUrl)
        .filter((url): url is string => !!url)
        .filter(url =>
            EXTERNAL_UPLOAD_PATTERNS.some(pattern => url.includes(pattern)) &&
            !url.endsWith('.svg')
        );

    return [...new Set(normalizedImages)];
};
