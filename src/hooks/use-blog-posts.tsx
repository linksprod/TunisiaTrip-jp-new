
import { useState, useEffect } from "react";
import { BlogArticle } from "@/types/blog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export interface BlogFormValues {
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  image: string;
  status: 'draft' | 'published';
  language: 'EN' | 'JP';
  // SEO fields
  meta_title?: string;
  meta_description?: string;
  focus_keyword?: string;
  seo_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  og_image_alt?: string;
  twitter_card_type?: string;
  twitter_title?: string;
  twitter_description?: string;
  canonical_url?: string;
  meta_robots?: string;
  schema_markup_type?: string;
  // Social Media fields
  instagram_caption?: string;
  instagram_hashtags?: string[];
  instagram_story_text?: string;
  facebook_title?: string;
  facebook_description?: string;
  facebook_image?: string;
}

export const useBlogPosts = () => {
  const [blogPosts, setBlogPosts] = useState<BlogArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Generate SEO-friendly slug from title with Japanese support
  const generateSlug = async (title: string): Promise<string> => {
    const { generateSEOSlug } = await import('@/lib/utils');
    return generateSEOSlug(title);
  };

  useEffect(() => {
    let isMounted = true;
    
    const refreshPosts = async () => {
      try {
        setIsLoading(true);
        
        if (!isMounted) return;
        
        const { data, error } = await supabase
          .from('blog_articles')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (!isMounted) return;
        
        if (error) {
          console.error("Error fetching blog posts:", error);
          return;
        }
        
        console.log("Fetched blog posts:", data);
        setBlogPosts(data as BlogArticle[]);
      } catch (error) {
        if (isMounted) {
          console.error("Exception fetching blog posts:", error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (user) {
      refreshPosts();
    }
    
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Realtime updates for blog_articles
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('blog-articles-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'blog_articles' }, (payload) => {
        const newRow = payload.new as any;
        setBlogPosts((prev) => {
          if (prev.some((p) => p.id === newRow.id)) return prev;
          return [newRow as BlogArticle, ...prev];
        });
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'blog_articles' }, (payload) => {
        const newRow = payload.new as any;
        setBlogPosts((prev) => prev.map((p) => (p.id === newRow.id ? { ...p, ...newRow } : p)) as BlogArticle[]);
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'blog_articles' }, (payload) => {
        const oldRow = payload.old as any;
        setBlogPosts((prev) => prev.filter((p) => p.id !== oldRow.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const refreshPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_articles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setBlogPosts(data as BlogArticle[]);
    } catch (error) {
      console.error("Error refreshing blog posts:", error);
    }
  };
  
  const handleAddPost = async (formData: BlogFormValues) => {
    try {
      setIsSubmitting(true);
      
      const slug = formData.slug || await generateSlug(formData.title);
      
      const newPost = {
        title: formData.title,
        slug: slug,
        description: formData.description,
        content: formData.content,
        category: formData.category,
        image: formData.image,
        status: formData.status,
        language: (formData.language || 'EN').toUpperCase() as 'EN' | 'JP',
        publish_date: formData.status === 'published' 
          ? new Date().toISOString() 
          : (formData.status === 'draft' ? new Date().toISOString() : null), // Ensure not null if DB requires it
        meta_title: formData.meta_title,
        meta_description: formData.meta_description,
        focus_keyword: formData.focus_keyword,
        seo_keywords: formData.seo_keywords ? formData.seo_keywords.split(',').map(k => k.trim()) : null,
        og_title: formData.og_title,
        og_description: formData.og_description,
        og_image: formData.og_image,
        og_image_alt: formData.og_image_alt,
        twitter_card_type: formData.twitter_card_type,
        twitter_title: formData.twitter_title,
        twitter_description: formData.twitter_description,
        canonical_url: formData.canonical_url,
        meta_robots: formData.meta_robots,
        schema_markup_type: formData.schema_markup_type,
        instagram_caption: formData.instagram_caption,
        instagram_hashtags: formData.instagram_hashtags,
        instagram_story_text: formData.instagram_story_text,
        facebook_title: formData.facebook_title,
        facebook_description: formData.facebook_description,
        facebook_image: formData.facebook_image
      };
      
      const { data, error } = await supabase
        .from('blog_articles')
        .insert(newPost)
        .select();
      
      if (error) {
        console.error("Error adding blog post:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to add blog post",
          variant: "destructive"
        });
        return false;
      }
      
      if (data) {
        setBlogPosts(prevPosts => [...(data as BlogArticle[]), ...prevPosts]);
      }
      
      toast({
        title: "Success",
        description: formData.status === 'published' 
          ? "Blog post published successfully" 
          : "Blog post saved as draft"
      });
      
      return true;
    } catch (error) {
      console.error("Exception adding blog post:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUpdatePost = async (formData: BlogFormValues, currentPost: BlogArticle) => {
    try {
      setIsSubmitting(true);
      
      const wasPublished = currentPost.status === 'published';
      const isPublishedNow = formData.status === 'published';
      
      const slug = formData.slug || (formData.title !== currentPost.title ? 
        await generateSlug(formData.title) : currentPost.slug);
      
      const updates = {
        title: formData.title,
        slug: slug,
        description: formData.description,
        content: formData.content,
        category: formData.category,
        image: formData.image,
        status: formData.status,
        language: (formData.language || 'EN').toUpperCase() as 'EN' | 'JP',
        updated_at: new Date().toISOString(),
        meta_title: formData.meta_title,
        meta_description: formData.meta_description,
        focus_keyword: formData.focus_keyword,
        seo_keywords: formData.seo_keywords ? formData.seo_keywords.split(',').map(k => k.trim()) : null,
        og_title: formData.og_title,
        og_description: formData.og_description,
        og_image: formData.og_image,
        og_image_alt: formData.og_image_alt,
        twitter_card_type: formData.twitter_card_type,
        twitter_title: formData.twitter_title,
        twitter_description: formData.twitter_description,
        canonical_url: formData.canonical_url,
        meta_robots: formData.meta_robots,
        schema_markup_type: formData.schema_markup_type,
        instagram_caption: formData.instagram_caption,
        instagram_hashtags: formData.instagram_hashtags,
        instagram_story_text: formData.instagram_story_text,
        facebook_title: formData.facebook_title,
        facebook_description: formData.facebook_description,
        facebook_image: formData.facebook_image,
        ...((!wasPublished && isPublishedNow) ? { publish_date: new Date().toISOString() } : 
           (formData.status === 'draft' && !currentPost.publish_date ? { publish_date: new Date().toISOString() } : {}))
      };
      
      const { error } = await supabase
        .from('blog_articles')
        .update(updates)
        .eq('id', currentPost.id);
      
      if (error) {
        console.error("Error updating blog post:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to update blog post",
          variant: "destructive"
        });
        return false;
      }
      
      setBlogPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === currentPost.id 
            ? { ...post, ...updates } as BlogArticle
            : post
        )
      );
      
      toast({
        title: "Success",
        description: "Blog post updated successfully"
      });
      
      return true;
    } catch (error) {
      console.error("Exception updating blog post:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const confirmDeletePost = (id: string) => {
    setPostToDelete(id);
    setDeleteConfirmOpen(true);
  };
  
  const handleDeletePost = async () => {
    if (!postToDelete) return;
    
    try {
      // First, delete all translations that reference this article
      const { error: translationsError } = await supabase
        .from('blog_articles')
        .delete()
        .eq('original_id', postToDelete);
      
      if (translationsError) {
        console.error("Error deleting translations:", translationsError);
        toast({
          title: "Error",
          description: "Failed to delete article translations",
          variant: "destructive"
        });
        return;
      }
      
      // Then delete the main article
      const { error } = await supabase
        .from('blog_articles')
        .delete()
        .eq('id', postToDelete);
      
      if (error) {
        console.error("Error deleting blog post:", error);
        toast({
          title: "Error",
          description: "Failed to delete blog post",
          variant: "destructive"
        });
        return;
      }
      
      // Remove all related articles from state (original and translations)
      setBlogPosts(prevPosts => 
        prevPosts.filter(post => 
          post.id !== postToDelete && 
          (post as any).original_id !== postToDelete
        )
      );
      
      toast({
        title: "Success",
        description: "Blog post and its translations deleted successfully"
      });
      
    } catch (error) {
      console.error("Exception deleting blog post:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setDeleteConfirmOpen(false);
      setPostToDelete(null);
    }
  };
  
  return {
    blogPosts,
    isLoading,
    isSubmitting,
    deleteConfirmOpen,
    postToDelete,
    refreshPosts,
    handleAddPost,
    handleUpdatePost,
    confirmDeletePost,
    handleDeletePost,
    setDeleteConfirmOpen
  };
};
