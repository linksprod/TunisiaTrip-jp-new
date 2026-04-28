import React, { useState } from 'react';
import { Control } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Facebook, Twitter, Globe, Settings, Instagram, Sparkles, Loader2, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import { TranslateText } from "@/components/translation/TranslateText";
import { BlogFormValues } from "@/hooks/use-blog-posts";

interface SEOFieldsSectionProps {
  control: Control<BlogFormValues>;
  watch: (name: keyof BlogFormValues) => any;
  setValue: (name: keyof BlogFormValues, value: any) => void;
}

interface GenerateButtonProps {
  platform: 'instagram' | 'facebook' | 'twitter' | 'open_graph';
  contentType: 'title' | 'description' | 'hashtags' | 'caption' | 'story';
  onGenerate: (content: string) => void;
  articleContent: string;
  title: string;
  focusKeyword?: string;
  disabled?: boolean;
  language?: 'EN' | 'JP';
}

const GenerateButton: React.FC<GenerateButtonProps> = ({
  platform,
  contentType,
  onGenerate,
  articleContent,
  title,
  focusKeyword,
  disabled = false,
  language = 'EN'
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleGenerate = async () => {
    if (!articleContent || !title) {
      toast({
        title: t("Missing Content"),
        description: t("Please add a title and content to the article first"),
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-social-content', {
        body: {
          articleContent,
          title,
          platform,
          contentType,
          focusKeyword,
          language
        }
      });

      if (error) throw error;

      if (data?.content) {
        onGenerate(data.content);
        toast({
          title: t("Content Generated"),
          description: `${platform} ${contentType} ${t("generated successfully")}`,
        });
      }
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: t("Error"),
        description: t("Unable to generate content. Check your connection."),
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleGenerate}
      disabled={disabled || isGenerating}
      className="ml-2"
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4" />
      )}
      {isGenerating ? t('Generating...') : t('AI')}
    </Button>
  );
};

