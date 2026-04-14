import { Helmet } from 'react-helmet-async';
import { BlogArticle } from '@/types/blog';
import { useTranslation } from '@/hooks/use-translation';
import { getCurrentProductionUrl } from '@/utils/urlUtils';

interface ArticleMetaTagsProps {
  article: BlogArticle;
}

export function ArticleMetaTags({ article }: ArticleMetaTagsProps) {
  const { currentLanguage } = useTranslation();
  
  // Get the production URL for consistent sharing and canonical links
  const currentUrl = getCurrentProductionUrl();
  
  // Determine the best image to use
  const getArticleImage = () => {
    let baseImage = '';
    if (article.og_image) baseImage = article.og_image;
    else if (article.facebook_image) baseImage = article.facebook_image;
    else if (article.image) baseImage = article.image;
    else {
      // Fallback to default site image based on language
      baseImage = currentLanguage === 'EN' 
        ? "https://tunisiatrip.jp/uploads/f4547708-3e81-4d1e-b626-844cc888dabd.png"
        : "https://tunisiatrip.jp/uploads/0c1b3cad-b8c4-4e02-a789-e700a147f440.png";
    }
    
    // Add cache-busting version parameter
    const version = new Date(article.updated_at || article.publish_date || article.created_at || Date.now()).getTime();
    return baseImage ? `${baseImage}${baseImage.includes('?') ? '&' : '?'}v=${version}` : baseImage;
  };
  
  // Get the best title
  const getArticleTitle = () => {
    if (article.meta_title) return article.meta_title;
    if (article.og_title) return article.og_title;
    return article.title;
  };
  
  // Get the best description
  const getArticleDescription = () => {
    if (article.meta_description) return article.meta_description;
    if (article.og_description) return article.og_description;
    return article.description || '';
  };
  
  // Get Twitter-specific title
  const getTwitterTitle = () => {
    if (article.twitter_title) return article.twitter_title;
    return getArticleTitle();
  };
  
  // Get Twitter-specific description
  const getTwitterDescription = () => {
    if (article.twitter_description) return article.twitter_description;
    return getArticleDescription();
  };
  
  const articleImage = getArticleImage();
  const articleTitle = getArticleTitle();
  const articleDescription = getArticleDescription();
  const twitterTitle = getTwitterTitle();
  const twitterDescription = getTwitterDescription();
  
  // Derive image metadata for social scrapers
  const imageType = articleImage.endsWith('.png')
    ? 'image/png'
    : articleImage.endsWith('.webp')
    ? 'image/webp'
    : 'image/jpeg';
  const imageWidth = 1200;
  const imageHeight = 630;
  
  // Get canonical URL
  const canonicalUrl = article.canonical_url || currentUrl;
  
  // Generate keywords
  const keywords = article.seo_keywords?.join(', ') || article.focus_keyword || '';
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{articleTitle}</title>
      <meta name="description" content={articleDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Robots */}
      <meta name="robots" content={article.meta_robots || 'index, follow'} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={articleTitle} />
      <meta property="og:description" content={articleDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Tunisia Trip" />
      <meta property="og:locale" content={currentLanguage === 'JP' ? 'ja_JP' : 'en_US'} />
      <meta property="og:image" content={articleImage} />
      <meta property="og:image:secure_url" content={articleImage} />
      <meta property="og:image:type" content={imageType} />
      <meta property="og:image:width" content={String(imageWidth)} />
      <meta property="og:image:height" content={String(imageHeight)} />
      <meta property="og:image:alt" content={article.og_image_alt || articleTitle} />
      
      {/* Article specific Open Graph */}
      {article.publish_date && (
        <meta property="article:published_time" content={article.publish_date} />
      )}
      {article.updated_at && (
        <meta property="article:modified_time" content={article.updated_at} />
      )}
      <meta property="article:author" content="Tunisia Trip" />
      <meta property="article:section" content={article.category} />
      {article.seo_keywords?.map((keyword, index) => (
        <meta key={index} property="article:tag" content={keyword} />
      ))}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={article.twitter_card_type || 'summary_large_image'} />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={twitterTitle} />
      <meta name="twitter:description" content={twitterDescription} />
      <meta name="twitter:image" content={articleImage} />
      <meta name="twitter:image:src" content={articleImage} />
      <meta name="twitter:image:alt" content={article.og_image_alt || articleTitle} />
      
      {/* Hreflang tags - Japanese only */}
      <link rel="alternate" hrefLang="ja" href={`https://tunisiatrip.jp/blog/article/${article.slug}`} />
      <link rel="alternate" hrefLang="x-default" href={`https://tunisiatrip.jp/blog/article/${article.slug}`} />
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "@id": currentUrl,
          "headline": articleTitle,
          "description": articleDescription,
          "image": {
            "@type": "ImageObject",
            "url": articleImage,
            "width": 1200,
            "height": 630
          },
          "datePublished": article.publish_date,
          "dateModified": article.updated_at || article.publish_date,
          "author": {
            "@type": "Person",
            "name": "Tunisia Trip"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Tunisia Trip",
            "logo": {
              "@type": "ImageObject",
              "url": "https://tunisiatrip.jp/uploads/b8d3011d-f5cd-4edd-b34e-9ef0827ba186.png"
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": currentUrl
          },
          "url": currentUrl,
          "keywords": keywords,
          "articleSection": article.category,
          "inLanguage": currentLanguage === 'JP' ? 'ja-JP' : 'en-US'
        })}
      </script>
    </Helmet>
  );
}