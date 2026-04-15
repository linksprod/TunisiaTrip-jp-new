
import { supabase } from "@/integrations/supabase/client";
import { BlogArticle } from "@/types/blog";
import { cities } from "@/components/travel/data/citiesData";
import { activities } from "@/components/start-my-trip/activities-data";
import { dayByDayItinerary } from "@/components/travel/itinerary/itineraryData";

export interface EnhancedSearchItem {
  id: string;
  title: string;
  description: string;
  path: string;
  category: 'blog' | 'city' | 'activity' | 'itinerary' | 'about' | 'travel' | 'atlantis' | 'home' | 'accommodation' | 'navigation' | 'services';
  subcategory?: string;
  section?: string;
  image?: string;
  tags?: string[];
  relevanceScore?: number;
  titleJP?: string;
  descriptionJP?: string;
  sectionJP?: string;
}

// Enhanced fuzzy search with better multilingual matching and contextual understanding
function calculateRelevance(item: EnhancedSearchItem, query: string, enhancedTerms?: string[]): number {
  const queryLower = query.toLowerCase().trim();
  const titleLower = item.title.toLowerCase();
  const descriptionLower = item.description.toLowerCase();
  const sectionLower = item.section?.toLowerCase() || '';

  // Include enhanced terms in search
  const allSearchTerms = [queryLower];
  if (enhancedTerms) {
    allSearchTerms.push(...enhancedTerms.map(term => term.toLowerCase()));
  }

  let bestScore = 0;

  // Test each search term
  allSearchTerms.forEach(searchTerm => {
    let titleScore = 0;
    let descriptionScore = 0;
    let sectionScore = 0;
    let tagsScore = 0;
    let categoryScore = 0;

    // Enhanced exact phrase matching
    if (titleLower.includes(searchTerm)) {
      titleScore = Math.min(1, searchTerm.length / titleLower.length * 2);
      if (titleLower.startsWith(searchTerm)) {
        titleScore *= 1.5;
      }
      if (titleLower === searchTerm) {
        titleScore = 1;
      }
    }

    if (descriptionLower.includes(searchTerm)) {
      descriptionScore = Math.min(0.8, searchTerm.length / descriptionLower.length * 1.5);
    }

    // Section matching (important for contextual results)
    if (sectionLower.includes(searchTerm)) {
      sectionScore = 0.7;
    }

    // Category matching with context awareness
    if (item.category.toLowerCase().includes(searchTerm)) {
      categoryScore = 0.6;
    }

    // Enhanced tag matching
    if (item.tags) {
      const tagMatches = item.tags.filter(tag => {
        const tagLower = tag.toLowerCase();
        return tagLower.includes(searchTerm) || searchTerm.includes(tagLower);
      });
      tagsScore = Math.min(0.5, tagMatches.length * 0.2);
    }

    // Word-based matching for partial queries with better scoring
    const searchWords = searchTerm.split(' ').filter(word => word.length > 1);
    let wordMatchScore = 0;

    if (searchWords.length > 0) {
      const titleWords = titleLower.split(' ');
      const descWords = descriptionLower.split(' ');

      searchWords.forEach(sWord => {
        // Title word matches with position weighting
        titleWords.forEach((tWord, index) => {
          const positionWeight = 1 - (index * 0.1); // Earlier words get higher weight
          if (tWord.includes(sWord) || sWord.includes(tWord)) {
            wordMatchScore += 0.4 * positionWeight;
          }
          if (sWord.length > 2 && tWord.length > 2 &&
            (tWord.startsWith(sWord.substring(0, 3)) || sWord.startsWith(tWord.substring(0, 3)))) {
            wordMatchScore += 0.3 * positionWeight;
          }
        });

        // Description word matches
        descWords.forEach(dWord => {
          if (dWord.includes(sWord) || sWord.includes(dWord)) {
            wordMatchScore += 0.15;
          }
        });
      });
    }

    // Context-specific phrase matching
    const contextPhrases = {
      'travel': ['travel', 'trip', 'journey', 'tour', 'visit', 'explore'],
      'accommodation': ['hotel', 'stay', 'room', 'accommodation', 'lodge'],
      'transportation': ['transport', 'taxi', 'bus', 'train', 'car', 'metro'],
      'culture': ['culture', 'tradition', 'history', 'heritage', 'art'],
      'nature': ['beach', 'desert', 'mountain', 'sea', 'nature', 'landscape'],
      'entertainment': ['entertainment', 'movie', 'filming', 'star wars', 'attraction']
    };

    let contextScore = 0;
    Object.entries(contextPhrases).forEach(([context, phrases]) => {
      if (phrases.some(phrase => searchTerm.includes(phrase))) {
        if (item.section?.includes(context) ||
          item.category.includes(context) ||
          titleLower.includes(context) ||
          item.tags?.some(tag => tag.toLowerCase().includes(context))) {
          contextScore = 0.4;
        }
      }
    });

    const termScore = Math.max(
      titleScore * 1.0,
      descriptionScore * 0.8,
      sectionScore * 0.9,
      wordMatchScore * 0.7
    ) + tagsScore + categoryScore + contextScore;

    bestScore = Math.max(bestScore, termScore);
  });

  // Enhanced context-aware boosting
  let contextBoost = 0;
  const lowerQuery = query.toLowerCase();

  // Tourism/Travel intent boosting
  const travelKeywords = ['visit', 'travel', 'trip', 'tour', 'tourism', 'destination', 'explore', '観光', '旅行', '訪問'];
  if (travelKeywords.some(keyword => lowerQuery.includes(keyword))) {
    if (item.category === 'travel' || item.category === 'activity' || item.category === 'city') {
      contextBoost += 0.3;
    }
  }

  // Location-based boosting
  const locationKeywords = ['city', 'place', 'where', 'location', '都市', '場所'];
  if (locationKeywords.some(keyword => lowerQuery.includes(keyword))) {
    if (item.category === 'city' || item.section === 'beaches' || item.section === 'desert') {
      contextBoost += 0.4;
    }
  }

  // Service-based boosting
  const serviceKeywords = ['hotel', 'accommodation', 'service', 'company', 'booking'];
  if (serviceKeywords.some(keyword => lowerQuery.includes(keyword))) {
    if (item.category === 'atlantis' || item.category === 'accommodation') {
      contextBoost += 0.5;
    }
  }

  // Information-seeking boosting
  const infoKeywords = ['about', 'information', 'what is', 'learn', 'culture'];
  if (infoKeywords.some(keyword => lowerQuery.includes(keyword))) {
    if (item.category === 'about' || item.category === 'blog') {
      contextBoost += 0.4;
    }
  }

  return Math.max(0, Math.min(1, bestScore + contextBoost));
}

