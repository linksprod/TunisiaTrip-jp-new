
// Search item interface
export interface SearchItem {
  id: string;
  title: string;
  description?: string;
  path: string;
  category: 'accommodation' | 'about' | 'travel' | 'blog' | 'atlantis' | 'home' | 'navigation' | 'services' | 'city' | 'activity';
  section?: string;
  tab?: string;
  scrollTo?: string;
  titleJP?: string;
  descriptionJP?: string;
  sectionJP?: string;
  keywords?: string[];
  score?: number;
  image?: string;
}
