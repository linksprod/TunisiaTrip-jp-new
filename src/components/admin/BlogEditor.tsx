
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Save, Send, Languages, RefreshCw } from "lucide-react";
import { BlogArticle } from "@/types/blog";
import { BlogFormValues } from "@/hooks/use-blog-posts";
import ImageUploader from "@/components/admin/ImageUploader";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { SEOFieldsSection } from "@/components/admin/SEOFieldsSection";
import { ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/hooks/use-translation";

interface BlogEditorProps {
  isAddMode: boolean;
  currentPost: BlogArticle | null;
  isSubmitting: boolean;
  onSubmit: (data: BlogFormValues) => void;
  onCancel: () => void;
}

const BlogEditor: React.FC<BlogEditorProps> = ({
  isAddMode,
  currentPost,
  isSubmitting,
  onSubmit,
  onCancel
}) => {
  const { toast } = useToast();
  const { t, currentLanguage } = useTranslation();
  const [isTranslating, setIsTranslating] = React.useState(false);
  const [isGeneratingSlug, setIsGeneratingSlug] = React.useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = React.useState(false);
  const [titleDebounce, setTitleDebounce] = React.useState("");

  const form = useForm<BlogFormValues>({
    defaultValues: {
      title: currentPost?.title || "",
      slug: currentPost?.slug || "",
      description: currentPost?.description || "",
      content: currentPost?.content || "",
      category: currentPost?.category || "",
      image: currentPost?.image || "",
      status: (currentPost?.status as 'draft' | 'published') || "draft",
      language: (currentPost?.language as 'EN' | 'JP') || (currentLanguage as 'EN' | 'JP') || "JP",
      meta_title: currentPost?.meta_title || "",
      meta_description: currentPost?.meta_description || "",
      focus_keyword: currentPost?.focus_keyword || "",
      seo_keywords: currentPost?.seo_keywords?.join(', ') || "",
      og_title: currentPost?.og_title || "",
      og_description: currentPost?.og_description || "",
      og_image: currentPost?.og_image || "",
      twitter_card_type: currentPost?.twitter_card_type || "summary_large_image",
      canonical_url: currentPost?.canonical_url || "",
      meta_robots: currentPost?.meta_robots || "index,follow",
      schema_markup_type: currentPost?.schema_markup_type || "BlogPosting"
    }
  });

  // Generate SEO-friendly slug from title with Japanese support
  const generateSlug = async (title: string): Promise<string> => {
    const { generateSEOSlug } = await import('@/lib/utils');
    return generateSEOSlug(title);
  };

  // Watch title to auto-generate slug
  const watchedTitle = form.watch('title');

  // Debounce title changes
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setTitleDebounce(watchedTitle);
    }, 300);

    return () => clearTimeout(timer);
  }, [watchedTitle]);

  // Auto-generate slug from title when typing
  React.useEffect(() => {
    if (titleDebounce && !isSlugManuallyEdited) {
      generateSlug(titleDebounce).then(newSlug => {
        form.setValue('slug', newSlug, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      });
    }
  }, [titleDebounce, isSlugManuallyEdited, form]);

  // Reset manual edit flag when changing posts or mode
  React.useEffect(() => {
    setIsSlugManuallyEdited(false);
  }, [currentPost, isAddMode]);

  const handleSubmit = (data: BlogFormValues) => {
    onSubmit(data);
  };

  const handleGenerateSlug = async (language: 'EN' | 'JP') => {
    const currentTitle = form.getValues('title');
    if (!currentTitle) {
      toast({
        title: t("No Title"),
        description: t("Please enter a title first"),
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingSlug(true);
    setIsSlugManuallyEdited(false); // Reset manual edit flag
    try {
      let slug: string;
      if (language === 'JP') {
        // Force Japanese slug generation
        slug = await generateSlug(currentTitle);
      } else {
        // For English, use basic slug generation
        const { generateBasicSlug } = await import('@/lib/utils');
        slug = generateBasicSlug(currentTitle);
      }

      form.setValue('slug', slug, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      toast({
        title: t("Slug Generated"),
        description: t(`${language === 'EN' ? 'English' : 'Japanese'} slug generated successfully`),
      });
    } catch (error) {
      console.error('Slug generation error:', error);
      toast({
        title: t("Generation Failed"),
        description: t("Failed to generate slug. Please try again."),
        variant: "destructive"
      });
    } finally {
      setIsGeneratingSlug(false);
    }
  };

  const handleTranslateToJapanese = async () => {
    const currentTitle = form.getValues('title');
    const currentDescription = form.getValues('description');
    const currentContent = form.getValues('content');

    if (!currentTitle || !currentDescription || !currentContent) {
      toast({
        title: t("Missing Content"),
        description: t("Please fill in title, description, and content before translating"),
        variant: "destructive"
      });
      return;
    }

    setIsTranslating(true);
    try {
      const { data, error } = await supabase.functions.invoke('translate-article', {
        body: {
          title: currentTitle,
          description: currentDescription,
          content: currentContent,
          targetLanguage: 'JP'
        }
      });

      if (error) throw error;

      if (data?.success && data?.translatedTitle && data?.translatedDescription && data?.translatedContent) {
        const translatedTitle = data.translatedTitle as string;
        const translatedDescription = data.translatedDescription as string;
        const translatedContent = data.translatedContent as string;
        const slug = await generateSlug(translatedTitle);

        const newPost = {
          title: translatedTitle,
          slug,
          description: translatedDescription,
          content: translatedContent,
          category: form.getValues('category'),
          image: form.getValues('image'),
          status: 'draft' as const,
          language: 'JP' as const,
          original_id: (currentPost?.id as string) || null,
        };

        const { data: insertData, error: insertError } = await supabase
          .from('blog_articles')
          .insert(newPost)
          .select()
          .single();

        if (insertError) throw insertError;

        toast({
          title: t("Japanese draft created"),
          description: t("A new Japanese version has been created."),
        });
      }
    } catch (error: any) {
      console.error('Translation error:', error);

      const errorMessage = error?.message || error?.error || "Failed to translate article. Please try again.";

      toast({
        title: t("Translation Failed"),
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <Card className="p-6 border border-gray-200 shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Title and Slug Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Title")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("Blog post title")} {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Slug
                    <ExternalLink className="h-3 w-3" />
                  </FormLabel>
                  <div className="space-y-2">
                    <FormControl>
                      <Input
                        placeholder="article-url-slug"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setIsSlugManuallyEdited(true);
                        }}
                        required
                      />
                    </FormControl>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateSlug('EN')}
                        disabled={isGeneratingSlug}
                        className="flex-1"
                      >
                        {isGeneratingSlug ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <>
                            <RefreshCw className="h-3 w-3 mr-1" />
                            🇺🇸 EN
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateSlug('JP')}
                        disabled={isGeneratingSlug}
                        className="flex-1"
                      >
                        {isGeneratingSlug ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <>
                            <RefreshCw className="h-3 w-3 mr-1" />
                            🇯🇵 JP
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  <FormDescription className="text-xs">
                    URL: tunisitrip.jp/blog/{form.watch('slug') || 'article-slug'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Short Description")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("Enter a short description")}
                    className="resize-none"
                    rows={3}
                    {...field}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Main Image - Moved to top */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Main Article Image")}</FormLabel>
                <FormControl>
                  <ImageUploader
                    onImageUploaded={field.onChange}
                    currentImage={field.value}
                    folder="blog"
                  />
                </FormControl>
                <FormDescription>
                  {t("Main image for the article. Will be used for social media sharing if no OG image is set.")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Content Editor */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Article Content")}</FormLabel>
                <FormControl>
                  <RichTextEditor
                    value={field.value || ''}
                    onChange={field.onChange}
                    placeholder={t("Start writing your article content...")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* SEO Fields Section */}
          <SEOFieldsSection control={form.control} watch={form.watch} setValue={form.setValue} />

          {/* Category, Language and Status Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Category")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("Category (e.g., Travel Guide, Tips)")} {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Language")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select language")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="EN">🇺🇸 English</SelectItem>
                      <SelectItem value="JP">🇯🇵 Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Status")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select status")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">
                        <div className="flex items-center">
                          <Save className="h-4 w-4 mr-2" />
                          <span>{t("Draft")}</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="published">
                        <div className="flex items-center">
                          <Send className="h-4 w-4 mr-2" />
                          <span>{t("Published")}</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleTranslateToJapanese}
                disabled={isTranslating || form.watch('language') === 'JP'}
                className="w-full"
              >
                {isTranslating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("Translating...")}
                  </>
                ) : (
                  <>
                    <Languages className="mr-2 h-4 w-4" />
                    {t("Translate to Japanese")}
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              {t("Cancel")}
            </Button>
            <Button
              type="submit"
              className="bg-admin-primary hover:bg-admin-accent transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("Saving...")}
                </>
              ) : isAddMode ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {t("Save")}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {t("Update")}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default BlogEditor;
