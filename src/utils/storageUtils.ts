import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/ui/use-toast";
import { EXTERNAL_UPLOAD_PATTERNS } from "./imageMigrationUtils";

const BUCKET_NAME = "website_images"; // Using the existing bucket
const MAX_FILE_SIZE = 400 * 1024; // 400 KB in bytes

/**
 * Compresses an image and optionally converts it to WebP format
 * @param file Original file to compress
 * @param maxSizeKB Maximum size in KB
 * @returns Compressed file as Blob
 */
export const compressImage = async (file: File, maxSizeKB = 100): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Keep aspect ratio while resizing if needed
        if (width > 1920 || height > 1080) {
          const ratio = Math.min(1920 / width, 1080 / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Start with high quality
        let quality = 0.9;
        const tryCompression = () => {
          // Convert to WebP if supported, fallback to original format
          const format = 'webp';
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Could not create blob from canvas'));
                return;
              }

              // Check if the blob size is within limits
              if (blob.size <= maxSizeKB * 1024 || quality <= 0.3) {
                // If size is good or we've reduced quality enough, return the blob
                resolve(blob);
              } else {
                // Reduce quality and try again
                quality -= 0.1;
                tryCompression();
              }
            },
            `image/${format}`,
            quality
          );
        };

        tryCompression();
      };

      img.onerror = () => {
        reject(new Error('Failed to load image for compression'));
      };
    };

    reader.onerror = () => {
      reject(new Error('Could not read the file'));
    };
  });
};

/**
 * Creates the website_images bucket in Supabase storage if it doesn't exist
 * This approach skips bucket creation and just assumes it exists/will be created
 */
const ensureBucketExists = async (): Promise<void> => {
  // Instead of trying to create the bucket (which requires admin privileges),
  // we'll just check if we can access it
  try {
    const { data, error } = await supabase.storage.from(BUCKET_NAME).list();

    if (error) {
      console.warn(`Warning: Could not access the ${BUCKET_NAME} bucket. Uploads may fail.`, error);
    } else {
      console.log(`Bucket ${BUCKET_NAME} is accessible.`);
    }
  } catch (error) {
    console.warn(`Warning: Error checking bucket ${BUCKET_NAME}:`, error);
  }
};

/**
 * Uploads an image file to Supabase storage
 * @param file The file to upload
 * @param folder Optional folder path within the bucket
 * @returns URL to the uploaded image if successful, null otherwise
 */
