
import React from "react";
import { FileText, Clock, Search as SearchIcon } from "lucide-react";
import { TranslateText } from "@/components/translation/TranslateText";
import { UnifiedSearchResult } from "@/hooks/use-unified-search";
import { getResultIcon, getCategoryColor } from "@/utils/search/searchUtils";
import { useTranslation } from "@/hooks/use-translation";

interface MobileSearchDropdownProps {
  showContent: boolean;
  isLoading: boolean;
  searchValue: string;
  results: UnifiedSearchResult[];
  suggestions: string[];
  history: string[];
  currentLanguage: string;
  onResultClick: (result: UnifiedSearchResult) => void;
  onHistoryClick: (historyItem: string) => void;
  onSuggestionClick: (suggestion: string) => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
}

export const MobileSearchDropdown: React.FC<MobileSearchDropdownProps> = ({
  showContent,
  isLoading,
  searchValue,
  results,
  suggestions,
  history,
  currentLanguage,
  onResultClick,
  onHistoryClick,
  onSuggestionClick,
  dropdownRef
}) => {
  const { t } = useTranslation();

  if (!showContent) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-[100]"
      style={{
        maxHeight: 'clamp(250px, 70vh, 500px)',
        overflowY: 'auto',
        width: '100%',
        marginLeft: 'clamp(-8px, -2vw, -4px)',
        marginRight: 'clamp(-8px, -2vw, -4px)'
      }}
    >
      {/* Loading State */}
      {isLoading && (
        <div
          className="px-4 py-4 text-center text-gray-500 flex items-center justify-center"
          style={{ minHeight: 'clamp(56px, 14vw, 64px)' }}
        >
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <TranslateText text="Searching..." language={currentLanguage} />
          </div>
        </div>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <div className="py-1">
          <div
            className="px-4 py-3 text-sm font-medium bg-gray-50 border-b border-gray-100 flex items-center gap-2 text-gray-600"
            style={{ fontSize: 'clamp(12px, 3vw, 14px)' }}
          >
            <FileText className="w-4 h-4 flex-shrink-0" />
            <TranslateText text="Search Results" language={currentLanguage} />
            <span className="text-gray-400">({results.length})</span>
          </div>

          {results.map((result, index) => {
            const IconComponent = getResultIcon(result);
            const categoryBadge = t(result.category);
            const categoryColor = getCategoryColor(result.category);

            // Localized content
            const isJP = currentLanguage === 'JP';
            const displayTitle = (isJP && result.titleJP) ? result.titleJP : result.title;
            const displayDescription = (isJP && result.descriptionJP) ? result.descriptionJP : result.description;
            const displaySection = (isJP && result.sectionJP) ? result.sectionJP : result.section;
            const displayContext = (isJP && result.contextType) ? t(result.contextType) : result.contextType;

            return (
              <div
                key={`result-${result.id || index}`}
                className="px-4 py-4 hover:bg-blue-50 active:bg-blue-100 cursor-pointer transition-colors duration-150 border-b border-gray-50 last:border-b-0 flex items-center touch-manipulation"
                style={{
                  minHeight: 'clamp(56px, 14vw, 64px)',
                  padding: 'clamp(12px, 3vw, 16px)'
                }}
                onClick={() => onResultClick(result)}
              >
                <div className="flex items-start gap-3 w-full min-w-0">
                  <IconComponent className="flex-shrink-0 mt-0.5 text-blue-500 w-5 h-5" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4
                        className="font-medium text-gray-900 truncate flex-1 transition-colors"
                        style={{ fontSize: 'clamp(14px, 3.5vw, 16px)' }}
                      >
                        {displayTitle}
                      </h4>

                      <span
                        className={`px-2 py-0.5 text-xs rounded-full font-medium flex-shrink-0 ${categoryColor}`}
                        style={{ fontSize: 'clamp(10px, 2.5vw, 12px)' }}
                      >
                        {categoryBadge}
                      </span>
                    </div>

                    {displayDescription && (
                      <p
                        className="text-gray-500 line-clamp-2 mb-1"
                        style={{ fontSize: 'clamp(12px, 3vw, 14px)' }}
                      >
                        {displayDescription}
                      </p>
                    )}

                    <div
                      className="flex items-center gap-3 text-gray-400"
                      style={{ fontSize: 'clamp(11px, 2.8vw, 13px)' }}
                    >
                      {displayContext && (
                        <span className="capitalize">{displayContext}</span>
                      )}
                      {result.source === 'ai' && (
                        <span className="text-blue-500 font-medium">AI</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && !searchValue.trim() && (
        <div className="py-1">
          <div
            className="px-4 py-3 text-sm font-medium bg-gray-50 border-b border-gray-100 flex items-center gap-2 text-gray-600"
            style={{ fontSize: 'clamp(12px, 3vw, 14px)' }}
          >
            <SearchIcon className="w-4 h-4 flex-shrink-0" />
            <TranslateText text="Suggestions" language={currentLanguage} />
          </div>

          {suggestions.map((suggestion, index) => (
            <div
              key={`suggestion-${index}`}
              className="px-4 py-4 hover:bg-blue-50 active:bg-blue-100 cursor-pointer transition-colors duration-150 border-b border-gray-50 last:border-b-0 flex items-center touch-manipulation"
              style={{
                minHeight: 'clamp(56px, 14vw, 64px)',
                padding: 'clamp(12px, 3vw, 16px)'
              }}
              onClick={() => onSuggestionClick(suggestion)}
            >
              <div className="flex items-center gap-3 w-full">
                <SearchIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span
                  className="text-gray-700 truncate"
                  style={{ fontSize: 'clamp(14px, 3.5vw, 16px)' }}
                >
                  {suggestion}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search History */}
      {history.length > 0 && !searchValue.trim() && suggestions.length === 0 && (
        <div className="py-1">
          <div
            className="px-4 py-3 text-sm font-medium bg-gray-50 border-b border-gray-100 flex items-center gap-2 text-gray-600"
            style={{ fontSize: 'clamp(12px, 3vw, 14px)' }}
          >
            <Clock className="w-4 h-4 flex-shrink-0" />
            <TranslateText text="Recent Searches" language={currentLanguage} />
          </div>

          {history.slice(0, 3).map((historyItem, index) => (
            <div
              key={`history-${index}`}
              className="px-4 py-4 hover:bg-blue-50 active:bg-blue-100 cursor-pointer transition-colors duration-150 border-b border-gray-50 last:border-b-0 flex items-center touch-manipulation"
              style={{
                minHeight: 'clamp(56px, 14vw, 64px)',
                padding: 'clamp(12px, 3vw, 16px)'
              }}
              onClick={() => onHistoryClick(historyItem)}
            >
              <div className="flex items-center gap-3 w-full">
                <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span
                  className="text-gray-600 truncate"
                  style={{ fontSize: 'clamp(14px, 3.5vw, 16px)' }}
                >
                  {historyItem}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && searchValue.trim() && results.length === 0 && (
        <div
          className="px-4 py-4 text-center text-gray-500 flex items-center justify-center"
          style={{
            minHeight: 'clamp(56px, 14vw, 64px)',
            fontSize: 'clamp(14px, 3.5vw, 16px)'
          }}
        >
          <TranslateText
            text="No results found. Try a different search term."
            language={currentLanguage}
          />
        </div>
      )}
    </div>
  );
};