// Blog articles search data with enhanced indexing
async function getBlogSearchData(): Promise<EnhancedSearchItem[]> {
  try {
    const { data: articles, error } = await supabase
      .from('blog_articles')
      .select('id, title, slug, description, category, image')
      .eq('status', 'published');

    if (error) {
      console.error("Error fetching blog articles:", error);
      return [];
    }

    return (articles || []).map((article) => ({
      id: `blog-${article.id}`,
      title: article.title,
      description: article.description || `Read about ${article.title} in our travel blog`,
      path: article.slug ? `/blog/${article.slug}` : `/blog/${article.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}-${article.id}`,
      category: 'blog' as const,
      subcategory: article.category,
      section: 'articles',
      image: article.image,
      tags: [article.category, 'blog', 'article', 'tunisia', 'information', 'travel guide']
    }));
  } catch (error) {
    console.error("Error in getBlogSearchData:", error);
    return [];
  }
}

// Cities search data with better categorization
function getCitiesSearchData(): EnhancedSearchItem[] {
  return cities.map(city => ({
    id: `city-${city.id}`,
    title: city.name,
    description: city.description || `Explore ${city.name}, a beautiful city in ${city.region}, Tunisia`,
    path: `/travel-information?tab=activities&city=${city.id}`,
    category: 'city' as const,
    subcategory: city.region,
    section: 'destinations',
    image: city.image,
    tags: [city.region, 'city', 'travel', 'destination', 'tunisia', 'explore', 'visit']
  }));
}

