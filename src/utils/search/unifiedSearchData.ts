
import { contextualSearchData } from './contextual';
import { transportSearchData } from './transport';

// Enhanced search data with comprehensive indexing
export function getAllSearchData() {
  return [
    ...contextualSearchData,
    ...transportSearchData,
    ...getPageSearchData(),
    ...getSectionSearchData(),
    ...getCitySearchData(),
    ...getActivitySearchData()
  ];
}

// Main pages with better indexing
function getPageSearchData() {
  return [
    {
      id: 'home-main',
      title: 'Tunisia Travel Guide - Discover Tunisia',
      description: 'Your complete guide to traveling in Tunisia with expert recommendations and local insights.',
      path: '/',
      category: 'home' as const,
      section: 'main',
      titleJP: 'チュニジア旅行ガイド',
      descriptionJP: 'エキスパートの推奨事項と地元のアドバイスが含まれた、チュニジア旅行の完全なガイド。',
      sectionJP: 'メイン',
      keywords: ['home', 'main', 'tunisia', 'guide', 'travel', 'discover', 'welcome', 'start', 'ホーム', 'メイン', 'チュニジア', 'ガイド'],
      score: 0
    },
    {
      id: 'about-tunisia-page',
      title: 'About Tunisia - Culture, History & Information',
      description: 'Learn about Tunisia\'s rich culture, fascinating history, geography, and diverse regions.',
      path: '/about-tunisia',
      category: 'about' as const,
      section: 'information',
      titleJP: 'チュニジアについて',
      descriptionJP: 'チュニジアの豊かな文化、魅力的な歴史、地理、多様な地域について学びましょう。',
      sectionJP: '情報',
      keywords: ['about', 'tunisia', 'culture', 'history', 'information', 'country', 'geography', 'overview', 'チュニジアについて', '文化', '歴史'],
      score: 0
    },
    {
      id: 'travel-info-page',
      title: 'Travel Information & Tour Packages',
      description: 'Complete travel guide with itineraries, activities, cities, and practical travel information.',
      path: '/travel-information',
      category: 'travel' as const,
      section: 'planning',
      titleJP: '旅行情報',
      descriptionJP: '旅程、アクティビティ、都市、実用的な旅行情報を含む完全な旅行ガイド。',
      sectionJP: 'プランニング',
      keywords: ['travel', 'information', 'tour', 'packages', 'itinerary', 'activities', 'cities', 'planning', '旅行', '情報', 'ツアー'],
      score: 0
    },
    {
      id: 'company-page',
      title: 'Atlantis Voyages - Professional Travel Services',
      description: 'Professional travel agency offering personalized tours, hotel bookings, and travel services.',
      path: '/company-information',
      category: 'atlantis' as const,
      section: 'services',
      titleJP: 'アトランティス航海',
      descriptionJP: 'パーソナライズされたツアー、ホテル予約、旅行サービスを提供するプロフェッショナルな旅行代理店。',
      sectionJP: 'サービス',
      keywords: ['atlantis', 'voyages', 'company', 'services', 'agency', 'professional', 'booking', 'tours', 'アトランティス', '会社', 'サービス'],
      score: 0
    },
    {
      id: 'start-trip-page',
      title: 'Start My Trip - Trip Planner',
      description: 'Plan your perfect Tunisia trip with our interactive trip planner and customized itineraries.',
      path: '/start-my-trip',
      category: 'travel' as const,
      section: 'planning',
      titleJP: '旅行を始める',
      descriptionJP: 'インタラクティブなトリッププランナーとカスタマイズされた旅程で、完璧なチュニジア旅行を計画しましょう。',
      sectionJP: 'プランニング',
      keywords: ['start', 'trip', 'planner', 'plan', 'customize', 'itinerary', 'interactive', '旅行を始める', 'プランナー'],
      score: 0
    },
    {
      id: 'blog-page',
      title: 'Tunisia Travel Blog',
      description: 'Travel stories, tips, and insights from our Tunisia travel experts and local guides.',
      path: '/blog',
      category: 'blog' as const,
      section: 'articles',
      titleJP: 'ブログ',
      descriptionJP: 'チュニジア旅行のエキスパートや地元ガイドによる旅行記、ヒント、洞察。',
      sectionJP: '記事',
      keywords: ['blog', 'articles', 'stories', 'tips', 'insights', 'experiences', 'travel blog', 'ブログ', '記事', '旅行記'],
      score: 0
    }
  ];
}

