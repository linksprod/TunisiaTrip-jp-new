
import React, { useState } from "react";
import { EnhancedAdminLayout } from "@/components/admin/modern/EnhancedAdminLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { BlogArticle } from "@/types/blog";
import BlogEditor from "@/components/admin/BlogEditor";
import { EnhancedBlogPostsGrid } from "@/components/admin/modern/EnhancedBlogPostsGrid";
import { useBlogPosts, BlogFormValues } from "@/hooks/use-blog-posts";
import { useToast } from "@/components/ui/use-toast";
import { LoadingIndicator } from "@/components/ui/LoadingIndicator";
import { useTranslation } from "@/hooks/use-translation";
import { TranslateText } from "@/components/translation/TranslateText";

const AdminBlogPage = () => {
  const [isAddMode, setIsAddMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogArticle | null>(null);
  const { toast } = useToast();
  const { currentLanguage, t } = useTranslation();

  const {
    blogPosts,
    isLoading,
    isSubmitting,
    deleteConfirmOpen,
    postToDelete,
    handleAddPost,
    handleUpdatePost,
    confirmDeletePost,
    handleDeletePost,
    setDeleteConfirmOpen
  } = useBlogPosts();

  const handleAddNewClick = () => {
    setIsAddMode(true);
    setIsEditMode(false);
    setCurrentPost(null);
  };

  const handleEditPost = (post: BlogArticle) => {
    setCurrentPost(post);
    setIsEditMode(true);
    setIsAddMode(false);
  };

  const handleCancel = () => {
    setIsAddMode(false);
    setIsEditMode(false);
    setCurrentPost(null);
  };

  const handleFormSubmit = async (data: BlogFormValues) => {
    console.log("Form submitted with data:", data);
    let success = false;

    try {
      if (isAddMode) {
        success = await handleAddPost(data);
        if (success && data.status === 'published') {
          toast({
            title: t("Blog post published"),
            description: t("Your post is now live on the blog page"),
          });
        }
      } else if (isEditMode && currentPost) {
        success = await handleUpdatePost(data, currentPost);
        if (success && data.status === 'published' && currentPost.status !== 'published') {
          toast({
            title: t("Blog post published"),
            description: t("Your post is now live on the blog page"),
          });
        }
      }

      if (success) {
        handleCancel();
      }
    } catch (error) {
      console.error("Error handling form submit:", error);
      toast({
        title: t("Error"),
        description: t("There was a problem publishing your post"),
        variant: "destructive"
      });
    }
  };

  const actionButtons = (
    <div className="flex gap-2">
      <Button
        className="bg-admin-primary hover:bg-admin-accent transition-colors text-white"
        onClick={handleAddNewClick}
        disabled={isAddMode || isEditMode}
      >
        <Plus className="mr-2 h-4 w-4" /> <TranslateText text="Add New Blog Post" language={currentLanguage} />
      </Button>
    </div>
  );

  return (
    <EnhancedAdminLayout>
      <div className="space-y-8 animate-fadeIn">
        <AdminHeader
          title={t("Blog Management")}
          description={t("Add, edit, or delete blog articles.")}
          actionButton={actionButtons}
        />

        {/* Blog Editor Component */}
        {(isAddMode || isEditMode) && (
          <BlogEditor
            isAddMode={isAddMode}
            currentPost={currentPost}
            isSubmitting={isSubmitting}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        )}

        {/* Enhanced Blog Posts Grid - Only show when not in add/edit mode */}
        {!isAddMode && !isEditMode && (
          <EnhancedBlogPostsGrid
            blogPosts={blogPosts}
            isLoading={isLoading}
            onEdit={handleEditPost}
            onDelete={(post) => confirmDeletePost(post.id)}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteConfirmOpen}
          onOpenChange={setDeleteConfirmOpen}
          title={t("Delete Blog Post")}
          description={t("Are you sure you want to delete this blog post? This action cannot be undone.")}
          confirmText={t("Delete")}
          cancelText={t("Cancel")}
          onConfirm={handleDeletePost}
          variant="destructive"
        />
      </div>
    </EnhancedAdminLayout>
  );
};

export default AdminBlogPage;