export const SEOFieldsSection: React.FC<SEOFieldsSectionProps> = ({ control, watch, setValue }) => {
  const title = watch('title') || '';
  const metaTitle = watch('meta_title') || '';
  const description = watch('description') || '';
  const metaDescription = watch('meta_description') || '';
  const content = watch('content') || '';
  const focusKeyword = watch('focus_keyword') || '';
  const instagramHashtags = watch('instagram_hashtags') || [];
  const { currentLanguage, t } = useTranslation();

  // SERP Preview Component
  const SERPPreview = () => (
    <div className="border rounded-lg p-4 bg-white">
      <div className="mb-2">
        <div className="text-xs text-green-600 mb-1">tunisitrip.jp › blog › {watch('slug') || 'article-slug'}</div>
        <h3 className="text-lg text-blue-600 hover:underline cursor-pointer">
          {metaTitle || title || 'Article Title'}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {metaDescription || description || 'Article description will appear here...'}
        </p>
      </div>
    </div>
  );

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          <TranslateText text="SEO Settings" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <TranslateText text="Basic SEO" />
            </TabsTrigger>
            <TabsTrigger value="instagram" className="flex items-center gap-2">
              <Instagram className="h-4 w-4" />
              <TranslateText text="Instagram" language={currentLanguage} />
            </TabsTrigger>
            <TabsTrigger value="facebook" className="flex items-center gap-2">
              <Facebook className="h-4 w-4" />
              <TranslateText text="Facebook" language={currentLanguage} />
            </TabsTrigger>
            <TabsTrigger value="twitter" className="flex items-center gap-2">
              <Twitter className="h-4 w-4" />
              <TranslateText text="Twitter" language={currentLanguage} />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={control}
                name="meta_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      <TranslateText text="Meta Title" language={currentLanguage} />
                      <div className="flex items-center gap-2">
                        <Badge variant={metaTitle.length > 60 ? "destructive" : metaTitle.length > 50 ? "secondary" : "default"}>
                          {metaTitle.length}/60
                        </Badge>
                        <GenerateButton
                          platform="open_graph"
                          contentType="title"
                          onGenerate={(content) => setValue('meta_title', content)}
                          articleContent={content}
                          title={title}
                          focusKeyword={focusKeyword}
                          language={currentLanguage}
                        />
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("SEO-optimized title (50-60 characters recommended)")}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {metaTitle.length === 0 && t("Will use the article title if empty")}
                      {metaTitle.length > 0 && metaTitle.length <= 50 && `✅ ${t("Good length for search results")}`}
                      {metaTitle.length > 50 && metaTitle.length <= 60 && `⚠️ ${t("Optimal range, but close to limit")}`}
                      {metaTitle.length > 60 && `❌ ${t("Too long - may be truncated in search results")}`}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="meta_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      <TranslateText text="Meta Description" language={currentLanguage} />
                      <div className="flex items-center gap-2">
                        <Badge variant={metaDescription.length > 160 ? "destructive" : metaDescription.length > 140 ? "secondary" : "default"}>
                          {metaDescription.length}/160
                        </Badge>
                        <GenerateButton
                          platform="open_graph"
                          contentType="description"
                          onGenerate={(content) => setValue('meta_description', content)}
                          articleContent={content}
                          title={title}
                          focusKeyword={focusKeyword}
                          language={currentLanguage}
                        />
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("Compelling description for search results (150-160 characters)")}
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {metaDescription.length === 0 && t("Will use the article description if empty")}
                      {metaDescription.length > 0 && metaDescription.length <= 140 && `✅ ${t("Good length for search results")}`}
                      {metaDescription.length > 140 && metaDescription.length <= 160 && `⚠️ ${t("Optimal range, but close to limit")}`}
                      {metaDescription.length > 160 && `❌ ${t("Too long - may be truncated in search results")}`}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="focus_keyword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><TranslateText text="Focus Keyword" language={currentLanguage} /></FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("Main keyword to rank for (e.g., 'Tunisia travel guide')")}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Primary keyword that should appear in title, first paragraph, and throughout content
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="seo_keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><TranslateText text="SEO Keywords" language={currentLanguage} /></FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("tunisia, travel, guide, vacation (comma-separated)")}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Related keywords separated by commas. Keep it natural and relevant.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <TranslateText text="Search Results Preview" language={currentLanguage} />
              </h4>
              <SERPPreview />
            </div>
          </TabsContent>

          <TabsContent value="instagram" className="space-y-4">
            <FormField
              control={control}
              name="instagram_caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    <TranslateText text="Instagram Caption" language={currentLanguage} />
                    <div className="flex items-center gap-2">
                      <Badge variant={(field.value?.length || 0) > 2200 ? "destructive" : "default"}>
                        {field.value?.length || 0}/2200
                      </Badge>
                      <GenerateButton
                        platform="instagram"
                        contentType="caption"
                        onGenerate={(content) => setValue('instagram_caption', content)}
                        articleContent={content}
                        title={title}
                        focusKeyword={focusKeyword}
                        language={currentLanguage}
                      />
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("Create an engaging Instagram caption with emojis and call-to-action...")}
                      className="resize-none min-h-32"
                      rows={6}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optimized caption for Instagram engagement (max 2200 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="instagram_hashtags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    <TranslateText text="Instagram Hashtags" language={currentLanguage} />
                    <div className="flex items-center gap-2">
                      <Badge variant={(field.value?.length || 0) > 30 ? "destructive" : "default"}>
                        {field.value?.length || 0}/30
                      </Badge>
                      <GenerateButton
                        platform="instagram"
                        contentType="hashtags"
                        onGenerate={(content) => {
                          const hashtagsArray = content.split(/\s+/).filter(tag => tag.startsWith('#')).slice(0, 30);
                          setValue('instagram_hashtags', hashtagsArray);
                        }}
                        articleContent={content}
                        title={title}
                        focusKeyword={focusKeyword}
                        language={currentLanguage}
                      />
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="#travel #tunisia #vacation #explore #wanderlust"
                      className="resize-none"
                      rows={3}
                      value={instagramHashtags.join(' ')}
                      onChange={(e) => {
                        const hashtags = e.target.value.split(/\s+/).filter(tag => tag.trim());
                        setValue('instagram_hashtags', hashtags);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Relevant hashtags separated by spaces (max 30 recommended)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="instagram_story_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    <TranslateText text="Instagram Story Text" language={currentLanguage} />
                    <div className="flex items-center gap-2">
                      <Badge variant={(field.value?.length || 0) > 200 ? "destructive" : "default"}>
                        {field.value?.length || 0}/200
                      </Badge>
                      <GenerateButton
                        platform="instagram"
                        contentType="story"
                        onGenerate={(content) => setValue('instagram_story_text', content)}
                        articleContent={content}
                        title={title}
                        language={currentLanguage}
                      />
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Short text for Instagram Story...")}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Catchy text for Instagram story (max 200 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="facebook" className="space-y-4">
            <FormField
              control={control}
              name="facebook_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    <TranslateText text="Facebook Title" language={currentLanguage} />
                    <div className="flex items-center gap-2">
                      <Badge variant={(field.value?.length || 0) > 60 ? "destructive" : "default"}>
                        {field.value?.length || 0}/60
                      </Badge>
                      <GenerateButton
                        platform="facebook"
                        contentType="title"
                        onGenerate={(content) => setValue('facebook_title', content)}
                        articleContent={content}
                        title={title}
                        focusKeyword={focusKeyword}
                        language={currentLanguage}
                      />
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Optimized title for Facebook...")}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Catchy title optimized for Facebook engagement (max 60 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="facebook_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    <TranslateText text="Facebook Description" language={currentLanguage} />
                    <div className="flex items-center gap-2">
                      <Badge variant={(field.value?.length || 0) > 125 ? "destructive" : "default"}>
                        {field.value?.length || 0}/125
                      </Badge>
                      <GenerateButton
                        platform="facebook"
                        contentType="description"
                        onGenerate={(content) => setValue('facebook_description', content)}
                        articleContent={content}
                        title={title}
                        focusKeyword={focusKeyword}
                        language={currentLanguage}
                      />
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("Optimized description for Facebook...")}
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Click-inducing description for Facebook sharing (max 125 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="facebook_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel><TranslateText text="Facebook Image" language={currentLanguage} /></FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Facebook-specific image URL (1200x630px recommended)")}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Facebook-specific image. Will use main image if empty.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="twitter" className="space-y-4">
            <FormField
              control={control}
              name="twitter_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    <TranslateText text="Twitter Title" language={currentLanguage} />
                    <div className="flex items-center gap-2">
                      <Badge variant={(field.value?.length || 0) > 50 ? "destructive" : "default"}>
                        {field.value?.length || 0}/50
                      </Badge>
                      <GenerateButton
                        platform="twitter"
                        contentType="title"
                        onGenerate={(content) => setValue('twitter_title', content)}
                        articleContent={content}
                        title={title}
                        focusKeyword={focusKeyword}
                        language={currentLanguage}
                      />
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Title adapted for Twitter...")}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Impactful title adapted to Twitter (max 50 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="twitter_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    <TranslateText text="Twitter Description" language={currentLanguage} />
                    <div className="flex items-center gap-2">
                      <Badge variant={(field.value?.length || 0) > 140 ? "destructive" : "default"}>
                        {field.value?.length || 0}/140
                      </Badge>
                      <GenerateButton
                        platform="twitter"
                        contentType="description"
                        onGenerate={(content) => setValue('twitter_description', content)}
                        articleContent={content}
                        title={title}
                        focusKeyword={focusKeyword}
                        language={currentLanguage}
                      />
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("Description for Twitter with hashtags...")}
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Description with hashtags and call-to-action for Twitter (max 140 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="twitter_card_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel><TranslateText text="Twitter Card Type" language={currentLanguage} /></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select Twitter card type")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="summary">{t("Summary")}</SelectItem>
                      <SelectItem value="summary_large_image">{t("Summary with Large Image")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Controls how your article appears when shared on Twitter
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="og_image_alt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel><TranslateText text="Image Alt Text" language={currentLanguage} /></FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Alternative text for the image...")}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Alternative text for accessibility and SEO
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};