// Detailed sections with specific content
function getSectionSearchData() {
  return [
    {
      id: 'culture-section',
      title: 'Tunisian Culture & Traditions',
      description: 'Discover Tunisia\'s rich cultural heritage, traditions, customs, and way of life.',
      path: '/about-tunisia#culture',
      category: 'about' as const,
      section: 'culture',
      titleJP: 'チュニジア文化',
      descriptionJP: 'チュニジアの豊かな文化的遺産、伝統、習慣、そして生活様式を発見してください。',
      sectionJP: '文化',
      image: '/uploads/67d662bd-9913-40c8-9171-f34177b63a89.png',
      keywords: ['culture', 'traditions', 'customs', 'heritage', 'arab', 'berber', 'lifestyle', 'way of life', '文化', '伝統', '習慣'],
      score: 0
    },
    {
      id: 'weather-section',
      title: 'Tunisia Weather & Climate',
      description: 'Complete weather guide, seasonal patterns, and best times to visit Tunisia.',
      path: '/about-tunisia#weather',
      category: 'about' as const,
      section: 'weather',
      titleJP: '天気・気候',
      descriptionJP: '完全な天気ガイド、季節のパターン、およびチュニジアを訪れるのに最適な時期。',
      sectionJP: '天気',
      keywords: ['weather', 'climate', 'temperature', 'seasons', 'best time', 'visit', 'planning', '天気', '気候', '季節'],
      score: 0
    },
    {
      id: 'languages-section',
      title: 'Languages in Tunisia',
      description: 'Learn about Arabic, French, and Berber languages spoken in Tunisia.',
      path: '/about-tunisia#languages',
      category: 'about' as const,
      section: 'languages',
      titleJP: '言語',
      descriptionJP: 'チュニジアで話されているアラビア語、フランス語、ベルベル語について学びましょう。',
      sectionJP: '言語',
      keywords: ['languages', 'arabic', 'french', 'berber', 'communication', 'speaking', 'dialect', '言語', 'アラビア語', 'フランス語'],
      score: 0
    },
    {
      id: 'transportation-section',
      title: 'Transportation in Tunisia',
      description: 'Complete guide to getting around Tunisia - trains, buses, taxis, and car rentals.',
      path: '/travel-information?tab=departure&section=transportation',
      category: 'travel' as const,
      section: 'transportation',
      titleJP: '交通手段',
      descriptionJP: '電車、バス、タクシー、レンタカーなど、チュニジア国内の移動に関する完全ガイド。',
      sectionJP: '交通手段',
      keywords: ['transportation', 'transport', 'taxi', 'bus', 'train', 'car', 'rental', 'getting around', '交通', 'タクシー', 'バス'],
      score: 0
    },
    {
      id: 'accommodation-section',
      title: 'Hotels & Accommodation',
      description: 'Find the perfect place to stay with our curated selection of hotels and guest houses.',
      path: '/company-information?section=services&scrollTo=hotels',
      category: 'accommodation' as const,
      section: 'hotels',
      titleJP: 'ホテル・宿泊',
      descriptionJP: '厳選されたホテルやゲストハウスから、完璧な滞在先を見つけましょう。',
      sectionJP: 'ホテル',
      keywords: ['hotels', 'accommodation', 'stay', 'lodging', 'guest houses', 'booking', 'rooms', 'ホテル', '宿泊', '部屋'],
      score: 0
    }
  ];
}

// Popular cities with enhanced data
function getCitySearchData() {
  return [
    {
      id: 'tunis-city',
      title: 'Tunis - Capital City',
      description: 'Explore Tunisia\'s vibrant capital with its medina, museums, and modern attractions.',
      path: '/travel-information?tab=activities&city=tunis',
      category: 'city' as const,
      section: 'destinations',
      titleJP: 'チュニス',
      descriptionJP: 'メディナ、博物館、近代的なアトラクションがあるチュニジアの活気ある首都を探索してください。',
      sectionJP: '目的地',
      image: '/uploads/f725cd5d-dab1-4471-90ca-93cf7764136b.png',
      keywords: ['tunis', 'capital', 'city', 'medina', 'museums', 'attractions', 'downtown', 'チュニス', '首都', '都市'],
      score: 0
    },
    {
      id: 'sidi-bou-said',
      title: 'Sidi Bou Said - Blue & White Village',
      description: 'Famous clifftop village with stunning blue and white architecture and sea views.',
      path: '/travel-information?tab=activities&city=sidi-bou-said',
      category: 'city' as const,
      section: 'destinations',
      titleJP: 'シディ・ブ・サイード',
      descriptionJP: '見事な青と白の建築と海の景色を楽しめる、有名な崖の上の村。',
      sectionJP: '目的地',
      image: '/uploads/2714f2c3-4465-4a55-8369-5484aa8f3b28.png',
      keywords: ['sidi bou said', 'blue', 'white', 'village', 'cliff', 'sea', 'views', 'architecture', 'シディブサイード', '青と白', '村'],
      score: 0
    },
    {
      id: 'hammamet-city',
      title: 'Hammamet - Beach Resort Town',
      description: 'Popular beach destination with beautiful coastline, resorts, and water activities.',
      path: '/travel-information?tab=activities&city=hammamet',
      category: 'city' as const,
      section: 'destinations',
      titleJP: 'ハンマメット',
      descriptionJP: '美しい海岸線、リゾート、ウォーターアクティビティがある人気のビーチ目的地。',
      sectionJP: '目的地',
      keywords: ['hammamet', 'beach', 'resort', 'coastline', 'swimming', 'water', 'activities', 'ハンマメット', 'ビーチ', 'リゾート'],
      score: 0
    },
    {
      id: 'djerba-city',
      title: 'Djerba - Island Paradise',
      description: 'Beautiful island destination with pristine beaches, traditional villages, and unique culture.',
      path: '/travel-information?tab=activities&city=djerba',
      category: 'city' as const,
      section: 'destinations',
      titleJP: 'ジェルバ島',
      descriptionJP: 'のどかなビーチ、伝統的な村、ユニークな文化がある美しい島。',
      sectionJP: '目的地',
      keywords: ['djerba', 'island', 'paradise', 'beaches', 'traditional', 'villages', 'culture', 'ジェルバ', '島', 'パラダイス'],
      score: 0
    }
  ];
}

