
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { enhancedFuzzySearch } from '@/utils/search/fuzzySearch';
import { enhancedSearch } from '@/services/enhancedSearchService';
import { enhanceSearchQuery } from '@/services/semanticSearchService';
import { getAllSearchData } from '@/utils/search/unifiedSearchData';
import { SearchItem } from '@/utils/search/types';

export interface UnifiedSearchResult {
  id: string;
  title: string;
  description?: string;
  path: string;
  category: string;
  section?: string;
  image?: string;
  titleJP?: string;
  descriptionJP?: string;
  sectionJP?: string;
  source: 'basic' | 'enhanced' | 'ai';
  relevanceScore: number;
  contextType: 'page' | 'city' | 'activity' | 'section' | 'service';
}

export const useUnifiedSearch = (currentLanguage: string = 'EN') => {
  const [searchValue, setSearchValue] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [basicResults, setBasicResults] = useState<UnifiedSearchResult[]>([]);
  const [aiResults, setAiResults] = useState<UnifiedSearchResult[]>([]);
  const [combinedResults, setCombinedResults] = useState<UnifiedSearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isBasicLoading, setIsBasicLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const navigate = useNavigate();
  const basicSearchTimeoutRef = useRef<NodeJS.Timeout>();
  const aiSearchTimeoutRef = useRef<NodeJS.Timeout>();
  const searchDataRef = useRef(getAllSearchData());

  // Load search history
  useEffect(() => {
    try {
      const history = localStorage.getItem('searchHistory');
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  }, []);

  // Fast basic search with 100ms debounce
  const performBasicSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setBasicResults([]);
      return;
    }

    setIsBasicLoading(true);
    try {
      const results = enhancedFuzzySearch(query, currentLanguage, searchDataRef.current);
      const formattedResults: UnifiedSearchResult[] = results.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || `Explore ${item.title}`,
        path: item.path,
        category: item.category,
        section: item.section,
        image: item.image,
        titleJP: item.titleJP,
        descriptionJP: item.descriptionJP,
        sectionJP: item.sectionJP,
        source: 'basic' as const,
        relevanceScore: item.score || 0,
        contextType: getContextType(item.category, item.section)
      }));

      setBasicResults(formattedResults);
    } catch (error) {
      console.error('Basic search error:', error);
      setBasicResults([]);
    } finally {
      setIsBasicLoading(false);
    }
  }, [currentLanguage]);

  // AI-enhanced search with 300ms debounce
  const performAiSearch = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setAiResults([]);
      return;
    }

    setIsAiLoading(true);
    try {
      // Get enhanced query from semantic search service
      const enhancement = await enhanceSearchQuery(query, currentLanguage);

      // Use enhanced search service
      const results = await enhancedSearch(
        query,
        8,
        enhancement.keywords.concat(enhancement.synonyms)
      );

      const formattedResults: UnifiedSearchResult[] = results.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        path: item.path,
        category: item.category,
        section: item.section,
        image: item.image,
        titleJP: item.titleJP,
        descriptionJP: item.descriptionJP,
        sectionJP: item.sectionJP,
        source: 'ai' as const,
        relevanceScore: (item.relevanceScore || 0) + 0.1, // Slight boost for AI results
        contextType: getContextType(item.category, item.section)
      }));

      setAiResults(formattedResults);

      // Generate contextual suggestions
      generateSuggestions(query, enhancement.keywords);
    } catch (error) {
      console.error('AI search error:', error);
      setAiResults([]);
    } finally {
      setIsAiLoading(false);
    }
  }, [currentLanguage]);

  // Generate contextual suggestions
  const generateSuggestions = useCallback((query: string, keywords: string[]) => {
    const contextualSuggestions: string[] = [];
    const queryLower = query.toLowerCase();

    // Context-based suggestions
    const suggestionMap = {
      'tunisia': currentLanguage === 'JP' ? ['チュニジアの観光地', 'チュニジア文化', 'チュニジア旅行'] : ['Tunisia attractions', 'Tunisia culture', 'Tunisia travel'],
      'beach': currentLanguage === 'JP' ? ['ハンマメット', 'ジェルバ島', '地中海ビーチ'] : ['Hammamet', 'Djerba island', 'Mediterranean beaches'],
      'desert': currentLanguage === 'JP' ? ['サハラ砂漠', 'ラクダツアー', '砂漠キャンプ'] : ['Sahara desert', 'Camel tours', 'Desert camping'],
      'hotel': currentLanguage === 'JP' ? ['ホテル予約', '宿泊施設', 'リゾート'] : ['Hotel booking', 'Accommodation', 'Resorts'],
      'food': currentLanguage === 'JP' ? ['チュニジア料理', 'クスクス', 'ハリッサ'] : ['Tunisian cuisine', 'Couscous', 'Harissa']
    };

    Object.entries(suggestionMap).forEach(([key, suggestions]) => {
      if (queryLower.includes(key) || keywords.some(k => k.includes(key))) {
        contextualSuggestions.push(...suggestions);
      }
    });

    // Add keyword-based suggestions
    keywords.slice(0, 2).forEach(keyword => {
      if (!contextualSuggestions.includes(keyword)) {
        contextualSuggestions.push(keyword);
      }
    });

    setSuggestions(contextualSuggestions.slice(0, 4));
  }, [currentLanguage]);

  // Combine and prioritize results
  useEffect(() => {
    const combined = [...basicResults, ...aiResults];

    // Remove duplicates by path, preferring AI results
    const uniqueResults = combined.reduce((acc, current) => {
      const existing = acc.find(item => item.path === current.path);
      if (!existing) {
        acc.push(current);
      } else if (current.source === 'ai' && existing.source === 'basic') {
        // Replace basic result with AI result
        const index = acc.indexOf(existing);
        acc[index] = current;
      }
      return acc;
    }, [] as UnifiedSearchResult[]);

    // Sort by relevance score and context importance
    const sortedResults = uniqueResults
      .sort((a, b) => {
        // Boost important context types
        const aBoost = getContextBoost(a.contextType);
        const bBoost = getContextBoost(b.contextType);

        return (b.relevanceScore + bBoost) - (a.relevanceScore + aBoost);
      })
      .slice(0, 8);

    setCombinedResults(sortedResults);
  }, [basicResults, aiResults]);

  // Handle search input with different debounce times
  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);

    // Clear previous timeouts
    if (basicSearchTimeoutRef.current) {
      clearTimeout(basicSearchTimeoutRef.current);
    }
    if (aiSearchTimeoutRef.current) {
      clearTimeout(aiSearchTimeoutRef.current);
    }

    if (!value.trim()) {
      setBasicResults([]);
      setAiResults([]);
      setSuggestions([]);
      return;
    }

    // Fast basic search (100ms debounce)
    basicSearchTimeoutRef.current = setTimeout(() => {
      performBasicSearch(value);
    }, 100);

    // Slower AI search (300ms debounce)
    aiSearchTimeoutRef.current = setTimeout(() => {
      performAiSearch(value);
    }, 300);
  }, [performBasicSearch, performAiSearch]);

  // Handle result click
  const handleResultClick = useCallback((result: UnifiedSearchResult) => {
    // Save to history
    const newHistory = [searchValue, ...searchHistory.filter(h => h !== searchValue)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));

    // Navigate to result
    navigate(result.path);

    // Clear search
    setSearchValue('');
    setIsSearchFocused(false);
    setBasicResults([]);
    setAiResults([]);
    setSuggestions([]);
  }, [searchValue, searchHistory, navigate]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchValue('');
    setBasicResults([]);
    setAiResults([]);
    setSuggestions([]);

    if (basicSearchTimeoutRef.current) {
      clearTimeout(basicSearchTimeoutRef.current);
    }
    if (aiSearchTimeoutRef.current) {
      clearTimeout(aiSearchTimeoutRef.current);
    }
  }, []);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (basicSearchTimeoutRef.current) {
        clearTimeout(basicSearchTimeoutRef.current);
      }
      if (aiSearchTimeoutRef.current) {
        clearTimeout(aiSearchTimeoutRef.current);
      }
    };
  }, []);

  return {
    searchValue,
    setSearchValue: handleSearchChange,
    isSearchFocused,
    setIsSearchFocused,
    combinedResults,
    suggestions,
    searchHistory,
    isLoading: isBasicLoading || isAiLoading,
    isBasicLoading,
    isAiLoading,
    handleResultClick,
    clearSearch
  };
};

// Helper functions
function getContextType(category: string, section?: string): 'page' | 'city' | 'activity' | 'section' | 'service' {
  if (category === 'city') return 'city';
  if (category === 'activity') return 'activity';
  if (category === 'atlantis' || section === 'hotels') return 'service';
  if (section) return 'section';
  return 'page';
}

function getContextBoost(contextType: string): number {
  const boosts = {
    'page': 0.3,     // Main pages get high priority
    'service': 0.2,  // Services are important
    'city': 0.15,    // Cities are relevant
    'activity': 0.1, // Activities are good
    'section': 0.05  // Sections are useful
  };
  return boosts[contextType as keyof typeof boosts] || 0;
}
