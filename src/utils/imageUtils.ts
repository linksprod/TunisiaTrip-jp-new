
/**
 * Utility functions for image handling in the application
 */

// Set maximum concurrent image loads to prevent network congestion
const MAX_CONCURRENT_LOADS = 4;

/**
 * Interface for image source objects
 */
export interface ImageSource {
  src: string;
  type?: string;
  media?: string;
}

/**
 * Preloads an array of image URLs to ensure they're cached by the browser
 * with concurrency control to prevent network congestion
 * @param images Array of image URLs to preload
 * @param options Optional configuration including callback and priority
 * @returns Promise that resolves when all images are loaded
 */
export const preloadImages = (
  images: string[], 
  options?: { 
    onComplete?: () => void,
    priority?: 'high' | 'low' | 'auto'
  }
): Promise<void> => {
  // Use a queue to manage concurrent loads
  let activeLoads = 0;
  let imageQueue = [...images];
  let completed = 0;

  return new Promise((resolve) => {
    const loadNext = () => {
      if (imageQueue.length === 0 && activeLoads === 0) {
        if (options?.onComplete) {
          options.onComplete();
        }
        resolve();
        return;
      }
      
      while (activeLoads < MAX_CONCURRENT_LOADS && imageQueue.length > 0) {
        const src = imageQueue.shift() as string;
        activeLoads++;
        
        const img = new Image();
        if (options?.priority) {
          img.fetchPriority = options.priority;
        }
        
        img.onload = img.onerror = () => {
          activeLoads--;
          completed++;
          loadNext();
        };
        
        img.src = src;
      }
    };
    
    // Start the loading process
    loadNext();
  });
};

/**
 * Converts an image URL to WebP format if supported
 * @param imageUrl Original image URL
 * @returns WebP version of the URL if supported, otherwise original URL
 */
export const convertToWebP = (imageUrl: string): string => {
  // Skip conversion for SVGs and GIFs
  if (imageUrl.endsWith('.svg') || imageUrl.endsWith('.gif')) {
    return imageUrl;
  }
  
  // Extract the base URL without extension
  const baseUrl = imageUrl.substring(0, imageUrl.lastIndexOf('.'));
  
  // Return WebP version
  return `${baseUrl}.webp`;
};

/**
 * Preloads critical UI images required for the application
 */
export const preloadCriticalUIImages = (): void => {
  const criticalImages = [
    "/uploads/b8d3011d-f5cd-4edd-b34e-9ef0827ba186.png", // Logo
    "/uploads/5d66739d-6d91-48f0-99e6-f5ec39df4306.png", // JP flag
    "https://i.imgur.com/5YtDgG9.gif", // Loading GIF
  ];
  
  preloadImages(criticalImages, { 
    priority: 'high',
    onComplete: () => console.log("Critical UI images preloaded successfully") 
  });
};

/**
 * Sets up image optimizations for the application
 */
export const setupImageOptimizations = (): void => {
  // Add image decode policy
  document.head.appendChild(Object.assign(document.createElement('meta'), {
    name: 'image-decoding',
    content: 'async'
  }));
  
  // Set up preconnect for CDNs
  const origins = ['https://uploads.s3.amazonaws.com', 'https://i.imgur.com'];
  
  origins.forEach(origin => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });

  // Add picture element polyfill for browsers that don't support it
  if (!('HTMLPictureElement' in window)) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/picturefill@3.0.3/dist/picturefill.min.js';
    script.async = true;
    document.head.appendChild(script);
  }
  
  console.log("Image optimizations set up");
};

/**
 * Creates a properly optimized image sources set
 * @param src Base image source
 * @param sizes Size descriptors for the image
 * @returns Array of source objects for picture element
 */
export const createImageSources = (src: string, sizes?: string): ImageSource[] => {
  // Skip for SVGs and GIFs
  if (src.endsWith('.svg') || src.endsWith('.gif')) {
    return [{src}];
  }
  
  // Prepare size variations
  const baseUrl = src.substring(0, src.lastIndexOf('.'));
  const ext = src.substring(src.lastIndexOf('.'));
  
  return [
    { src: `${baseUrl}${ext}`, type: `image/${ext.substring(1)}`, media: "(min-width: 1024px)" },
    { src: `${baseUrl}.webp`, type: "image/webp", media: "(min-width: 1024px)" },
    { src: `${baseUrl}-md${ext}`, type: `image/${ext.substring(1)}`, media: "(min-width: 640px)" },
    { src: `${baseUrl}-md.webp`, type: "image/webp", media: "(min-width: 640px)" },
    { src: `${baseUrl}-sm${ext}`, type: `image/${ext.substring(1)}` },
    { src: `${baseUrl}-sm.webp`, type: "image/webp" }
  ];
};