// Key activities and experiences
function getActivitySearchData() {
  return [
    {
      id: 'sahara-desert',
      title: 'Sahara Desert Experience',
      description: 'Unforgettable desert adventure with camel trekking, camping, and stargazing.',
      path: '/travel-information?tab=activities&context=desert',
      category: 'activity' as const,
      section: 'desert',
      titleJP: 'サハラ砂漠体験',
      descriptionJP: 'ラクダトレッキング、キャンプ、星空観察を楽しめる、忘れられない砂漠の冒険。',
      sectionJP: '砂漠',
      image: '/uploads/2714f2c3-4465-4a55-8369-5484aa8f3b28.png',
      keywords: ['sahara', 'desert', 'camels', 'camping', 'stars', 'adventure', 'dunes', 'oasis', 'サハラ', '砂漠', 'ラクダ'],
      score: 0
    },
    {
      id: 'star-wars-locations',
      title: 'Star Wars Filming Locations',
      description: 'Visit iconic Star Wars filming locations including Tatooine scenes and movie sets.',
      path: '/travel-information?tab=activities&context=starwars',
      category: 'activity' as const,
      section: 'entertainment',
      titleJP: 'スターウォーズ撮影地',
      descriptionJP: 'タトゥイーンのシーンや映画セットを含む、象徴的なスターウォーズの撮影場所を訪問しましょう。',
      sectionJP: 'エンターテイメント',
      image: '/uploads/38ad0f33-36f7-4fa7-87c7-b4e8e7a9c2d1.png',
      keywords: ['star wars', 'filming', 'locations', 'tatooine', 'movie', 'sets', 'matmata', 'スターウォーズ', '撮影地', '映画'],
      score: 0
    },
    {
      id: 'roman-ruins',
      title: 'Roman Archaeological Sites',
      description: 'Explore ancient Roman ruins, amphitheaters, and UNESCO World Heritage sites.',
      path: '/travel-information?tab=activities&context=roman',
      category: 'activity' as const,
      section: 'history',
      titleJP: 'ローマ遺跡',
      descriptionJP: '古代ローマの遺跡、円形劇場、およびユネスコ世界遺産を探索してください。',
      sectionJP: '歴史',
      image: '/uploads/c0f73b03-8e7e-4aea-996c-25418c3b8927.png',
      keywords: ['roman', 'ruins', 'archaeological', 'amphitheater', 'unesco', 'heritage', 'ancient', 'history', 'ローマ', '遺跡', '古代'],
      score: 0
    },
    {
      id: 'mediterranean-beaches',
      title: 'Mediterranean Beaches',
      description: 'Relax on beautiful Mediterranean beaches with crystal clear waters and golden sands.',
      path: '/travel-information?tab=activities&context=beaches',
      category: 'activity' as const,
      section: 'beaches',
      titleJP: '地中海ビーチ',
      descriptionJP: '透き通った水と黄金の砂が広がる美しい地中海のビーチでリラックスしてください。',
      sectionJP: 'ビーチ',
      image: '/uploads/f725cd5d-dab1-4471-90ca-93cf7764136b.png',
      keywords: ['beaches', 'mediterranean', 'swimming', 'sun', 'sand', 'water', 'coast', 'seaside', 'ビーチ', '地中海', '海'],
      score: 0
    }
  ];
}
