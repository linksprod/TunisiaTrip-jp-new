import React, { useEffect, useState } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { useParams, Link } from "react-router-dom";
import { BlogArticle } from "@/types/blog";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/hooks/use-translation";
import { TranslateText } from "@/components/translation/TranslateText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, Loader2, Clock, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ContentRenderer } from "@/components/blog/ContentRenderer";
import { PopularActivitiesSection } from "@/components/blog/PopularActivitiesSection";
import { TravelInformationSection } from "@/components/blog/TravelInformationSection";
import { ArticleMetaTags } from "@/components/common/ArticleMetaTags";
import { ShareButtons } from "@/components/blog/ShareButtons";

const ArticlePage = () => {
  const { slug: paramSlug } = useParams<{ slug: string }>();

  // SSR Data Injection: Use global slug/data if provided (from entry-server and prerender)
  const ssrSlug = typeof globalThis !== 'undefined' ? (globalThis as any).__SSR_SLUG__ : null;
  const ssrData = typeof globalThis !== 'undefined' ? (globalThis as any).__SSR_DATA__ : null;

  const slug = paramSlug || ssrSlug;
  const initialArticle = (ssrData && (ssrData.slug === slug || ssrData.id === slug)) ? ssrData : null;

  const [article, setArticle] = useState<BlogArticle | null>(initialArticle);
  const [relatedArticles, setRelatedArticles] = useState<BlogArticle[]>([]);
  const [isLoading, setIsLoading] = useState(!initialArticle);
  const [error, setError] = useState<string | null>(null);
  const { currentLanguage } = useTranslation();
  const { toast } = useToast();

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug || initialArticle) return;

      try {
        console.log(`Fetching article with slug: ${slug} in language: ${currentLanguage}`);

        // First try to find by slug in current language
        let { data, error } = await supabase
          .from('blog_articles')
          .select('*')
          .eq('slug', slug)
          .eq('language', currentLanguage)
          .eq('status', 'published')
          .single();

        console.log('Direct slug search result:', { data, error });

        // If not found in current language, try to find the original or translated version
        if (error && error.code === 'PGRST116') {
          console.log(`Article not found with slug: ${slug} in language: ${currentLanguage}, searching for alternative versions...`);

          // Look for any article with this slug (any language)
          const { data: anyVersionData, error: anyVersionError } = await supabase
            .from('blog_articles')
            .select('*')
            .eq('slug', slug)
            .eq('status', 'published')
            .maybeSingle();

          console.log('Any version search result:', { anyVersionData, anyVersionError });

          if (anyVersionData) {
            // Found an article with this slug, now look for the translated version
            if (anyVersionData.language === currentLanguage) {
              // Already in the right language
              data = anyVersionData;
              error = null;
              console.log(`Article is already in the correct language: ${currentLanguage}`);
            } else {
              console.log(`Article found in ${anyVersionData.language}, searching for ${currentLanguage} translation...`);

              // Look for the translated version using both original_id patterns
              let translatedData = null;

              // Pattern 1: If current article is a translation, look for siblings
              if (anyVersionData.original_id) {
                console.log(`Current article is a translation with original_id: ${anyVersionData.original_id}`);
                const { data: sibling } = await supabase
                  .from('blog_articles')
                  .select('*')
                  .eq('original_id', anyVersionData.original_id)
                  .eq('language', currentLanguage)
                  .eq('status', 'published')
                  .maybeSingle();

                if (sibling) {
                  translatedData = sibling;
                  console.log('Found sibling translation:', sibling);
                }

                // Also check if the original itself is in the target language
                if (!translatedData) {
                  const { data: original } = await supabase
                    .from('blog_articles')
                    .select('*')
                    .eq('id', anyVersionData.original_id)
                    .eq('language', currentLanguage)
                    .eq('status', 'published')
                    .maybeSingle();

                  if (original) {
                    translatedData = original;
                    console.log('Found original in target language:', original);
                  }
                }
              } else {
                // Pattern 2: Current article is the original, look for translations
                console.log(`Current article is original, looking for translations...`);
                const { data: translation } = await supabase
                  .from('blog_articles')
                  .select('*')
                  .eq('original_id', anyVersionData.id)
                  .eq('language', currentLanguage)
                  .eq('status', 'published')
                  .maybeSingle();

                if (translation) {
                  translatedData = translation;
                  console.log('Found translation:', translation);
                }
              }

              if (translatedData) {
                data = translatedData;
                error = null;
                console.log(`Successfully found ${currentLanguage} translation`);
              } else {
                // No translation found, show the available version
                console.log(`No ${currentLanguage} translation found, using available version`);
                data = anyVersionData;
                error = null;
              }
            }
          } else {
            // Try by id for backward compatibility
            console.log(`No article found with slug: ${slug}, trying by ID...`);
            const { data: dataById, error: errorById } = await supabase
              .from('blog_articles')
              .select('*')
              .eq('id', slug)
              .eq('status', 'published')
              .maybeSingle();

            console.log('ID search result:', { dataById, errorById });
            data = dataById;
            error = errorById;
          }
        }

        if (error) throw error;

        setArticle(data as BlogArticle);

        // Fetch related articles in current language
        const { data: related } = await supabase
          .from('blog_articles')
          .select('*')
          .eq('language', currentLanguage)
          .eq('status', 'published')
          .neq('id', data.id)
          .limit(3);

        if (related) {
          setRelatedArticles(related as BlogArticle[]);
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        setError("Failed to load article");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [slug, currentLanguage]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return new Intl.DateTimeFormat(currentLanguage === 'JP' ? 'ja-JP' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };


  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (error || !article) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center max-w-6xl">
          <h1 className="text-2xl font-bold mb-4">
            <TranslateText
              text="Article Not Found"
              language={currentLanguage}
            />
          </h1>
          <p className="mb-6 text-gray-600">
            <TranslateText
              text="The article you're looking for doesn't exist or has been removed."
              language={currentLanguage}
            />
          </p>
          <Button asChild>
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <TranslateText
                text="Back to Blog"
                language={currentLanguage}
              />
            </Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Dynamic Meta Tags for Social Sharing */}
      <ArticleMetaTags article={article} />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Back button */}
            <div className="mb-6">
              <Button variant="ghost" asChild>
                <Link to="/blog" className="flex items-center text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  <TranslateText text="Back to Blog" language={currentLanguage} />
                </Link>
              </Button>
            </div>

            <article className="bg-white rounded-lg shadow-sm">
              {/* Article Header */}
              <div className="p-6 border-b">
                <div className="mb-4">
                  <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-4 py-2 text-sm font-medium">
                    <TranslateText text={article.category} language={currentLanguage} />
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 leading-tight">
                  <TranslateText text={article.title} language={currentLanguage} />
                </h1>

                {/* Short Description */}
                {article.description && (
                  <div className="mb-6 p-4 bg-white border-l-4 border-blue-500 shadow-sm">
                    <p className="text-gray-700 italic text-lg leading-relaxed">
                      <TranslateText text={article.description} language={currentLanguage} />
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-4 text-gray-500 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatDate(article.publish_date)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <TranslateText text="5 min read" language={currentLanguage} />
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <TranslateText text="Tunisia Trip" language={currentLanguage} />
                  </div>
                </div>
              </div>

              {/* Main Image */}
              {article.image && (
                <div className="p-6 pb-0">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-auto rounded-lg object-cover max-h-[400px] shadow-sm"
                  />
                </div>
              )}

              {/* Article Content */}
              <div className="p-6">
                <div className="article-content">
                  {article.content ? (
                    <ContentRenderer
                      content={article.content}
                      className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-li:text-gray-700 prose-li:mb-2 prose-ul:mb-4 prose-ol:mb-4 prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:italic prose-blockquote:pl-4 prose-blockquote:py-2 prose-strong:text-gray-900 prose-em:text-gray-800"
                    />
                  ) : (
                    <div className="text-gray-600 text-center py-8">
                      <p><TranslateText text="No content available for this article." language={currentLanguage} /></p>
                    </div>
                  )}
                </div>
              </div>

              {/* Share Section */}
              <div className="p-6 border-t">
                <ShareButtons article={article} currentLanguage={currentLanguage} />
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-8">
              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      <TranslateText text="Related Articles" language={currentLanguage} />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {relatedArticles.map((relatedArticle) => (
                        <Link
                          key={relatedArticle.id}
                          to={`/blog/article/${relatedArticle.slug || relatedArticle.id}`}
                          className="block group"
                        >
                          <div className="flex gap-3">
                            {relatedArticle.image && (
                              <img
                                src={relatedArticle.image}
                                alt={relatedArticle.title}
                                className="w-16 h-16 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="font-medium text-sm group-hover:text-blue-600 line-clamp-2">
                                <TranslateText text={relatedArticle.title} language={currentLanguage} />
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDate(relatedArticle.publish_date)}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Featured Activities - Using Real Data */}
              <PopularActivitiesSection currentLanguage={currentLanguage} />

              {/* Travel Information - Using Real Data */}
              <TravelInformationSection currentLanguage={currentLanguage} />

              {/* Popular Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    <TranslateText text="Popular Topics" language={currentLanguage} />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {['Travel Tips', 'Culture', 'Food', 'History', 'Activities'].map((tag) => (
                      <span
                        key={tag}
                        className="inline-block bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-xs cursor-pointer transition-colors"
                      >
                        <TranslateText text={tag} language={currentLanguage} />
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ArticlePage;
