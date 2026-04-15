import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Search,
  Grid3X3,
  List,
  Trash2,
  Download,
  Eye,
  Copy,
  Filter,
  Image as ImageIcon,
  File
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { TranslateText } from "@/components/translation/TranslateText";

interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'video' | 'audio';
  size: number;
  uploadDate: string;
  dimensions?: { width: number; height: number };
}

interface MediaLibraryProps {
  onSelectFile?: (file: MediaFile) => void;
  mode?: 'library' | 'picker';
  allowedTypes?: string[];
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({
  onSelectFile,
  mode = 'library',
  allowedTypes = ['image', 'document', 'video', 'audio']
}) => {
  const { currentLanguage, t } = useTranslation();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  // Mock data - replace with real data fetching
  const [mediaFiles] = useState<MediaFile[]>([
    {
      id: '1',
      name: 'tunisia-landscape.jpg',
      url: '/uploads/tunisia-landscape.jpg',
      type: 'image',
      size: 2547692,
      uploadDate: '2024-01-15T10:30:00Z',
      dimensions: { width: 1920, height: 1080 }
    },
    {
      id: '2',
      name: 'blog-hero.png',
      url: '/uploads/blog-hero.png',
      type: 'image',
      size: 1234567,
      uploadDate: '2024-01-14T15:45:00Z',
      dimensions: { width: 1200, height: 800 }
    },
    {
      id: '3',
      name: 'travel-guide.pdf',
      url: '/uploads/travel-guide.pdf',
      type: 'document',
      size: 5678901,
      uploadDate: '2024-01-13T09:15:00Z'
    }
  ]);

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || file.type === typeFilter;
    const matchesAllowed = allowedTypes.includes(file.type);
    return matchesSearch && matchesType && matchesAllowed;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return ImageIcon;
      default:
        return File;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'image':
        return 'bg-blue-100 text-blue-800';
      case 'document':
        return 'bg-green-100 text-green-800';
      case 'video':
        return 'bg-purple-100 text-purple-800';
      case 'audio':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFileSelect = (file: MediaFile) => {
    if (mode === 'picker' && onSelectFile) {
      onSelectFile(file);
    } else {
      // Toggle selection for library mode
      const newSelection = new Set(selectedFiles);
      if (newSelection.has(file.id)) {
        newSelection.delete(file.id);
      } else {
        newSelection.add(file.id);
      }
      setSelectedFiles(newSelection);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    // Could add toast notification here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            <TranslateText text="Media Library" language={currentLanguage} />
          </h2>
          <p className="text-muted-foreground">
            <TranslateText text="Manage your uploaded files and media assets" language={currentLanguage} />
          </p>
        </div>
        <Button className="w-fit">
          <Upload className="h-4 w-4 mr-2" />
          {t("Upload Files")}
        </Button>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("Search files...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[130px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder={t("Type")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("All Types")}</SelectItem>
              <SelectItem value="image">{t("Images")}</SelectItem>
              <SelectItem value="document">{t("Documents")}</SelectItem>
              <SelectItem value="video">{t("Videos")}</SelectItem>
              <SelectItem value="audio">{t("Audio")}</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex rounded-md border">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
              title={t("Grid View")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
              title={t("List View")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* File Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredFiles.map((file) => {
            const IconComponent = getFileIcon(file.type);
            const isSelected = selectedFiles.has(file.id);

            return (
              <Card
                key={file.id}
                className={cn(
                  "group cursor-pointer transition-all hover:shadow-md",
                  isSelected && "ring-2 ring-primary",
                  mode === 'picker' && "hover:scale-105"
                )}
                onClick={() => handleFileSelect(file)}
              >
                <CardContent className="p-3">
                  <div className="aspect-square mb-3 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                    {file.type === 'image' ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={cn("flex flex-col items-center justify-center", file.type === 'image' && "hidden")}>
                      <IconComponent className="h-8 w-8 text-muted-foreground mb-2" />
                      <Badge className={cn("text-xs", getTypeColor(file.type))}>
                        {t(file.type.charAt(0).toUpperCase() + file.type.slice(1))}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium truncate" title={file.name}>
                      {file.name}
                    </h4>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatFileSize(file.size)}</span>
                      {file.dimensions && (
                        <span>{file.dimensions.width}×{file.dimensions.height}</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(file.uploadDate)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyUrl(file.url);
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:text-destructive">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="space-y-0">
              {filteredFiles.map((file, index) => {
                const IconComponent = getFileIcon(file.type);
                const isSelected = selectedFiles.has(file.id);

                return (
                  <div
                    key={file.id}
                    className={cn(
                      "flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer transition-colors",
                      index !== 0 && "border-t",
                      isSelected && "bg-primary/5"
                    )}
                    onClick={() => handleFileSelect(file)}
                  >
                    <div className="flex-shrink-0">
                      {file.type === 'image' ? (
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                          <IconComponent className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{file.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <Badge className={cn("text-xs", getTypeColor(file.type))}>
                          {t(file.type.charAt(0).toUpperCase() + file.type.slice(1))}
                        </Badge>
                        <span>{formatFileSize(file.size)}</span>
                        {file.dimensions && (
                          <span>{file.dimensions.width}×{file.dimensions.height}</span>
                        )}
                        <span>{formatDate(file.uploadDate)}</span>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyUrl(file.url);
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selection Summary */}
      {selectedFiles.size > 0 && mode === 'library' && (
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <span className="text-sm font-medium">
            {selectedFiles.size} {selectedFiles.size !== 1 ? t("files selected") : t("file selected")}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              {t("Download")}
            </Button>
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              {t("Delete")}
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredFiles.length === 0 && (
        <Card className="p-12 text-center">
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">{t("No files found")}</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm || typeFilter !== "all"
              ? t("Try adjusting your search or filter criteria")
              : t("Upload your first file to get started")
            }
          </p>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            {t("Upload Files")}
          </Button>
        </Card>
      )}
    </div>
  );
};