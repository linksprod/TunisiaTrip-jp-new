
import { SearchItem } from "./types";

export const eventsSearchData: SearchItem[] = [
  // FESTIVALS & EVENTS
  {
    id: 'event-carthage-festival',
    title: 'International Festival of Carthage',
    path: '/blog?category=events&event=carthage-festival',
    category: 'blog',
    titleJP: 'カルタゴ国際フェスティバル',
    image: '/uploads/c0f73b03-8e7e-4aea-996c-25418c3b8927.png',
    keywords: [
      'carthage festival', 'international', 'music', 'theater',
      'summer', 'cultural', 'performances', 'artists',
      'カルタゴフェスティバル', '国際', '音楽', '劇場', '夏'
    ]
  },
  {
    id: 'event-sahara-festival',
    title: 'Festival of the Sahara - Douz',
    path: '/blog?category=events&event=sahara-festival',
    category: 'blog',
    titleJP: 'サハラ祭り - ドゥーズ',
    image: '/uploads/2714f2c3-4465-4a55-8369-5484aa8f3b28.png',
    keywords: [
      'sahara festival', 'douz', 'desert', 'nomadic', 'traditions',
      'camel racing', 'poetry', 'folk music', 'winter',
      'サハラ祭り', 'ドゥーズ', '砂漠', '遊牧民', '伝統'
    ]
  },
  {
    id: 'event-tabarka-jazz',
    title: 'Tabarka Jazz Festival',
    path: '/blog?category=events&event=tabarka-jazz',
    category: 'blog',
    titleJP: 'タバルカ ジャズフェスティバル',
    image: '/uploads/887573e2-027f-4492-8fb5-dab816ee46da.png',
    keywords: [
      'tabarka jazz', 'jazz festival', 'music', 'international',
      'summer', 'coral coast', 'concerts', 'artists',
      'タバルカジャズ', 'ジャズフェスティバル', '音楽', '夏'
    ]
  }
];
