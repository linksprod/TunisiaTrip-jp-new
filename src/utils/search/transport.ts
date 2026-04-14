
import { SearchItem } from "./types";

export const transportSearchData: SearchItem[] = [
  // TRANSPORTATION
  {
    id: 'transport-tgm',
    title: 'TGM Tram - Tunis to Sidi Bou Said',
    path: '/travel-information?tab=departure&section=transportation&transport=tgm',
    category: 'travel',
    section: 'transportation',
    titleJP: 'TGMトラム',
    image: '/uploads/8d781b00-a095-48ad-ab1e-c584f33cc173.png',
    keywords: [
      'tgm', 'tram', 'tunis goulette marsa', 'train', 'sidi bou said',
      'carthage', 'la marsa', 'public transport', 'scenic route',
      'TGM', 'トラム', '電車', '公共交通', '景色の良いルート'
    ]
  },
  {
    id: 'transport-louage',
    title: 'Louage - Shared Taxi System',
    path: '/travel-information?tab=departure&section=transportation&transport=louage',
    category: 'travel',
    section: 'transportation',
    titleJP: 'ルアージュ - 乗り合いタクシー',
    image: '/uploads/8d781b00-a095-48ad-ab1e-c584f33cc173.png',
    keywords: [
      'louage', 'shared taxi', 'collective taxi', 'intercity',
      'affordable', 'local transport', 'stations',
      'ルアージュ', '乗り合いタクシー', '都市間', '安い', '地元交通'
    ]
  },
  {
    id: 'transport-metro',
    title: 'Tunis Metro - Light Rail System',
    path: '/travel-information?tab=departure&section=transportation&transport=metro',
    category: 'travel',
    section: 'transportation',
    titleJP: 'チュニス地下鉄',
    image: '/uploads/8d781b00-a095-48ad-ab1e-c584f33cc173.png',
    keywords: [
      'metro', 'light rail', 'tunis', 'urban transport',
      'modern', 'efficient', 'city center', 'suburbs',
      'メトロ', 'ライトレール', '都市交通', '現代的', '効率的'
    ]
  },
  {
    id: 'transport-taxi',
    title: 'Taxi Services in Tunisia',
    path: '/travel-information?tab=departure&section=transportation&transport=taxi',
    category: 'travel',
    section: 'transportation',
    titleJP: 'タクシーサービス',
    keywords: [
      'taxi', 'cab', 'private transport', 'door to door',
      'airport transfer', 'city taxi', 'yellow taxi',
      'タクシー', 'プライベート交通', 'ドアツードア'
    ]
  },
  {
    id: 'transport-bus',
    title: 'Bus Network - TRANSTU',
    path: '/travel-information?tab=departure&section=transportation&transport=bus',
    category: 'travel',
    section: 'transportation',
    titleJP: 'バスネットワーク',
    keywords: [
      'bus', 'transtu', 'public transport', 'city bus',
      'intercity bus', 'bus routes', 'bus stations',
      'バス', '公共交通', '市内バス', '都市間バス'
    ]
  },
  {
    id: 'transport-car-rental',
    title: 'Car Rental Services',
    path: '/travel-information?tab=departure&section=transportation&transport=car',
    category: 'travel',
    section: 'transportation',
    titleJP: 'レンタカーサービス',
    keywords: [
      'car rental', 'rent a car', 'self drive', 'vehicle rental',
      'driving', 'car hire', 'automobile', 'independent travel',
      'レンタカー', '自動車', '自分で運転', '独立旅行'
    ]
  }
];