export const uploadImage = async (file: File, folder = "blog"): Promise<string | null> => {
  try {
    // First check if bucket is accessible
    await ensureBucketExists();

    // Compress and convert to WebP if it's an image
    let fileToUpload: File | Blob = file;
    let fileName = file.name;

    if (file.type.startsWith('image/')) {
      console.log("Compressing image before upload...");
      try {
        // Compress the image
        const compressedBlob = await compressImage(file);

        // Generate a unique filename with WebP extension
        fileName = `${uuidv4()}.webp`;

        // Convert Blob to File
        fileToUpload = new File([compressedBlob], fileName, { type: 'image/webp' });
        console.log(`Image compressed: ${file.size} -> ${compressedBlob.size} bytes`);
      } catch (compressError) {
        console.warn("Image compression failed, using original file:", compressError);
        // If compression fails, use the original file
        // Generate a unique name
        const fileExt = file.name.split('.').pop();
        fileName = `${uuidv4()}.${fileExt}`;
      }
    } else {
      // For non-image files, just generate a unique name
      const fileExt = file.name.split('.').pop();
      fileName = `${uuidv4()}.${fileExt}`;
    }

    console.log(`Uploading file to ${folder}/${fileName}`);

    // Upload the file
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(`${folder}/${fileName}`, fileToUpload, {
        cacheControl: "3600",
        upsert: true // Overwrite if file exists
      });

    if (error) {
      console.error("Error uploading image:", error);

      // Provide more specific error messages
      if (error.message.includes("does not exist")) {
        toast({
          title: "Upload failed",
          description: "Storage bucket does not exist. Please contact an administrator.",
          variant: "destructive"
        });
      } else if (error.message.includes("permission")) {
        toast({
          title: "Upload failed",
          description: "You don't have permission to upload files. Please contact an administrator.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Upload failed",
          description: error.message,
          variant: "destructive"
        });
      }
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(`${folder}/${fileName}`);

    console.log("Upload successful, URL:", publicUrl);
    return publicUrl;
  } catch (err) {
    console.error("Upload error:", err);
    toast({
      title: "Upload failed",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return null;
  }
};

/**
 * Deletes an image from Supabase storage
 * @param imageUrl The URL of the image to delete
 * @returns True if deletion was successful, false otherwise
 */
export const deleteImage = async (imageUrl: string): Promise<boolean> => {
  try {
    // Extract the path from the URL
    const urlObj = new URL(imageUrl);
    const pathParts = urlObj.pathname.split('/');
    const fileName = pathParts.slice(2).join('/'); // Remove domain and bucket part

    console.log(`Attempting to delete file: ${fileName}`);

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fileName]);

    if (error) {
      console.error("Error deleting image:", error);
      toast({
        title: "Deletion failed",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }

    console.log("File deleted successfully");
    return true;
  } catch (err) {
    console.error("Delete error:", err);
    toast({
      title: "Deletion failed",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return false;
  }
};

/**
 * Lists all images in a specific folder
 * @param folder The folder to list images from
 * @returns Array of image URLs
 */
export const listImages = async (folder = "blog"): Promise<string[]> => {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list(folder);

  if (error) {
    console.error("Error listing images:", error);
    return [];
  }

  return data
    .filter(item => !item.id.endsWith('/')) // Filter out folders
    .map(item => {
      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(`${folder}/${item.name}`);
      return publicUrl;
    });
};

/**
 * Checks if a URL is valid and accessible
 * @param url URL to check
 * @returns True if valid and accessible
 */
const isValidImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('content-type');
    return response.ok && contentType?.startsWith('image/') || false;
  } catch (error) {
    console.log(`URL validation failed for ${url}:`, error);
    return false;
  }
};

/**
 * Migrates existing images to Supabase storage with focus on External uploads
 * @param imageUrls Array of image URLs to migrate
 * @param folder Target folder in storage
 * @param progressCallback Function to report progress
 * @returns Object with success and failure counts
 */
export const migrateExistingImages = async (
  imageUrls: string[],
  folder = "website",
  progressCallback?: (progress: number) => void
): Promise<{ success: number, failed: number, urls: Record<string, string> }> => {
  const results = {
    success: 0,
    failed: 0,
    urls: {} as Record<string, string> // Maps original URLs to new Supabase URLs
  };

  // Filter out already migrated URLs or invalid URLs
  // Here we're specifically focusing on External uploads
  const filteredUrls = imageUrls.filter(url =>
    !url.includes('storage.googleapis.com') &&
    !url.includes('supabase.co') &&
    !url.endsWith('.svg') &&
    EXTERNAL_UPLOAD_PATTERNS.some(pattern => url.includes(pattern))
  );

  if (filteredUrls.length === 0) {
    return results;
  }

  // Process in batches to avoid overwhelming the network
  const batchSize = 5;
  const totalItems = filteredUrls.length;

  for (let i = 0; i < filteredUrls.length; i += batchSize) {
    const batch = filteredUrls.slice(i, i + batchSize);

    // Process batch in parallel
    const batchResults = await Promise.allSettled(
      batch.map(async (url) => {
        try {
          // Validate URL before attempting to fetch
          const isValid = await isValidImageUrl(url);
          if (!isValid) {
            throw new Error(`Invalid image URL or not accessible: ${url}`);
          }

          // Fetch the image
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Failed to fetch image (${response.status}): ${url}`);
          }

          // Get file extension from URL or content-type
          const contentType = response.headers.get('content-type') || '';
          const urlPath = new URL(url).pathname;
          let originalFilename = urlPath.split('/').pop() || 'image';

          // Some URLs might not have file extensions
          const hasExtension = originalFilename.includes('.');
          const extension = hasExtension
            ? originalFilename.split('.').pop()?.toLowerCase()
            : contentType.split('/').pop() || 'jpg';

          if (!hasExtension) {
            originalFilename = `${originalFilename}.${extension}`;
          }

          // Convert to blob
          const blob = await response.blob();

          // Create a File object
          const file = new File([blob], originalFilename, {
            type: contentType || `image/${extension}`
          });

          // Upload to Supabase using our existing function which handles compression
          const newUrl = await uploadImage(file, folder);

          if (newUrl) {
            return { originalUrl: url, newUrl };
          } else {
            throw new Error(`Failed to upload image: ${url}`);
          }
        } catch (error) {
          console.error(`Error migrating image ${url}:`, error);
          return { originalUrl: url, error };
        }
      })
    );

    // Process batch results
    batchResults.forEach((result) => {
      if (result.status === 'fulfilled' && 'newUrl' in result.value) {
        results.success++;
        results.urls[result.value.originalUrl] = result.value.newUrl;
      } else {
        results.failed++;
      }
    });

    // Report progress
    const progress = Math.min(100, Math.round(((i + batch.length) / totalItems) * 100));
    if (progressCallback) {
      progressCallback(progress);
    }

    // Small delay to avoid rate limiting
    if (i + batchSize < filteredUrls.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return results;
};
