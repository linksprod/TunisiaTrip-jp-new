
import { SearchItem } from "./types";

/**
 * Get trending searches for empty queries
 */
export function getTrendingSearches(): SearchItem[] {
  return [
    {
      id: 'trending-about',
      title: 'À propos de la Tunisie',
      path: '/about-tunisia',
      category: 'about',
      titleJP: 'チュニジアについて',
      keywords: ['tunisie', 'about', 'information'],
      image: '/uploads/2341be42-96ea-48c1-83f9-701f53a33454.png'
    },
    {
      id: 'trending-travel',
      title: 'Informations de Voyage',
      path: '/travel-information',
      category: 'travel',
      titleJP: '旅行情報',
      keywords: ['voyage', 'travel', 'guide'],
      image: '/uploads/4baa4a7e-ac9b-4e42-8219-450bde66a3df.png'
    },
    {
      id: 'trending-hotels',
      title: 'Hôtels et Hébergement',
      path: '/company-information?section=services&scrollTo=hotels',
      category: 'accommodation',
      titleJP: 'ホテル・宿泊',
      keywords: ['hotels', 'hebergement', 'accommodation'],
      image: '/uploads/887573e2-027f-4492-8fb5-dab816ee46da.png'
    },
    {
      id: 'trending-activities',
      title: 'Activités et Attractions',
      path: '/travel-information?tab=activities',
      category: 'travel',
      titleJP: 'アクティビティ',
      keywords: ['activites', 'attractions', 'tourism'],
      image: '/uploads/96f6d1b7-6b24-4d51-9156-76ddba2842af.png'
    }
  ];
}
