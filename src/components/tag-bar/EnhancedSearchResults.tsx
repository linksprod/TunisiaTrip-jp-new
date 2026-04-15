
import React from "react";
import {
  MapPin,
  Calendar,
  Image,
  FileText,
  Home,
  Info,
  Plane,
  Building2,
  Camera,
  Waves,
  Mountain,
  Utensils,
  Car,
  Bed,
  Users,
  BookOpen,
  Clock
} from "lucide-react";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

interface EnhancedSearchResultsProps {
  results: any[];
  onResultClick: (item: any) => void;
  currentLanguage: string;
}

export const EnhancedSearchResults: React.FC<EnhancedSearchResultsProps> = ({
  results,
  onResultClick,
  currentLanguage
}) => {
  const { t } = useTranslation();

  if (results.length === 0) return null;

  const getResultIcon = (item: any) => {
    // Check category first
    switch (item.category) {
      case 'home': return Home;
      case 'about': return Info;
      case 'travel': return Plane;
      case 'atlantis': return Building2;
      case 'accommodation': return Bed;
      case 'blog': return BookOpen;
      case 'city': return MapPin;
    }

    // Check section for more specific icons
    if (item.section) {
      switch (item.section) {
        case 'transportation': return Car;
        case 'beaches': return Waves;
        case 'desert': return Mountain;
        case 'entertainment': return Camera;
        case 'history': return Clock;
        case 'hotels': return Bed;
        case 'weather': return Calendar;
      }
    }

    // Check keywords for context-specific icons
    const title = item.title.toLowerCase();
    const keywords = item.keywords?.join(' ').toLowerCase() || '';
    const searchText = `${title} ${keywords}`;

    if (searchText.includes('beach') || searchText.includes('coast')) return Waves;
    if (searchText.includes('desert') || searchText.includes('sahara')) return Mountain;
    if (searchText.includes('star wars') || searchText.includes('filming')) return Camera;
    if (searchText.includes('food') || searchText.includes('restaurant')) return Utensils;
    if (searchText.includes('transport') || searchText.includes('taxi') || searchText.includes('bus')) return Car;
    if (searchText.includes('hotel') || searchText.includes('accommodation')) return Bed;
    if (searchText.includes('company') || searchText.includes('service')) return Users;
    if (searchText.includes('event') || searchText.includes('festival')) return Calendar;
    if (searchText.includes('weather') || searchText.includes('climate')) return Calendar;

    // Default icons by type
    switch (item.type) {
      case 'location': return MapPin;
      case 'event': return Calendar;
      case 'image': return Image;
      default: return FileText;
    }
  };

  const getCategoryBadge = (category: string) => {
    // Use translated category name if available
    return t(category);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'home': 'bg-green-100 text-green-700',
      'about': 'bg-blue-100 text-blue-700',
      'travel': 'bg-purple-100 text-purple-700',
      'atlantis': 'bg-orange-100 text-orange-700',
      'accommodation': 'bg-pink-100 text-pink-700',
      'blog': 'bg-yellow-100 text-yellow-700',
      'city': 'bg-indigo-100 text-indigo-700'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="py-1">
      <div className="px-3 xs:px-4 py-2 text-xs text-gray-500 bg-blue-50/50 font-medium flex items-center gap-2">
        <FileText className="w-3 h-3 xs:w-3.5 xs:h-3.5" />
        <TranslateText
          text="Search Results"
          language={currentLanguage}
        />
        <span className="text-gray-400">({results.length})</span>
      </div>

      {results.map((result, index) => {
        const IconComponent = getResultIcon(result);
        const categoryBadge = getCategoryBadge(result.category);
        const categoryColor = getCategoryColor(result.category);

        // Use localized fields if available and in Japanese mode
        const isJP = currentLanguage === 'JP';
        const displayTitle = (isJP && result.titleJP) ? result.titleJP : result.title;
        const displayDescription = (isJP && result.descriptionJP) ? result.descriptionJP : result.description;
        const displaySection = (isJP && result.sectionJP) ? result.sectionJP : result.section;

        return (
          <button
            key={`result-${result.id || index}`}
            className="w-full text-left px-3 xs:px-4 py-2 xs:py-3 hover:bg-blue-50/50 flex items-start gap-2 xs:gap-3 cursor-pointer transition-colors duration-150 group border-b border-gray-50 last:border-b-0"
            onClick={() => onResultClick(result)}
          >
            <IconComponent className="w-4 h-4 xs:w-5 xs:h-5 text-blue-500 flex-shrink-0 mt-0.5 group-hover:text-blue-600 transition-colors" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="text-xs xs:text-sm font-medium text-gray-900 truncate group-hover:text-gray-700 transition-colors flex-1">
                  {displayTitle}
                </h4>
                <span className={`px-2 py-0.5 text-xs rounded-full font-medium flex-shrink-0 ${categoryColor}`}>
                  {categoryBadge}
                </span>
              </div>

              {displayDescription && (
                <p className="text-xs text-gray-500 line-clamp-2 mb-1">
                  {displayDescription}
                </p>
              )}

              <div className="flex items-center gap-3 text-xs text-gray-400">
                {displaySection && (
                  <span className="capitalize">{displaySection}</span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
