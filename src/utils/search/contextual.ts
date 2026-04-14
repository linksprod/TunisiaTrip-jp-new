
import { SearchItem } from "./types";

export const contextualSearchData: SearchItem[] = [
  // MAIN PAGES
  {
    id: 'page-home',
    title: 'Tunisia Travel Guide - Home',
    path: '/',
    category: 'home',
    titleJP: 'チュニジア旅行ガイド - ホーム',
    keywords: [
      'home', 'main page', 'tunisia', 'travel guide', 'start',
      'homepage', 'main', 'welcome', 'overview',
      'ホーム', 'メインページ', 'チュニジア', '旅行ガイド'
    ]
  },
  {
    id: 'page-about-tunisia',
    title: 'About Tunisia - Culture & Information',
    path: '/about-tunisia',
    category: 'about',
    titleJP: 'チュニジアについて',
    keywords: [
      'about tunisia', 'culture', 'information', 'country',
      'history', 'geography', 'people', 'overview',
      'チュニジアについて', '文化', '情報', '国', '歴史'
    ]
  },
  {
    id: 'page-travel-info',
    title: 'Travel Information & Tour Packages',
    path: '/travel-information',
    category: 'travel',
    titleJP: '旅行情報・ツアーパッケージ',
    keywords: [
      'travel information', 'tour packages', 'itinerary',
      'activities', 'cities', 'trips', 'tours',
      '旅行情報', 'ツアーパッケージ', '旅程', 'アクティビティ'
    ]
  },
  {
    id: 'page-atlantis',
    title: 'Atlantis Voyages - Company Services',
    path: '/company-information',
    category: 'atlantis',
    titleJP: 'アトランティス航海 - 会社サービス',
    keywords: [
      'atlantis voyages', 'company', 'services', 'travel agency',
      'professional', 'booking', 'accommodation', 'tours',
      'アトランティス航海', '会社', 'サービス', '旅行代理店'
    ]
  },
  {
    id: 'page-start-trip',
    title: 'Start My Trip - Trip Planner',
    path: '/start-my-trip',
    category: 'travel',
    titleJP: '旅行を始める',
    keywords: [
      'start trip', 'trip planner', 'plan journey', 'customize',
      'itinerary builder', 'trip planning', 'personalized',
      '旅行を始める', '旅行プランナー', '旅程作成'
    ]
  },
  {
    id: 'page-blog',
    title: 'Tunisia Travel Blog',
    path: '/blog',
    category: 'blog',
    titleJP: 'チュニジア旅行ブログ',
    keywords: [
      'blog', 'articles', 'travel stories', 'experiences',
      'tips', 'guides', 'insights', 'travel blog',
      'ブログ', '記事', '旅行記', '体験', 'コツ'
    ]
  },

  // CONTEXTUAL SEARCH TERMS - High Priority
  {
    id: 'context-beaches',
    title: 'Tunisia Beaches & Coastal Areas',
    path: '/travel-information?tab=activities&context=beaches',
    category: 'travel',
    section: 'beaches',
    titleJP: 'チュニジアのビーチ・海岸地域',
    image: '/uploads/f725cd5d-dab1-4471-90ca-93cf7764136b.png',
    keywords: [
      'beaches', 'coast', 'mediterranean', 'swimming', 'sun', 'sand',
      'djerba beaches', 'sousse beaches', 'hammamet', 'nabeul',
      'sidi bou said', 'la marsa', 'bizerte', 'tabarka',
      'ビーチ', '海岸', '地中海', '水泳', '日光浴'
    ]
  },
  {
    id: 'context-desert',
    title: 'Sahara Desert Experience',
    path: '/travel-information?tab=activities&context=desert',
    category: 'travel',
    section: 'desert',
    titleJP: 'サハラ砂漠体験',
    image: '/uploads/2714f2c3-4465-4a55-8369-5484aa8f3b28.png',
    keywords: [
      'desert', 'sahara', 'sand dunes', 'camels', 'oasis',
      'camping', 'stars', 'sunset', 'sunrise', 'nomads',
      'bedouins', '4x4', 'adventure', 'grand erg oriental',
      '砂漠', 'サハラ', '砂丘', 'ラクダ', 'オアシス'
    ]
  },
  {
    id: 'context-star-wars',
    title: 'Star Wars Filming Locations',
    path: '/travel-information?tab=activities&context=starwars',
    category: 'travel',
    section: 'entertainment',
    titleJP: 'スターウォーズ撮影地',
    image: '/uploads/38ad0f33-36f7-4fa7-87c7-b4e8e7a9c2d1.png',
    keywords: [
      'star wars', 'tatooine', 'filming locations', 'movie sites',
      'matmata', 'tataouine', 'tozeur', 'tamerza', 'chott el jerid',
      'hotel sidi driss', 'lars homestead', 'cantina', 'desert scenes',
      'スターウォーズ', '撮影地', '映画', 'タトゥイーン'
    ]
  },
  {
    id: 'context-roman-sites',
    title: 'Roman Archaeological Sites',
    path: '/travel-information?tab=activities&context=roman',
    category: 'travel',
    section: 'history',
    titleJP: 'ローマ考古学遺跡',
    image: '/uploads/c0f73b03-8e7e-4aea-996c-25418c3b8927.png',
    keywords: [
      'roman', 'ruins', 'archaeological', 'ancient', 'history',
      'el jem', 'dougga', 'sbeitla', 'carthage', 'bulla regia',
      'amphitheater', 'mosaics', 'temples', 'baths', 'unesco',
      'ローマ', '遺跡', '考古学', '古代', '歴史'
    ]
  },
  {
    id: 'context-hotels',
    title: 'Hotels & Accommodation',
    path: '/company-information?section=services&scrollTo=hotels',
    category: 'accommodation',
    section: 'hotels',
    titleJP: 'ホテル・宿泊施設',
    keywords: [
      'hotels', 'accommodation', 'stay', 'lodging', 'rooms',
      'guest houses', 'resorts', 'booking', 'luxury', 'budget',
      'ホテル', '宿泊', '部屋', 'ゲストハウス', 'リゾート'
    ]
  },
  {
    id: 'context-weather',
    title: 'Tunisia Weather & Climate',
    path: '/about-tunisia#weather',
    category: 'about',
    section: 'weather',
    titleJP: 'チュニジアの天気・気候',
    keywords: [
      'weather', 'climate', 'temperature', 'seasons', 'rainfall',
      'best time to visit', 'hot', 'cold', 'spring', 'summer',
      '天気', '気候', '気温', '季節', '降雨量'
    ]
  }
];
