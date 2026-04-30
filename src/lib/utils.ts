
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the appropriate font class based on content type
 * @param type The type of content (heading, body, etc.)
 * @returns The appropriate Tailwind font class
 */
/**
 * Generate SEO-friendly slug from text, handling Japanese characters
 * @param text The text to convert to a slug
 * @returns SEO-friendly slug
 */
export async function generateSEOSlug(text: string): Promise<string> {
  try {
    // Check if text contains Japanese characters
    const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text);
    
    if (hasJapanese) {
      const Kuroshiro = (await import('kuroshiro')).default;
      const KuromojiAnalyzer = (await import('kuroshiro-analyzer-kuromoji')).default;
      
      // Initialize analyzer with dictionary path via CDN so it works in the browser
      const analyzer = new KuromojiAnalyzer({
        dictPath: 'https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict/'
      });
      const kuroshiro = new Kuroshiro();
      await kuroshiro.init(analyzer);
      
      // Convert Japanese to romaji (Hepburn), keep spaces which will be hyphenated later
      const romanized = await kuroshiro.convert(text, { to: 'romaji', mode: 'spaced', romajiSystem: 'hepburn' });
      // Remove diacritics (e.g., ō -> o) to keep URL ASCII-only
      text = romanized
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '');
    }
    
    // Generate slug from the (possibly romanized) text
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf-]/g, '') // Remove special characters but keep Japanese
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/-+/g, '-')      // Replace multiple hyphens with single
      .replace(/^-|-$/g, '');   // Remove leading/trailing hyphens
  } catch (error) {
    console.warn('Error generating SEO slug, falling back to basic generation:', error);
    // Fallback to basic slug generation, preserving Japanese characters
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
}

/**
 * Basic slug generation for immediate use (synchronous)
 * @param text The text to convert to a slug
 * @returns Basic slug
 */
export function generateBasicSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getFontClass(type: 'heading' | 'subheading' | 'body' | 'caption' = 'body'): string {
  switch (type) {
    case 'heading':
      return 'font-inter font-bold';
    case 'subheading':
      return 'font-montserrat font-semibold';
    case 'body':
      return 'font-inter';
    case 'caption':
      return 'font-inter text-sm';
    default:
      return 'font-inter';
  }
}
