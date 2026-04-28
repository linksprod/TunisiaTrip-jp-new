// Mapping between UI categories and database categories
export const categoryMapping: Record<string, string[]> = {
  "travel-diary": ["Travel", "Travel & Tourism", "Travel and Tourism"],
  "places": ["Travel & Culture", "Travel & Nature"],
  "hotels": ["Hotels", "Accommodation"],
  "food": ["Kitchen & Gastronomy", "Food & Cuisine"],
  "events": ["Culture & Events", "Events"],
  "culture": ["Culture & Heritage", "Cultural"],
  "history": ["Historical", "Travel and Historical", "History"],
  "tips": ["Tips & Advice", "Travel Tips"]
};

// Get UI category color based on category slug
export const getCategoryColor = (categorySlug: string): string => {
  const colorMap: Record<string, string> = {
    "travel-diary": "bg-blue-100 text-blue-700 border-blue-200",
    "places": "bg-purple-100 text-purple-700 border-purple-200",
    "hotels": "bg-yellow-100 text-yellow-700 border-yellow-200",
    "food": "bg-red-100 text-red-700 border-red-200",
    "events": "bg-indigo-100 text-indigo-700 border-indigo-200",
    "culture": "bg-emerald-100 text-emerald-700 border-emerald-200",
    "history": "bg-amber-100 text-amber-700 border-amber-200",
    "tips": "bg-teal-100 text-teal-700 border-teal-200"
  };
  return colorMap[categorySlug] || "bg-gray-100 text-gray-700 border-gray-200";
};

// Match DB category to UI category slug
export const matchCategoryToSlug = (dbCategory: string): string | null => {
  if (!dbCategory) return null;
  
  for (const [slug, categories] of Object.entries(categoryMapping)) {
    if (categories.some(cat => cat && cat.toLowerCase() === dbCategory.toLowerCase())) {
      return slug;
    }
  }
  return null;
};