// Activities search data with enhanced descriptions
function getActivitiesSearchData(): EnhancedSearchItem[] {
  return activities.map(activity => ({
    id: `activity-${activity.id}`,
    title: activity.title,
    description: activity.description || `Experience ${activity.title} in ${activity.location}`,
    path: `/travel-information?tab=activities&activity=${activity.id}`,
    category: 'activity' as const,
    subcategory: 'experience',
    section: 'activities',
    image: activity.image,
    tags: ['activity', 'experience', activity.location, 'tourism', 'travel', 'tunisia', ...activity.tags]
  }));
}

// Itinerary search data with day-specific information
function getItinerarySearchData(): EnhancedSearchItem[] {
  return dayByDayItinerary.map(day => ({
    id: `itinerary-day-${day.day}`,
    title: `Day ${day.day}: ${day.title}`,
    description: day.description || `Explore ${day.title} on day ${day.day} of your Tunisia journey`,
    path: `/travel-information?tab=itinerary&day=${day.day}`,
    category: 'itinerary' as const,
    subcategory: 'tour-package',
    section: 'itinerary',
    image: day.image,
    tags: ['itinerary', 'tour', 'package', 'day-trip', 'guided', 'travel', 'tunisia', ...day.activities]
  }));
}

// Enhanced static content search data with comprehensive page indexing
function getStaticContentSearchData(): EnhancedSearchItem[] {
  return [
    // Main navigation pages
    {
      id: 'page-home',
      title: 'Tunisia Travel Guide - Discover Tunisia',
      description: 'Your complete guide to traveling in Tunisia. Discover amazing destinations, activities, and travel information.',
      path: '/',
      category: 'home' as const,
      section: 'navigation',
      tags: ['home', 'main', 'tunisia', 'travel guide', 'discover', 'welcome', 'start'],
      titleJP: 'チュニジア旅行ガイド - チュニジアを発見',
      descriptionJP: 'チュニジア旅行の完全なガイド。素晴らしい目的地、アクティビティ、旅行情報を発見してください。',
      sectionJP: 'メイン'
    },
    {
      id: 'about-tunisia-main',
      title: 'About Tunisia - Culture, History & Information',
      description: 'Learn about Tunisia\'s rich culture, fascinating history, geography, and people. Complete country information.',
      path: '/about-tunisia',
      category: 'about' as const,
      section: 'information',
      tags: ['about', 'tunisia', 'culture', 'history', 'information', 'country', 'overview', 'learn'],
      titleJP: 'チュニジアについて - 文化、歴史、情報',
      descriptionJP: 'チュニジアの豊かな文化、魅力的な歴史、地理、人々について学びましょう。完全な国情報。',
      sectionJP: '情報'
    },
    {
      id: 'travel-information-main',
      title: 'Travel Information & Tour Packages',
      description: 'Complete travel guide with itineraries, activities, cities, and travel tips for your Tunisia journey.',
      path: '/travel-information',
      category: 'travel' as const,
      section: 'planning',
      tags: ['travel', 'information', 'tour', 'packages', 'itinerary', 'activities', 'cities', 'guide'],
      titleJP: '旅行情報・ツアーパッケージ',
      descriptionJP: 'チュニジア旅行のための旅程、アクティビティ、都市、旅行のヒントを含む完全な旅行ガイド。',
      sectionJP: 'プランニング'
    },
    {
      id: 'atlantis-company',
      title: 'Atlantis Voyages - Professional Travel Services',
      description: 'Professional travel agency offering tours, accommodation booking, transportation, and personalized travel services.',
      path: '/company-information',
      category: 'atlantis' as const,
      section: 'services',
      tags: ['atlantis', 'voyages', 'company', 'services', 'travel agency', 'professional', 'booking'],
      titleJP: 'アトランティス航海 - プロフェッショナル旅行サービス',
      descriptionJP: 'ツアー、宿泊予約、交通機関、パーソナライズされた旅行サービスを提供するプロフェッショナルな旅行代理店。',
      sectionJP: 'サービス'
    },

    // Specific content sections
    {
      id: 'tunisia-culture',
      title: 'Tunisian Culture & Traditions',
      description: 'Discover the rich cultural heritage, traditions, customs, and way of life in Tunisia.',
      path: '/about-tunisia#culture',
      category: 'about' as const,
      subcategory: 'culture',
      section: 'culture',
      tags: ['culture', 'traditions', 'customs', 'heritage', 'tunisia', 'arab', 'berber', 'lifestyle'],
      titleJP: 'チュニジア文化・伝統',
      descriptionJP: 'チュニジアの豊かな文化的遺産、伝統、習慣、生活様式を発見してください。',
      sectionJP: '文化'
    },
    {
      id: 'accommodation-services',
      title: 'Hotels & Accommodation Services',
      description: 'Find the perfect accommodation in Tunisia with our expert recommendations and booking services.',
      path: '/company-information?section=services&scrollTo=hotels',
      category: 'accommodation' as const,
      subcategory: 'hotels',
      section: 'hotels',
      tags: ['hotels', 'accommodation', 'stay', 'lodging', 'guest houses', 'booking', 'rooms', 'luxury'],
      titleJP: 'ホテル・宿泊サービス',
      descriptionJP: '専門家の推奨事項と予約サービスで、チュニジアの完璧な宿泊施設を見つけましょう。',
      sectionJP: '宿泊'
    },
    {
      id: 'tunisia-weather-climate',
      title: 'Tunisia Weather & Climate Guide',
      description: 'Complete weather information, seasonal patterns, and best times to visit Tunisia.',
      path: '/about-tunisia#weather',
      category: 'about' as const,
      subcategory: 'weather',
      section: 'weather',
      tags: ['weather', 'climate', 'temperature', 'seasons', 'planning', 'tunisia', 'best time'],
      titleJP: '天気・気候ガイド',
      descriptionJP: 'チュニジアを訪れるのに最適な時期、季節ごとのパターン、完全な天気情報。',
      sectionJP: '天気'
    },
    {
      id: 'tunisia-languages',
      title: 'Languages in Tunisia',
      description: 'Learn about Arabic, French, and other languages spoken in Tunisia. Communication guide for travelers.',
      path: '/about-tunisia#languages',
      category: 'about' as const,
      subcategory: 'languages',
      section: 'language',
      tags: ['language', 'arabic', 'french', 'communication', 'speaking', 'tunisia', 'travel tips'],
      titleJP: '言語ガイド',
      descriptionJP: 'アラビア語、フランス語、およびチュニジアで話されている他の言語について学びましょう。旅行者のためのコミュニケーションガイド。',
      sectionJP: '言語'
    },
    {
      id: 'travel-tips-preparation',
      title: 'Travel Tips & Trip Preparation',
      description: 'Essential tips, advice, and preparation guide for traveling in Tunisia.',
      path: '/travel-information?tab=departure',
      category: 'travel' as const,
      subcategory: 'tips',
      section: 'preparation',
      tags: ['tips', 'advice', 'preparation', 'travel', 'guide', 'tunisia', 'planning'],
      titleJP: '旅行のコツ・準備',
      descriptionJP: 'チュニジア旅行のための必須のヒント、アドバイス、準備ガイド。',
      sectionJP: '準備'
    },
    {
      id: 'transportation-guide',
      title: 'Transportation in Tunisia',
      description: 'Complete guide to getting around Tunisia - taxis, buses, trains, metro, and car rentals.',
      path: '/travel-information?tab=departure&section=transportation',
      category: 'travel' as const,
      subcategory: 'transportation',
      section: 'transportation',
      tags: ['transportation', 'travel', 'taxi', 'bus', 'train', 'car', 'getting around', 'metro'],
      titleJP: '交通ガイド',
      descriptionJP: 'タクシー、バス、電車、地下鉄、レンタカーなど、チュニジア国内の移動に関する完全ガイド。',
      sectionJP: '交通手段'
    }
  ];
}

