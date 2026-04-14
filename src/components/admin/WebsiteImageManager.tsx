
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, UploadCloud, RefreshCw, Image as ImageIcon, X } from "lucide-react";
import { useStorage } from "@/hooks/use-storage";
import { toast } from "@/components/ui/use-toast";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { scanPagesForExternalImages } from "@/utils/imageMigrationUtils";

// Helper type for the image grid
interface ImageItem {
  url: string;
  name: string;
  isDeleting: boolean;
}



const WebsiteImageManager: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("website");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState(0);
  const [externalImages, setExternalImages] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    uploadImage,
    deleteImage,
    listImages,
    migrateImages,
    isUploading: isStorageUploading,
    isLoading: isStorageLoading,
    isMigrating: isStorageMigrating
  } = useStorage();

  // Fetch images when the folder changes
  useEffect(() => {
    loadImages();
  }, [selectedFolder]);

  // Load images from Supabase
  const loadImages = async () => {
    setIsLoading(true);
    try {
      const urls = await listImages(selectedFolder);
      const newImages = urls.map(url => ({
        url,
        name: url.split('/').pop() || '',
        isDeleting: false
      }));
      setImages(newImages);
    } catch (error) {
      console.error("Error loading images:", error);
      toast({
        title: "Error loading images",
        description: "Failed to load images from storage",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(file => uploadImage(file, selectedFolder));
      const results = await Promise.all(uploadPromises);

      const successCount = results.filter(Boolean).length;
      const failCount = results.length - successCount;

      if (successCount > 0) {
        toast({
          title: "Upload successful",
          description: `${successCount} image(s) uploaded successfully${failCount > 0 ? `, ${failCount} failed` : ''}`,
        });
        loadImages(); // Refresh the image list
      } else {
        toast({
          title: "Upload failed",
          description: "No images were uploaded successfully",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      toast({
        title: "Upload failed",
        description: "An unexpected error occurred during upload",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      // Reset the input to allow uploading the same files again
      e.target.value = '';
    }
  };

  // Handle image deletion
  const confirmDeleteImage = (url: string) => {
    setImageToDelete(url);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteImage = async () => {
    if (!imageToDelete) return;

    const imageIndex = images.findIndex(img => img.url === imageToDelete);
    if (imageIndex === -1) return;

    // Mark the image as deleting
    setImages(prev => prev.map((img, idx) =>
      idx === imageIndex ? { ...img, isDeleting: true } : img
    ));

    try {
      const success = await deleteImage(imageToDelete);
      if (success) {
        setImages(prev => prev.filter(img => img.url !== imageToDelete));
        toast({
          title: "Image deleted",
          description: "Image has been deleted successfully",
        });
      }
    } catch (error) {
      // Reset the deleting state on error
      setImages(prev => prev.map((img, idx) =>
        idx === imageIndex ? { ...img, isDeleting: false } : img
      ));

      toast({
        title: "Deletion failed",
        description: "Failed to delete image",
        variant: "destructive"
      });
    } finally {
      setDeleteConfirmOpen(false);
      setImageToDelete(null);
    }
  };

  // Scan the site specifically for External uploads
  const scanWebsiteForExternalUploads = async () => {
    try {
      setIsMigrating(true);
      setMigrationProgress(0);
      toast({
        title: "Scanning website",
        description: "Looking for External upload images across the website...",
      });

      // Get HTML content from key pages to extract images
      const pagesToScan = [
        '/',
        '/about',
        '/blog',
        '/travel',
        '/admin',
        '/atlantis'
      ];

      const uniqueImages = await scanPagesForExternalImages(pagesToScan, (scanned, total) => {
        setMigrationProgress(Math.round((scanned / total) * 100));
      });

      setExternalImages(uniqueImages);

      toast({
        title: "Scan complete",
        description: `Found ${uniqueImages.length} unique External upload images`,
      });
    } catch (error) {
      console.error("Error scanning website for images:", error);
      toast({
        title: "Scan failed",
        description: "Failed to scan website for External upload images",
        variant: "destructive"
      });
    } finally {
      setIsMigrating(false);
      setMigrationProgress(100);
    }
  };

  // Migrate found External uploads to Supabase
  const handleMigrateExternalImages = async () => {
    if (externalImages.length === 0) {
      toast({
        title: "No images to migrate",
        description: "Please scan the website for External upload images first",
      });
      return;
    }

    setIsMigrating(true);
    setMigrationProgress(0);

    try {
      toast({
        title: "Starting migration",
        description: `Migrating ${externalImages.length} External images to Supabase...`,
      });

      // Start migration and track progress
      const results = await migrateImages(externalImages, selectedFolder);

      // Update progress periodically
      const progressInterval = setInterval(() => {
        setMigrationProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 1000);

      // Refresh the image list
      await loadImages();

      // Clear interval and set to 100%
      clearInterval(progressInterval);
      setMigrationProgress(100);

      toast({
        title: "Migration complete",
        description: `Successfully migrated ${results.success} images, failed: ${results.failed}`,
        variant: results.failed > 0 ? "destructive" : "default"
      });

      // Add migration mapping to console for reference
      console.log("Image URL mapping:", results.urls);
    } catch (error) {
      console.error("Error migrating images:", error);
      toast({
        title: "Migration failed",
        description: "An error occurred during migration",
        variant: "destructive"
      });
    } finally {
      setIsMigrating(false);
    }
  };

  // Filter images based on search query
  const filteredImages = images.filter(image =>
    image.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <Card className="p-6 border border-gray-200 shadow-sm">
      <div className="mb-6 flex flex-col space-y-4">
        <h2 className="text-2xl font-bold">Website Image Manager</h2>
        <p className="text-gray-600">
          Upload, manage, and migrate website images with automatic compression and WebP conversion.
          All images are compressed to max 400 KB and stored in Supabase.
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={isUploading}
            className="bg-admin-primary hover:bg-admin-accent"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <UploadCloud className="mr-2 h-4 w-4" />
                Upload Images
              </>
            )}
          </Button>

          <Input
            id="file-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileUpload}
            disabled={isUploading}
          />

          <Button
            onClick={loadImages}
            variant="outline"
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Input
            placeholder="Search images..."
            className="w-full md:w-48"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="stored" className="space-y-4">
        <TabsList>
          <TabsTrigger value="stored">Stored Images</TabsTrigger>
          <TabsTrigger value="migrate">External Migration</TabsTrigger>
        </TabsList>

        <TabsContent value="stored" className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {['website', 'blog', 'uploads', 'products'].map(folder => (
              <Button
                key={folder}
                variant={selectedFolder === folder ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFolder(folder)}
              >
                {folder}
              </Button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : filteredImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filteredImages.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square border rounded-md bg-gray-50 overflow-hidden group"
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => confirmDeleteImage(image.url)}
                      disabled={image.isDeleting}
                      className="h-8 w-8"
                    >
                      {image.isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                    {image.name}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-12 bg-gray-50 rounded-md">
              <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
              <p className="mt-2 text-gray-500">
                {searchQuery ? 'No images matching your search' : 'No images found in this folder'}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="migrate" className="space-y-4">
          <Alert>
            <AlertDescription>
              This tool helps you scan your website for images from External uploads and migrate them to Supabase storage.
              All images will be compressed to max 400KB and converted to WebP format for better performance.
            </AlertDescription>
          </Alert>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={scanWebsiteForExternalUploads}
              disabled={isMigrating}
              variant="outline"
            >
              {isMigrating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Scan for External Uploads
            </Button>

            <Button
              onClick={handleMigrateExternalImages}
              disabled={isMigrating || externalImages.length === 0}
              className="bg-admin-primary hover:bg-admin-accent"
            >
              {isMigrating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Migrating... {migrationProgress}%
                </>
              ) : (
                <>
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Migrate {externalImages.length} Images
                </>
              )}
            </Button>
          </div>

          {isMigrating && (
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${migrationProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-center mt-1">{migrationProgress}% Complete</p>
            </div>
          )}

          {externalImages.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Found External Uploads ({externalImages.length})</h3>
              <div className="max-h-60 overflow-y-auto border rounded-md p-2">
                <ul className="space-y-1 text-xs">
                  {externalImages.map((url, idx) => (
                    <li key={idx} className="truncate text-blue-600 hover:underline">
                      <a href={url} target="_blank" rel="noreferrer">{url}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Image"
        description="Are you sure you want to delete this image? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteImage}
        variant="destructive"
      />
    </Card>
  );
};

export default WebsiteImageManager;
