
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
  Clock,
  Activity,
  Globe
} from "lucide-react";

export const getResultIcon = (item: any) => {
  // Check context type first for better icons
  switch (item.contextType) {
    case 'city': return MapPin;
    case 'activity': return Activity;
    case 'service': return Building2;
    case 'section': return FileText;
    case 'page': return Globe;
  }

  // Check category
  switch (item.category) {
    case 'home': return Home;
    case 'about': return Info;
    case 'travel': return Plane;
    case 'atlantis': return Building2;
    case 'accommodation': return Bed;
    case 'blog': return BookOpen;
    case 'city': return MapPin;
    case 'activity': return Activity;
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
      case 'culture': return Users;
    }
  }

  // Check keywords for context-specific icons
  const title = (item.title || '').toLowerCase();
  const titleJP = (item.titleJP || '').toLowerCase();
  const keywords = item.keywords?.join(' ').toLowerCase() || '';
  const description = (item.description || '').toLowerCase();
  const descriptionJP = (item.descriptionJP || '').toLowerCase();

  const searchText = `${title} ${titleJP} ${keywords} ${description} ${descriptionJP}`;

  if (searchText.includes('beach') || searchText.includes('coast') || searchText.includes('ビーチ') || searchText.includes('海岸')) return Waves;
  if (searchText.includes('desert') || searchText.includes('sahara') || searchText.includes('砂漠') || searchText.includes('サハラ')) return Mountain;
  if (searchText.includes('star wars') || searchText.includes('filming') || searchText.includes('スターウォーズ') || searchText.includes('撮影')) return Camera;
  if (searchText.includes('food') || searchText.includes('restaurant') || searchText.includes('料理') || searchText.includes('レストラン') || searchText.includes('食事')) return Utensils;
  if (searchText.includes('transport') || searchText.includes('taxi') || searchText.includes('bus') || searchText.includes('交通') || searchText.includes('タクシー') || searchText.includes('バス')) return Car;
  if (searchText.includes('hotel') || searchText.includes('accommodation') || searchText.includes('ホテル') || searchText.includes('宿泊')) return Bed;
  if (searchText.includes('company') || searchText.includes('service') || searchText.includes('企業') || searchText.includes('サービス')) return Users;
  if (searchText.includes('event') || searchText.includes('festival') || searchText.includes('イベント') || searchText.includes('祭り')) return Calendar;
  if (searchText.includes('weather') || searchText.includes('climate') || searchText.includes('天気') || searchText.includes('気候')) return Calendar;

  // Default icons by type
  switch (item.type) {
    case 'location': return MapPin;
    case 'event': return Calendar;
    case 'image': return Image;
    default: return FileText;
  }
};

export const getCategoryColor = (category: string) => {
  const colors = {
    'home': 'bg-green-100 text-green-700',
    'about': 'bg-blue-100 text-blue-700',
    'travel': 'bg-purple-100 text-purple-700',
    'atlantis': 'bg-orange-100 text-orange-700',
    'accommodation': 'bg-pink-100 text-pink-700',
    'blog': 'bg-yellow-100 text-yellow-700',
    'city': 'bg-indigo-100 text-indigo-700',
    'activity': 'bg-emerald-100 text-emerald-700'
  };
  return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700';
};
