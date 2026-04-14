
export interface Hotel {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  region: string;
  style: 'luxury' | 'boutique' | 'business';
  priceRange: '$' | '$$' | '$$$';
  amenities: string[];
  nearbyActivities: string[];
  japaneseFeatures: string[];
}

export const hotels: Hotel[] = [
  {
    id: "1",
    name: "Four Seasons Hotel",
    location: "Tunis, Tunisia",
    image: "/uploads/31fa750b-9618-4556-9aa2-c9b62cf3b480.png",
    rating: 5,
    coordinates: { lat: 36.8065, lng: 10.1815 },
    region: "Tunis",
    style: "luxury",
    priceRange: "$$$",
    amenities: ["Spa", "Pool", "Restaurant", "Business Center", "Concierge"],
    nearbyActivities: ["2", "3"], // Carthage, Sidi Bou Said
    japaneseFeatures: ["Japanese breakfast options", "Multilingual staff", "Quiet rooms", "High-speed WiFi"]
  },
  {
    id: "2",
    name: "Anantara Tozeur",
    location: "Tozeur, Tunisia",
    image: "/uploads/7848de0b-5463-4416-ae56-7922714a447b.png",
    rating: 5,
    coordinates: { lat: 33.9197, lng: 8.1335 },
    region: "Sahara",
    style: "luxury",
    priceRange: "$$$",
    amenities: ["Desert views", "Spa", "Pool", "Desert excursions"],
    nearbyActivities: ["1"], // Desert Safari
    japaneseFeatures: ["Zen-inspired design", "Meditation spaces", "Organic cuisine", "Cultural respect"]
  },
  {
    id: "3",
    name: "Movenpick Sousse",
    location: "Sousse, Tunisia",
    image: "/uploads/d5b362eb-773a-485d-aa39-67eff2ccf55e.png",
    rating: 5,
    coordinates: { lat: 35.8256, lng: 10.6411 },
    region: "Central Coast",
    style: "luxury",
    priceRange: "$$",
    amenities: ["Beach access", "Pool", "Spa", "Restaurant"],
    nearbyActivities: [],
    japaneseFeatures: ["Clean facilities", "Punctual service", "Quality assurance"]
  },
  {
    id: "4",
    name: "The Residence Tunis",
    location: "Tunis, Tunisia",
    image: "/uploads/4de6ef16-ca24-431b-899d-e5c7cf11c73c.png",
    rating: 5,
    coordinates: { lat: 36.8625, lng: 10.3064 },
    region: "Tunis",
    style: "luxury",
    priceRange: "$$$",
    amenities: ["Golf course", "Spa", "Multiple restaurants", "Beach club"],
    nearbyActivities: ["2", "3"],
    japaneseFeatures: ["Golf facilities", "Precise service", "Quiet environment"]
  },
  {
    id: "5",
    name: "Le Kasbah Kairouan",
    location: "Kairouan, Tunisia",
    image: "/uploads/4fdc3022-820b-4653-8401-6d31df53747b.png",
    rating: 5,
    coordinates: { lat: 35.6781, lng: 10.0963 },
    region: "Central",
    style: "boutique",
    priceRange: "$$",
    amenities: ["Traditional architecture", "Cultural tours", "Restaurant"],
    nearbyActivities: ["4"], // El Jem nearby
    japaneseFeatures: ["Cultural authenticity", "Respectful atmosphere", "Historical significance"]
  },
  {
    id: "6",
    name: "Pansy KSAR Ghilene",
    location: "Ghilene, Tunisia",
    image: "/uploads/53341fca-0b8d-47ff-a07c-7a30290c0170.png",
    rating: 5,
    coordinates: { lat: 33.0167, lng: 9.8167 },
    region: "South",
    style: "boutique",
    priceRange: "$$",
    amenities: ["Desert camp", "Traditional meals", "Camel trekking"],
    nearbyActivities: ["1", "9"], // Desert activities, Star Wars locations
    japaneseFeatures: ["Unique experience", "Natural setting", "Peaceful environment"]
  }
];
