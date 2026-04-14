
import { SearchItem } from "./types";

export const staticSearchData: SearchItem[] = [
  // Core Tunisia Information (High Priority)
  {
    id: 'about-tunisia-main',
    title: 'About Tunisia',
    path: '/about-tunisia',
    category: 'about',
    titleJP: 'チュニジアについて',
    image: '/uploads/2341be42-96ea-48c1-83f9-701f53a33454.png',
    keywords: [
      'tunisia', 'about', 'information', 'country', 'overview',
      'north africa', 'maghreb', 'mediterranean', 'introduction',
      'history', 'culture', 'geography', 'presentation',
      'チュニジア', '国', '情報', '文化', '歴史', '概要'
    ]
  },

  // Core Tunisia Information
  {
    id: 'about-tunisia-culture',
    title: 'Tunisian Culture',
    path: '/about-tunisia#culture',
    section: 'culture',
    category: 'about',
    titleJP: 'チュニジア文化',
    image: '/uploads/cbd7751a-e460-45c8-847d-849a5ca51bcc.png',
    keywords: [
      'culture', 'traditions', 'customs', 'heritage', 'cultural',
      'art', 'crafts', 'music', 'dance', 'traditional',
      'festivals', 'celebrations', 'berber', 'arab', 'islamic',
      'identity', 'lifestyle', 'customs', 'practices',
      '文化', '伝統', '習慣', '芸術', '音楽', 'アート'
    ]
  },

  // Languages
  {
    id: 'languages-tunisia',
    title: 'Languages in Tunisia',
    path: '/about-tunisia#languages',
    section: 'languages',
    category: 'about',
    titleJP: 'チュニジアの言語',
    image: '/uploads/67d662bd-9913-40c8-9171-f34177b63a89.png',
    keywords: [
      'languages', 'arabic', 'french', 'language', 'speak',
      'dialect', 'tunisian', 'communication', 'linguistic',
      'berber', 'tamazight', 'multilingual', 'expressions',
      'vocabulary', 'pronunciation', 'learning',
      '言語', 'アラビア語', 'フランス語', '方言', '会話'
    ]
  },

  // Weather & Climate
  {
    id: 'weather-tunisia',
    title: 'Tunisia Weather & Climate',
    path: '/about-tunisia#weather',
    section: 'weather',
    category: 'about',
    titleJP: 'チュニジアの天気と気候',
    image: '/uploads/e18f95d0-cdde-41b5-91cf-75188ee44366.png',
    keywords: [
      'weather', 'climate', 'temperature', 'forecast',
      'seasons', 'summer', 'winter', 'spring', 'autumn',
      'rain', 'sun', 'wind', 'mediterranean', 'desert',
      'sahara', 'conditions', 'seasonal', 'hot', 'mild',
      '天気', '気候', '温度', '季節', '夏', '冬', '予報'
    ]
  },

  // Travel Information (High Priority)
  {
    id: 'travel-information',
    title: 'Travel Information',
    path: '/travel-information',
    category: 'travel',
    titleJP: '旅行情報',
    image: '/uploads/4baa4a7e-ac9b-4e42-8219-450bde66a3df.png',
    keywords: [
      'travel', 'tourism', 'information', 'guide', 'trip',
      'itinerary', 'tours', 'excursions', 'visiting',
      'tips', 'preparation', 'planning', 'vacation',
      'holiday', 'discovery', 'explore', 'journey',
      '旅行', '観光', 'ツアー', '情報', 'ガイド', '旅程'
    ]
  },

  // Activities & Attractions
  {
    id: 'activities-tunisia',
    title: 'Activities in Tunisia',
    path: '/travel-information?tab=activities',
    tab: 'activities',
    category: 'travel',
    titleJP: 'チュニジアのアクティビティ',
    image: '/uploads/96f6d1b7-6b24-4d51-9156-76ddba2842af.png',
    keywords: [
      'activities', 'attractions', 'sites', 'visits', 'things to do',
      'excursions', 'experiences', 'leisure', 'entertainment',
      'adventures', 'discoveries', 'hiking', 'diving',
      'safari', 'desert', 'beaches', 'monuments', 'sightseeing',
      'アクティビティ', '観光地', '体験', '冒険', '見どころ'
    ]
  },

  // Museums
  {
    id: 'museums-tunisia',
    title: 'Tunisian Museums',
    path: '/travel-information?tab=activities&section=activities&scrollTo=museums',
    tab: 'activities',
    section: 'activities',
    scrollTo: 'museums',
    category: 'travel',
    titleJP: 'チュニジアの博物館',
    image: '/uploads/8dc0707d-46c0-424d-a35a-6ef7a8b8436a.png',
    keywords: [
      'museums', 'heritage', 'history', 'historical',
      'archaeology', 'exhibitions', 'collections', 'art',
      'antiquities', 'carthage', 'bardo', 'sousse',
      'kairouan', 'artifacts', 'civilizations', 'cultural sites',
      '博物館', '歴史', '考古学', '展示', '遺跡', '文化'
    ]
  },

  // Transportation
  {
    id: 'transportation-tunisia',
    title: 'Transportation in Tunisia',
    path: '/travel-information?tab=departure&section=transportation',
    tab: 'departure',
    section: 'transportation',
    category: 'travel',
    titleJP: 'チュニジアの交通',
    image: '/uploads/8d781b00-a095-48ad-ab1e-c584f33cc173.png',
    keywords: [
      'transport', 'transportation', 'travel', 'taxi', 'bus',
      'train', 'car', 'rental', 'plane', 'airport',
      'shuttle', 'metro', 'tram', 'louage', 'driver',
      'getting around', 'public transport', 'private transport',
      '交通', 'タクシー', 'バス', '電車', '車', '空港', '移動'
    ]
  },

  // Accommodation
  {
    id: 'hotels-accommodation',
    title: 'Hotels & Accommodation',
    path: '/company-information?section=services&scrollTo=hotels',
    section: 'services',
    scrollTo: 'hotels',
    category: 'accommodation',
    titleJP: 'ホテル・宿泊施設',
    image: '/uploads/887573e2-027f-4492-8fb5-dab816ee46da.png',
    keywords: [
      'hotels', 'accommodation', 'stay', 'lodging',
      'rooms', 'booking', 'reservation', 'guest houses',
      'riads', 'pensions', 'hostels', 'luxury', 'budget',
      'family', 'where to stay', 'sleeping', 'overnight',
      'ホテル', '宿泊', '部屋', '予約', '宿泊施設'
    ]
  },

  // Atlantis Services
  {
    id: 'atlantis-services',
    title: 'Atlantis Travel Services',
    path: '/company-information',
    category: 'atlantis',
    titleJP: 'アトランティス旅行サービス',
    image: '/uploads/bd5ba590-fb88-434b-b2b0-a6eae62e1144.png',
    keywords: [
      'atlantis', 'travel', 'services', 'agency', 'professional',
      'organization', 'bookings', 'assistance', 'support',
      'advice', 'expertise', 'experience', 'specialists',
      'team', 'quality', 'company', 'travel agency',
      'アトランティス', 'サービス', '旅行会社', 'プロ', '専門'
    ]
  },

  // Tour Packages
  {
    id: 'tour-packages',
    title: 'Tour Packages & Itineraries',
    path: '/travel-information?tab=itinerary',
    tab: 'itinerary',
    category: 'travel',
    titleJP: 'ツアーパッケージ',
    image: '/uploads/4baa4a7e-ac9b-4e42-8219-450bde66a3df.png',
    keywords: [
      'tours', 'packages', 'itineraries', 'programs',
      'stays', 'organized trips', 'groups', 'individual',
      'custom', 'personalized', 'guided', 'self-guided',
      'tour operators', 'trip planning', 'vacation packages',
      'ツアー', 'パッケージ', '旅程', 'プログラム', '団体'
    ]
  },

  // Food & Cuisine
  {
    id: 'tunisian-cuisine',
    title: 'Tunisian Cuisine',
    path: '/blog?category=food',
    category: 'blog',
    titleJP: 'チュニジア料理',
    image: '/uploads/6cb11651-d5dc-47a3-ba8c-2b563eaa9b25.png',
    keywords: [
      'food', 'cuisine', 'gastronomy', 'dishes', 'eating',
      'specialties', 'couscous', 'tajine', 'brik', 'harissa',
      'pastries', 'tea', 'coffee', 'restaurants', 'local food',
      'recipes', 'flavors', 'spices', 'traditional food',
      '料理', '食べ物', 'クスクス', 'レストラン', 'レシピ'
    ]
  },

  // Blog & Articles
  {
    id: 'blog-articles',
    title: 'Blog & Articles',
    path: '/blog',
    category: 'blog',
    titleJP: 'ブログ・記事',
    image: '/uploads/e344bb17-31ee-41bb-90b5-fb4b09b103e0.png',
    keywords: [
      'blog', 'articles', 'news', 'information', 'stories',
      'tips', 'guides', 'testimonials', 'experiences',
      'reviews', 'photos', 'videos', 'discoveries',
      'culture', 'travel blog', 'posts', 'content',
      'ブログ', '記事', 'ニュース', 'ガイド', '体験談'
    ]
  }
];
