
import React from "react";
import { FileText, Clock, Search as SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { TranslateText } from "@/components/translation/TranslateText";
import { UnifiedSearchResult } from "@/hooks/use-unified-search";
import { getResultIcon, getCategoryColor } from "@/utils/search/searchUtils";
import { useTranslation } from "@/hooks/use-translation";

interface ResponsiveSearchDropdownProps {
  showContent: boolean;
  isLoading: boolean;
  searchValue: string;
  results: UnifiedSearchResult[];
  suggestions: string[];
  history: string[];
  currentLanguage: string;
  isMobile?: boolean;
  onResultClick: (result: UnifiedSearchResult) => void;
  onHistoryClick: (historyItem: string) => void;
  onSuggestionClick: (suggestion: string) => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
}

export const ResponsiveSearchDropdown: React.FC<ResponsiveSearchDropdownProps> = ({
  showContent,
  isLoading,
  searchValue,
  results,
  suggestions,
  history,
  currentLanguage,
  isMobile = false,
  onResultClick,
  onHistoryClick,
  onSuggestionClick,
  dropdownRef
}) => {
  const { t } = useTranslation();

  if (!showContent) return null;

  // Aggressive mobile positioning and sizing
  const getDropdownClasses = () => {
    if (isMobile) {
      return cn(
        "absolute top-full left-0 right-0 mt-1",
        "w-screen max-w-none", // Use full screen width
        "bg-white rounded-lg shadow-xl border border-gray-200",
        "max-h-[70vh] overflow-y-auto overflow-x-hidden",
        "z-[70]", // Even higher z-index for mobile
        "-ml-2 -mr-2" // Negative margins to break out of container
      );
    }

    return cn(
      "absolute top-full left-1/2 transform -translate-x-1/2 mt-2",
      "w-72 sm:w-80 md:w-96 lg:w-[400px] xl:w-[500px]",
      "bg-white rounded-lg shadow-lg border border-gray-200",
      "max-h-[80vh] overflow-y-auto",
      "z-50"
    );
  };

  const getItemClasses = (isHeader = false) => {
    if (isHeader) {
      return "px-4 py-3 text-sm font-medium bg-gray-50 border-b border-gray-100";
    }

    return cn(
      "px-4 py-4", // Larger padding for mobile
      "hover:bg-blue-50 active:bg-blue-100 cursor-pointer",
      "transition-colors duration-150",
      "border-b border-gray-50 last:border-b-0",
      "min-h-[56px] flex items-center", // Larger touch targets on mobile
      "touch-manipulation" // Better mobile performance
    );
  };

  const getTextClasses = (size: 'sm' | 'base' = 'base') => {
    if (size === 'sm') {
      return "text-sm";
    }
    return "text-base"; // Consistent text size
  };

  return (
    <div
      ref={dropdownRef}
      className={getDropdownClasses()}
      style={{
        // Ensure proper stacking and positioning on mobile
        position: 'absolute',
        zIndex: isMobile ? 70 : 50,
        ...(isMobile && {
          left: '-0.5rem',
          right: '-0.5rem',
          width: 'calc(100vw - 1rem)' // Full viewport width minus small margin
        })
      }}
    >
      {/* Loading State */}
      {isLoading && (
        <div className={cn(getItemClasses(), "text-center text-gray-500 justify-center")}>
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <TranslateText text="Searching..." language={currentLanguage} />
          </div>
        </div>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <div className="py-1">
          <div className={cn(getItemClasses(true), "flex items-center gap-2 text-gray-600")}>
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
                className={cn(getItemClasses(), "group")}
                onClick={() => onResultClick(result)}
              >
                <div className="flex items-start gap-3 w-full min-w-0">
                  <IconComponent className={cn(
                    "flex-shrink-0 mt-0.5 text-blue-500 group-hover:text-blue-600",
                    "w-5 h-5"
                  )} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className={cn(
                        "font-medium text-gray-900 group-hover:text-gray-700",
                        "truncate flex-1 transition-colors",
                        getTextClasses()
                      )}>
                        {displayTitle}
                      </h4>

                      <span className={cn(
                        "px-2 py-0.5 text-xs rounded-full font-medium flex-shrink-0",
                        categoryColor
                      )}>
                        {categoryBadge}
                      </span>
                    </div>

                    {displayDescription && (
                      <p className={cn(
                        "text-gray-500 line-clamp-2 mb-1",
                        getTextClasses('sm')
                      )}>
                        {displayDescription}
                      </p>
                    )}

                    <div className={cn(
                      "flex items-center gap-3 text-gray-400",
                      getTextClasses('sm')
                    )}>
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
          <div className={cn(getItemClasses(true), "flex items-center gap-2 text-gray-600")}>
            <SearchIcon className="w-4 h-4 flex-shrink-0" />
            <TranslateText text="Suggestions" language={currentLanguage} />
          </div>

          {suggestions.map((suggestion, index) => (
            <div
              key={`suggestion-${index}`}
              className={cn(getItemClasses(), "group")}
              onClick={() => onSuggestionClick(suggestion)}
            >
              <div className="flex items-center gap-3 w-full">
                <SearchIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span className={cn(
                  "text-gray-700 group-hover:text-gray-900 transition-colors truncate",
                  getTextClasses()
                )}>
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
          <div className={cn(getItemClasses(true), "flex items-center gap-2 text-gray-600")}>
            <Clock className="w-4 h-4 flex-shrink-0" />
            <TranslateText text="Recent Searches" language={currentLanguage} />
          </div>

          {history.slice(0, 3).map((historyItem, index) => (
            <div
              key={`history-${index}`}
              className={cn(getItemClasses(), "group")}
              onClick={() => onHistoryClick(historyItem)}
            >
              <div className="flex items-center gap-3 w-full">
                <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span className={cn(
                  "text-gray-600 group-hover:text-gray-800 transition-colors truncate",
                  getTextClasses()
                )}>
                  {historyItem}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && searchValue.trim() && results.length === 0 && (
        <div className={cn(getItemClasses(), "text-center text-gray-500 justify-center")}>
          <TranslateText
            text="No results found. Try a different search term."
            language={currentLanguage}
          />
        </div>
      )}
    </div>
  );
};