// Get trending/suggested searches for empty queries
export function getTrendingSearches(): EnhancedSearchItem[] {
  return [
    {
      id: 'trending-tunisia-guide',
      title: 'Complete Tunisia Travel Guide',
      description: 'Everything you need to know for your Tunisia trip',
      path: '/travel-information',
      category: 'travel' as const,
      section: 'guide',
      tags: ['tunisia', 'travel', 'guide', 'complete']
    },
    {
      id: 'trending-about',
      title: 'About Tunisia - Culture & History',
      description: 'Learn about Tunisia\'s rich culture and fascinating history',
      path: '/about-tunisia',
      category: 'about' as const,
      section: 'information',
      tags: ['tunisia', 'about', 'culture', 'history']
    },
    {
      id: 'trending-hotels',
      title: 'Hotels & Accommodation',
      description: 'Find the perfect place to stay in Tunisia',
      path: '/company-information?section=services&scrollTo=hotels',
      category: 'accommodation' as const,
      section: 'hotels',
      tags: ['hotels', 'accommodation', 'stay']
    },
    {
      id: 'trending-activities',
      title: 'Activities & Attractions',
      description: 'Discover amazing activities and attractions in Tunisia',
      path: '/travel-information?tab=activities',
      category: 'travel' as const,
      section: 'activities',
      tags: ['activities', 'attractions', 'experiences']
    }
  ];
}

