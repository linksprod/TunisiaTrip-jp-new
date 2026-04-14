
import React from 'react';
import { Helmet } from 'react-helmet-async';

export const WebsiteSchema = ({ name, url, description, inLanguage = ['en', 'ja'] }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    description,
    inLanguage,
    keywords: '旅行情報, アクティビティ, さらに探索する, 晴れ時々曇り, もっと詳しく, チュニジア, 観光'
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export const BreadcrumbSchema = ({ items }) => {
  const itemListElement = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.item
  }));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export const TourismDestinationSchema = ({ 
  name, 
  description, 
  url, 
  image, 
  touristType = [], 
  touristTags = [] 
}) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name,
    description,
    url,
    image,
    touristType,
    hasMap: 'https://www.google.com/maps/place/Tunisia/',
    amenityFeature: touristTags.map(tag => ({
      '@type': 'LocationFeatureSpecification',
      name: tag
    })),
    keywords: '旅行情報, アクティビティ, さらに探索する, 晴れ時々曇り, もっと詳しく, チュニジア, 観光'
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export const BlogPostSchema = ({ 
  title, 
  description, 
  image, 
  datePublished, 
  authorName, 
  url 
}) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    },
    headline: title,
    description,
    image,
    datePublished,
    dateModified: datePublished,
    author: {
      '@type': 'Organization',
      '@id': 'https://tunisiatrip.jp/#organization',
      name: 'TunisiaTrip',
      url: 'https://tunisiatrip.jp'
    },
    publisher: {
      '@type': 'Organization',
      '@id': 'https://tunisiatrip.jp/#organization',
      name: 'TunisiaTrip',
      logo: {
        '@type': 'ImageObject',
        url: 'https://tunisiatrip.jp/uploads/93c21f45-85e6-4c0d-9726-d7648d48686d.png',
        width: 512,
        height: 512
      }
    },
    url,
    inLanguage: 'ja',
    keywords: '旅行情報, アクティビティ, さらに探索する, 晴れ時々曇り, もっと詳しく, チュニジア, 観光'
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// GEO Optimization: Organization/TravelAgency Schema - Fixed with required address field
export const OrganizationSchema = ({ 
  name = 'TunisiaTrip',
  url = 'https://tunisiatrip.jp',
  logo = 'https://tunisiatrip.jp/uploads/93c21f45-85e6-4c0d-9726-d7648d48686d.png',
  sameAs = [],
  contactEmail = 'atlantis@atlantis.tn'
}: {
  name?: string;
  url?: string;
  logo?: string;
  sameAs?: string[];
  contactEmail?: string;
}) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': 'https://tunisiatrip.jp/#organization',
    name,
    alternateName: ['Tunisia Trip Japan', 'チュニジアトリップ'],
    url,
    logo: {
      '@type': 'ImageObject',
      url: logo,
      width: 512,
      height: 512
    },
    // REQUIRED: Address field for TravelAgency schema
    address: {
      '@type': 'PostalAddress',
      streetAddress: '29, Avenue du Japon, Imm. Fatma',
      addressLocality: 'Montplaisir - Tunis',
      postalCode: '1002',
      addressCountry: 'TN'
    },
    telephone: '+216 31 31 8000',
    email: contactEmail,
    // Parent organization
    parentOrganization: {
      '@type': 'TravelAgency',
      name: 'Atlantis Voyages',
      url: 'https://atlantis-voyages.com/',
      foundingDate: '1991'
    },
    sameAs: [
      'https://tunisiatrip.com',
      'https://atlantis-voyages.com/',
      ...sameAs
    ],
    areaServed: {
      '@type': 'Country',
      name: 'Tunisia',
      alternateName: ['チュニジア', 'Tunisie', 'تونس']
    },
    knowsLanguage: ['ja', 'en', 'fr', 'ar'],
    description: 'チュニジア専門の旅行情報サイト。観光スポット、アクティビティ、天気情報、ホテル・ゲストハウス情報を日本語で提供。',
    slogan: 'Discover Tunisia - チュニジアを発見しよう',
    foundingDate: '2024',
    priceRange: '$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'https://schema.org/Monday',
        opens: '08:30',
        closes: '18:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'https://schema.org/Tuesday',
        opens: '08:30',
        closes: '18:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'https://schema.org/Wednesday',
        opens: '08:30',
        closes: '18:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'https://schema.org/Thursday',
        opens: '08:30',
        closes: '18:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'https://schema.org/Friday',
        opens: '08:30',
        closes: '18:00'
      }
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+216 31 31 8000',
      email: contactEmail,
      contactType: 'customer service',
      availableLanguage: ['Japanese', 'English', 'French', 'Arabic']
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// GEO Optimization: FAQ Page Schema (Critical for AI Overviews)
export const FAQPageSchema = ({ faqs }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// GEO Optimization: HowTo Schema (For travel guides)
export const HowToSchema = ({ 
  name, 
  description, 
  steps,
  totalTime,
  estimatedCost
}) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    ...(totalTime && { totalTime }),
    ...(estimatedCost && {
      estimatedCost: {
        '@type': 'MonetaryAmount',
        currency: 'JPY',
        value: estimatedCost
      }
    }),
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image }),
      ...(step.url && { url: step.url })
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// Default Tunisia Travel FAQs for GEO
export const TunisiaTravelFAQs = [
  {
    question: 'チュニジアへの旅行は安全ですか？',
    answer: 'チュニジアは観光客に人気の安全な国です。主要な観光地、リゾート地、都市部は安全に旅行できます。ただし、リビア・アルジェリア国境付近は避けることをお勧めします。外務省の渡航情報を確認し、現地の状況に注意してください。'
  },
  {
    question: 'チュニジア旅行のベストシーズンはいつですか？',
    answer: '春（3月〜5月）と秋（9月〜11月）がベストシーズンです。気温は20〜28度で過ごしやすく、観光に最適です。夏は40度を超えることもありますが、ビーチリゾートは人気です。冬は温暖で雨が少なく、砂漠ツアーに適しています。'
  },
  {
    question: '日本からチュニジアへのフライト時間はどのくらいですか？',
    answer: '日本からチュニジアへの直行便はありません。ヨーロッパ（パリ、イスタンブール、フランクフルトなど）で乗り継ぎ、合計約15〜20時間かかります。最も一般的なルートはパリ経由で、羽田・成田から約18時間です。'
  },
  {
    question: 'チュニジアでの観光にビザは必要ですか？',
    answer: '日本国籍の方は90日以内の観光目的であればビザは不要です。パスポートの残存有効期間が6ヶ月以上必要です。入国時に帰りの航空券と宿泊先の情報を求められることがあります。'
  },
  {
    question: 'チュニジアの通貨と両替について教えてください',
    answer: 'チュニジアの通貨はチュニジア・ディナール（TND）です。1ディナール≒約45〜50円（レートにより変動）。空港、銀行、ホテルで両替可能です。クレジットカードは主要ホテル・レストランで使用できますが、現金を持参することをお勧めします。'
  },
  {
    question: 'チュニジアで人気の観光スポットはどこですか？',
    answer: 'カルタゴ遺跡（世界遺産）、シディ・ブ・サイド（青と白の美しい村）、サハラ砂漠ツアー、チュニス旧市街（メディナ）、ジェルバ島、エル・ジェムの円形闘技場などが人気です。スター・ウォーズのロケ地巡りも人気があります。'
  }
];
