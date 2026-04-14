
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '@/hooks/use-translation';

export function DynamicMetaTags() {
  const { currentLanguage } = useTranslation();
  const location = useLocation();
  
  const baseUrl = 'https://tunisiatrip.jp';
  const currentPath = location.pathname;
  
  // Build canonical URL
  const canonicalUrl = `${baseUrl}${currentPath}`;
  const japaneseUrl = `${baseUrl}${currentPath}`;

  // Japanese site only - fixed OG image
  const ogImage = "https://tunisiatrip.jp/uploads/0c1b3cad-b8c4-4e02-a789-e700a147f440.png";

  // Japanese site meta content
  const metaContent = {
    title: "TunisiaTrip - 旅行情報 | アクティビティ | チュニジア観光",
    description: "チュニジアの旅行情報、アクティビティ、天気情報。さらに探索する、もっと詳しく知るためのチュニジア観光ガイド。晴れ時々曇りの美しい国で素晴らしい体験を。"
  };

  return (
    <Helmet>
      <title>{metaContent.title}</title>
      <meta name="description" content={metaContent.description} />
      
      {/* Dynamic Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Hreflang tags - Japanese only */}
      <link rel="alternate" hrefLang="ja" href={japaneseUrl} />
      <link rel="alternate" hrefLang="x-default" href={japaneseUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:title" content={metaContent.title} />
      <meta property="og:description" content={metaContent.description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      
      {/* Twitter */}
      <meta property="twitter:title" content={metaContent.title} />
      <meta property="twitter:description" content={metaContent.description} />
      <meta property="twitter:image" content={ogImage} />
    </Helmet>
  );
}
