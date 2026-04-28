
import React, { useEffect, useState } from "react";
import { BlogHero } from "./BlogHero";
import { BlogIllustrationHero } from "./BlogIllustrationHero";
import { TravelContactSection } from "../TravelContactSection";
import { useTranslation } from "@/hooks/use-translation";
import { TranslateText } from "../translation/TranslateText";

import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BlogArticle } from "@/types/blog";
import { Link } from "react-router-dom";
import { categoryMapping, getCategoryColor, matchCategoryToSlug } from "@/utils/categoryMapping";

interface BlogContentProps {
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function BlogContent({ selectedCategory, onCategorySelect, searchQuery, onSearchChange }: BlogContentProps) {
  const { currentLanguage } = useTranslation();
  const [blogArticles, setBlogArticles] = useState<BlogArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchBlogArticles() {
      try {
        const { data, error } = await supabase
          .from('blog_articles')
          .select('id, title, slug, description, category, image, language')
          .eq('status', 'published')
          .eq('language', currentLanguage)
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        setBlogArticles((data || []) as BlogArticle[]);
      } catch (err) {
        console.error("Error fetching blog articles:", err);
        setError("Failed to load blog articles");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchBlogArticles();
  }, [currentLanguage]);

  // Generate SEO-friendly URL for blog articles
  const generateArticleUrl = (article: BlogArticle) => {
    if (article.slug) {
      return `/blog/${article.slug}`;
    }
    // Fallback: use ID directly for articles without slug
    return `/blog/${article.id}`;
  };

  // Filter articles based on selected category and search query
  const filteredArticles = blogArticles.filter(article => {
    // Filter by category
    const matchesCategory = !selectedCategory || 
      (categoryMapping[selectedCategory] || []).some(cat => 
        article.category && cat && article.category.toLowerCase() === cat.toLowerCase()
      );
    
    // Filter by search query (title, description, or category)
    const query = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery.trim() || 
      (article.title && article.title.toLowerCase().includes(query)) ||
      (article.description && article.description.toLowerCase().includes(query)) ||
      (article.category && article.category.toLowerCase().includes(query));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <BlogIllustrationHero />
      
      <div className="mt-8 md:mt-12">
        <BlogHero 
          onCategorySelect={onCategorySelect}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />
      </div>
      
      <section id="featured-articles" className="max-w-[1200px] mx-auto px-4 mt-12 scroll-mt-20">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            <TranslateText text="Featured Articles" language={currentLanguage} />
          </h2>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2">{currentLanguage === 'JP' ? '記事を読み込み中...' : 'Loading articles...'}</span>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">
              {selectedCategory 
                ? (currentLanguage === 'JP' ? 'このカテゴリーの記事が見つかりません。' : 'No articles found for this category.')
                : (currentLanguage === 'JP' ? '公開された記事が見つかりません。' : 'No published articles found.')
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredArticles.map((article) => {
              const categorySlug = matchCategoryToSlug(article.category);
              
              return (
                <div key={article.id} className="flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <Link to={generateArticleUrl(article)} className="group">
                    <div className="overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title} 
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {categorySlug && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              onCategorySelect(categorySlug);
                            }}
                            className={`text-xs px-3 py-1 rounded-full border transition-all hover:scale-105 ${getCategoryColor(categorySlug)}`}
                          >
                            <TranslateText text={article.category} language={currentLanguage} />
                          </button>
                        )}
                      </div>
                      <h3 className="text-xl font-bold mt-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                        <TranslateText text={article.title} language={currentLanguage} />
                      </h3>
                      <p className="text-gray-700 mt-2 line-clamp-3">
                        <TranslateText text={article.description} language={currentLanguage} />
                      </p>
                      <div className="flex items-center gap-2 mt-4 text-blue-500 group-hover:text-blue-600 transition-colors">
                        <span>
                          <TranslateText text="Learn more" language={currentLanguage} />
                        </span>
                        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5.68841 0.779785L4.63281 1.91078L10.2124 7.56578L4.63281 13.2208L5.68841 14.3518L12.4744 7.56578L5.68841 0.779785Z" fill="currentColor"/>
                        </svg>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>
      
      <section className="mt-12 md:mt-16 lg:mt-20 mb-10">
        <TravelContactSection />
      </section>
    </div>
  );
}
