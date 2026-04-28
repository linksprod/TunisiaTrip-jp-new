import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { BlogArticle } from "@/types/blog";
import {
  Edit,
  Eye,
  Trash2,
  MoreVertical,
  Copy,
  Calendar,
  Clock,
  Globe,
  Search,
  Filter,
  Grid3x3,
  List,
  Plus,
  Image as ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { TranslateText } from "@/components/translation/TranslateText";

interface EnhancedBlogPostsGridProps {
  blogPosts: BlogArticle[];
  isLoading: boolean;
  onEdit: (post: BlogArticle) => void;
  onDelete: (post: BlogArticle) => void;
  onView?: (post: BlogArticle) => void;
  onDuplicate?: (post: BlogArticle) => void;
}

export const EnhancedBlogPostsGrid: React.FC<EnhancedBlogPostsGridProps> = ({
  blogPosts,
  isLoading,
  onEdit,
  onDelete,
  onView,
  onDuplicate
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [languageFilter, setLanguageFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { toast } = useToast();
  const { currentLanguage, t } = useTranslation();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(currentLanguage === 'jp' ? 'ja-JP' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getImageUrl = (post: BlogArticle) => {
    if (post.image?.startsWith('http')) {
      return post.image;
    }
    return post.image ? `/images/blog/${post.image}` : null;
  };

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || post.status === statusFilter;
    const matchesLanguage =
      languageFilter === "all" || ((post.language || 'EN').toUpperCase() === languageFilter.toUpperCase());

    return matchesSearch && matchesStatus && matchesLanguage;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'draft':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'archived':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getLanguageFlag = (language: string) => {
    const code = (language || 'EN').toUpperCase();
    switch (code) {
      case 'EN':
        return '🇺🇸';
      case 'JP':
        return '🇯🇵';
      default:
        return '🌐';
    }
  };

  if (isLoading) {
    return <BlogPostsSkeleton viewMode={viewMode} />;
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                <TranslateText text="Blog Posts" language={currentLanguage} />
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                <TranslateText text="Manage your blog content and articles" language={currentLanguage} />
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="px-3"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="px-3"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t("Search posts by title, description, or category...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 dark:bg-gray-800 border-0"
              />
            </div>

            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 bg-gray-50 dark:bg-gray-800 border-0">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={t("Status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("All Status")}</SelectItem>
                  <SelectItem value="published">{t("Published")}</SelectItem>
                  <SelectItem value="draft">{t("Draft")}</SelectItem>
                  <SelectItem value="archived">{t("Archived")}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={languageFilter} onValueChange={setLanguageFilter}>
                <SelectTrigger className="w-32 bg-gray-50 dark:bg-gray-800 border-0">
                  <Globe className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={t("Language")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("All Languages")}</SelectItem>
                  <SelectItem value="EN">🇺🇸 English</SelectItem>
                  <SelectItem value="JP">🇯🇵 Japanese</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <TranslateText text="Showing" />{" "}
          <span className="font-medium">{filteredPosts.length}</span>{" "}
          <TranslateText text="of" />{" "}
          <span className="font-medium">{blogPosts.length}</span>{" "}
          <TranslateText text="posts" />
        </p>
      </div>

      {/* Posts Grid/List */}
      {filteredPosts.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="py-16 text-center">
            <div className="max-w-md mx-auto">
              <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                <TranslateText text="No posts found" />
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {searchTerm || statusFilter !== "all" || languageFilter !== "all"
                  ? t("Try adjusting your search criteria or filters.")
                  : t("Get started by creating your first blog post.")}
              </p>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                <TranslateText text="Create Your First Post" language={currentLanguage} />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className={cn(
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        )}>
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              viewMode={viewMode}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
              onDuplicate={onDuplicate}
              getImageUrl={getImageUrl}
              formatDate={formatDate}
              getStatusColor={getStatusColor}
              getLanguageFlag={getLanguageFlag}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface PostCardProps {
  post: BlogArticle;
  viewMode: "grid" | "list";
  onEdit: (post: BlogArticle) => void;
  onDelete: (post: BlogArticle) => void;
  onView?: (post: BlogArticle) => void;
  onDuplicate?: (post: BlogArticle) => void;
  getImageUrl: (post: BlogArticle) => string | null;
  formatDate: (dateString: string) => string;
  getStatusColor: (status: string) => string;
  getLanguageFlag: (language: string) => string;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  viewMode,
  onEdit,
  onDelete,
  onView,
  onDuplicate,
  getImageUrl,
  formatDate,
  getStatusColor,
  getLanguageFlag
}) => {
  const { t } = useTranslation();
  const imageUrl = getImageUrl(post);

  if (viewMode === "list") {
    return (
      <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={post.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate pr-4">
                  {post.title}
                </h3>
                <PostActions
                  post={post}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                  onDuplicate={onDuplicate}
                />
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                {post.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(post.created_at)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    5 {t("min read")}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(post.status)}>
                    {post.status}
                  </Badge>
                  {post.language && (
                    <Badge variant="outline" className="text-xs">
                      {getLanguageFlag(post.language)} {post.language.toUpperCase()}
                    </Badge>
                  )}
                  {post.category && (
                    <Badge variant="outline" className="text-xs">
                      {post.category}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden">
      <div className="relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={post.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}

        <div className="absolute top-4 right-4">
          <PostActions
            post={post}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
            onDuplicate={onDuplicate}
          />
        </div>

        <div className="absolute bottom-4 left-4">
          <Badge className={getStatusColor(post.status)}>
            {t(post.status.charAt(0).toUpperCase() + post.status.slice(1))}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {post.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
              {post.description}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(post.created_at)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                5{t("m")}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {post.language && (
                <Badge variant="outline" className="text-xs px-2">
                  {getLanguageFlag(post.language)}
                </Badge>
              )}
              {post.category && (
                <Badge variant="outline" className="text-xs">
                  {post.category}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface PostActionsProps {
  post: BlogArticle;
  onEdit: (post: BlogArticle) => void;
  onDelete: (post: BlogArticle) => void;
  onView?: (post: BlogArticle) => void;
  onDuplicate?: (post: BlogArticle) => void;
}

const PostActions: React.FC<PostActionsProps> = ({
  post,
  onEdit,
  onDelete,
  onView,
  onDuplicate
}) => {
  const { t } = useTranslation();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onEdit(post)} className="gap-2">
          <Edit className="h-4 w-4" />
          {t("Edit Post")}
        </DropdownMenuItem>

        {onView && (
          <DropdownMenuItem onClick={() => onView(post)} className="gap-2">
            <Eye className="h-4 w-4" />
            {t("Preview")}
          </DropdownMenuItem>
        )}

        {onDuplicate && (
          <DropdownMenuItem onClick={() => onDuplicate(post)} className="gap-2">
            <Copy className="h-4 w-4" />
            {t("Duplicate")}
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => onDelete(post)}
          className="gap-2 text-red-600 focus:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
          {t("Delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

function BlogPostsSkeleton({ viewMode }: { viewMode: "grid" | "list" }) {
  const skeletonCount = 6;

  if (viewMode === "list") {
    return (
      <div className="space-y-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-8 w-16" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <Card key={i} className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <Skeleton className="w-24 h-24 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <div className="flex justify-between">
                      <div className="flex gap-4">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-12" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-8 w-16" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <Card key={i} className="border-0 shadow-md overflow-hidden">
            <Skeleton className="w-full h-48" />
            <CardContent className="p-6">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <div className="flex justify-between items-center pt-2 border-t">
                <div className="flex gap-3">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-8" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}