// Main enhanced search function with improved matching and comprehensive indexing
export async function enhancedSearch(query: string, limit: number = 8, enhancedTerms?: string[]): Promise<EnhancedSearchItem[]> {
  if (!query || query.trim().length < 1) {
    return getTrendingSearches();
  }

  try {
    console.log('Enhanced search called with query:', query);
    console.log('Enhanced terms:', enhancedTerms);

    // Get search data with priority to static content and comprehensive indexing
    const [staticData, blogData, activitiesData, itineraryData, citiesData] = await Promise.all([
      getStaticContentSearchData(),
      getBlogSearchData(),
      getActivitiesSearchData(),
      getItinerarySearchData(),
      getCitiesSearchData()
    ]);

    // Combine all search data with proper weighting
    const allSearchData = [
      ...staticData,        // Highest priority - main pages and key content
      ...activitiesData,    // High priority - user activities
      ...itineraryData,     // Medium-high priority - tour packages
      ...blogData,          // Medium priority - informational content
      ...citiesData         // Lower priority - specific locations
    ];

    console.log('Total search items:', allSearchData.length);

    // Calculate relevance scores with enhanced terms and contextual matching
    const results = allSearchData
      .map(item => ({
        ...item,
        relevanceScore: calculateRelevance(item, query, enhancedTerms)
      }))
      .filter(item => (item.relevanceScore || 0) > 0.05) // Lower threshold for better recall
      .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
      .slice(0, limit);

    console.log('Filtered search results:', results.length);
    console.log('Top search results:', results.slice(0, 5).map(r => ({
      title: r.title,
      score: r.relevanceScore,
      category: r.category,
      section: r.section
    })));

    // Ensure unique results by ID
    const uniqueResults = results.filter((item, index, self) =>
      index === self.findIndex(t => t.id === item.id)
    );

    return uniqueResults;
  } catch (error) {
    console.error("Error in enhancedSearch:", error);
    return getTrendingSearches();
  }
}

// Save search to history (localStorage)
export function saveSearchToHistory(query: string): void {
  try {
    const history = getSearchHistory();
    const updatedHistory = [query, ...history.filter(h => h !== query)].slice(0, 5);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Error saving search history:", error);
  }
}

// Get search history
export function getSearchHistory(): string[] {
  try {
    const history = localStorage.getItem('searchHistory');
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error("Error getting search history:", error);
    return [];
  }
}
